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
  tokens: Array<{ text: string; type: "plain" | "keyword" | "type" | "fn" | "comment" | "number" | "string" }>;
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
      "Institutional real-world asset tokenization engine deployed on Base Mainnet with ERC-3643 transfer compliance, on-chain KYC and OFAC identity registries, a 15% Chainlink NAV circuit breaker, and O(1) Merkle yield distribution.",
    category: "fullstack",
    flagship: true,
    network: "Base Mainnet",
    standard: "ERC-3643 / Chainlink NAV",
    metric: "15% Circuit Breaker",
    metricDetail: "O(1) Merkle yield claims and 5,000+ Foundry fuzz sequences",
    tech: ["Solidity", "ERC-3643", "Chainlink NAV", "Foundry", "Base Mainnet"],
    link: "https://github.com/NexTechArchitect/Nexus-RWA-Protocol/",
    liveUrl: "https://nexus-rwa-protocol.vercel.app/",
    accentColor: "#0052FF",
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
      "Decentralized keeper execution engine on Base Mainnet built around an O(1) swap-and-pop batch queue, staked keeper bond slashing, stateless call routing, and Yul-optimized state transitions reducing gas overhead by up to 35%.",
    category: "fullstack",
    flagship: true,
    network: "Base Mainnet",
    standard: "O(1) Keeper Network",
    metric: "35% Yul Gas Reduction",
    metricDetail: "Constant-time batch job scheduling with zero unbounded loops",
    tech: ["Solidity", "Yul Assembly", "Foundry", "Base Mainnet", "Next.js"],
    link: "https://github.com/NexTechArchitect/OnChain-Automation-Protocol",
    liveUrl: "https://on-chain-automation-protocol.vercel.app/",
    accentColor: "#0891B2",
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
      "Decentralized DeFi insurance architecture deployed on Base Mainnet combining ERC-4626 capital vaults routed into Aave V3 yield strategies, ERC-721 coverage policies, and flash-loan resistant DAO claim adjudication.",
    category: "fullstack",
    flagship: true,
    network: "Base Mainnet",
    standard: "ERC-4626 / Aave V3",
    metric: "Aave V3 Yield Vaults",
    metricDetail: "Flash-loan resistant claims governor with Veto Council safeguards",
    tech: ["Solidity", "ERC-4626", "Aave V3", "Foundry", "Base Mainnet"],
    link: "https://github.com/NexTechArchitect/Sentinel-Insurance-Protocol",
    liveUrl: "https://sentinel-insurance-protocol.vercel.app/",
    accentColor: "#2563EB",
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
    title: "Nexus Perpetuals (Protocol OS)",
    shortTitle: "Nexus Perpetuals",
    description:
      "Non-custodial 50x leverage perpetuals DEX integrating ERC-4337 smart account paymasters for gasless order execution, Chainlink CCIP cross-chain margin relay with nonce deduplication, and automated liquidation engines.",
    category: "fullstack",
    flagship: true,
    network: "Ethereum / CCIP",
    standard: "50x Perps / ERC-4337",
    metric: "50x Leverage DEX",
    metricDetail: "Gasless smart account execution with CCIP cross-chain margin",
    tech: ["Solidity", "ERC-4337", "Chainlink CCIP", "Foundry", "Next.js"],
    link: "https://github.com/NexTechArchitect/Nexus-Protocol-OS",
    liveUrl: "https://nexus-protocol-os.vercel.app/",
    accentColor: "#059669",
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
    id: "fs3",
    title: "Nexus Perps v2 (Polkadot Hub)",
    shortTitle: "Nexus Perps v2",
    description:
      "Cross-chain perpetuals infrastructure deployed on Polkadot Hub EVM featuring automated price keepers, 50x isolated leverage positions, real-time liquidation vaults, and cross-chain margin relay.",
    category: "fullstack",
    network: "Polkadot Hub",
    standard: "50x Perps / Keepers",
    metric: "50x Isolated Margin",
    metricDetail: "Automated price keepers and cross-chain margin settlement",
    tech: ["Solidity", "Polkadot Hub", "Chainlink CCIP", "Next.js"],
    link: "https://github.com/NexTechArchitect/nexus-polka-perps",
    liveUrl: "https://nexus-protocol-v2.vercel.app/",
    accentColor: "#0284C7",
    iconKey: "layers",
  },
  {
    id: "fs4",
    title: "ERC-5484 On-Chain Reputation",
    shortTitle: "ERC-5484 Reputation",
    description:
      "Fully on-chain reputation protocol built on ERC-5484 Soulbound Tokens and EIP-1822 UUPS upgradeable proxies. Wallet behavior evolves dynamic reputation scores and renders upgraded SVG medal metadata entirely on-chain with zero IPFS dependency.",
    category: "fullstack",
    network: "Base Mainnet",
    standard: "ERC-5484 / UUPS",
    metric: "100% On-Chain SVG",
    metricDetail: "Storage-gap safe UUPS proxy with dynamic SBT progression",
    tech: ["Solidity", "ERC-5484", "UUPS Proxy", "Foundry", "Next.js"],
    link: "https://github.com/NexTechArchitect/RST-Reputation-Protocol",
    liveUrl: "https://rst-reputation-protocol.vercel.app/",
    accentColor: "#4F46E5",
    iconKey: "award",
  },
  {
    id: "fs2",
    title: "Sentinel DAO Governance",
    shortTitle: "Sentinel DAO",
    description:
      "Modular on-chain governance architecture combining ERC20Votes checkpoint snapshots at block.number - 1, TimelockController execution queues, quorum thresholds, and a full Wagmi governance dashboard.",
    category: "fullstack",
    network: "Base Mainnet",
    standard: "Governor / Timelock",
    metric: "Flash-Loan Immune",
    metricDetail: "Prior-block snapshot voting with delayed timelock execution",
    tech: ["Solidity", "OpenZeppelin", "Wagmi", "Next.js"],
    link: "https://github.com/NexTechArchitect/Web3-FullStack-Sentinal-DAO",
    liveUrl: "https://sentinel-dao-brown.vercel.app/",
    accentColor: "#0F766E",
    iconKey: "landmark",
  },
];

