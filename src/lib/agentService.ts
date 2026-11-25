import { sanitizeEditorialCopy } from "./agentKnowledge";

export interface ChatTurnPayload {
  role: "user" | "assistant";
  text: string;
}

export interface StreamChatResult {
  ok: true;
  text: string;
  model?: string;
}

export interface StreamChatFailure {
  ok: false;
  error: string;
  status?: number;
}

export type AmitChatResponse = StreamChatResult | StreamChatFailure;

/**
 * Streams live responses from the server-side `/api/chat` Gemini pipeline.
 * Logs real HTTP/network/SSE errors via console.error so nothing fails silently.
 */
export async function streamAmitChat(
  message: string,
  history: readonly ChatTurnPayload[],
  onDelta: (accumulatedText: string) => void
): Promise<AmitChatResponse> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        message,
        history: history.slice(-16).map((m) => ({
          role: m.role,
          text: m.text,
        })),
      }),
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      let errorDetail = `Request failed with status ${response.status}`;
      try {
        const errJson = (await response.json()) as { error?: string };
        if (errJson.error) errorDetail = errJson.error;
      } catch {
        // Non-JSON error body
      }
      console.error("[Ask Amit] /api/chat HTTP error:", response.status, errorDetail);
      return { ok: false, error: errorDetail, status: response.status };
    }

    if (contentType.includes("application/json")) {
      const data = (await response.json()) as {
        reply?: string;
        error?: string;
        model?: string;
      };
      if (data.error || !data.reply) {
        const errMsg =
          data.error || "The assistant did not return a response. Please try again.";
        console.error("[Ask Amit] /api/chat JSON error:", errMsg);
        return { ok: false, error: errMsg };
      }
      const clean = sanitizeEditorialCopy(data.reply);
      onDelta(clean);
      return { ok: true, text: clean, model: data.model };
    }

    const reader = response.body?.getReader();
    if (!reader) {
      const errMsg = "Streaming reader was unavailable on the response.";
      console.error("[Ask Amit]", errMsg);
      return { ok: false, error: errMsg };
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    let resolvedModel: string | undefined;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload) continue;

        try {
          const parsed = JSON.parse(payload) as {
            delta?: string;
            done?: boolean;
            model?: string;
            error?: string;
          };

          if (parsed.error) {
            console.error("[Ask Amit] Upstream Gemini stream error:", parsed.error);
            if (!fullText.trim()) {
              return { ok: false, error: parsed.error };
            }
          }

          if (parsed.model) {
            resolvedModel = parsed.model;
          }

          if (parsed.delta) {
            fullText += parsed.delta;
            onDelta(sanitizeEditorialCopy(fullText));
          }
        } catch (parseErr) {
          console.error("[Ask Amit] Failed to parse SSE frame:", parseErr);
        }
      }
    }

    const cleaned = sanitizeEditorialCopy(fullText);
    if (!cleaned) {
      const errMsg = "No text was received from the model stream. Please try again.";
      console.error("[Ask Amit]", errMsg);
      return { ok: false, error: errMsg };
    }

    return { ok: true, text: cleaned, model: resolvedModel };
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === "AbortError";
    const messageText = isAbort
      ? "The response timed out. Please try sending your question again."
      : err instanceof Error
      ? err.message
      : "Unable to reach the assistant service.";
    console.error("[Ask Amit] Live chat request failed:", err);
    return { ok: false, error: messageText };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
