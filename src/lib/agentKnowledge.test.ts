import test from "node:test";
import assert from "node:assert/strict";
import {
  AGENT_DEFAULT_GREETING,
  AGENT_INITIAL_PROMPTS,
  BANNED_BUZZWORDS,
  generateAgentReply,
  getProtocolExplanation,
} from "./agentKnowledge";

function assertCleanEditorialVoice(text: string, label: string) {
  assert.ok(
    !text.includes("\u2014"),
    `${label} must not contain em-dash characters`
  );
  const lower = text.toLowerCase();
  for (const word of BANNED_BUZZWORDS) {
    assert.ok(
      !lower.includes(word),
      `${label} must not contain banned buzzword "${word}"`
    );
  }
  assert.ok(
    /\b(I|I'm|I'll|I've|My|my)\b/.test(text),
    `${label} must be written in first-person voice`
  );
}

test("default greeting and initial prompts are clean and match requirements", () => {
  assert.equal(
    AGENT_DEFAULT_GREETING,
    "Hi there, I'm Amit. Welcome to my protocol studio. Click any prompt below or select a protocol on the page, and I'll walk you through the smart contract architecture."
  );
  assert.equal(AGENT_INITIAL_PROMPTS.length, 3);
  assertCleanEditorialVoice(AGENT_DEFAULT_GREETING, "default greeting");
});

test("all primary architectural queries return first-person replies with 2 follow-ups", () => {
  const queries = [
    "What protocols have you shipped?",
    "How do you prevent flash-loan exploits?",
    "Tell me about your Yul gas optimizations",
    "How do you keep UUPS proxies storage-safe?",
    "Walk me through Nexus RWA compliance",
    "How does Sentinel Insurance protect vault capital?",
    "Walk me through Nexus Perpetuals architecture",
    "How do you test invariants in Foundry?",
    "Are you available for senior smart contract roles?",
    "Tell me something completely general about smart contract engineering",
  ];

  for (const query of queries) {
    const reply = generateAgentReply(query);
    assert.equal(reply.followUps.length, 2, `Expected 2 follow-ups for "${query}"`);
    assert.ok(reply.followUps[0].trim().length > 0);
    assert.ok(reply.followUps[1].trim().length > 0);
    assertCleanEditorialVoice(reply.text, `reply for "${query}"`);
  }
});

test("protocol triggers map directly to tailored protocol explanations", () => {
  const ids = [
    "nexus-rwa",
    "onchain-automation",
    "sentinel-insurance",
    "fs1",
    "fs4",
    "fs2",
  ];

  for (const id of ids) {
    const { prompt, reply } = getProtocolExplanation(id);
    assert.ok(prompt.length > 0);
    assert.equal(reply.followUps.length, 2);
    assertCleanEditorialVoice(reply.text, `protocol explanation for "${id}"`);
  }
});
