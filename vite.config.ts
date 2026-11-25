import { fileURLToPath, URL } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  buildAmitSystemPrompt,
  normalizeConversationContents,
} from "./src/lib/agentSystemPrompt";
import {
  InMemoryRateLimiter,
  MAX_BODY_BYTES,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  extractClientIp,
  isAllowedRequestOrigin,
  validateChatPayload,
} from "./src/lib/chatSecurity";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-4-hydrogen",
  "gemini-3.1-flash-lite",
] as const;

const rateLimiter = new InMemoryRateLimiter(
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS
);

function resolveServerApiKey(mode: string): string {
  const fileEnv = loadEnv(mode, process.cwd(), "");
  return (
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    fileEnv.GEMINI_API_KEY ||
    fileEnv.API_KEY ||
    ""
  ).trim();
}

function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /\b(429|500|502|503|504|UNAVAILABLE|RESOURCE_EXHAUSTED)\b/i.test(msg);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatReadableError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (/API_KEY_INVALID|PERMISSION_DENIED|401|403/i.test(raw)) {
    return "The Gemini API key could not be authenticated. Please check the API key configured in Settings > Secrets.";
  }
  if (/503|UNAVAILABLE|high demand/i.test(raw)) {
    return "The AI service is experiencing a brief traffic spike. Please tap Retry in a moment.";
  }
  if (/429|RESOURCE_EXHAUSTED|quota/i.test(raw)) {
    return "Rate limit reached. Please wait a moment and try again.";
  }
  return "Unable to complete the request right now. Please try again.";
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

function createChatHandler(mode: string) {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
  ) => {
    const pathname = (req.url ?? "").split("?")[0];
    if (pathname !== "/api/chat" && pathname !== "/api/agent") {
      next();
      return;
    }
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method not allowed." });
      return;
    }

    // 1. Origin / Referer check in production preview mode
    const isProduction = mode === "production" && process.env.NODE_ENV === "production";
    if (
      !isAllowedRequestOrigin({
        origin: typeof req.headers.origin === "string" ? req.headers.origin : null,
        referer:
          typeof req.headers.referer === "string" ? req.headers.referer : null,
        host: typeof req.headers.host === "string" ? req.headers.host : null,
        forwardedHost:
          typeof req.headers["x-forwarded-host"] === "string"
            ? req.headers["x-forwarded-host"]
            : null,
        isProduction,
        allowedOriginsEnv: process.env.ALLOWED_ORIGINS,
      })
    ) {
      sendJson(res, 403, { error: "Forbidden request origin." });
      return;
    }

    // 2. Per-IP sliding-window rate limit (20 requests / minute)
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

    // 3. Enforce strict 32KB raw payload byte limit while reading body
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let payloadTooLarge = false;

    req.on("data", (chunk: Buffer) => {
      if (payloadTooLarge) return;
      totalBytes += chunk.length;
      if (totalBytes > MAX_BODY_BYTES) {
        payloadTooLarge = true;
        sendJson(res, 413, { error: "Request payload is too large." });
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", async () => {
      if (payloadTooLarge) return;

      try {
        const rawBody = Buffer.concat(chunks).toString("utf8");
        let parsedBody: unknown;
        try {
          parsedBody = JSON.parse(rawBody || "{}");
        } catch {
          sendJson(res, 400, { error: "Malformed JSON request body." });
          return;
        }

        // 4. Validate JSON shape, 1,000-char message cap, and last-10-turns history cap
        const validated = validateChatPayload(parsedBody);
        if (!validated.ok) {
          sendJson(res, validated.status, { error: validated.error });
          return;
        }

        const apiKey = resolveServerApiKey(mode);
        if (!apiKey) {
          console.error(
            "[Ask Amit /api/chat] Missing server-side GEMINI_API_KEY configuration."
          );
          sendJson(res, 503, {
            error:
              "AI assistant is temporarily unavailable. Please verify server configuration and try again.",
          });
          return;
        }

        const { GoogleGenAI } = await import("@google/genai");
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

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Content-Type-Options", "nosniff");

        let emitted = false;
        let lastError: unknown = null;

        for (const model of GEMINI_MODELS) {
          const maxAttempts = 2;
          for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
            try {
              const responseStream = await ai.models.generateContentStream({
                model,
                contents,
                config: {
                  systemInstruction,
                },
              });

              for await (const chunk of responseStream) {
                const delta = chunk.text ?? "";
                if (!delta) continue;
                emitted = true;
                const sanitizedDelta = delta.replace(/\u2014/g, ", ");
                res.write(
                  `data: ${JSON.stringify({ delta: sanitizedDelta, model })}\n\n`
                );
              }

              if (emitted) {
                res.write(
                  `data: ${JSON.stringify({ done: true, mode: "gemini", model })}\n\n`
                );
                res.end();
                return;
              }
            } catch (err) {
              lastError = err;
              console.error(
                `[Ask Amit /api/chat] Model "${model}" attempt ${attempt + 1} failed.`
              );
              if (emitted) {
                res.write(
                  `data: ${JSON.stringify({ done: true, mode: "gemini", model })}\n\n`
                );
                res.end();
                return;
              }
              if (isRetryableError(err) && attempt + 1 < maxAttempts) {
                await sleep(450 * (attempt + 1));
                continue;
              }
              break;
            }
          }
        }

        const errorText = formatReadableError(lastError);
        res.write(`data: ${JSON.stringify({ error: errorText })}\n\n`);
        res.end();
      } catch {
        console.error("[Ask Amit /api/chat] Unexpected server error.");
        if (!res.headersSent) {
          sendJson(res, 500, {
            error: "Unable to complete the request right now. Please try again.",
          });
        } else {
          res.write(
            `data: ${JSON.stringify({
              error: "Unable to complete the request right now. Please try again.",
            })}\n\n`
          );
          res.end();
        }
      }
    });
  };
}

function geminiChatApiPlugin(mode: string): Plugin {
  return {
    name: "amit-gemini-chat-middleware",
    configureServer(server) {
      server.middlewares.use(createChatHandler(mode));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createChatHandler(mode));
    },
  };
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss(), geminiChatApiPlugin(mode)],
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "next/link": fileURLToPath(
          new URL("./src/shims/next-link.tsx", import.meta.url)
        ),
        "next/font/google": fileURLToPath(
          new URL("./src/shims/next-font-google.ts", import.meta.url)
        ),
      },
    },
  };
});