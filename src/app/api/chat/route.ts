import { NextRequest, NextResponse } from "next/server";
import {
  buildAmitSystemPrompt,
  normalizeConversationContents,
} from "@/lib/agentSystemPrompt";
import { callGeminiRest } from "@/lib/geminiRest";
import {
  InMemoryRateLimiter,
  MAX_BODY_BYTES,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  extractClientIp,
  extractUpstreamErrorInfo,
  resolveApiKey,
  validateChatPayload,
} from "@/lib/chatSecurity";

const rateLimiter = new InMemoryRateLimiter(
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS
);

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce per-IP sliding-window rate limit (20 requests / minute)
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

    // 2. Enforce strict payload byte limit before parsing
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

    // 3. Validate JSON shape, 1,000-char message cap, and last-10-turns history cap
    const validated = validateChatPayload(parsedBody);
    if (!validated.ok) {
      return NextResponse.json(
        { error: validated.error },
        { status: validated.status }
      );
    }

    // 4. Resolve valid AIza key (prioritizing API_KEY over GEMINI_API_KEY and ignoring placeholders)
    const apiKey = resolveApiKey(
      process.env.API_KEY,
      process.env.GEMINI_API_KEY
    );

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "No valid Gemini API key configured in environment.",
          upstreamStatus: 503,
        },
        {
          status: 200,
          headers: { "X-Content-Type-Options": "nosniff" },
        }
      );
    }

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
      return NextResponse.json(
        {
          reply: result.reply,
          source: "live",
          model: result.model,
        },
        {
          status: 200,
          headers: { "X-Content-Type-Options": "nosniff" },
        }
      );
    }

    return NextResponse.json(
      {
        error: result.error,
        upstreamStatus: result.upstreamStatus,
      },
      {
        status: 200,
        headers: { "X-Content-Type-Options": "nosniff" },
      }
    );
  } catch (err) {
    const info = extractUpstreamErrorInfo(err);
    return NextResponse.json(
      {
        error: info.message,
        upstreamStatus: info.status === "unknown" ? 500 : info.status,
      },
      {
        status: 200,
        headers: { "X-Content-Type-Options": "nosniff" },
      }
    );
  }
}
