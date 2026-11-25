export interface ContractReference {
  label: string;
  address: string;
  role: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  category: "fullstack" | "core";
  flagship?: boolean;
  network: string;
  standard: string;
  metric: string;
  metricDetail: string;
  tech: string[];
  link: string;
  liveUrl?: string;
  accentColor: string;
  iconKey:
    | "shield"
    | "cpu"
    | "building"
    | "activity"
    | "landmark"
    | "layers"
    | "award"
    | "coins"
    | "dice"
    | "key"
    | "refresh"
    | "gitbranch"
    | "image"
    | "lock"
    | "globe";
  contracts?: ContractReference[];
}

export type TechDomain =
  | "All"
  | "Protocol & EVM"
  | "Security & Testing"
  | "DeFi Standards"
  | "Full-Stack Web3";

export interface TechStackItem {
  name: string;
  domain: Exclude<TechDomain, "All">;
  focus: string;
  iconKey:
    | "code"
    | "hammer"
    | "cpu"
    | "shield"
    | "link"
    | "trending"
    | "key"
    | "layers"
    | "vault"
    | "database"
    | "globe"
    | "wallet"
    | "terminal"
    | "network";
}

export interface CodeLine {
  line: number;
  tokens: Array<{
    text: string;
    type: "plain" | "keyword" | "type" | "fn" | "comment" | "number" | "string";
  }>;
}

export interface ArchitectureInsight {
  id: string;
  num: string;
  protocol: string;
  domain: string;
  title: string;
  summary: string;
  body: string;
  tradeoff: string;
  outcome: string;
  filename: string;
  language: "Solidity" | "Yul / Solidity";
  code: string;
}

