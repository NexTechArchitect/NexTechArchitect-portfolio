import test from "node:test";
import assert from "node:assert/strict";
import { callGeminiRest, extractRestCandidateText } from "./geminiRest";

test("extractRestCandidateText joins visible text parts, skips thoughts, and strips em-dashes", () => {
  const text = extractRestCandidateText({
    candidates: [
      {
        content: {
          parts: [
            { text: "internal scratchpad", thought: true },
            { text: "ERC-721 defines unique NFTs" },
            { text: " \u2014 each with an ownerOf lookup." },
          ],
        },
      },
    ],
  });
  assert.equal(text, "ERC-721 defines unique NFTs ,  each with an ownerOf lookup.");
});

test("callGeminiRest sends direct REST payload with User-Agent and falls back across 2.5 -> 2.5-lite -> 2.0", async () => {
  const calls: Array<{ url: string; headers: Record<string, string>; body: unknown }> = [];

  const mockFetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    const headers = (init?.headers ?? {}) as Record<string, string>;
    const body = init?.body ? JSON.parse(String(init.body)) : null;
    calls.push({ url, headers, body });

    if (url.includes("gemini-2.5-flash:") || url.includes("gemini-2.5-flash-lite:")) {
      return new Response(
        JSON.stringify({ error: { code: 404, message: "Model not found" } }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        candidates: [
          {
            content: {
              parts: [{ text: "Live Gemini answer about ERC-721." }],
            },
          },
        ],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;

  const result = await callGeminiRest({
    apiKey: "AIzaSyTestFakeKeyValue1234567890123",
    systemPrompt: "You are Ask Amit.",
    contents: [{ role: "user", parts: [{ text: "what is erc 721" }] }],
    fetchImpl: mockFetch,
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.model, "gemini-2.0-flash");
    assert.equal(result.reply, "Live Gemini answer about ERC-721.");
  }

  assert.equal(calls.length, 3);
  assert.equal(calls[0]?.headers["User-Agent"], "aistudio-build");
  assert.match(
    calls[0]?.url ?? "",
    /generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-2\.5-flash:generateContent\?key=/
  );
  assert.match(
    calls[1]?.url ?? "",
    /generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-2\.5-flash-lite:generateContent\?key=/
  );
  assert.deepEqual((calls[0]?.body as Record<string, unknown>).generationConfig, {
    temperature: 0.7,
    maxOutputTokens: 1024,
  });
});

test("callGeminiRest redacts API keys from error messages on upstream failure", async () => {
  const mockFetch = (async () => {
    return new Response(
      JSON.stringify({
        error: {
          code: 403,
          message: "API key AIzaSySecretKeyLeak123456789012345 is invalid",
        },
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;

  const result = await callGeminiRest({
    apiKey: "AIzaSySecretKeyLeak123456789012345",
    systemPrompt: "Sys",
    contents: [{ role: "user", parts: [{ text: "hi" }] }],
    models: ["gemini-2.5-flash"],
    fetchImpl: mockFetch,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.upstreamStatus, 403);
    assert.doesNotMatch(result.error, /AIzaSySecretKeyLeak/);
    assert.match(result.error, /\[REDACTED_KEY\]/);
  }
});
