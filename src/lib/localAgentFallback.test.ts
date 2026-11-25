import test from "node:test";
import assert from "node:assert/strict";
import { generateLocalFallbackReply } from "./localAgentFallback";
import { BANNED_BUZZWORDS } from "./agentKnowledge";

test("answers flagship projects question with all 4 flagship protocols and real URLs", () => {
  const reply = generateLocalFallbackReply("What are Amit's flagship projects?");
  assert.match(reply, /Nexus RWA Protocol/);
  assert.match(reply, /On-Chain Automation Protocol/);
  assert.match(reply, /Sentinel Insurance Protocol/);
  assert.match(reply, /Nexus Perpetuals DEX/);
  assert.match(reply, /https:\/\/github\.com\/NexTechArchitect\/Nexus-RWA-Protocol/);
  assert.match(reply, /https:\/\/sentinel-insurance-protocol\.vercel\.app/);
  assert.doesNotMatch(reply, /\u2014/);
});

test("matches specific flagship protocol and returns contract addresses and live URL", () => {
  const rwaReply = generateLocalFallbackReply("Tell me about ERC-3643 compliance in Nexus RWA");
  assert.match(rwaReply, /ComplianceEngine/);
  assert.match(rwaReply, /0x00c0E82e0C81c4Df096aAd98f2aA5A399b34131c/);
  assert.match(rwaReply, /https:\/\/nexus-rwa-protocol\.vercel\.app/);

  const autoReply = generateLocalFallbackReply("How does On-Chain Automation save 35% gas?");
  assert.match(autoReply, /JobManager\.sol/);
  assert.match(autoReply, /0xBAa2B4c250DD6da358e23244C2fa85dA1927718C/);
  assert.match(autoReply, /SwapPopQueue\.yul/);

  const perpsReply = generateLocalFallbackReply("Explain Chainlink CCIP in Nexus Perpetuals");
  assert.match(perpsReply, /CrossChainRouter/);
  assert.match(perpsReply, /0xE9b7f8F6c78054fb8d0D97585F32e7e026F5dd24/);
});

test("matches Workbench code filenames directly and includes real code block", () => {
  const reply = generateLocalFallbackReply("Walk me through SwapPopQueue.yul line by line");
  assert.match(reply, /SwapPopQueue\.yul/);
  assert.match(reply, /sstore\(activeIds\.slot, lastIdx\)/);
  assert.match(reply, /```solidity/);
});

test("answers core Solidity and EVM security topics accurately", () => {
  const customErr = generateLocalFallbackReply("Explain custom errors vs revert strings in Solidity");
  assert.match(customErr, /4-byte/);
  assert.match(customErr, /EIP-170/);

  const cei = generateLocalFallbackReply("How does Checks-Effects-Interactions prevent reentrancy?");
  assert.match(cei, /CCIPMarginReceiver\.sol/);
  assert.match(cei, /ReentrancyGuard/);

  const securityApproach = generateLocalFallbackReply(
    "How does Amit approach protocol security and gas optimization?"
  );
  assert.match(securityApproach, /ClaimsGovernor\.sol/);
  assert.match(securityApproach, /SwapPopQueue\.yul/);
});

test("answers contact, credentials, and casual greetings cleanly without banned buzzwords", () => {
  const contact = generateLocalFallbackReply("How can I connect with Amit?");
  assert.match(contact, /nextech\.amit@gmail\.com/);
  assert.match(contact, /Cyfrin Updraft/);
  assert.match(contact, /Alchemy University/);
  assert.match(contact, /Jammu, India/);

  const greeting = generateLocalFallbackReply("Hey kaise ho!");
  assert.match(greeting, /Amit Kumar/);

  for (const text of [contact, greeting]) {
    const lower = text.toLowerCase();
    for (const banned of BANNED_BUZZWORDS) {
      assert.equal(lower.includes(banned), false, `Found banned buzzword: ${banned}`);
    }
    assert.equal(text.includes("\u2014"), false, "Found em-dash");
  }
});
