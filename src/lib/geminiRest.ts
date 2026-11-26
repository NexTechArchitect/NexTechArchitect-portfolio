import type { GeminiContentTurn } from "./agentSystemPrompt";
import { GEMINI_MODELS, extractUpstreamErrorInfo } from "./chatSecurity";

export interface GeminiRestSuccess {
  ok: true;
  reply: string;
  model: string;
}

export interface GeminiRestFailure {
  ok: false;
  error: string;
  upstreamStatus: number | string;
}

export type GeminiRestResult = GeminiRestSuccess | GeminiRestFailure;

export interface CallGeminiRestOptions {
  apiKey: string;
  systemPrompt: string;
  contents: readonly GeminiContentTurn[];
  models?: readonly string[];
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

interface GeminiRestResponsePayload {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: unknown;
        thought?: unknown;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

function redactKeys(text: string): string {
  return text.replace(/AIza[A-Za-z0-9_-]+/g, "[REDACTED_KEY]");
}

function isRetryableStatus(status: number | string): boolean {
  return /^(429|500|502|503|504)$/.test(String(status));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extracts visible text parts from a raw Gemini REST v1beta generateContent response.
 */
export function extractRestCandidateText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const data = payload as GeminiRestResponsePayload;
  const parts = data.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";

  return parts
    .filter(
      (part): part is { text: string; thought?: unknown } =>
        Boolean(part) &&
        typeof part === "object" &&
        part.thought !== true &&
        typeof part.text === "string" &&
        part.text.length > 0
    )
    .map((part) => part.text)
    .join("")
    .replace(/\u2014/g, ", ")
    .trim();
}

/**
 * Direct server-side Gemini REST API caller (zero SDK bundling issues across
 * Vite dev middleware, Vercel serverless functions, and Next.js route handlers).
 */
export async function callGeminiRest({
  apiKey,
  systemPrompt,
  contents,
  models = GEMINI_MODELS,
  fetchImpl = fetch,
  timeoutMs = 18_000,
}: CallGeminiRestOptions): Promise<GeminiRestResult> {
  let lastError = "Upstream Gemini request did not return a text response.";
  let lastStatus: number | string = 502;

  const requestBody = JSON.stringify({
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  for (const model of models) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const maxAttempts = 2;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchImpl(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "aistudio-build",
          },
          body: requestBody,
          signal: controller.signal,
        });

        const rawText = await response.text();
        let parsed: GeminiRestResponsePayload | null = null;
        try {
          parsed = rawText ? (JSON.parse(rawText) as GeminiRestResponsePayload) : null;
        } catch {
          parsed = null;
        }

        if (!response.ok) {
          const upstreamMsg =
            parsed?.error?.message ||
            rawText.slice(0, 240) ||
            `HTTP ${response.status}`;
          lastStatus = response.status;
          lastError = redactKeys(
            `Model ${model} returned HTTP ${response.status}: ${upstreamMsg}`
          );

          if (isRetryableStatus(response.status) && attempt + 1 < maxAttempts) {
            await sleep(400 * (attempt + 1));
            continue;
          }
          break;
        }

        const text = extractRestCandidateText(parsed);
        if (text) {
          return {
            ok: true,
            reply: text,
            model,
          };
        }

        lastStatus = 502;
        lastError = `Model ${model} returned an empty candidate response.`;
        break;
      } catch (err) {
        const info = extractUpstreamErrorInfo(err);
        lastStatus = info.status === "unknown" ? 504 : info.status;
        lastError = redactKeys(
          `Model ${model} network error: ${info.message}`
        );

        if (attempt + 1 < maxAttempts) {
          await sleep(400 * (attempt + 1));
          continue;
        }
        break;
      } finally {
        clearTimeout(timeoutHandle);
      }
    }
  }

  return {
    ok: false,
    error: lastError,
    upstreamStatus: lastStatus,
  };
}
