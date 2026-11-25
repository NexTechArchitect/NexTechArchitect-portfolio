import { sanitizeEditorialCopy } from "./agentKnowledge";
import { generateLocalFallbackReply } from "./localAgentFallback";

export interface ChatTurnPayload {
  role: "user" | "assistant";
  text: string;
}

export interface StreamChatResult {
  ok: true;
  text: string;
  model?: string;
  mode: "gemini" | "local";
}

export interface StreamChatFailure {
  ok: false;
  error: string;
  status?: number;
}

export type AmitChatResponse = StreamChatResult | StreamChatFailure;

async function revealProgressively(
  fullText: string,
  onDelta: (accumulatedText: string) => void
): Promise<void> {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || fullText.length <= 48) {
    onDelta(fullText);
    return;
  }

  // Smooth, brisk word-group progressive reveal (~180-320ms total)
  const chunkSize = Math.max(18, Math.ceil(fullText.length / 18));
  let cursor = 0;

  while (cursor < fullText.length) {
    cursor = Math.min(fullText.length, cursor + chunkSize);
    if (cursor < fullText.length) {
      const nextSpace = fullText.indexOf(" ", cursor);
      if (nextSpace !== -1 && nextSpace - cursor < 16) {
        cursor = nextSpace + 1;
      }
    }
    onDelta(fullText.slice(0, cursor));
    if (cursor < fullText.length) {
      await new Promise((resolve) => window.setTimeout(resolve, 14));
    }
  }
}

/**
 * Requests a clean JSON response from `/api/chat` (`application/json`).
 * If `/api/chat` fails, times out, returns non-JSON, or hits rate limits,
 * transparently serves a sharp context-aware reply from `generateLocalFallbackReply`
 * so visitors never encounter error boxes.
 */
export async function streamAmitChat(
  message: string,
  history: readonly ChatTurnPayload[],
  onDelta: (accumulatedText: string) => void
): Promise<StreamChatResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 20000);
  const trimmedHistory: ChatTurnPayload[] = history.slice(-10).map((m) => ({
    role: m.role,
    text: m.text,
  }));

  let liveText = "";
  let resolvedModel: string | undefined;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        message,
        history: trimmedHistory,
      }),
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (response.ok && contentType.includes("application/json")) {
      const data = (await response.json()) as {
        reply?: string;
        model?: string;
      };
      if (typeof data.reply === "string" && data.reply.trim().length > 0) {
        liveText = sanitizeEditorialCopy(data.reply);
        resolvedModel = data.model;
      }
    }
  } catch {
    // Transparently fall through to built-in local portfolio & EVM assistant
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (liveText) {
    await revealProgressively(liveText, onDelta);
    return { ok: true, text: liveText, model: resolvedModel, mode: "gemini" };
  }

  const fallbackText = generateLocalFallbackReply(message);
  await revealProgressively(fallbackText, onDelta);
  return { ok: true, text: fallbackText, mode: "local" };
}