export const fullStackProjects: ProjectItem[] = [
  {
    id: "nexus-rwa",
    title: "Nexus RWA Protocol",
    shortTitle: "Nexus RWA",
    description:
      "Institutional real-world asset tokenization engine built for Ethereum and EVM mainnets with ERC-3643 transfer compliance and O(1) Merkle yield distribution. Every token movement checks on-chain KYC and OFAC identity registries inside the transfer hook alongside a 15% Chainlink NAV circuit breaker.",
    category: "fullstack",
    flagship: true,
    network: "Ethereum & EVM",
    standard: "ERC-3643 / Chainlink NAV",
    metric: "On-Chain Transfer Compliance",
    metricDetail:
      "IdentityRegistry transfer hooks paired with O(1) Merkle yield distribution",
    tech: ["Solidity", "ERC-3643", "Chainlink NAV", "Foundry", "EVM Mainnet"],
    link: "https://github.com/NexTechArchitect/Nexus-RWA-Protocol/",
    liveUrl: "https://nexus-rwa-protocol.vercel.app/",
    accentColor: "#E85D04",
    iconKey: "building",
    contracts: [
      {
        label: "ComplianceEngine",
        address: "0x00c0E82e0C81c4Df096aAd98f2aA5A399b34131c",
        role: "Transfer Gatekeeper",
      },
      {
        label: "IdentityRegistry",
        address: "0x18026c0BF58c978caDc8Df7f31b1cbC2f6A94c5A",
        role: "KYC & Sanctions",
      },
      {
        label: "Genesis Token (nUSTB)",
        address: "0xFDFda5Ca91bDC022EC85C9F2bE5d29A33f874EDE",
        role: "Permissioned ERC-20",
      },
    ],
  },
  {
    id: "onchain-automation",
    title: "On-Chain Automation Protocol",
    shortTitle: "Automation",
    description:
      "Decentralized keeper execution engine featuring a constant-time swap-and-pop batch queue, staked operator bonds, and stateless call routing. Inline Yul slot management eliminates linear loop DoS risks and cuts execution gas overhead by up to 35%.",
    category: "fullstack",
    flagship: true,
    network: "Ethereum & EVM",
    standard: "O(1) Keeper Network",
    metric: "35% Yul Gas Reduction",
    metricDetail:
      "Constant-time batch job scheduling with zero unbounded loops",
    tech: ["Solidity", "Yul Assembly", "Foundry", "EVM Mainnet", "Next.js"],
    link: "https://github.com/NexTechArchitect/OnChain-Automation-Protocol",
    liveUrl: "https://on-chain-automation-protocol.vercel.app/",
    accentColor: "#D96B27",
    iconKey: "cpu",
    contracts: [
      {
        label: "JobManager.sol",
        address: "0xBAa2B4c250DD6da358e23244C2fa85dA1927718C",
        role: "O(1) Queue & Escrow",
      },
      {
        label: "KeeperRegistry.sol",
        address: "0xcEa37b9CCA6170d43BF133CCfdeaD9CB2A4D61D3",
        role: "Operator Bonds & Slashing",
      },
      {
        label: "ExecutionEngine.sol",
        address: "0x388665c32F9F17E0d5cfEE3Eabe1880A3AEd80e9",
        role: "Stateless Router",
      },
    ],
  },
  {
    id: "sentinel-insurance",
    title: "Sentinel Insurance Protocol",
    shortTitle: "Sentinel Insurance",
    description:
      "DeFi coverage architecture pairing ERC-4626 capital vaults routed into Aave V3 yield strategies with tokenized ERC-721 underwriting policies. Claim adjudication anchors voting power to prior-block snapshots and a Veto Council timelock to block flash-loan capture.",
    category: "fullstack",
    flagship: true,
    network: "Ethereum & EVM",
    standard: "ERC-4626 / Aave V3",
    metric: "Aave V3 Yield Vaults",
    metricDetail:
      "Flash-loan resistant claims governor with Veto Council safeguards",
    tech: ["Solidity", "ERC-4626", "Aave V3", "Foundry", "EVM Mainnet"],
    link: "https://github.com/NexTechArchitect/Sentinel-Insurance-Protocol",
    liveUrl: "https://sentinel-insurance-protocol.vercel.app/",
    accentColor: "#E85D04",
    iconKey: "shield",
    contracts: [
      {
        label: "PolicyEngine",
        address: "0xEF80cd6370D4619D2f71BD4000a4757357Be5564",
        role: "Underwriting Core",
      },
      {
        label: "CoveragePool",
        address: "0x374d949c7A575212d423Ecc0e765a59664d7C3eD",
        role: "ERC-4626 Aave V3 Vault",
      },
      {
        label: "ClaimsGovernor",
        address: "0xB7939f8b41C932595cf358842BC63AFE221D2Ba3",
        role: "Snapshot Adjudication",
      },
    ],
  },
  {
    id: "fs1",
    title: "Nexus Perpetuals DEX",
    shortTitle: "Nexus Perpetuals",
    description:
      "Non-custodial 50x leverage perpetuals DEX with ERC-4337 smart account paymasters for gasless order execution and automated liquidations. Chainlink CCIP cross-chain margin relays enforce source-chain allowlists and nonce locks before crediting collateral.",
    category: "fullstack",
    flagship: true,
    network: "Ethereum / CCIP",
    standard: "50x Perps / ERC-4337",
    metric: "50x Leverage DEX",
    metricDetail:
      "Gasless smart account execution with CCIP cross-chain margin",
    tech: ["Solidity", "ERC-4337", "Chainlink CCIP", "Foundry", "Next.js"],
    link: "https://github.com/NexTechArchitect/Nexus-Protocol-OS",
    liveUrl: "https://nexus-protocol-os.vercel.app/",
    accentColor: "#D96B27",
    iconKey: "activity",
    contracts: [
      {
        label: "PositionManager",
        address: "0x6952144C5dfb64DF54a64b61B3321Fd2C24cB42A",
        role: "50x Margin Core",
      },
      {
        label: "NexusPaymaster",
        address: "0x20e302881494F79eF5E536d5533be04F913eE652",
        role: "ERC-4337 Gas Sponsor",
      },
      {
        label: "CrossChainRouter",
        address: "0xE9b7f8F6c78054fb8d0D97585F32e7e026F5dd24",
        role: "Chainlink CCIP Bridge",
      },
    ],
  },
  {
    id: "fs2",
    title: "Sentinel DAO Governance",
    shortTitle: "Sentinel DAO",
    description:
      "Modular on-chain governance system pairing ERC20Votes checkpoints with a full Next.js and Wagmi proposal execution dashboard. Prior-block vote snapshots and TimelockController queues prevent atomic flash-loan treasury takeovers.",
    category: "fullstack",
    network: "Ethereum & EVM",
    standard: "Governor / Timelock",
    metric: "Flash-Loan Immune",
    metricDetail:
      "Prior-block snapshot voting with delayed timelock execution",
    tech: ["Solidity", "OpenZeppelin", "Wagmi", "Next.js"],
    link: "https://github.com/NexTechArchitect/Web3-FullStack-Sentinal-DAO",
    liveUrl: "https://sentinel-dao-brown.vercel.app/",
    accentColor: "#E85D04",
    iconKey: "landmark",
  },
  {
    id: "fs3",
    title: "Nexus Perps v2 (Polkadot Hub)",
    shortTitle: "Nexus Perps v2",
    description:
      "Cross-chain perpetuals exchange built for Polkadot Hub EVM supporting 50x isolated leverage positions and automated price keepers. Isolated margin accounting and deterministic liquidation triggers keep vault solvency intact under rapid volatility.",
    category: "fullstack",
    network: "Polkadot Hub EVM",
    standard: "50x Perps / Keepers",
    metric: "50x Isolated Margin",
    metricDetail:
      "Automated price keepers and cross-chain margin settlement",
    tech: ["Solidity", "Polkadot Hub", "Chainlink CCIP", "Next.js"],
    link: "https://github.com/NexTechArchitect/nexus-polka-perps",
    liveUrl: "https://nexus-protocol-v2.vercel.app/",
    accentColor: "#D96B27",
    iconKey: "layers",
  },
  {
    id: "fs4",
    title: "ERC-5484 Soulbound Reputation",
    shortTitle: "ERC-5484 Reputation",
    description:
      "On-chain reputation system built on non-transferable ERC-5484 tokens that render evolving SVG medal metadata directly from contract state. EIP-1822 UUPS upgradeability with reserved storage gaps prevents slot collisions across future versions.",
    category: "fullstack",
    network: "Ethereum & EVM",
    standard: "ERC-5484 / UUPS",
    metric: "100% On-Chain SVG",
    metricDetail:
      "Storage-gap safe UUPS proxy with dynamic SBT progression",
    tech: ["Solidity", "ERC-5484", "UUPS Proxy", "Foundry", "Next.js"],
    link: "https://github.com/NexTechArchitect/RST-Reputation-Protocol",
    liveUrl: "https://rst-reputation-protocol.vercel.app/",
    accentColor: "#E85D04",
    iconKey: "award",
  },
];

