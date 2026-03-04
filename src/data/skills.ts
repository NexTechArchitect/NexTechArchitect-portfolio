export type SkillCapability = {
  title: string;
  description: string;
};

export type Skill = {
  id: string;
  tier: "primary" | "secondary";
  tag: string;
  tagColor: string;
  name: string;
  icon: string;
  headline: string;
  description: string;
  why: string;
  capabilities: SkillCapability[];
};

export const marqueeSkills = [
  "Solidity", "Foundry", "OpenZeppelin", "ERC-4337",
  "Chainlink VRF", "Wagmi & Viem", "Ethers.js", "TypeScript", "Next.js 14"
];

export const skillsData: Skill[] = [
  // ════════════ PRIMARY ROW: WEB3 CORE (Execution Layer) ════════════
  {
    id: "sk-sol",
    tier: "primary",
    tag: "Core EVM",
    tagColor: "#DC2626",
    name: "Solidity Architecture",
    icon: "⚙️",
    headline: "Primary Expertise · Storage-Safe · Deterministic Execution",
    description: "My core engineering focus. Architecting deterministic, highly gas-optimized smart contracts with deep expertise in EVM internals—manipulating memory vs. calldata, precise storage slot packing, Yul optimizations, and securing proxy patterns.",
    why: "As a Smart Contract Developer, writing code is only 10% of the job; ensuring it cannot be exploited is the other 90%. Mastering the EVM allows me to build fault-tolerant, modular architectures that guarantee mathematical solvency and seamless upgrade paths.",
    capabilities: [
      { title: "Upgradeable Infrastructure", description: "Designing EIP-1822 UUPS proxy patterns with strict storage gap management to ensure seamless, collision-free state migrations across protocol versions." },
      { title: "Precision Economics", description: "Implementing custom math libraries (Wad/Ray scaling) within Solidity to normalize disparate token decimals, neutralizing dust-sweep vectors in DeFi vaults." }
    ]
  },
  {
    id: "sk-foundry",
    tier: "primary",
    tag: "Testing",
    tagColor: "#2563EB",
    name: "Foundry Framework",
    icon: "🛡️",
    headline: "Stateful Fuzzing · Invariant Proofs",
    description: "Leveraging Rust-based toolchains to build rigorous testing pipelines for my Solidity contracts. Moving beyond basic unit tests to mathematically prove protocol security under stress.",
    why: "Writing Solidity is incomplete without proving it works. I utilize Foundry to subject my contracts to thousands of randomized, adversarial state mutations, ensuring core invariants hold true under massive entropy before mainnet deployment.",
    capabilities: [
      { title: "Stateful Invariant Fuzzing", description: "Bombarding Solidity protocols with tens of thousands of randomized state mutations to guarantee solvency constraints." },
      { title: "Mainnet Fork Simulation", description: "Validating complex cross-contract interactions against live mainnet states within Anvil to ensure deterministic execution." }
    ]
  },
  {
    id: "sk-defi",
    tier: "primary",
    tag: "Protocols",
    tagColor: "#059669",
    name: "DeFi Protocol Math",
    icon: "🏦",
    headline: "Solvency Invariants · Precision Scaling",
    description: "Translating complex financial models into precision-safe Solidity logic. Essential for building automated market makers (AMMs), over-collateralized debt positions, and real-time PnL engines.",
    why: "A Solidity developer must intimately understand the math their contracts execute. Solidity's lack of native floating-point math makes financial engineering highly susceptible to precision loss. I engineer math libraries that prevent these economic exploits natively on-chain.",
    capabilities: [
      { title: "Solvency & Liquidations", description: "Engineering over-collateralized threshold logic and liquidation arbitrage engines that automatically self-regulate protocol health directly within the contract." },
      { title: "Overflow-Guarded Calculations", description: "Executing constant-product formulas and PnL scaling within strictly validated 'unchecked' blocks to optimize gas without sacrificing mathematical safety." }
    ]
  },
  {
    id: "sk-sec",
    tier: "primary",
    tag: "Security",
    tagColor: "#8B5CF6",
    name: "Protocol Defense",
    icon: "🔒",
    headline: "CEI Matrices · Flash-Loan Mitigation",
    description: "Executing a security-first engineering methodology. A critical skill for a Solidity developer to anticipate and block external attack vectors like reentrancy and governance takeovers.",
    why: "In Web3, code is law and every public endpoint is a potential attack vector. Defense must be architected into the Solidity state transitions from day one, not bolted on later, to protect capital from highly sophisticated on-chain actors.",
    capabilities: [
      { title: "State Transition Security", description: "Mandating strict Checks-Effects-Interactions (CEI) patterns and ReentrancyGuards across all value-transferring Solidity functions." },
      { title: "Anti-Flash Governance", description: "Deploying Timelock controllers and rage-quit mechanics to protect decentralized treasuries from flash-loan-backed hostile governance takeovers." }
    ]
  },

  // ════════════ SECONDARY ROW: INTEGRATION (Access Layer) ════════════
  {
    id: "sk-chainlink",
    tier: "secondary",
    tag: "Oracles",
    tagColor: "#0284C7",
    name: "Chainlink Ecosystem",
    icon: "🔗",
    headline: "Cryptographic Truth · Autonomous Execution",
    description: "Integrating decentralized oracle networks to securely feed real-world data into Solidity contracts. Crucial for triggering on-chain logic based on off-chain state.",
    why: "A smart contract is inherently blind to the outside world. I engineer robust oracle integrations with heartbeat staleness guards, enabling my Solidity contracts to execute liquidations or lotteries based on cryptographically guaranteed truth.",
    capabilities: [
      { title: "Resilient Data Pipelines", description: "Integrating Chainlink Price Feeds into Solidity with strict staleness guards, preventing liquidations based on obsolete market data." },
      { title: "Verifiable Randomness", description: "Utilizing VRF to provide cryptographically proven fairness to Solidity contracts, paired with Keepers for autonomous state transitions." }
    ]
  },
  {
    id: "sk-aa",
    tier: "secondary",
    tag: "ERC-4337",
    tagColor: "#F59E0B",
    name: "Account Abstraction",
    icon: "🔑",
    headline: "Smart Wallets · Gas Sponsorship",
    description: "Writing specialized Solidity infrastructure (Smart Accounts, Paymasters) to eliminate UX friction, allowing users to interact with protocols without holding native gas tokens.",
    why: "To make Solidity protocols usable by the masses, the standard EOA barrier must be removed. I build custom ERC-4337 validation logic that allows for gasless, programmable transactions while maintaining strict cryptographic validation.",
    capabilities: [
      { title: "Smart Account Validation", description: "Deploying counterfactual wallets via CREATE2 and writing custom Solidity endpoints for ECDSA signature recovery." },
      { title: "Gas Sponsorship Paymasters", description: "Engineering custom Paymaster contracts to subsidize transaction costs or accept ERC-20 tokens for gas fees." }
    ]
  },
  {
    id: "sk-ts",
    tier: "secondary",
    tag: "Cryptography",
    tagColor: "#0369A1",
    name: "TypeScript & Off-Chain",
    icon: "📘",
    headline: "EIP-712 · Merkle Trees · O(1) Gas",
    description: "Developing type-safe off-chain Node.js infrastructure to generate cryptographic proofs that are then verified by Solidity contracts on-chain, drastically reducing gas costs.",
    why: "On-chain computation in Solidity is expensive. I write TypeScript engines to compress massive datasets (like airdrop lists) into Merkle Roots, allowing my smart contracts to verify users with O(1) gas efficiency.",
    capabilities: [
      { title: "Off-Chain Data Compression", description: "Generating massive Merkle Trees via TypeScript to compress millions of data points into a single 32-byte root for Solidity verification." },
      { title: "Structured Data Signatures", description: "Enforcing EIP-712 typed hashing to bind user intents, giving Solidity contracts the ability to natively neutralize cross-chain replay attacks." }
    ]
  },
  {
    id: "sk-next",
    tier: "secondary",
    tag: "Client Layer",
    tagColor: "#E11D48",
    name: "Next.js & Viem",
    icon: "⚛️",
    headline: "React State · Type-Safe ABIs",
    description: "Constructing institutional-grade Web3 interfaces using Next.js App Router and Viem/Wagmi to seamlessly connect React frontends to deployed Solidity smart contracts.",
    why: "A highly optimized smart contract is useless without an intuitive interface. I use Wagmi and Viem to create strict, type-safe bridges between my Solidity ABIs and the frontend. This ensures zero runtime errors when users read state or trigger transactions.",
    capabilities: [
      { title: "Zero-Backend Telemetry", description: "Fetching and mutating blockchain state in real-time, bridging complex Solidity ABIs into strictly typed React hooks without relying on centralized databases." },
      { title: "Transaction Lifecycle", description: "Building robust frontend state machines to handle asynchronous on-chain operations (awaiting block confirmations, gas estimation) seamlessly." }
    ]
  }
];
