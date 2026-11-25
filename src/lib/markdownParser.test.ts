import test from "node:test";
import assert from "node:assert/strict";
import { parseAssistantBlocks, parseInlineTokens } from "./markdownParser";

test("parseAssistantBlocks parses headings, bullets, ordered lists, dividers, and code blocks cleanly", () => {
  const sample = [
    "### Core Capabilities",
    "Amit engineers production DeFi systems.",
    "- **ERC-3643** compliance hooks",
    "* Inline `Yul` swap-and-pop queues",
    "1. Threat modeling & invariants",
    "2. Stateful Foundry fuzzing",
    "---",
    "```solidity",
    "pragma solidity ^0.8.24;",
    "```",
  ].join("\n");

  const blocks = parseAssistantBlocks(sample);

  assert.equal(blocks[0]?.type, "heading");
  if (blocks[0]?.type === "heading") {
    assert.equal(blocks[0].level, 3);
    assert.equal(blocks[0].text, "Core Capabilities");
    assert.ok(!blocks[0].text.includes("#"));
  }

  assert.equal(blocks[1]?.type, "paragraph");
  assert.equal(blocks[2]?.type, "bullet");
  assert.equal(blocks[3]?.type, "bullet");
  assert.equal(blocks[4]?.type, "ordered");
  assert.equal(blocks[5]?.type, "ordered");
  assert.equal(blocks[6]?.type, "divider");
  assert.equal(blocks[7]?.type, "code");
  if (blocks[7]?.type === "code") {
    assert.equal(blocks[7].lang, "solidity");
    assert.equal(blocks[7].code, "pragma solidity ^0.8.24;");
  }
});

test("parseAssistantBlocks handles streaming unclosed code fences safely", () => {
  const partial = "## Yul Pattern\n```yul\nsstore(slot, val)";
  const blocks = parseAssistantBlocks(partial);
  assert.equal(blocks.length, 2);
  assert.deepEqual(blocks[0], { type: "heading", level: 2, text: "Yul Pattern" });
  assert.deepEqual(blocks[1], {
    type: "code",
    lang: "yul",
    code: "sstore(slot, val)",
  });
});

test("parseInlineTokens parses bold, italic, inline code, links, and email without raw syntax", () => {
  const tokens = parseInlineTokens(
    "Check **Nexus RWA**, `SwapPopQueue.yul`, *Foundry*, [GitHub](https://github.com/NexTechArchitect), or nextech.amit@gmail.com."
  );

  assert.ok(tokens.some((t) => t.type === "bold" && t.value === "Nexus RWA"));
  assert.ok(tokens.some((t) => t.type === "code" && t.value === "SwapPopQueue.yul"));
  assert.ok(tokens.some((t) => t.type === "italic" && t.value === "Foundry"));
  assert.ok(
    tokens.some(
      (t) =>
        t.type === "link" &&
        t.label === "GitHub" &&
        t.href === "https://github.com/NexTechArchitect"
    )
  );
  assert.ok(
    tokens.some((t) => t.type === "email" && t.address === "nextech.amit@gmail.com")
  );
});
