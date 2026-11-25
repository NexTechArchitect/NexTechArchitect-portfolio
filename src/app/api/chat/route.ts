import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import {
  buildAmitSystemPrompt,
  normalizeConversationContents,
} from "@/lib/agentSystemPrompt";
import {
  InMemoryRateLimiter,
  MAX_BODY_BYTES,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  extractClientIp,
  isAllowedRequestOrigin,
  validateChatPayload,
} from "@/lib/chatSecurity";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-4-hydrogen",
  "gemini-3.1-flash-lite",
] as const;

const rateLimiter = new InMemoryRateLimiter(
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS
);

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

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Origin / Referer in production to prevent cross-site endpoint abuse
    const isProduction = process.env.NODE_ENV === "production";
    if (
      !isAllowedRequestOrigin({
        origin: req.headers.get("origin"),
        referer: req.headers.get("referer"),
        host: req.headers.get("host"),
        forwardedHost: req.headers.get("x-forwarded-host"),
        isProduction,
        allowedOriginsEnv: process.env.ALLOWED_ORIGINS,
      })
    ) {
      return NextResponse.json(
        { error: "Forbidden request origin." },
        { status: 403 }
      );
    }

    // 2. Enforce per-IP sliding-window rate limit (20 requests / minute)
    const clientIp = extractClientIp(req.headers);
    const rate = rateLimiter.check(clientIp);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment before asking again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rate.retryAfterSeconds),
          },
        }
      );
    }

    // 3. Enforce strict payload byte limit before parsing
    const contentLengthHeader = req.headers.get("content-length");
    if (contentLengthHeader) {
      const declaredBytes = Number(contentLengthHeader);
      if (Number.isFinite(declaredBytes) && declaredBytes > MAX_BODY_BYTES) {
        return NextResponse.json(
          { error: "Request payload is too large." },
          { status: 413 }
        );
      }
    }

    const rawText = await req.text();
    if (new TextEncoder().encode(rawText).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request payload is too large." },
        { status: 413 }
      );
    }

    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawText || "{}");
    } catch {
      return NextResponse.json(
        { error: "Malformed JSON request body." },
        { status: 400 }
      );
    }

    // 4. Validate JSON shape, 1,000-char message cap, and last-10-turns history cap
    const validated = validateChatPayload(parsedBody);
    if (!validated.ok) {
      return NextResponse.json(
        { error: validated.error },
        { status: validated.status }
      );
    }

    const apiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.API_KEY ||
      ""
    ).trim();

    if (!apiKey) {
      console.error(
        "[Ask Amit /api/chat] Missing server-side GEMINI_API_KEY configuration."
      );
      return NextResponse.json(
        {
          error:
            "AI assistant is temporarily unavailable. Please verify server configuration and try again.",
        },
        { status: 503 }
      );
    }

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
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
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
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ delta: sanitizedDelta, model })}\n\n`
                  )
                );
              }

              if (emitted) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ done: true, mode: "gemini", model })}\n\n`
                  )
                );
                controller.close();
                return;
              }
            } catch (err) {
              lastError = err;
              console.error(
                `[Ask Amit /api/chat] Model "${model}" attempt ${attempt + 1} failed.`
              );
              if (emitted) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ done: true, mode: "gemini", model })}\n\n`
                  )
                );
                controller.close();
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
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errorText })}\n\n`)
        );
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    console.error("[Ask Amit /api/chat] Unexpected request error.");
    return NextResponse.json(
      { error: "Unable to complete the request right now. Please try again." },
      { status: 500 }
    );
  }
}
