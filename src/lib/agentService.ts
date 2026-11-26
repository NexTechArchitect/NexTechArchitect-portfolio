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
 * Requests a clean JSON response from server-side `/api/chat` (`application/json`).
 * Logs clear LIVE vs OFFLINE mode diagnostics without ever exposing keys or showing error boxes.
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
  let fallbackReason = "Live endpoint unavailable";

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
    if (contentType.includes("application/json")) {
      const data = (await response.json()) as {
        reply?: string;
        source?: string;
        model?: string;
        error?: string;
        upstreamStatus?: number | string;
      };

      if (
        response.ok &&
        typeof data.reply === "string" &&
        data.reply.trim().length > 0
      ) {
        liveText = sanitizeEditorialCopy(data.reply);
        resolvedModel = data.model;
      } else {
        fallbackReason = `${data.upstreamStatus ?? response.status}: ${
          data.error ?? "No live reply returned"
        }`;
      }
    } else {
      fallbackReason = `HTTP ${response.status} non-JSON response (${
        contentType || "unknown"
      })`;
    }
  } catch (err) {
    fallbackReason = err instanceof Error ? err.message : "Network error";
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (liveText) {
    console.info("[Ask Amit] Mode: LIVE");
    await revealProgressively(liveText, onDelta);
    return { ok: true, text: liveText, model: resolvedModel, mode: "gemini" };
  }

  console.warn("[Ask Amit] Mode: OFFLINE fallback — reason:", fallbackReason);
  const fallbackText = generateLocalFallbackReply(message, trimmedHistory);
  await revealProgressively(fallbackText, onDelta);
  return { ok: true, text: fallbackText, mode: "local" };
}