export const coreProjects: ProjectItem[] = [
  {
    id: "c1",
    title: "Decentralized StableCoin Engine",
    shortTitle: "DSC StableCoin",
    description:
      "Exogenous crypto-collateralized stablecoin pegged to USD with 200% minimum collateralization and automated liquidation bonuses. Handler-based Foundry invariant fuzzing and Chainlink staleness guards verify protocol solvency across adversarial sequences.",
    category: "core",
    network: "EVM / Foundry",
    standard: "CDP / Invariant Fuzzing",
    metric: "200% Min Collateral",
    metricDetail:
      "Stateful handler-based Foundry invariant suite verifying solvency",
    tech: ["Solidity", "Foundry", "Chainlink Oracles", "Invariant Fuzzing"],
    link: "https://github.com/NexTechArchitect/Foundry-Defi-StableCoin",
    accentColor: "#E85D04",
    iconKey: "coins",
  },
  {
    id: "c2",
    title: "Automated Provably Fair Raffle",
    shortTitle: "VRF Raffle",
    description:
      "Autonomous on-chain raffle wired to Chainlink VRF v2.5 randomness and Chainlink Automation upkeep triggers. A strict finite state machine locks entry during settlement so reentrancy and timing manipulation are impossible.",
    category: "core",
    network: "EVM / Chainlink",
    standard: "Chainlink VRF v2.5",
    metric: "Deterministic FSM",
    metricDetail:
      "Zero-operator execution verified via unit and staging tests",
    tech: ["Solidity", "Chainlink VRF", "Chainlink Automation", "Foundry"],
    link: "https://github.com/NexTechArchitect/Raffle-Lottery-Foundry",
    accentColor: "#D96B27",
    iconKey: "dice",
  },
  {
    id: "c3",
    title: "ERC-4337 Account Abstraction Core",
    shortTitle: "ERC-4337 Core",
    description:
      "Minimal smart account built directly against the canonical ERC-4337 EntryPoint with modular Paymaster gas sponsorship. Strict ECDSA UserOperation validation and EntryPoint-only execution gates isolate account funds from unauthorized callers.",
    category: "core",
    network: "Ethereum / EVM",
    standard: "ERC-4337 EntryPoint",
    metric: "Custom UserOp Flow",
    metricDetail:
      "Direct EntryPoint integration with minimal signature verification",
    tech: ["Solidity", "ERC-4337", "Paymaster", "Foundry"],
    link: "https://github.com/NexTechArchitect/ERC4337-Account-Abstraction-Foundry",
    accentColor: "#E85D04",
    iconKey: "key",
  },
  {
    id: "c4",
    title: "UUPS Upgradeable Protocol",
    shortTitle: "UUPS Proxy Core",
    description:
      "EIP-1822 UUPS proxy framework with reproducible Foundry upgrade scripts from V1 to V2 implementations. Initializer locks, owner-gated upgrade checks, and explicit storage gaps prevent hijacking and layout corruption.",
    category: "core",
    network: "EVM / Foundry",
    standard: "EIP-1822 / ERC-1967",
    metric: "Collision-Safe Slots",
    metricDetail:
      "Automated Foundry upgrade scripts validating storage layout",
    tech: ["Solidity", "UUPS Proxies", "OpenZeppelin", "Foundry"],
    link: "https://github.com/NexTechArchitect/uups-protocol-config",
    accentColor: "#D96B27",
    iconKey: "refresh",
  },
  {
    id: "c5",
    title: "Merkle-712 Airdrop Protocol",
    shortTitle: "Merkle-712 Airdrop",
    description:
      "Gas-efficient token distribution engine combining O(log N) Merkle proof verification with relayer-sponsored gasless claiming. EIP-712 typed domain signatures and claimed-state flags close signature replay and double-claim vectors.",
    category: "core",
    network: "EVM / Foundry",
    standard: "EIP-712 / Merkle Proof",
    metric: "O(log N) Proof Claims",
    metricDetail:
      "Delegated gasless claiming with replay-protected signatures",
    tech: ["Solidity", "EIP-712", "Merkle Trees", "Foundry"],
    link: "https://github.com/NexTechArchitect/Siso-Merkle-Airdrop",
    accentColor: "#E85D04",
    iconKey: "gitbranch",
  },
  {
    id: "c6",
    title: "CuteCat NFT Protocol",
    shortTitle: "CuteCat NFT",
    description:
      "ERC-721 architecture demonstrating both content-addressed IPFS metadata and fully on-chain Base64 SVG token rendering. Deterministic Foundry deployment scripts and URI invariants verify immutability without centralized servers.",
    category: "core",
    network: "EVM / IPFS",
    standard: "ERC-721 / Base64 SVG",
    metric: "Dual Metadata Engine",
    metricDetail:
      "Immutable IPFS pinning paired with on-chain SVG rendering",
    tech: ["Solidity", "ERC-721", "IPFS", "Foundry Scripts"],
    link: "https://github.com/NexTechArchitect/ERC721-Advanced-IPFS-NFT",
    accentColor: "#D96B27",
    iconKey: "image",
  },
  {
    id: "c7",
    title: "SISO Token Standard",
    shortTitle: "SISO ERC-20",
    description:
      "Hardened ERC-20 token primitive engineered with role-gated minting, hard supply ceilings, and emergency pause breakers. Custom errors and Foundry invariant checks enforce supply conservation on every state transition.",
    category: "core",
    network: "Ethereum & EVM",
    standard: "ERC-20 / RBAC",
    metric: "Strict Supply Invariant",
    metricDetail: "Role-gated minting with automated Foundry verification",
    tech: ["Solidity", "ERC-20", "Access Control", "Foundry"],
    link: "https://github.com/NexTechArchitect/SISO-Token-ERC20",
    accentColor: "#E85D04",
    iconKey: "lock",
  },
  {
    id: "c8",
    title: "Oracle-Pegged Crowdfunding",
    shortTitle: "Oracle FundMe",
    description:
      "Treasury contribution contract enforcing USD-denominated minimums through live Chainlink AggregatorV3Interface price feeds. Packed storage reads, cached memory withdrawal loops, and owner-only sweeps keep gas costs tight and safe.",
    category: "core",
    network: "EVM / Chainlink",
    standard: "AggregatorV3 / Gas Opt",
    metric: "USD-Pegged Thresholds",
    metricDetail:
      "Live oracle normalization with cached memory withdrawal loops",
    tech: ["Solidity", "Chainlink Data Feeds", "DeFi Math", "Foundry"],
    link: "https://github.com/NexTechArchitect/FundMe-Contract",
    accentColor: "#D96B27",
    iconKey: "globe",
  },
];

