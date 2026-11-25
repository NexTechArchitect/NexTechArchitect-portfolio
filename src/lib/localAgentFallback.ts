import {
  fullStackProjects,
  coreProjects,
  TECH_STACK,
  ARCHITECTURE_INSIGHTS,
  type ProjectItem,
  type ArchitectureInsight,
} from "../data/projects";
import { sanitizeEditorialCopy } from "./agentKnowledge";

const ALL_PROJECTS: readonly ProjectItem[] = [
  ...fullStackProjects,
  ...coreProjects,
];

const FLAGSHIP_PROJECTS: readonly ProjectItem[] = fullStackProjects.filter(
  (p) => p.flagship
);

const PROJECT_ALIASES: Record<string, readonly string[]> = {
  "nexus-rwa": [
    "nexus rwa",
    "rwa",
    "erc-3643",
    "erc3643",
    "3643",
    "nustb",
    "complianceengine",
    "identityregistry",
    "kyc",
    "ofac",
    "nav",
    "circuit breaker",
    "tokenization",
    "real world asset",
    "real-world asset",
  ],
  "onchain-automation": [
    "on-chain automation",
    "onchain automation",
    "automation protocol",
    "keeper",
    "jobmanager",
    "keeperregistry",
    "executionengine",
    "swap-and-pop",
    "swap and pop",
    "swappop",
    "35%",
  ],
  "sentinel-insurance": [
    "sentinel insurance",
    "insurance",
    "erc-4626",
    "erc4626",
    "4626",
    "aave",
    "aave v3",
    "policyengine",
    "coveragepool",
    "claimsgovernor",
    "veto council",
    "underwriting",
  ],
  fs1: [
    "nexus perpetuals",
    "perpetuals dex",
    "nexus protocol os",
    "positionmanager",
    "nexuspaymaster",
    "crosschainrouter",
    "50x",
    "perps",
    "ccip",
    "paymaster",
  ],
  fs2: [
    "sentinel dao",
    "dao governance",
    "erc20votes",
    "timelockcontroller",
    "timelock",
  ],
  fs3: ["polkadot", "polka perps", "perps v2", "nexus perps v2"],
  fs4: [
    "erc-5484",
    "erc5484",
    "5484",
    "soulbound",
    "sbt",
    "reputation",
    "rst",
    "svg medal",
  ],
  c1: ["dsc", "stablecoin", "stable coin", "cdp", "200%", "collateral"],
  c2: ["raffle", "lottery", "vrf", "randomness", "fsm"],
  c3: [
    "erc-4337",
    "erc4337",
    "4337",
    "account abstraction",
    "entrypoint",
    "userop",
    "useroperation",
  ],
  c4: ["uups", "eip-1822", "1822", "erc-1967", "1967", "upgradeable", "proxy"],
  c5: ["merkle", "eip-712", "712", "airdrop", "gasless claiming"],
  c6: ["cutecat", "cute cat", "erc-721", "erc721", "nft", "ipfs"],
  c7: ["siso", "erc-20", "erc20", "token standard"],
  c8: ["fundme", "fund me", "crowdfunding", "aggregatorv3"],
};

function formatSingleProject(project: ProjectItem): string {
  const lines: string[] = [
    `### ${project.title}`,
    `**Category:** ${
      project.category === "fullstack"
        ? "Full-Stack Web3 Protocol"
        : "Core EVM Contract"
    } | **Network:** ${project.network} | **Standard:** ${project.standard}`,
    "",
    project.description,
    "",
    `- **Key Highlight:** ${project.metric} (${project.metricDetail})`,
    `- **Stack:** ${project.tech.join(", ")}`,
  ];

  if (project.contracts && project.contracts.length > 0) {
    lines.push("- **Deployed Contracts:**");
    for (const c of project.contracts) {
      lines.push(`  - **${c.label}** (${c.role}): \`${c.address}\``);
    }
  }

  if (project.liveUrl) {
    lines.push(`- **Live App:** ${project.liveUrl}`);
  }
  lines.push(`- **GitHub:** ${project.link}`);

  const relatedInsight = findInsightForProject(project);
  if (relatedInsight) {
    lines.push(
      `- **Workbench Code Reference:** \`${relatedInsight.filename}\` (${relatedInsight.outcome})`
    );
  }

  return lines.join("\n");
}

