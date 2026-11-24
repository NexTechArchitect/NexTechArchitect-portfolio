export interface AgentReply {
  id: string;
  topic: string;
  text: string;
  followUps: readonly [string, string];
}

export const AGENT_DEFAULT_GREETING =
  "Hi there, I'm Amit. Welcome to my protocol studio. Click any prompt below or select a protocol on the page, and I'll walk you through the smart contract architecture.";

export const AGENT_INITIAL_PROMPTS: readonly string[] = [
  "What protocols have you shipped?",
  "How do you prevent flash-loan exploits?",
  "Tell me about your Yul gas optimizations",
];

export const BANNED_BUZZWORDS = [
  "delve",
  "testament",
  "elevate",
  "seamless",
  "cutting-edge",
  "realm",
  "tapestry",
  "robust",
  "landscape",
] as const;

interface KnowledgeEntry {
  topic: string;
  protocolIds?: readonly string[];
  keywords: readonly string[];
  text: string;
  followUps: readonly [string, string];
}

const KNOWLEDGE_BASE: readonly KnowledgeEntry[] = [
  {
    topic: "shipped-protocols",
    keywords: [
      "shipped",
      "protocols",
      "projects",
      "built",
      "deployed",
      "mainnet",
      "portfolio",
      "work",
    ],
    text: "I have designed and deployed six production DeFi protocols across Base Mainnet and EVM networks, plus a broader suite of audited core primitives. My flagship systems include Nexus RWA (ERC-3643 institutional compliance with a 15% Chainlink NAV circuit breaker), On-Chain Automation (O(1) Yul-optimized keeper queues), Sentinel Insurance (ERC-4626 vaults routed into Aave V3), and Nexus Perpetuals (50x leverage with ERC-4337 gasless paymasters and Chainlink CCIP margin relay).",
    followUps: [
      "Walk me through Nexus RWA compliance",
      "How does Sentinel Insurance protect vault capital?",
    ],
  },
  {
    topic: "flash-loan-defense",
    keywords: [
      "flash",
      "flash-loan",
      "exploit",
      "governance",
      "dao",
      "snapshot",
      "attack",
      "vote",
      "timelock",
    ],
    protocolIds: ["fs2"],
    text: "I eliminate flash-loan governance and claim capture at the state-machine boundary. In Sentinel Insurance and Sentinel DAO, every voting-weight query reads ERC20Votes checkpoints strictly at block.number - 1, so tokens borrowed atomically inside the active block carry zero voting power. I pair that checkpoint guard with a TimelockController execution delay and a Veto Council safeguard before any treasury payout can execute.",
    followUps: [
      "How do you test invariants in Foundry?",
      "Tell me about your Yul gas optimizations",
    ],
  },
  {
    topic: "yul-gas",
    keywords: [
      "yul",
      "assembly",
      "gas",
      "optimization",
      "optimizations",
      "automation",
      "keeper",
      "queue",
      "o(1)",
      "swap-and-pop",
    ],
    protocolIds: ["onchain-automation"],
    text: "In my On-Chain Automation Protocol, linear job arrays would eventually hit block gas limits as active upkeeps scale. I built a dense swap-and-pop queue backed by a 1-based index mapping so every cancellation and batch dequeue executes in strict O(1) time. Moving array length decrements, storage slot pointers, and calldata routing into inline Yul cut execution gas overhead by up to 35% while keeping every state transition deterministic.",
    followUps: [
      "How do you handle keeper slashing and incentives?",
      "How do you keep UUPS proxies storage-safe?",
    ],
  },
  {
    topic: "nexus-rwa",
    keywords: [
      "rwa",
      "erc-3643",
      "3643",
      "compliance",
      "kyc",
      "ofac",
      "nav",
      "circuit breaker",
      "tokenization",
    ],
    protocolIds: ["nexus-rwa"],
    text: "I architected Nexus RWA on Base Mainnet to enforce institutional transfer rules without a centralized signing server. Every ERC-20 transfer hook queries my on-chain IdentityRegistry and ComplianceEngine to validate KYC commitments and OFAC status in real time. For pricing safety, my NAV oracle tracks Chainlink updates against a 15% 24-hour deviation circuit breaker that automatically halts mints and redemptions if a feed goes stale or drifts outside bounds.",
    followUps: [
      "How does O(1) Merkle yield distribution work?",
      "How do you test invariants in Foundry?",
    ],
  },
  {
    topic: "sentinel-insurance",
    keywords: [
      "sentinel",
      "insurance",
      "4626",
      "erc-4626",
      "aave",
      "vault",
      "vaults",
      "underwriting",
      "inflation",
    ],
    protocolIds: ["sentinel-insurance"],
    text: "I designed Sentinel Insurance around ERC-4626 capital vaults that route idle underwriter liquidity directly into Aave V3 yield reserves while issuing ERC-721 coverage policies. To defeat first-depositor share inflation attacks, I use virtual share offsets and strict accounting invariants across deposits and redemptions. Claims flow through a prior-block snapshot governor so liquidity providers stay protected against flash-loan collusion.",
    followUps: [
      "How do you prevent flash-loan exploits?",
      "Walk me through Nexus Perpetuals architecture",
    ],
  },
  {
    topic: "nexus-perpetuals",
    keywords: [
      "perpetuals",
      "perps",
      "50x",
      "leverage",
      "ccip",
      "cross-chain",
      "4337",
      "erc-4337",
      "paymaster",
      "account abstraction",
      "polkadot",
    ],
    protocolIds: ["fs1", "fs3", "c3"],
    text: "For Nexus Perpetuals (Protocol OS), I combined a 50x isolated-margin liquidation engine with ERC-4337 smart account paymasters so traders submit orders without juggling native gas tokens. Cross-chain margin deposits arrive over Chainlink CCIP, where I enforce strict source-chain allowlists and lock each messageId nonce before crediting collateral so asynchronous bridge retries can never double-credit a vault.",
    followUps: [
      "How do you prevent replay attacks across chains?",
      "Tell me about your Yul gas optimizations",
    ],
  },
  {
    topic: "uups-upgradeability",
    keywords: [
      "uups",
      "proxy",
      "proxies",
      "upgrade",
      "upgradeability",
      "storage",
      "slot",
      "gap",
      "reputation",
      "5484",
      "erc-5484",
      "sbt",
    ],
    protocolIds: ["fs4", "c4"],
    text: "Upgradeable contracts live with their storage layout permanently, so I treat slot discipline as a hard invariant. Across my ERC-5484 On-Chain Reputation engine and EIP-1822 UUPS proxy architecture, I pack struct fields into single 256-bit EVM words, reserve explicit storage gaps on base contracts, lock implementation initializers, and run automated Foundry storage layout diff checks before any V2 upgrade executes.",
    followUps: [
      "How do you test invariants in Foundry?",
      "What protocols have you shipped?",
    ],
  },
  {
    topic: "foundry-security",
    keywords: [
      "foundry",
      "fuzz",
      "fuzzing",
      "invariant",
      "invariants",
      "slither",
      "audit",
      "security",
      "test",
      "testing",
      "solvency",
      "stablecoin",
      "dsc",
    ],
    protocolIds: ["c1"],
    text: "My verification pipeline starts with handler-based stateful Foundry invariant fuzzing rather than isolated happy-path unit tests. Across protocols like Nexus RWA and my Decentralized StableCoin Engine, I run thousands of randomized multi-actor call sequences asserting that total protocol collateral always exceeds liabilities and compliance hooks can never be bypassed, paired with zero-high Slither static analysis gates in CI.",
    followUps: [
      "Walk me through Nexus RWA compliance",
      "How do you prevent flash-loan exploits?",
    ],
  },
  {
    topic: "merkle-vrf-core",
    keywords: [
      "merkle",
      "airdrop",
      "eip-712",
      "712",
      "vrf",
      "raffle",
      "oracle",
      "yield",
      "claims",
      "replay",
      "slashing",
    ],
    protocolIds: ["c2", "c5", "c6", "c7", "c8"],
    text: "For high-fanout distributions and cross-chain relays, I move heavy computation off-chain and verify compact cryptographic commitments on-chain. In my Merkle-712 Airdrop and Nexus RWA yield distributor, users claim in O(log N) or O(1) gas using Merkle proofs paired with replay-protected EIP-712 signatures. For keeper bonds, operators stake collateral that slashes automatically on missed or invalid executions.",
    followUps: [
      "Tell me about your Yul gas optimizations",
      "Walk me through Nexus Perpetuals architecture",
    ],
  },
  {
    topic: "contact-hiring",
    keywords: [
      "hire",
      "contact",
      "email",
      "available",
      "availability",
      "role",
      "team",
      "collaborate",
      "reach",
      "github",
      "linkedin",
    ],
    text: "I am open to senior smart contract engineering, DeFi protocol architecture, and security engineering roles across Ethereum and EVM teams. You can reach me directly at nextech.amit@gmail.com, inspect my verified contract repositories on GitHub at NexTechArchitect, or connect with me on LinkedIn and X.",
    followUps: [
      "What protocols have you shipped?",
      "How do you test invariants in Foundry?",
    ],
  },
];