export const coreProjects: ProjectItem[] = [
  {
    id: "c1",
    title: "Decentralized StableCoin Engine",
    shortTitle: "DSC StableCoin",
    description:
      "Exogenous, crypto-collateralized algorithmic stablecoin pegged to USD using Chainlink stale-price checks, 200% over-collateralization health factors, liquidation bonuses, and stateful Foundry invariant fuzzing.",
    category: "core",
    network: "EVM / Foundry",
    standard: "CDP / Invariant Fuzzing",
    metric: "200% Min Collateral",
    metricDetail: "Stateful handler-based Foundry invariant suite verifying solvency",
    tech: ["Solidity", "Foundry", "Chainlink Oracles", "Invariant Fuzzing"],
    link: "https://github.com/NexTechArchitect/Foundry-Defi-StableCoin",
    accentColor: "#059669",
    iconKey: "coins",
  },
  {
    id: "c2",
    title: "Automated Provably Fair Raffle",
    shortTitle: "VRF Raffle",
    description:
      "Autonomous on-chain raffle engineered as a strict finite state machine integrating Chainlink VRF v2.5 verifiable randomness and Chainlink Automation upkeep triggers with custom gas-efficient error handling.",
    category: "core",
    network: "EVM / Chainlink",
    standard: "Chainlink VRF v2.5",
    metric: "Deterministic FSM",
    metricDetail: "Zero-operator execution verified via unit and staging tests",
    tech: ["Solidity", "Chainlink VRF", "Chainlink Automation", "Foundry"],
    link: "https://github.com/NexTechArchitect/Raffle-Lottery-Foundry",
    accentColor: "#0284C7",
    iconKey: "dice",
  },
  {
    id: "c3",
    title: "ERC-4337 Account Abstraction Core",
    shortTitle: "ERC-4337 Core",
    description:
      "Protocol-accurate smart account implementation targeting the canonical EntryPoint contract with ECDSA UserOperation signature validation, prefund settlement, and modular Paymaster gas sponsorship.",
    category: "core",
    network: "EVM / zkSync",
    standard: "ERC-4337 EntryPoint",
    metric: "Custom UserOp Flow",
    metricDetail: "Direct EntryPoint integration with minimal signature verification",
    tech: ["Solidity", "ERC-4337", "Paymaster", "Foundry"],
    link: "https://github.com/NexTechArchitect/ERC4337-Account-Abstraction-Foundry",
    accentColor: "#0052FF",
    iconKey: "key",
  },
  {
    id: "c4",
    title: "UUPS Upgradeable Protocol",
    shortTitle: "UUPS Proxy Core",
    description:
      "Production-grade EIP-1822 UUPS proxy architecture enforcing initializer guards, storage-gap collision resistance, owner-gated upgrade authorization, and automated V1-to-V2 state preservation scripts.",
    category: "core",
    network: "EVM / Foundry",
    standard: "EIP-1822 / ERC-1967",
    metric: "Collision-Safe Slots",
    metricDetail: "Automated Foundry upgrade scripts validating storage layout",
    tech: ["Solidity", "UUPS Proxies", "OpenZeppelin", "Foundry"],
    link: "https://github.com/NexTechArchitect/uups-protocol-config",
    accentColor: "#475569",
    iconKey: "refresh",
  },
  {
    id: "c5",
    title: "Merkle-712 Airdrop Protocol",
    shortTitle: "Merkle-712 Airdrop",
    description:
      "Gas-optimized token claim architecture combining off-chain Merkle tree proof verification with EIP-712 typed structured signatures so relayers can sponsor claims without exposing double-spend vectors.",
    category: "core",
    network: "EVM / Foundry",
    standard: "EIP-712 / Merkle Proof",
    metric: "O(log N) Proof Claims",
    metricDetail: "Delegated gasless claiming with replay-protected signatures",
    tech: ["Solidity", "EIP-712", "Merkle Trees", "Foundry"],
    link: "https://github.com/NexTechArchitect/Siso-Merkle-Airdrop",
    accentColor: "#0891B2",
    iconKey: "gitbranch",
  },
  {
    id: "c6",
    title: "CuteCat NFT Protocol (IPFS)",
    shortTitle: "ERC-721 Provenance",
    description:
      "ERC-721 collection architecture demonstrating both deterministic IPFS content addressing and fully on-chain Base64 SVG encoding with Foundry deployment scripts and metadata verification tests.",
    category: "core",
    network: "EVM / IPFS",
    standard: "ERC-721 / Base64 SVG",
    metric: "Dual Metadata Engine",
    metricDetail: "Immutable IPFS pinning paired with on-chain SVG rendering",
    tech: ["Solidity", "ERC-721", "IPFS", "Foundry Scripts"],
    link: "https://github.com/NexTechArchitect/ERC721-Advanced-IPFS-NFT",
    accentColor: "#4F46E5",
    iconKey: "image",
  },
  {
    id: "c7",
    title: "SISO Token Standard",
    shortTitle: "SISO ERC-20",
    description:
      "Hardened ERC-20 token primitive built with strict role-based access control, supply cap invariants, emergency pause circuit breakers, and reproducible Foundry deployment pipelines.",
    category: "core",
    network: "Ethereum Sepolia",
    standard: "ERC-20 / RBAC",
    metric: "Strict Supply Invariant",
    metricDetail: "Role-gated minting with automated Foundry verification",
    tech: ["Solidity", "ERC-20", "Access Control", "Foundry"],
    link: "https://github.com/NexTechArchitect/SISO-Token-ERC20",
    accentColor: "#0F766E",
    iconKey: "lock",
  },
  {
    id: "c8",
    title: "Oracle-Pegged Crowdfunding",
    shortTitle: "Oracle FundMe",
    description:
      "Decentralized treasury contract enforcing USD-denominated minimum contributions via live Chainlink AggregatorV3Interface price feeds, packed storage variables, and gas-benchmarked withdrawal paths.",
    category: "core",
    network: "EVM / Chainlink",
    standard: "AggregatorV3 / Gas Opt",
    metric: "USD-Pegged Thresholds",
    metricDetail: "Live oracle normalization with cached memory withdrawal loops",
    tech: ["Solidity", "Chainlink Data Feeds", "DeFi Math", "Foundry"],
    link: "https://github.com/NexTechArchitect/FundMe-Contract",
    accentColor: "#0EA5E9",
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
    name: "Base Mainnet",
    domain: "Protocol & EVM",
    focus: "6 deployed production DeFi protocols",
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
    summary: "Neutralizing single-block flash-loan governance capture at the snapshot boundary.",
    body: "When engineering Sentinel DAO adjudication, tracking balances at the active block.number exposes governance to atomic flash-loan borrows and proposal votes inside a single transaction. Shifting every voting-weight lookup to prior-block checkpoints (block.number - 1) combined with a TimelockController delay structurally eliminates same-block vote manipulation before execution ever reaches the treasury.",
    tradeoff: "Requires ERC20Votes checkpoint writes on token transfers, adding modest SSTORE gas during routine transfers in exchange for deterministic flash-loan immunity.",
    outcome: "Zero flash-loan governance attack vectors across stateful Foundry fuzz campaigns.",
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
    summary: "Eliminating bounded loop DoS with constant-time swap-and-pop batch scheduling.",
    body: "Standard keeper registries that linearly scan active jobs eventually breach block gas limits as protocol adoption scales. In On-Chain Automation, every active job tracks its own 1-based index inside a dense array so cancellations and batch dequeues execute in strict O(1) time via swap-and-pop. Critical slot reads and pointer updates run in inline Yul assembly, cutting execution overhead by up to 35%.",
    tradeoff: "Swap-and-pop breaks strict FIFO ordering, so execution priority is encoded through explicit deadline timestamps and keeper incentive tiers rather than array position.",
    outcome: "Up to 35% execution gas reduction and constant O(1) removal regardless of total active jobs.",
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
    summary: "Enforcing institutional KYC, OFAC sanctions, and oracle deviation limits inside ERC-20 hooks.",
    body: "Most RWA implementations gate secondary transfers behind slow centralized signing servers. For Nexus RWA on Base Mainnet, the ComplianceEngine intercepts every ERC-20 transfer hook to verify cryptographic identity commitments on-chain in real time. Simultaneously, the NAVOracle validates Chainlink updates against a 15% 24-hour deviation circuit breaker so a compromised or stale feed halts minting and redemptions automatically.",
    tradeoff: "Every peer-to-peer transfer performs two staticcalls to the IdentityRegistry and ComplianceEngine, trading minimal L2 gas for zero centralized API bottlenecks.",
    outcome: "100% KYC enforcement across 219+ unit and invariant tests with 0 critical or high Slither findings.",
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
    protocol: "Nexus Perpetuals (Protocol OS)",
    domain: "Cross-Chain & AA",
    title: "Asynchronous CCIP Margin Replay Defense & ERC-4337 Paymasters",
    summary: "Protecting 50x leverage cross-chain margin settlements against delayed or duplicated relays.",
    body: "Cross-chain perpetuals margin routing introduces asynchronous settlement hazards where a retried or re-ordered bridge packet could double-credit trader collateral. Nexus Protocol OS combines Chainlink CCIP source-chain allowlisting with deterministic messageId nonce locking before crediting margin vaults, paired with ERC-4337 paymasters so active traders execute orders without managing native gas balances.",
    tradeoff: "Storing processed messageId commitments permanently increases state footprint, mitigated by mapping compact bytes32 flags rather than full payload structs.",
    outcome: "Deterministic replay immunity across multi-chain margin relays and gasless order routing.",
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
    summary: "Preventing proxy storage collisions and first-depositor vault share manipulation.",
    body: "Upgradeable protocols live with their storage layout forever. Across the ERC-5484 Reputation Engine and Sentinel's ERC-4626 Aave V3 vaults, every base contract reserves explicit 50-slot storage gaps and virtual share offsets to neutralize both V2 layout corruption and ERC-4626 first-depositor donation attacks. Foundry storage inspection runs inside CI before any upgrade transaction is signed.",
    tradeoff: "Fixed storage gaps constrain inheritance refactors, enforcing strict append-only state schemas across protocol versions.",
    outcome: "Zero storage slot drift across V1-to-V2 upgrades and full resistance to vault share dilution.",
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