function findInsightForProject(
  project: ProjectItem
): ArchitectureInsight | undefined {
  const lowerTitle = project.title.toLowerCase();
  const lowerShort = project.shortTitle.toLowerCase();
  return ARCHITECTURE_INSIGHTS.find((insight) => {
    const p = insight.protocol.toLowerCase();
    return (
      p.includes(lowerShort) ||
      lowerTitle.includes(p) ||
      (project.id === "sentinel-insurance" && insight.id === "l1") ||
      (project.id === "fs2" && insight.id === "l1") ||
      (project.id === "onchain-automation" && insight.id === "l2") ||
      (project.id === "nexus-rwa" && insight.id === "l3") ||
      (project.id === "fs1" && insight.id === "l4") ||
      (project.id === "fs4" && insight.id === "l5")
    );
  });
}

function matchWorkbenchSnippet(query: string): ArchitectureInsight | undefined {
  for (const insight of ARCHITECTURE_INSIGHTS) {
    const fname = insight.filename.toLowerCase();
    const baseName = fname.replace(/\.(sol|yul)$/, "");
    if (query.includes(fname) || query.includes(baseName)) {
      return insight;
    }
  }
  return undefined;
}

function formatWorkbenchWalkthrough(insight: ArchitectureInsight): string {
  return [
    `### ${insight.filename} (${insight.protocol})`,
    `**Domain:** ${insight.domain} | **Language:** ${insight.language}`,
    "",
    insight.body,
    "",
    `- **Engineering Tradeoff:** ${insight.tradeoff}`,
    `- **Verified Outcome:** ${insight.outcome}`,
    "",
    "```solidity",
    insight.code,
    "```",
  ].join("\n");
}