const PROTOCOL_TITLE_FALLBACKS: Record<string, string> = {
  "nexus-rwa": "Nexus RWA Protocol",
  "onchain-automation": "On-Chain Automation Protocol",
  "sentinel-insurance": "Sentinel Insurance Protocol",
  fs1: "Nexus Perpetuals (Protocol OS)",
  fs2: "Sentinel DAO Governance",
  fs3: "Nexus Perps v2 (Polkadot Hub)",
  fs4: "ERC-5484 On-Chain Reputation",
  c1: "Decentralized StableCoin Engine",
};

/**
 * Resolves a visitor's question into a calm, authoritative first-person reply
 * from Amit Kumar with 2 contextually relevant follow-up prompts.
 */
export function generateAgentReply(query: string): AgentReply {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return {
      id: "default-greeting",
      topic: "greeting",
      text: AGENT_DEFAULT_GREETING,
      followUps: [
        "What protocols have you shipped?",
        "How do you prevent flash-loan exploits?",
      ],
    };
  }

  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (normalized.includes(kw)) {
        // Reward multi-word or longer specific technical terms higher
        score += kw.length >= 6 ? 3 : 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore > 0) {
    return {
      id: `${bestEntry.topic}-${normalized.length}`,
      topic: bestEntry.topic,
      text: bestEntry.text,
      followUps: bestEntry.followUps,
    };
  }

  return {
    id: `fallback-${normalized.length}`,
    topic: "architecture-overview",
    text: "I approach every protocol from first principles: defining solvency invariants, mapping adversarial attack surfaces, and designing minimal Solidity and Yul state machines before writing deployment scripts. Ask me about any specific system I have shipped, including ERC-3643 compliance, ERC-4626 Aave V3 vaults, O(1) keeper automation, UUPS storage safety, or Foundry invariant fuzzing.",
    followUps: [
      "What protocols have you shipped?",
      "How do you prevent flash-loan exploits?",
    ],
  };
}

/**
 * Generates an immediate architectural walkthrough when triggered by clicking
 * a specific protocol card or section trigger anywhere in the app.
 */
export function getProtocolExplanation(protocolId: string): {
  prompt: string;
  reply: AgentReply;
} {
  const matched = KNOWLEDGE_BASE.find((entry) =>
    entry.protocolIds?.includes(protocolId)
  );
  const title = PROTOCOL_TITLE_FALLBACKS[protocolId] ?? protocolId;
  const prompt = `Walk me through ${title}`;

  if (matched) {
    return {
      prompt,
      reply: {
        id: `protocol-${protocolId}`,
        topic: matched.topic,
        text: matched.text,
        followUps: matched.followUps,
      },
    };
  }

  return {
    prompt,
    reply: generateAgentReply(prompt),
  };
}
