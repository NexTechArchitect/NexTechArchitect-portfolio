import test from "node:test";
import assert from "node:assert/strict";
import {
  InMemoryRateLimiter,
  MAX_HISTORY_TURNS,
  MAX_MESSAGE_LENGTH,
  isAllowedRequestOrigin,
  validateChatPayload,
} from "./chatSecurity";

test("InMemoryRateLimiter enforces 20 req/min per IP and resets after window", () => {
  const limiter = new InMemoryRateLimiter(3, 60_000);
  const start = 1_000_000;

  assert.equal(limiter.check("203.0.113.5", start).allowed, true);
  assert.equal(limiter.check("203.0.113.5", start + 1_000).allowed, true);
  assert.equal(limiter.check("203.0.113.5", start + 2_000).allowed, true);

  const blocked = limiter.check("203.0.113.5", start + 3_000);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds >= 57);

  // Different IP remains unaffected
  assert.equal(limiter.check("198.51.100.9", start + 3_000).allowed, true);

  // Original IP allowed again after sliding window expires
  assert.equal(limiter.check("203.0.113.5", start + 61_000).allowed, true);
});

test("validateChatPayload enforces message max length and caps history to last 10 turns", () => {
  assert.equal(validateChatPayload(null).ok, false);
  assert.equal(validateChatPayload({ message: "   " }).ok, false);

  const tooLong = validateChatPayload({
    message: "a".repeat(MAX_MESSAGE_LENGTH + 1),
  });
  assert.equal(tooLong.ok, false);

  const longHistory = Array.from({ length: 16 }, (_, i) => ({
    role: i % 2 === 0 ? "user" : "assistant",
    text: `Turn ${i + 1}`,
  }));

  const valid = validateChatPayload({
    message: "Explain Nexus RWA compliance hooks",
    history: [
      ...longHistory,
      { role: "system", text: "ignored invalid role" },
      { role: "user", text: "" },
    ],
  });

  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.history.length, MAX_HISTORY_TURNS);
    assert.equal(valid.history[0]?.text, "Turn 7");
    assert.equal(valid.history[MAX_HISTORY_TURNS - 1]?.text, "Turn 16");
  }
});

test("isAllowedRequestOrigin blocks cross-site origins in production and allows same-origin", () => {
  assert.equal(
    isAllowedRequestOrigin({
      origin: "https://amit-portfolio.vercel.app",
      host: "amit-portfolio.vercel.app",
      isProduction: true,
    }),
    true
  );

  assert.equal(
    isAllowedRequestOrigin({
      origin: "https://evil-attacker.example",
      host: "amit-portfolio.vercel.app",
      isProduction: true,
    }),
    false
  );

  assert.equal(
    isAllowedRequestOrigin({
      origin: null,
      referer: null,
      host: "amit-portfolio.vercel.app",
      isProduction: true,
    }),
    false
  );

  assert.equal(
    isAllowedRequestOrigin({
      origin: "https://evil-attacker.example",
      host: "localhost:3000",
      isProduction: false,
    }),
    true
  );
});
