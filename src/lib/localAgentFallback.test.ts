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

test("answers ERC & EIP standards cleanly including shorthand and common typos", () => {
  const erc721 = generateLocalFallbackReply("what is erc 721");
  assert.match(erc721, /ERC-721/);
  assert.match(erc721, /ownerOf/);
  assert.match(erc721, /ERC-721A/);

  const aaReply = generateLocalFallbackReply("what is aa");
  assert.match(aaReply, /ERC-4337/);
  assert.match(aaReply, /EntryPoint/);
  assert.match(aaReply, /Paymaster/);

  const erc3156 = generateLocalFallbackReply("what is erc 3156");
  assert.match(erc3156, /ERC-3156/);
  assert.match(erc3156, /onFlashLoan/);

  const eip1153 = generateLocalFallbackReply("explain eip 1153 transient storage");
  assert.match(eip1153, /EIP-1153/);
  assert.match(eip1153, /TLOAD/);

  const typo1115 = generateLocalFallbackReply("what is 1115 token standard");
  assert.match(typo1115, /ERC-1155/);
  assert.match(typo1115, /safeBatchTransferFrom/);

  const typo5626 = generateLocalFallbackReply("explain 5626 vault inflation");
  assert.match(typo5626, /ERC-4626/);
  assert.match(typo5626, /First-Depositor Inflation Attack/);

  const typo19000 = generateLocalFallbackReply("what is 19000 proxy slot");
  assert.match(typo19000, /ERC-1967/);
  assert.match(typo19000, /UUPS/);

  const eip4844 = generateLocalFallbackReply("explain eip-4844 blobs");
  assert.match(eip4844, /EIP-4844/);
  assert.match(eip4844, /KZG/);

  const eip7702 = generateLocalFallbackReply("what is erc 7702");
  assert.match(eip7702, /EIP-7702/);
  assert.match(eip7702, /0xef0100/);

  const diamond = generateLocalFallbackReply("explain erc 2535 diamond facets");
  assert.match(diamond, /ERC-2535/);
  assert.match(diamond, /diamondCut/);

  const tba = generateLocalFallbackReply("what are erc 6551 token bound accounts");
  assert.match(tba, /ERC-6551/);
  assert.match(tba, /CREATE2/);
});

test("matches Workbench code filenames directly and includes real code block", () => {
  const reply = generateLocalFallbackReply("Walk me through SwapPopQueue.yul line by line");
  assert.match(reply, /SwapPopQueue\.yul/);
  assert.match(reply, /sstore\(activeIds\.slot, lastIdx\)/);
  assert.match(reply, /```solidity/);
});

test("answers deep EVM, DeFi, L2, and full-stack Web3 topics accurately", () => {
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

  const create2 = generateLocalFallbackReply("How does CREATE2 deterministic deployment work?");
  assert.match(create2, /0xff/);
  assert.match(create2, /initCode/);

  const delegatecall = generateLocalFallbackReply("Explain delegatecall vs staticcall vs call");
  assert.match(delegatecall, /delegatecall/);
  assert.match(delegatecall, /staticcall/);

  const abi = generateLocalFallbackReply("Why is abi.encodePacked dangerous for hash collisions?");
  assert.match(abi, /abi\.encodePacked/);
  assert.match(abi, /abi\.encodeCall/);

  const muldiv = generateLocalFallbackReply("Explain mulDiv rounding direction in DeFi");
  assert.match(muldiv, /Math\.mulDiv/);
  assert.match(muldiv, /WAD/);

  const rollups = generateLocalFallbackReply("Compare Optimistic vs ZK L2 rollups");
  assert.match(rollups, /Optimistic Rollups/);
  assert.match(rollups, /ZK Rollups/);

  const wagmi = generateLocalFallbackReply("How do Wagmi v2, Viem, and The Graph fit in full-stack Web3?");
  assert.match(wagmi, /Multicall3/);
  assert.match(wagmi, /Subgraphs/);

  const uniswap = generateLocalFallbackReply("Compare Uniswap V2, V3, and V4 hooks");
  assert.match(uniswap, /x \* y = k/);
  assert.match(uniswap, /PoolManager/);

  const aave = generateLocalFallbackReply("How does Aave V3 health factor liquidation work?");
  assert.match(aave, /Health Factor/);
  assert.match(aave, /LiquidationThreshold/);

  const foundry = generateLocalFallbackReply("How does Foundry stateful invariant fuzzing work?");
  assert.match(foundry, /Handler/);
  assert.match(foundry, /Anvil/);
});

test("answers contact, credentials, and casual greetings cleanly without banned buzzwords", () => {
  const contact = generateLocalFallbackReply("How can I connect with Amit?");
  assert.match(contact, /nextech\.amit@gmail\.com/);
  assert.match(contact, /Cyfrin Updraft/);
  assert.match(contact, /Alchemy University/);
  assert.match(contact, /Jammu, India/);

  const greeting = generateLocalFallbackReply("Hey kaise ho!");
  assert.match(greeting, /Amit Kumar/);

  for (const text of [
    contact,
    greeting,
    generateLocalFallbackReply("what is erc 721"),
    generateLocalFallbackReply("what is aa"),
    generateLocalFallbackReply("what is erc 3156"),
    generateLocalFallbackReply("what is eip 1153"),
    generateLocalFallbackReply("what is eip 4844"),
  ]) {
    const lower = text.toLowerCase();
    for (const banned of BANNED_BUZZWORDS) {
      assert.equal(lower.includes(banned), false, `Found banned buzzword: ${banned}`);
    }
    assert.equal(text.includes("\u2014"), false, "Found em-dash");
  }
});
