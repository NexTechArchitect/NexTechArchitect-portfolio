import { fileURLToPath, URL } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  buildAmitSystemPrompt,
  normalizeConversationContents,
} from "./src/lib/agentSystemPrompt";
import { generateLocalFallbackReply } from "./src/lib/localAgentFallback";
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
} from "./src/lib/chatSecurity";

const rateLimiter = new InMemoryRateLimiter(
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS
);

function resolveServerApiKey(mode: string): string {
  const fileEnv = loadEnv(mode, process.cwd(), "");
  return resolveApiKey(
    process.env.API_KEY,
    process.env.GEMINI_API_KEY,
    fileEnv.API_KEY,
    fileEnv.GEMINI_API_KEY
  );
}

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

    // 2. Enforce strict 32KB raw payload byte limit while reading body
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

        // 3. Validate JSON shape, 1,000-char message cap, and last-10-turns history cap
        const validated = validateChatPayload(parsedBody);
        if (!validated.ok) {
          sendJson(res, validated.status, { error: validated.error });
          return;
        }

        // 4. Resolve valid AIza API key (ignoring placeholder values like "Gemini")
        const apiKey = resolveServerApiKey(mode);
        if (!apiKey) {
          sendJson(res, 200, {
            reply: generateLocalFallbackReply(validated.message),
            mode: "local",
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