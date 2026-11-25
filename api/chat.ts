import type { IncomingMessage, ServerResponse } from "node:http";
import { GoogleGenAI } from "@google/genai";
import {
  buildAmitSystemPrompt,
  normalizeConversationContents,
} from "../src/lib/agentSystemPrompt";
import { generateLocalFallbackReply } from "../src/lib/localAgentFallback";
import {
  GEMINI_MODELS,
  InMemoryRateLimiter,
  MAX_BODY_BYTES,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  buildModelGenerateConfig,
  extractClientIp,
  extractGeminiText,
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

function isRetryableError(err: unknown): boolean {
  const { status, message } = extractUpstreamErrorInfo(err);
  return /\b(429|500|502|503|504|UNAVAILABLE|RESOURCE_EXHAUSTED)\b/i.test(
    `${status} ${message}`
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
): Promise<{ ok: true; payload: unknown } | { ok: false; status: 400 | 413; error: string }> {
  if (req.body !== undefined) {
    if (typeof req.body === "string") {
      if (Buffer.byteLength(req.body, "utf8") > MAX_BODY_BYTES) {
        return { ok: false, status: 413, error: "Request payload is too large." };
      }
      try {
        return { ok: true, payload: JSON.parse(req.body || "{}") };
      } catch {
        return { ok: false, status: 400, error: "Malformed JSON request body." };
      }
    }
    const serializedBytes = Buffer.byteLength(JSON.stringify(req.body ?? {}), "utf8");
    if (serializedBytes > MAX_BODY_BYTES) {
      return { ok: false, status: 413, error: "Request payload is too large." };
    }
    return { ok: true, payload: req.body };
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
        resolve({ ok: false, status: 413, error: "Request payload is too large." });
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
        resolve({ ok: false, status: 400, error: "Malformed JSON request body." });
      }
    });

    req.on("error", () => {
      if (settled) return;
      settled = true;
      resolve({ ok: false, status: 400, error: "Failed to read request body." });
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

  // 2. Bounded JSON body read & payload validation
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

  // 3. Resolve valid AIza API key (prioritizing API_KEY over GEMINI_API_KEY and ignoring placeholders)
  const apiKey = resolveApiKey(process.env.API_KEY, process.env.GEMINI_API_KEY);
  if (!apiKey) {
    sendJson(res, 200, {
      reply: generateLocalFallbackReply(validated.message),
      mode: "local",
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const contents = normalizeConversationContents(
      validated.history,
      validated.message
    );
    const systemInstruction = buildAmitSystemPrompt();

    for (const model of GEMINI_MODELS) {
      const maxAttempts = 2;
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: buildModelGenerateConfig(model, systemInstruction),
          });
          const text = extractGeminiText(response)
            .replace(/\u2014/g, ", ")
            .trim();
          if (text) {
            sendJson(res, 200, { reply: text, mode: "gemini", model });
            return;
          }
        } catch (err) {
          const info = extractUpstreamErrorInfo(err);
          console.error(
            `[Ask Amit /api/chat] Model "${model}" attempt ${attempt + 1} failed (status=${info.status}): ${info.message}`
          );
          if (isRetryableError(err) && attempt + 1 < maxAttempts) {
            await sleep(450 * (attempt + 1));
            continue;
          }
          break;
        }
      }
    }

    sendJson(res, 200, {
      reply: generateLocalFallbackReply(validated.message),
      mode: "local",
    });
  } catch (err) {
    const info = extractUpstreamErrorInfo(err);
    console.error(
      `[Ask Amit /api/chat] Unexpected server error (status=${info.status}): ${info.message}`
    );
    if (!res.headersSent) {
      sendJson(res, 200, {
        reply: generateLocalFallbackReply(""),
        mode: "local",
      });
    }
  }
}