function scoreProjects(query: string): ProjectItem[] {
  const scored: Array<{ project: ProjectItem; score: number }> = [];

  for (const project of ALL_PROJECTS) {
    let score = 0;
    const titleLower = project.title.toLowerCase();
    const shortLower = project.shortTitle.toLowerCase();

    if (query.includes(titleLower)) score += 12;
    if (query.includes(shortLower) && shortLower.length >= 4) score += 8;

    const aliases = PROJECT_ALIASES[project.id] ?? [];
    for (const alias of aliases) {
      if (query.includes(alias)) {
        score += alias.length >= 6 ? 7 : 5;
      }
    }

    if (project.contracts) {
      for (const c of project.contracts) {
        if (query.includes(c.label.toLowerCase())) {
          score += 9;
        }
      }
    }

    for (const tech of project.tech) {
      const t = tech.toLowerCase();
      if (t !== "solidity" && t !== "foundry" && t !== "next.js" && t !== "evm mainnet") {
        if (query.includes(t)) score += 4;
      }
    }

    if (score > 0) {
      scored.push({ project, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.project);
}

function buildFlagshipOverview(): string {
  const blocks = FLAGSHIP_PROJECTS.map((project, idx) => {
    const livePart = project.liveUrl ? ` | Live: ${project.liveUrl}` : "";
    const contractSummary = project.contracts?.length
      ? ` Key contracts: ${project.contracts
          .map((c) => `\`${c.label}\` (${c.role})`)
          .join(", ")}.`
      : "";
    return `${idx + 1}. **${project.title}** (${project.standard}): **${project.metric}**, ${project.metricDetail}.${contractSummary}\n   GitHub: ${project.link}${livePart}`;
  });

  const additionalFullStack = fullStackProjects
    .filter((p) => !p.flagship)
    .map((p) => `**${p.shortTitle}** (${p.standard})`)
    .join(", ");

  const coreHighlights = coreProjects
    .slice(0, 4)
    .map((p) => `**${p.shortTitle}**`)
    .join(", ");

  return [
    "### Amit Kumar's Flagship DeFi Protocols",
    "Amit architects and ships production multi-contract systems across Ethereum and EVM-compatible mainnets:",
    "",
    ...blocks,
    "",
    `Beyond these flagship protocols, his full-stack gallery includes ${additionalFullStack}, plus core EVM Foundry systems like ${coreHighlights} and more.`,
    "",
    "Ask about any specific protocol (for example **Nexus RWA**, **On-Chain Automation**, **Sentinel Insurance**, or **Nexus Perpetuals**) to inspect contract addresses, security invariants, and gas mechanics.",
  ].join("\n");
}

function buildContactAndBioReply(): string {
  return [
    "### Connect with Amit Kumar (NexTechArchitect)",
    "Amit Kumar is a **Smart Contract Engineer & DeFi Protocol Architect** based in **Jammu, India (IST)**, available for remote Smart Contract Engineer, DeFi Protocol Architect, and Smart Contract Security roles worldwide.",
    "",
    "- **Email:** nextech.amit@gmail.com",
    "- **GitHub:** https://github.com/NexTechArchitect",
    "- **LinkedIn:** https://www.linkedin.com/in/amit-kumar-811a11277",
    "- **X (Twitter):** https://x.com/itZ_AmiT0",
    "- **Portfolio:** https://nex-tech-architect-portfolio.vercel.app/",
    "",
    "**Credentials & Education:**",
    "- **Cyfrin Updraft:** Advanced Solidity & Smart Contract Security",
    "- **Alchemy University:** Ethereum Developer Bootcamp",
    "- **Cluster University of Jammu:** B.Sc. Science",
    "",
    "You can also click **Resume** in the top navigation bar or footer to view and download Amit's full CV.",
  ].join("\n");
}

function buildSecurityAndGasReply(): string {
  const yulInsight = ARCHITECTURE_INSIGHTS.find((i) => i.id === "l2");
  const govInsight = ARCHITECTURE_INSIGHTS.find((i) => i.id === "l1");
  const rwaInsight = ARCHITECTURE_INSIGHTS.find((i) => i.id === "l3");

  return [
    "### Amit's Protocol Security & EVM Gas Engineering Approach",
    "Amit closes attack vectors at design time rather than patching after deployment, combining threat modeling, Foundry stateful fuzzing, and targeted inline Yul optimization:",
    "",
    `- **Flash-Loan & Governance Hardening:** ${govInsight ? govInsight.summary : "Prior-block vote checkpoints (block.number - 1) and TimelockController execution delays prevent same-block vote capture."} (\`ClaimsGovernor.sol\`)`,
    `- **O(1) Data Structures & Inline Yul:** ${yulInsight ? yulInsight.outcome : "Up to 35% execution gas reduction via 1-based index mappings, swap-and-pop removal, and direct storage length updates."} (\`SwapPopQueue.yul\`)`,
    `- **On-Chain Compliance & Oracle Circuit Breakers:** ${rwaInsight ? rwaInsight.summary : "ERC-3643 transfer hooks verify KYC/OFAC status on-chain alongside a 15% 24-hour Chainlink NAV deviation circuit breaker."} (\`ComplianceHook.sol\`)`,
    "- **Invariant Testing & Static Analysis:** Handler-based stateful Foundry fuzz campaigns, Anvil mainnet fork testing, Slither CI sweeps, strict Checks-Effects-Interactions (CEI), custom errors, and 50-slot UUPS storage gaps.",
    "",
    "Scroll to the **Workbench** section or ask me to explain `SwapPopQueue.yul`, `ClaimsGovernor.sol`, `ComplianceHook.sol`, `CCIPMarginReceiver.sol`, or `ReputationStorageV1.sol`.",
  ].join("\n");
}

function matchCoreWeb3Concept(query: string): string | null {
  if (
    /custom error|revert string|require\(/.test(query)
  ) {
    return [
      "### Custom Errors vs. Revert Strings in Solidity 0.8+",
      "Custom errors (`error Unauthorized(address caller);`) are strictly superior to string-based `require(..., \"...\")` messages in production EVM contracts:",
      "",
      "- **Deployment Bytecode Savings:** Revert strings embed full UTF-8 byte arrays into runtime bytecode, increasing deployment gas and pushing large protocols closer to the 24KB EIP-170 contract size limit. Custom errors encode only a 4-byte function selector (`keccak256(\"Unauthorized(address)\")[0:4]`).",
      "- **Runtime Revert Gas:** Reverting with a custom error avoids ABI-encoding dynamic string headers and memory expansion, saving gas on failing paths and keeper simulations.",
      "- **Typed Diagnostics:** Custom errors accept structured parameters (like `FlashLoanSnapshotViolation(uint256 queryBlock, uint256 currentBlock)` in Amit's `ClaimsGovernor.sol`), which Viem and Wagmi decode cleanly on the frontend.",
    ].join("\n");
  }

  if (
    /\byul\b|inline assembly|storage packing|slot packing|sstore|calldata/.test(
      query
    )
  ) {
    const yulInsight = ARCHITECTURE_INSIGHTS.find((i) => i.id === "l2");
    const storageInsight = ARCHITECTURE_INSIGHTS.find((i) => i.id === "l5");
    return [
      "### Yul Assembly & EVM Storage Packing",
      "Because `SSTORE` and `SLOAD` dominate EVM transaction gas, Amit optimizes storage layout first and drops into inline Yul only on proven hot paths:",
      "",
      `- **Tightly Packed Structs:** In \`${storageInsight?.filename ?? "ReputationStorageV1.sol"}\`, \`uint64 score\`, \`uint64 lastUpdated\`, \`uint16 tier\`, and \`bool revoked\` pack into a single 256-bit storage slot, turning multi-slot writes into one \`SSTORE\`.`,
      `- **O(1) Swap-and-Pop with Yul:** In \`${yulInsight?.filename ?? "SwapPopQueue.yul"}\` (On-Chain Automation Protocol), updating \`sstore(activeIds.slot, lastIdx)\` directly inside \`assembly\` removes redundant array bounds overhead and eliminates linear loop DoS, cutting execution gas by up to 35%.`,
      "- **Readability Rule:** Keep core accounting, access control, and invariant checks in explicit Solidity 0.8+ so auditors can verify state transitions cleanly.",
    ].join("\n");
  }

  if (/reentrancy|\bcei\b|checks[- ]effects[- ]interactions/.test(query)) {
    return [
      "### Checks-Effects-Interactions (CEI) & Reentrancy Defense",
      "Reentrancy occurs when an external call hands control flow to an untrusted contract (or ERC-777/ERC-721 callback) before internal state balances or nonces are updated.",
      "",
      "- **Strict CEI Ordering:** Validate all preconditions first (**Checks**), mutate all state balances, nonces, and flags second (**Effects**), and perform external token transfers or calls last (**Interactions**).",
      "- **Concrete Example from Amit's Codebase:** In `CCIPMarginReceiver.sol` (Nexus Perpetuals DEX), `processedMessages[messageId] = true` is written before `_depositMargin(...)` executes, closing both replay and reentrant credit paths.",
      "- **Defense in Depth:** Pair CEI with OpenZeppelin `ReentrancyGuard` (or EIP-1153 transient storage locks) and read-only reentrancy checks on vault share pricing.",
    ].join("\n");
  }

  if (/flash[- ]?loan|snapshot|governance attack/.test(query)) {
    const govInsight = ARCHITECTURE_INSIGHTS.find((i) => i.id === "l1");
    return [
      "### Flash-Loan Governance Defense",
      "If a governor contract checks live `balanceOf(voter)` at the current `block.number`, an attacker can flash-borrow voting tokens, pass or swing a proposal, and repay the loan inside one atomic transaction.",
      "",
      `- **Prior-Block Checkpoints:** In \`${govInsight?.filename ?? "ClaimsGovernor.sol"}\` (Sentinel Insurance & Sentinel DAO), every voting-weight lookup requires \`snapshotBlock < block.number\` and reads \`_getPastVotes(account, snapshotBlock)\` via \`ERC20Votes\`.`,
      "- **Timelock & Veto Layer:** Passed proposals queue inside a `TimelockController` with a Veto Council window, ensuring malicious state changes can never execute atomically.",
    ].join("\n");
  }

  if (/storage gap|uups|proxy collision|eip-1822|erc-1967/.test(query)) {
    const storageInsight = ARCHITECTURE_INSIGHTS.find((i) => i.id === "l5");
    return [
      "### UUPS Upgradeable Proxies & Storage Gaps",
      "In EIP-1822 UUPS proxies, upgrade authorization lives inside the implementation contract (`_authorizeUpgrade`), keeping the proxy minimal while delegating calls against shared proxy storage.",
      "",
      `- **Preventing Slot Collisions:** Base contracts must reserve append-only padding such as \`uint256[48] private __gap;\` (see Amit's \`${storageInsight?.filename ?? "ReputationStorageV1.sol"}\`) so adding state variables in V2 never overwrites child contract slots.`,
      "- **Hardening Checklist:** Call `_disableInitializers()` in the implementation constructor, gate `_authorizeUpgrade` behind owner/timelock control, and run Foundry storage layout diffs in CI before every upgrade.",
    ].join("\n");
  }

  if (/foundry|fuzz|invariant|slither|audit|testing/.test(query)) {
    return [
      "### Foundry Invariant Fuzzing & Slither Security Workflow",
      "Unit tests only verify paths the engineer thought of; DeFi protocols break on unexpected multi-actor call sequences.",
      "",
      "- **Stateful Handler-Based Invariant Fuzzing:** Amit builds bounded Foundry handler contracts that randomize deposits, borrows, oracle price updates, and liquidations across actors to prove core invariants (for example, protocol collateral value always exceeds minted DSC supply in his Decentralized StableCoin Engine).",
      "- **Mainnet Forking (Anvil):** Integration suites run against forked EVM state to validate real Chainlink feeds, Aave V3 pools, and ERC-4337 EntryPoint behavior.",
      "- **Static Analysis (Slither):** Automated Slither sweeps run in CI to catch unchecked return values, shadowing, reentrancy sinks, and precision loss early.",
    ].join("\n");
  }

  if (/stack|skills|tech|tools|experience|languages/.test(query)) {
    const domains = [
      "Protocol & EVM",
      "Security & Testing",
      "DeFi Standards",
      "Full-Stack Web3",
    ] as const;
    const grouped = domains.map((domain) => {
      const items = TECH_STACK.filter((t) => t.domain === domain)
        .map((t) => `**${t.name}** (${t.focus})`)
        .join("; ");
      return `- **${domain}:** ${items}`;
    });

    return [
      "### Amit Kumar's Engineering Stack",
      ...grouped,
      "",
      "Ask about any standard or protocol in his gallery to inspect how these tools fit together in production.",
    ].join("\n");
  }

  return null;
}

/**
 * Generates a crisp, context-aware response grounded directly in Amit Kumar's
 * portfolio data (`src/data/projects.ts`) and senior EVM engineering knowledge.
 * Used transparently whenever `/api/chat` is unavailable so visitors never see an error box.
 */
export function generateLocalFallbackReply(userMessage: string): string {
  const raw = userMessage.trim();
  const query = raw.toLowerCase();

  // 1. Direct Workbench file or snippet walkthrough
  const matchedSnippet = matchWorkbenchSnippet(query);
  if (matchedSnippet) {
    return sanitizeEditorialCopy(formatWorkbenchWalkthrough(matchedSnippet));
  }

  // 2. Flagship / gallery overview questions
  const asksFlagshipOverview =
    /\b(flagship|top projects|best projects|all projects|what projects|his projects|your projects|project gallery|what has amit built|what did amit build|portfolio projects)\b/.test(
      query
    ) ||
    (query.includes("project") &&
      !scoreProjects(query).length &&
      /\b(list|show|what|tell|overview|summary)\b/.test(query));

  if (asksFlagshipOverview) {
    return sanitizeEditorialCopy(buildFlagshipOverview());
  }

  // 3. Contact, hiring, resume, bio, or background questions
  if (
    /\b(contact|connect|hire|hiring|email|reach|linkedin|github|twitter|resume|cv|location|where is amit|available|remote|background|education|certif|cyfrin|alchemy|who is amit|about amit)\b/.test(
      query
    )
  ) {
    return sanitizeEditorialCopy(buildContactAndBioReply());
  }

  // 4. Security + gas combined overview prompt (e.g. starter prompt #3)
  if (
    query.includes("security") &&
    (query.includes("gas") || query.includes("approach") || query.includes("optimization"))
  ) {
    return sanitizeEditorialCopy(buildSecurityAndGasReply());
  }

  // 5. Dynamic project & DeFi standard match from src/data/projects.ts
  const matchedProjects = scoreProjects(query);
  if (matchedProjects.length > 0) {
    const topMatches = matchedProjects.slice(0, 2);
    const body = topMatches.map(formatSingleProject).join("\n\n---\n\n");
    return sanitizeEditorialCopy(body);
  }

  // 6. Core Solidity / EVM / DeFi engineering concepts
  const conceptReply = matchCoreWeb3Concept(query);
  if (conceptReply) {
    return sanitizeEditorialCopy(conceptReply);
  }

  // 7. General greetings & open-ended helpful guidance
  if (
    /^(hi|hello|hey|yo|hola|namaste|kaise ho|kya haal|gm|good morning|good evening|sup|greetings)\b/.test(
      query
    )
  ) {
    return sanitizeEditorialCopy(
      [
        "Hey! Great to meet you. I'm Amit Kumar's personal protocol assistant.",
        "",
        "Here are a few things we can explore right away:",
        "- **Flagship DeFi Protocols:** Nexus RWA (`ERC-3643`), On-Chain Automation (`O(1) Yul keepers`), Sentinel Insurance (`ERC-4626` + Aave V3), and Nexus Perpetuals DEX (`50x Perps` + `ERC-4337` + Chainlink CCIP).",
        "- **Solidity & Yul Workbench:** Deep dives on `SwapPopQueue.yul`, `ClaimsGovernor.sol`, `ComplianceHook.sol`, `CCIPMarginReceiver.sol`, and `ReputationStorageV1.sol`.",
        "- **Hiring & Contact:** Amit's background, Resume, GitHub (`https://github.com/NexTechArchitect`), or direct email (`nextech.amit@gmail.com`).",
        "",
        "What would you like to dig into first?",
      ].join("\n")
    );
  }

  // 8. Catch-all executive guidance (never an error message)
  return sanitizeEditorialCopy(
    [
      "I can walk you through any part of **Amit Kumar's (NexTechArchitect)** DeFi engineering work or core Solidity architecture:",
      "",
      "- **Flagship Protocols:** Ask about **Nexus RWA Protocol**, **On-Chain Automation Protocol**, **Sentinel Insurance Protocol**, or **Nexus Perpetuals DEX** for architecture details, deployed contract addresses, live apps, and GitHub repositories.",
      "- **Solidity & Security Deep Dives:** Ask about custom errors vs. revert strings, inline Yul gas optimization, Checks-Effects-Interactions (CEI), flash-loan governance defense, UUPS storage gaps, or Foundry invariant fuzzing.",
      "- **Connect with Amit:** Reach out via `nextech.amit@gmail.com`, GitHub (https://github.com/NexTechArchitect), or LinkedIn (https://www.linkedin.com/in/amit-kumar-811a11277).",
    ].join("\n")
  );
}