export const TECH_STACK: TechStackItem[] = [
  {
    name: "Solidity 0.8+",
    domain: "Protocol & EVM",
    focus: "Custom errors, checked math, modular interfaces",
    iconKey: "code",
  },
  {
    name: "Yul & EVM Internals",
    domain: "Protocol & EVM",
    focus: "Inline assembly, slot packing, calldata layout",
    iconKey: "cpu",
  },
  {
    name: "Ethereum & EVM Mainnets",
    domain: "Protocol & EVM",
    focus: "Production multi-contract DeFi deployments",
    iconKey: "network",
  },
  {
    name: "UUPS & Proxies",
    domain: "Protocol & EVM",
    focus: "EIP-1822 storage gaps and safe upgrades",
    iconKey: "layers",
  },
  {
    name: "Foundry & Anvil",
    domain: "Security & Testing",
    focus: "Stateful invariant fuzzing and mainnet forks",
    iconKey: "hammer",
  },
  {
    name: "Slither Analysis",
    domain: "Security & Testing",
    focus: "Static vulnerability sweeps and CI gates",
    iconKey: "shield",
  },
  {
    name: "ERC-3643 RWA",
    domain: "DeFi Standards",
    focus: "On-chain KYC registries and transfer hooks",
    iconKey: "database",
  },
  {
    name: "ERC-4626 Vaults",
    domain: "DeFi Standards",
    focus: "Tokenized share accounting and inflation guards",
    iconKey: "vault",
  },
  {
    name: "Aave V3 Routing",
    domain: "DeFi Standards",
    focus: "Automated reserve yield and liquidity buffers",
    iconKey: "trending",
  },
  {
    name: "ERC-4337 AA",
    domain: "DeFi Standards",
    focus: "Smart accounts, bundlers, and custom paymasters",
    iconKey: "key",
  },
  {
    name: "Chainlink CCIP & VRF",
    domain: "DeFi Standards",
    focus: "Cross-chain margin, NAV feeds, and keepers",
    iconKey: "link",
  },
  {
    name: "Next.js App Router",
    domain: "Full-Stack Web3",
    focus: "Production dApp frontends and SSR pipelines",
    iconKey: "globe",
  },
  {
    name: "Wagmi & Viem",
    domain: "Full-Stack Web3",
    focus: "Type-safe ABI calls and wallet orchestration",
    iconKey: "wallet",
  },
  {
    name: "TypeScript",
    domain: "Full-Stack Web3",
    focus: "Strict end-to-end contract and UI typing",
    iconKey: "terminal",
  },
];

