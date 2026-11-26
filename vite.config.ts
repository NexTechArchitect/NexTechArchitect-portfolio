import { fileURLToPath, URL } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  buildAmitSystemPrompt,
  normalizeConversationContents,
} from "./src/lib/agentSystemPrompt";
import { callGeminiRest } from "./src/lib/geminiRest";
import {
  InMemoryRateLimiter,
  MAX_BODY_BYTES,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  extractClientIp,
  extractUpstreamErrorInfo,
  resolveApiKey,
  validateChatPayload,
} from "./src/lib/chatSecurity";

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

function createChatHandler(env: Record<string, string>) {
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

    // 2. Enforce strict 32KB raw payload byte limit while buffering request body
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

        // 4. Resolve valid AIza API key from process.env + loadEnv closure
        const apiKey = resolveApiKey(
          process.env.API_KEY,
          process.env.GEMINI_API_KEY,
          env.API_KEY,
          env.GEMINI_API_KEY
        );

        if (!apiKey) {
          sendJson(res, 200, {
            error: "No valid Gemini API key configured in environment.",
            upstreamStatus: 503,
          });
          return;
        }

        // 5. Call Gemini REST v1beta directly via native fetch
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
    });
  };
}

function geminiChatApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: "amit-gemini-chat-middleware",
    configureServer(server) {
      server.middlewares.use(createChatHandler(env));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createChatHandler(env));
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), geminiChatApiPlugin(env)],
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