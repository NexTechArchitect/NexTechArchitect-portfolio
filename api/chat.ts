import type { IncomingMessage, ServerResponse } from "node:http";
import {
  buildAmitSystemPrompt,
  normalizeConversationContents,
} from "../src/lib/agentSystemPrompt";
import { callGeminiRest } from "../src/lib/geminiRest";
import {
  InMemoryRateLimiter,
  MAX_BODY_BYTES,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  extractClientIp,
  extractUpstreamErrorInfo,
  resolveApiKey,
  validateChatPayload,
} from "../src/lib/chatSecurity";

interface ServerlessRequest extends IncomingMessage {
  body?: unknown;
}

const rateLimiter = new InMemoryRateLimiter(
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS
);

function sendJson(
  res: ServerResponse,
  statusCode: number,
  body: Record<string, unknown>,
  extraHeaders?: Record<string, string>
) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (extraHeaders) {
    for (const [key, value] of Object.entries(extraHeaders)) {
      res.setHeader(key, value);
    }
  }
  res.end(JSON.stringify(body));
}

async function readBoundedBody(
  req: ServerlessRequest
): Promise<
  | { ok: true; payload: unknown }
  | { ok: false; status: 400 | 413; error: string }
> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === "string") {
      const trimmed = req.body.trim();
      if (trimmed.length > 0) {
        if (Buffer.byteLength(req.body, "utf8") > MAX_BODY_BYTES) {
          return {
            ok: false,
            status: 413,
            error: "Request payload is too large.",
          };
        }
        try {
          return { ok: true, payload: JSON.parse(req.body) };
        } catch {
          return {
            ok: false,
            status: 400,
            error: "Malformed JSON request body.",
          };
        }
      }
    } else if (typeof req.body === "object") {
      const serialized = JSON.stringify(req.body);
      if (serialized !== "{}" && serialized !== "[]") {
        if (Buffer.byteLength(serialized, "utf8") > MAX_BODY_BYTES) {
          return {
            ok: false,
            status: 413,
            error: "Request payload is too large.",
          };
        }
        return { ok: true, payload: req.body };
      }
    }
  }

  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let settled = false;

    req.on("data", (chunk: Buffer) => {
      if (settled) return;
      totalBytes += chunk.length;
      if (totalBytes > MAX_BODY_BYTES) {
        settled = true;
        resolve({
          ok: false,
          status: 413,
          error: "Request payload is too large.",
        });
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (settled) return;
      settled = true;
      const raw = Buffer.concat(chunks).toString("utf8");
      try {
        resolve({ ok: true, payload: JSON.parse(raw || "{}") });
      } catch {
        resolve({
          ok: false,
          status: 400,
          error: "Malformed JSON request body.",
        });
      }
    });

    req.on("error", () => {
      if (settled) return;
      settled = true;
      resolve({
        ok: false,
        status: 400,
        error: "Failed to read request body.",
      });
    });
  });
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerResponse
): Promise<void> {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed." });
    return;
  }

  // 1. Per-IP sliding-window rate limit (20 requests / minute)
  const clientIp = extractClientIp(req.headers, req.socket?.remoteAddress);
  const rate = rateLimiter.check(clientIp);
  if (!rate.allowed) {
    sendJson(
      res,
      429,
      {
        error: "Too many requests. Please wait a moment before asking again.",
      },
      { "Retry-After": String(rate.retryAfterSeconds) }
    );
    return;
  }

  // 2. Bounded JSON body read (pre-parsed object, raw string, or stream) & validation
  const bodyResult = await readBoundedBody(req);
  if (!bodyResult.ok) {
    sendJson(res, bodyResult.status, { error: bodyResult.error });
    return;
  }

  const validated = validateChatPayload(bodyResult.payload);
  if (!validated.ok) {
    sendJson(res, validated.status, { error: validated.error });
    return;
  }

  // 3. Resolve valid AIza API key (ignoring placeholder values like "Gemini")
  const apiKey = resolveApiKey(
    process.env.API_KEY,
    process.env.GEMINI_API_KEY
  );
  if (!apiKey) {
    sendJson(res, 200, {
      error: "No valid Gemini API key configured in environment.",
      upstreamStatus: 503,
    });
    return;
  }

  try {
    const contents = normalizeConversationContents(
      validated.history,
      validated.message
    );
    const result = await callGeminiRest({
      apiKey,
      systemPrompt: buildAmitSystemPrompt(),
      contents,
    });

    if (result.ok) {
      sendJson(res, 200, {
        reply: result.reply,
        source: "live",
        model: result.model,
      });
      return;
    }

    sendJson(res, 200, {
      error: result.error,
      upstreamStatus: result.upstreamStatus,
    });
  } catch (err) {
    const info = extractUpstreamErrorInfo(err);
    if (!res.headersSent) {
      sendJson(res, 200, {
        error: info.message,
        upstreamStatus: info.status === "unknown" ? 500 : info.status,
      });
    }
  }
}
