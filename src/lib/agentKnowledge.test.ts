import test from "node:test";
import assert from "node:assert/strict";
import {
  AGENT_DEFAULT_GREETING,
  AGENT_INITIAL_PROMPTS,
  BANNED_BUZZWORDS,
  buildProjectPrompt,
  sanitizeEditorialCopy,
} from "./agentKnowledge";
import {
  buildAmitSystemPrompt,
  normalizeConversationContents,
} from "./agentSystemPrompt";
import {
  fullStackProjects,
  coreProjects,
  ARCHITECTURE_INSIGHTS,
} from "../data/projects";

test("greeting copy and exact 3 starter questions match clean executive specification", () => {
  assert.equal(
    AGENT_DEFAULT_GREETING,
    "Hey! I'm Amit Kumar's personal AI assistant. Ask me anything about Amit's DeFi protocols, smart contract architecture, or any general tech and Web3 question."
  );
  assert.ok(!/hinglish|gemini 2\.5/i.test(AGENT_DEFAULT_GREETING));
  assert.ok(!AGENT_DEFAULT_GREETING.includes("\u2014"));

  assert.deepEqual(AGENT_INITIAL_PROMPTS, [
    "What are Amit's flagship projects?",
    "How can I connect with Amit?",
    "How does Amit approach protocol security and gas optimization?",
  ]);
  assert.equal(AGENT_INITIAL_PROMPTS.length, 3);

  for (const word of BANNED_BUZZWORDS) {
    assert.ok(!AGENT_DEFAULT_GREETING.toLowerCase().includes(word));
  }
});

test("normalizeConversationContents drops leading model turns and alternates user/model cleanly", () => {
  const firstTurn = normalizeConversationContents(
    [{ role: "assistant", text: AGENT_DEFAULT_GREETING }],
    "How does Amit save gas in On-Chain Automation Protocol?"
  );
  assert.equal(firstTurn.length, 1);
  assert.equal(firstTurn[0].role, "user");
  assert.equal(
    firstTurn[0].parts[0].text,
    "How does Amit save gas in On-Chain Automation Protocol?"
  );

  const multiTurn = normalizeConversationContents(
    [
      { role: "assistant", text: "Welcome greeting" },
      { role: "user", text: "Hi" },
      { role: "assistant", text: "Hello! How can I help?" },
      { role: "user", text: "Explain Nexus RWA" },
      { role: "user", text: "Specifically the NAV breaker" },
    ],
    "Specifically the NAV breaker"
  );
  assert.equal(multiTurn[0].role, "user");
  assert.equal(multiTurn[1].role, "model");
  assert.equal(multiTurn[2].role, "user");
  assert.equal(multiTurn[2].parts.length, 2);
});

test("system prompt serializes complete 15-project gallery, contracts, credentials, and all 5 workbench files", () => {
  const prompt = buildAmitSystemPrompt();
  assert.match(prompt, /Cyfrin Updraft/);
  assert.match(prompt, /Alchemy University/);
  assert.match(prompt, /Cluster University of Jammu/);
  assert.match(prompt, /nextech\.amit@gmail\.com/);

  for (const insight of ARCHITECTURE_INSIGHTS) {
    assert.ok(prompt.includes(insight.filename), `Missing ${insight.filename}`);
    assert.ok(prompt.includes(insight.tradeoff), `Missing tradeoff for ${insight.filename}`);
  }
  for (const project of [...fullStackProjects, ...coreProjects]) {
    assert.ok(prompt.includes(project.title), `Missing ${project.title}`);
    assert.ok(prompt.includes(project.link), `Missing GitHub URL for ${project.title}`);
    if (project.liveUrl) {
      assert.ok(prompt.includes(project.liveUrl), `Missing live URL for ${project.title}`);
    }
    for (const contract of project.contracts ?? []) {
      assert.ok(prompt.includes(contract.address), `Missing address for ${contract.label}`);
    }
  }
});

test("buildProjectPrompt and sanitizeEditorialCopy work for all 15 projects", () => {
  const all = [...fullStackProjects, ...coreProjects];
  assert.equal(all.length, 15);
  for (const project of all) {
    const prompt = buildProjectPrompt(project.id);
    assert.ok(prompt.includes(project.title));
    assert.ok(!prompt.includes("\u2014"));
  }
  assert.equal(sanitizeEditorialCopy("Solidity — Yul  fast"), "Solidity , Yul fast");
});
