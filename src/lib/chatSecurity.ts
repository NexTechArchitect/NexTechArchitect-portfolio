import type { ConversationTurnInput } from "./agentSystemPrompt";

export const MAX_BODY_BYTES = 32_768;
export const MAX_MESSAGE_LENGTH = 1_000;
export const MAX_HISTORY_TURNS = 10;
export const MAX_HISTORY_TURN_LENGTH = 2_000;
export const RATE_LIMIT_MAX_REQUESTS = 20;
export const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_TRACKED_IPS = 2_000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface ValidatedChatPayload {
  ok: true;
  message: string;
  history: ConversationTurnInput[];
}

export interface InvalidChatPayload {
  ok: false;
  status: 400 | 413;
  error: string;
}

export type ChatPayloadValidation = ValidatedChatPayload | InvalidChatPayload;

/**
 * In-memory sliding-window IP rate limiter with bounded memory footprint.
 */
export class InMemoryRateLimiter {
  private readonly hits = new Map<string, number[]>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(
    maxRequests = RATE_LIMIT_MAX_REQUESTS,
    windowMs = RATE_LIMIT_WINDOW_MS
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(ip: string, now = Date.now()): RateLimitResult {
    const key = ip.trim() || "unknown";
    const cutoff = now - this.windowMs;
    const existing = this.hits.get(key) ?? [];
    const recent = existing.filter((ts) => ts > cutoff);

    if (recent.length >= this.maxRequests) {
      const oldestInWindow = recent[0] ?? now;
      const retryAfterMs = Math.max(1_000, oldestInWindow + this.windowMs - now);
      this.hits.set(key, recent);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.ceil(retryAfterMs / 1_000),
      };
    }

    recent.push(now);
    this.hits.set(key, recent);

    if (this.hits.size > MAX_TRACKED_IPS) {
      this.prune(cutoff);
    }

    return {
      allowed: true,
      remaining: Math.max(0, this.maxRequests - recent.length),
      retryAfterSeconds: 0,
    };
  }

  private prune(cutoff: number): void {
    for (const [key, timestamps] of this.hits.entries()) {
      const valid = timestamps.filter((ts) => ts > cutoff);
      if (valid.length === 0) {
        this.hits.delete(key);
      } else {
        this.hits.set(key, valid);
      }
    }
  }
}

export function extractClientIp(
  headers: { get(name: string): string | null } | Record<string, string | string[] | undefined>,
  remoteAddress?: string | null
): string {
  const getHeader = (name: string): string => {
    if ("get" in headers && typeof headers.get === "function") {
      return headers.get(name) ?? "";
    }
    const record = headers as Record<string, string | string[] | undefined>;
    const raw = record[name] ?? record[name.toLowerCase()];
    if (Array.isArray(raw)) return raw[0] ?? "";
    return typeof raw === "string" ? raw : "";
  };

  const forwardedFor = getHeader("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = getHeader("x-real-ip").trim();
  if (realIp) return realIp;

  return (remoteAddress ?? "127.0.0.1").trim() || "127.0.0.1";
}

function normalizeHost(raw: string): string {
  return raw.trim().toLowerCase().replace(/:\d+$/, "");
}

function extractHostFromUrl(urlStr: string): string | null {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Verifies same-origin Origin/Referer headers in production so third-party
 * sites cannot hijack /api/chat.
 */
export function isAllowedRequestOrigin(params: {
  origin?: string | null;
  referer?: string | null;
  host?: string | null;
  forwardedHost?: string | null;
  isProduction: boolean;
  allowedOriginsEnv?: string;
}): boolean {
  if (!params.isProduction) {
    return true;
  }

  const expectedHost = normalizeHost(
    params.forwardedHost || params.host || ""
  );

  const allowlistedHosts = new Set<string>();
  if (expectedHost) {
    allowlistedHosts.add(expectedHost);
  }
  if (params.allowedOriginsEnv) {
    for (const entry of params.allowedOriginsEnv.split(",")) {
      const cleaned = entry.trim();
      if (!cleaned) continue;
      const fromUrl = extractHostFromUrl(cleaned);
      allowlistedHosts.add(fromUrl ?? normalizeHost(cleaned));
    }
  }

  const candidateUrl = (params.origin || params.referer || "").trim();
  if (!candidateUrl) {
    // Require Origin or Referer in production browser traffic
    return false;
  }

  const candidateHost = extractHostFromUrl(candidateUrl);
  if (!candidateHost) {
    return false;
  }

  if (candidateHost === "localhost" || candidateHost === "127.0.0.1") {
    return true;
  }

  return allowlistedHosts.has(candidateHost);
}

/**
 * Validates and bounds incoming chat JSON payloads.
 */
export function validateChatPayload(rawPayload: unknown): ChatPayloadValidation {
  if (
    !rawPayload ||
    typeof rawPayload !== "object" ||
    Array.isArray(rawPayload)
  ) {
    return {
      ok: false,
      status: 400,
      error: "Invalid request payload.",
    };
  }

  const record = rawPayload as Record<string, unknown>;
  if (typeof record.message !== "string") {
    return {
      ok: false,
      status: 400,
      error: "Message is required.",
    };
  }

  const message = record.message.trim();
  if (!message) {
    return {
      ok: false,
      status: 400,
      error: "Message is required.",
    };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      status: 400,
      error: `Message is too long. Please keep questions under ${MAX_MESSAGE_LENGTH} characters.`,
    };
  }

  const rawHistory = Array.isArray(record.history) ? record.history : [];
  const sanitizedHistory: ConversationTurnInput[] = [];

  for (const item of rawHistory) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const turn = item as Record<string, unknown>;
    const role = turn.role;
    const text = typeof turn.text === "string" ? turn.text.trim() : "";
    if ((role === "user" || role === "assistant") && text.length > 0) {
      sanitizedHistory.push({
        role,
        text: text.slice(0, MAX_HISTORY_TURN_LENGTH),
      });
    }
  }

  return {
    ok: true,
    message,
    history: sanitizedHistory.slice(-MAX_HISTORY_TURNS),
  };
}