export const ARCHITECTURE_INSIGHTS: ArchitectureInsight[] = [
  {
    id: "l1",
    num: "01",
    protocol: "Sentinel Insurance & DAO",
    domain: "Governance Security",
    title: "Threat-Modeled Architecture & Flash-Loan Immunity",
    summary:
      "Neutralizing single-block flash-loan governance capture at the snapshot boundary.",
    body: "When engineering Sentinel DAO adjudication, tracking balances at the active block.number exposes governance to atomic flash-loan borrows and proposal votes inside a single transaction. Shifting every voting-weight lookup to prior-block checkpoints (block.number - 1) combined with a TimelockController delay structurally eliminates same-block vote manipulation before execution ever reaches the treasury.",
    tradeoff:
      "Requires ERC20Votes checkpoint writes on token transfers, adding modest SSTORE gas during routine transfers in exchange for deterministic flash-loan immunity.",
    outcome:
      "Zero flash-loan governance attack vectors across stateful Foundry fuzz campaigns.",
    filename: "ClaimsGovernor.sol",
    language: "Solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error FlashLoanSnapshotViolation(uint256 queryBlock, uint256 currentBlock);

abstract contract SnapshotGuard {
    function _getSecureVotingWeight(
        address account,
        uint256 snapshotBlock
    ) internal view returns (uint256 weight) {
        if (snapshotBlock >= block.number) {
            revert FlashLoanSnapshotViolation(snapshotBlock, block.number);
        }
        // Always anchor adjudication power to a finalized historical block
        weight = _getPastVotes(account, snapshotBlock);
    }

    function _getPastVotes(address account, uint256 blockNumber)
        internal
        view
        virtual
        returns (uint256);
}`,
  },
  {
    id: "l2",
    num: "02",
    protocol: "On-Chain Automation Protocol",
    domain: "EVM Gas Engineering",
    title: "O(1) Keeper Queues & Yul Assembly Optimization",
    summary:
      "Eliminating bounded loop DoS with constant-time swap-and-pop batch scheduling.",
    body: "Standard keeper registries that linearly scan active jobs eventually breach block gas limits as protocol adoption scales. In On-Chain Automation, every active job tracks its own 1-based index inside a dense array so cancellations and batch dequeues execute in strict O(1) time via swap-and-pop. Critical slot reads and pointer updates run in inline Yul assembly, cutting execution overhead by up to 35%.",
    tradeoff:
      "Swap-and-pop breaks strict FIFO ordering, so execution priority is encoded through explicit deadline timestamps and keeper incentive tiers rather than array position.",
    outcome:
      "Up to 35% execution gas reduction and constant O(1) removal regardless of total active jobs.",
    filename: "SwapPopQueue.yul",
    language: "Yul / Solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library SwapPopQueue {
    function removeO1(
        uint256[] storage activeIds,
        mapping(uint256 => uint256) storage indexPlusOne,
        uint256 jobId
    ) internal {
        uint256 idxPlusOne = indexPlusOne[jobId];
        if (idxPlusOne == 0) return;

        uint256 idx = idxPlusOne - 1;
        uint256 lastIdx = activeIds.length - 1;

        if (idx != lastIdx) {
            uint256 lastJobId = activeIds[lastIdx];
            activeIds[idx] = lastJobId;
            indexPlusOne[lastJobId] = idxPlusOne;
        }

        // Inline Yul length decrement avoids redundant bounds checks
        assembly {
            sstore(activeIds.slot, lastIdx)
        }
        delete indexPlusOne[jobId];
    }
}`,
  },
  {
    id: "l3",
    num: "03",
    protocol: "Nexus RWA Protocol",
    domain: "ERC-3643 Compliance",
    title: "Stateless On-Chain Compliance & 15% NAV Circuit Breaker",
    summary:
      "Enforcing institutional KYC, OFAC sanctions, and oracle deviation limits inside ERC-20 hooks.",
    body: "Most RWA implementations gate secondary transfers behind slow centralized signing servers. For Nexus RWA on EVM mainnet, the ComplianceEngine intercepts every ERC-20 transfer hook to verify cryptographic identity commitments on-chain in real time. Simultaneously, the NAVOracle validates Chainlink updates against a 15% 24-hour deviation circuit breaker so a compromised or stale feed halts minting and redemptions automatically.",
    tradeoff:
      "Every peer-to-peer transfer performs two staticcalls to the IdentityRegistry and ComplianceEngine, trading minimal gas for zero centralized API bottlenecks.",
    outcome:
      "100% KYC enforcement across unit and invariant suites with zero critical or high Slither findings.",
    filename: "ComplianceHook.sol",
    language: "Solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error TransferComplianceRejected(address from, address to, uint256 amount);
error NavCircuitBreakerTripped(uint256 deltaBps, uint256 maxBps);

contract NexusComplianceHook {
    uint256 public constant MAX_DAILY_DELTA_BPS = 1_500; // 15.00%

    function validateTransfer(
        address from,
        address to,
        uint256 amount,
        bool fromVerified,
        bool toVerified,
        bool sanctioned
    ) external pure {
        if (!fromVerified || !toVerified || sanctioned || amount == 0) {
            revert TransferComplianceRejected(from, to, amount);
        }
    }

    function checkNavDeviation(uint256 prevNav, uint256 nextNav) external pure {
        uint256 diff = nextNav > prevNav ? nextNav - prevNav : prevNav - nextNav;
        uint256 deltaBps = (diff * 10_000) / prevNav;
        if (deltaBps > MAX_DAILY_DELTA_BPS) {
            revert NavCircuitBreakerTripped(deltaBps, MAX_DAILY_DELTA_BPS);
        }
    }
}`,
  },
  {
    id: "l4",
    num: "04",
    protocol: "Nexus Perpetuals DEX",
    domain: "Cross-Chain & AA",
    title: "Asynchronous CCIP Margin Replay Defense & ERC-4337 Paymasters",
    summary:
      "Protecting 50x leverage cross-chain margin settlements against delayed or duplicated relays.",
    body: "Cross-chain perpetuals margin routing introduces asynchronous settlement hazards where a retried or re-ordered bridge packet could double-credit trader collateral. Nexus Perpetuals DEX combines Chainlink CCIP source-chain allowlisting with deterministic messageId nonce locking before crediting margin vaults, paired with ERC-4337 paymasters so active traders execute orders without managing native gas balances.",
    tradeoff:
      "Storing processed messageId commitments permanently increases state footprint, mitigated by mapping compact bytes32 flags rather than full payload structs.",
    outcome:
      "Deterministic replay immunity across multi-chain margin relays and gasless order routing.",
    filename: "CCIPMarginReceiver.sol",
    language: "Solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error UntrustedSourceChain(uint64 chainSelector);
error MessageAlreadyProcessed(bytes32 messageId);

contract CCIPMarginReceiver {
    mapping(uint64 => bool) public allowedChains;
    mapping(bytes32 => bool) public processedMessages;

    function _creditCrossChainMargin(
        bytes32 messageId,
        uint64 sourceChain,
        address trader,
        uint256 collateralUsd
    ) internal {
        if (!allowedChains[sourceChain]) revert UntrustedSourceChain(sourceChain);
        if (processedMessages[messageId]) revert MessageAlreadyProcessed(messageId);

        // Lock nonce before external vault interaction (Checks-Effects-Interactions)
        processedMessages[messageId] = true;
        _depositMargin(trader, collateralUsd);
    }

    function _depositMargin(address trader, uint256 amount) internal virtual {}
}`,
  },
  {
    id: "l5",
    num: "05",
    protocol: "ERC-5484 Reputation & Sentinel",
    domain: "Upgradeability & Vaults",
    title: "Storage-Gap Safe UUPS Proxies & ERC-4626 Inflation Guards",
    summary:
      "Preventing proxy storage collisions and first-depositor vault share manipulation.",
    body: "Upgradeable protocols live with their storage layout forever. Across the ERC-5484 Reputation Engine and Sentinel's ERC-4626 Aave V3 vaults, every base contract reserves explicit 50-slot storage gaps and virtual share offsets to neutralize both V2 layout corruption and ERC-4626 first-depositor donation attacks. Foundry storage inspection runs inside CI before any upgrade transaction is signed.",
    tradeoff:
      "Fixed storage gaps constrain inheritance refactors, enforcing strict append-only state schemas across protocol versions.",
    outcome:
      "Zero storage slot drift across V1-to-V2 upgrades and full resistance to vault share dilution.",
    filename: "ReputationStorageV1.sol",
    language: "Solidity",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract ReputationStorageV1 {
    struct Profile {
        uint64 score;
        uint64 lastUpdated;
        uint16 tier;
        bool revoked;
    }

    // Slot 0: tightly packed struct occupies a single 256-bit EVM word
    mapping(address => Profile) internal _profiles;
    address internal _authority;

    // Reserved 48-slot storage gap for collision-safe V2+ UUPS upgrades
    uint256[48] private __gap;
}`,
  },
];