export interface ContractReference {
  label: string;
  address: string;
  role: string;
}

export interface SmartContractDetail {
  name: string;
  responsibility: string;
  address?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortTitle: string;
  aliases: string[];
  description: string;
  story: string;
  architecture: string;
  smartContracts: SmartContractDetail[];
  securityInvariants: string[];
  gasOptimizations: string[];
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
    aliases: [
      "nexus rwa",
      "nexus rwa protocol",
      "rwa protocol",
      "nustb",
      "complianceengine",
      "identityregistry",
      "nav circuit breaker",
      "15% nav",
      "real world asset tokenization",
      "erc-3643 rwa",
    ],
    description:
      "Institutional real-world asset tokenization engine built for Ethereum and EVM mainnets with ERC-3643 transfer compliance and O(1) Merkle yield distribution. Every token movement checks on-chain KYC and OFAC identity registries inside the transfer hook alongside a 15% Chainlink NAV circuit breaker.",
    story:
      "Most tokenized treasury products rely on centralized off-chain allowlist servers that create single points of failure and block DeFi composability. Amit built Nexus RWA to enforce institutional KYC, sanctions screening, and NAV price safety deterministically inside EVM transfer hooks so permissioned RWAs settle cleanly on-chain.",
    architecture:
      "Separates token accounting (`nUSTB`) from modular compliance (`ComplianceEngine`) and cryptographic identity claims (`IdentityRegistry`). Every mint, burn, and secondary transfer triggers a stateless transfer hook validation, while periodic Treasury yield epochs publish compact Merkle roots so thousands of holders claim distributions in O(1) proof verification without protocol-side payout loops.",
    smartContracts: [
      {
        name: "ComplianceEngine",
        responsibility:
          "Stateless transfer gatekeeper validating sender/receiver eligibility, jurisdiction limits, and 15% daily Chainlink NAV deviation bounds.",
        address: "0x00c0E82e0C81c4Df096aAd98f2aA5A399b34131c",
      },
      {
        name: "IdentityRegistry",
        responsibility:
          "On-chain KYC and OFAC sanctions registry binding investor wallets to verified identity claims.",
        address: "0x18026c0BF58c978caDc8Df7f31b1cbC2f6A94c5A",
      },
      {
        name: "Genesis Token (nUSTB)",
        responsibility:
          "Permissioned ERC-3643 / ERC-20 tokenized treasury share contract enforcing transfer hooks on every balance mutation.",
        address: "0xFDFda5Ca91bDC022EC85C9F2bE5d29A33f874EDE",
      },
      {
        name: "MerkleYieldDistributor",
        responsibility:
          "Epoch-based O(1) yield claim engine using Merkle proofs and claimed bitmaps to distribute T-bill yield without gas-heavy loops.",
      },
    ],
    securityInvariants: [
      "Zero non-KYC or sanctioned address can send or receive `nUSTB` across direct transfers, `transferFrom`, or mints.",
      "Chainlink NAV oracle updates exceeding a 15% (1,500 bps) 24-hour delta automatically trip the circuit breaker and halt minting/redemptions.",
      "Merkle yield claims lock per-epoch claimed flags before transferring tokens (strict Checks-Effects-Interactions) to block double claims and reentrancy.",
      "Verified with Foundry unit and stateful invariant suites plus clean Slither static analysis.",
    ],
    gasOptimizations: [
      "O(1) pull-based Merkle yield distribution eliminates O(N) holder payout loops that hit block gas limits.",
      "Compact 4-byte custom errors (`TransferComplianceRejected`, `NavCircuitBreakerTripped`) shrink deployment bytecode and revert gas.",
      "Stateless pure/view compliance checks minimize warm storage writes during secondary peer-to-peer transfers.",
    ],
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
    aliases: [
      "on-chain automation",
      "onchain automation",
      "automation protocol",
      "keeper network",
      "jobmanager",
      "keeperregistry",
      "executionengine",
      "swap and pop",
      "swappop",
      "35% yul gas",
    ],
    description:
      "Decentralized keeper execution engine featuring a constant-time swap-and-pop batch queue, staked operator bonds, and stateless call routing. Inline Yul slot management eliminates linear loop DoS risks and cuts execution gas overhead by up to 35%.",
    story:
      "Linear keeper registries degrade as job queues grow, eventually reverting at the block gas limit and stalling critical DeFi liquidations or harvests. Amit architected On-Chain Automation Protocol to guarantee O(1) job scheduling and removal with economic operator accountability.",
    architecture:
      "Splits scheduling, operator economics, and target execution across three isolated contracts: `JobManager` holds user gas escrow and dense active job arrays indexed via 1-based mappings, `KeeperRegistry` manages bonded operators and slashing, and `ExecutionEngine` isolates untrusted target calls in a stateless router so malicious callbacks cannot touch escrow funds.",
    smartContracts: [
      {
        name: "JobManager.sol",
        responsibility:
          "Maintains active job metadata, user gas escrow balances, and O(1) swap-and-pop queue insertions/removals.",
        address: "0xBAa2B4c250DD6da358e23244C2fa85dA1927718C",
      },
      {
        name: "KeeperRegistry.sol",
        responsibility:
          "Enforces minimum operator stake bonds, registration lifecycle, performance accounting, and slashing penalties.",
        address: "0xcEa37b9CCA6170d43BF133CCfdeaD9CB2A4D61D3",
      },
      {
        name: "ExecutionEngine.sol",
        responsibility:
          "Stateless execution router isolating arbitrary target contract calls from protocol escrow storage.",
        address: "0x388665c32F9F17E0d5cfEE3Eabe1880A3AEd80e9",
      },
    ],
    securityInvariants: [
      "Escrow isolation: `ExecutionEngine` holds zero persistent user balances so malicious target contracts cannot drain `JobManager` funds via callback reentrancy.",
      "Queue integrity invariant: every active `jobId` maps cleanly to its exact array index (`indexPlusOne[activeIds[i]] == i + 1`) after any sequence of adds, batches, and cancellations.",
      "Gas griefing defense: strict gas caps and return-data handling prevent failing target jobs from reverting an entire keeper batch.",
      "Economic deterrence: staked keeper bonds in `KeeperRegistry` penalize dishonest or invalid upkeep submissions.",
    ],
    gasOptimizations: [
      "O(1) swap-and-pop queue removal (`SwapPopQueue.yul`) replaces O(N) linear array shifts, keeping gas constant regardless of queue depth.",
      "Targeted inline Yul (`sstore(activeIds.slot, lastIdx)`) removes redundant Solidity array bounds and length checks on the hot path, cutting execution gas by up to 35%.",
      "1-based index mappings avoid extra `exists` boolean storage slots (`0` represents absent).",
    ],
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
    aliases: [
      "sentinel insurance",
      "sentinel insurance protocol",
      "insurance protocol",
      "policyengine",
      "coveragepool",
      "claimsgovernor",
      "veto council",
      "underwriting",
      "erc-4626 insurance",
    ],
    description:
      "DeFi coverage architecture pairing ERC-4626 capital vaults routed into Aave V3 yield strategies with tokenized ERC-721 underwriting policies. Claim adjudication anchors voting power to prior-block snapshots and a Veto Council timelock to block flash-loan capture.",
    story:
      "Idle DeFi insurance pools struggle to attract underwriters because locked capital earns zero base yield, while on-chain claims voting is frequently attacked by flash-loan governance capture. Amit built Sentinel Insurance to make coverage capital productive via Aave V3 while hardening claim payouts against atomic governance exploits.",
    architecture:
      "Underwriters deposit assets into `CoveragePool` (an ERC-4626 vault that routes idle reserves into Aave V3 while maintaining an instant payout buffer). Policyholders purchase coverage represented as transferable ERC-721 NFTs minted by `PolicyEngine`. When an exploit occurs, `ClaimsGovernor` adjudicates claims using historical `ERC20Votes` snapshots backed by a Veto Council timelock.",
    smartContracts: [
      {
        name: "PolicyEngine",
        responsibility:
          "Issues and tracks ERC-721 underwriting policies, premium pricing, coverage caps, and expiry windows.",
        address: "0xEF80cd6370D4619D2f71BD4000a4757357Be5564",
      },
      {
        name: "CoveragePool",
        responsibility:
          "ERC-4626 tokenized capital vault routing idle reserves into Aave V3 with virtual share inflation protection.",
        address: "0x374d949c7A575212d423Ecc0e765a59664d7C3eD",
      },
      {
        name: "ClaimsGovernor",
        responsibility:
          "Flash-loan resistant claim voting engine anchoring vote weight to finalized prior-block checkpoints plus Veto Council delay.",
        address: "0xB7939f8b41C932595cf358842BC63AFE221D2Ba3",
      },
    ],
    securityInvariants: [
      "Flash-loan vote immunity: `ClaimsGovernor` strictly rejects any `snapshotBlock >= block.number` (`FlashLoanSnapshotViolation`) and delays payout execution behind a Veto Council timelock.",
      "ERC-4626 first-depositor inflation defense: virtual share offsets and protocol-favorable rounding prevent share price donation attacks.",
      "Solvency cap invariant: total active insured coverage issued by `PolicyEngine` never exceeds available vault underwriting capacity.",
      "Reentrancy guards protect Aave V3 reserve withdrawals and claim disbursements.",
    ],
    gasOptimizations: [
      "Packed policy structs minimize storage slots per minted ERC-721 policy.",
      "Buffered Aave V3 liquidity avoids redundant Aave `supply`/`withdraw` external calls on small routine deposits and withdrawals.",
      "Custom errors replace verbose revert strings across vault, policy, and governor contracts.",
    ],
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
    aliases: [
      "nexus perpetuals",
      "nexus perpetuals dex",
      "nexus protocol os",
      "perpetuals dex",
      "positionmanager",
      "nexuspaymaster",
      "crosschainrouter",
      "50x leverage dex",
      "ccip margin",
    ],
    description:
      "Non-custodial 50x leverage perpetuals DEX with ERC-4337 smart account paymasters for gasless order execution and automated liquidations. Chainlink CCIP cross-chain margin relays enforce source-chain allowlists and nonce locks before crediting collateral.",
    story:
      "Active on-chain perpetual traders face two major UX and security bottlenecks: managing native gas balances across chains and fragmented cross-chain collateral vulnerable to bridge replay attacks. Amit engineered Nexus Perpetuals DEX to unify gasless ERC-4337 order execution with replay-proof Chainlink CCIP margin deposits.",
    architecture:
      "Combines a 50x leverage margin engine (`PositionManager`) with an ERC-4337 `NexusPaymaster` that sponsors trader UserOperations, and a `CrossChainRouter` built on Chainlink CCIP for cross-chain collateral deposits. Oracle mark pricing drives continuous PnL accounting and deterministic keeper liquidations.",
    smartContracts: [
      {
        name: "PositionManager",
        responsibility:
          "50x leverage perpetuals engine managing long/short positions, margin health ratios, funding accrual, and liquidations.",
        address: "0x6952144C5dfb64DF54a64b61B3321Fd2C24cB42A",
      },
      {
        name: "NexusPaymaster",
        responsibility:
          "ERC-4337 Paymaster validating trader UserOperations and sponsoring gas fees for frictionless order execution.",
        address: "0x20e302881494F79eF5E536d5533be04F913eE652",
      },
      {
        name: "CrossChainRouter",
        responsibility:
          "Chainlink CCIP receiver enforcing source-chain allowlists and messageId replay locks before crediting margin vaults.",
        address: "0xE9b7f8F6c78054fb8d0D97585F32e7e026F5dd24",
      },
    ],
    securityInvariants: [
      "CCIP replay immunity: `processedMessages[messageId] = true` is committed strictly before `_depositMargin(...)` under Checks-Effects-Interactions, alongside strict `allowedChains[sourceChain]` allowlisting.",
      "Liquidation solvency invariant: under-margined positions trigger permissionless liquidation before equity turns negative.",
      "Paymaster abuse protection: `NexusPaymaster` scopes sponsored UserOperations exclusively to verified protocol selectors and bounded gas limits.",
      "Oracle staleness and bounds checks prevent manipulated spot prices from triggering false liquidations.",
    ],
    gasOptimizations: [
      "Compact `mapping(bytes32 => bool)` nonce flags track processed CCIP messages instead of storing heavy payload structs.",
      "Packed position structs consolidate collateral, size, entry price, and funding index to reduce `SSTORE` count per trade.",
      "Custom errors (`UntrustedSourceChain`, `MessageAlreadyProcessed`) minimize revert overhead on invalid cross-chain calls.",
    ],
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
    aliases: [
      "sentinel dao",
      "sentinel dao governance",
      "dao governance",
      "erc20votes dao",
      "timelockcontroller",
      "web3-fullstack-sentinal-dao",
    ],
    description:
      "Modular on-chain governance system pairing ERC20Votes checkpoints with a full Next.js and Wagmi proposal execution dashboard. Prior-block vote snapshots and TimelockController queues prevent atomic flash-loan treasury takeovers.",
    story:
      "Naive token-weighted DAOs can be drained in a single block by flash-borrowing governance tokens, passing an emergency proposal, and executing a treasury sweep. Amit built Sentinel DAO Governance to demonstrate end-to-end flash-loan immune proposal lifecycles from Solidity checkpoints to a live Next.js + Wagmi governance portal.",
    architecture:
      "Uses an OpenZeppelin Governor architecture wired to an `ERC20Votes` checkpoint token and a mandatory `TimelockController` executor holding protocol treasury authority. Proposals move deterministically through Pending -> Active -> Succeeded -> Queued -> Executed states, with Wagmi v2 and Viem surfacing live quorum progress and calldata simulation.",
    smartContracts: [
      {
        name: "SentinelGovernor",
        responsibility:
          "Proposal lifecycle controller enforcing voting delay, quorum thresholds, and prior-block vote weight lookups.",
      },
      {
        name: "SentinelGovernanceToken (ERC20Votes)",
        responsibility:
          "Delegatable voting token recording historical balance checkpoints on every transfer and delegation.",
      },
      {
        name: "SentinelTimelock (TimelockController)",
        responsibility:
          "Enforces mandatory execution delay between proposal passage and treasury calldata execution.",
      },
    ],
    securityInvariants: [
      "Zero same-block flash-loan vote manipulation: all voting power queries read finalized historical checkpoints (`snapshotBlock < block.number`).",
      "Mandatory timelock delay gives token holders an exit window to inspect queued calldata before execution.",
      "Strict role separation ensures only the Governor can propose/queue operations on the Timelock, while admin bootstrap privileges are renounced.",
    ],
    gasOptimizations: [
      "Binary search over compact `ERC20Votes` checkpoint arrays keeps historical vote lookups O(log N).",
      "Proposal calldata hashes (`keccak256`) are stored on-chain instead of persisting full target/value/calldata arrays in storage.",
      "Custom errors and calldata function parameters reduce transaction overhead for voters and proposers.",
    ],
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
    aliases: [
      "nexus perps v2",
      "perps v2",
      "polkadot hub",
      "polkadot",
      "polka perps",
      "nexus-polka-perps",
      "nexus perps v2 polkadot hub",
      "isolated leverage",
    ],
    description:
      "Cross-chain perpetuals exchange built for Polkadot Hub EVM supporting 50x isolated leverage positions and automated price keepers. Isolated margin accounting and deterministic liquidation triggers keep vault solvency intact under rapid volatility.",
    story:
      "Expanding high-leverage perpetuals onto Polkadot Hub EVM requires protecting liquidity providers from cascading cross-margin blowups and stale cross-ecosystem price updates. Amit built Nexus Perps v2 specifically for Polkadot Hub EVM to combine strict 50x isolated margin containment, automated price keepers, and cross-chain collateral settlement.",
    architecture:
      "An isolated-margin perpetuals core deployed on Polkadot Hub EVM pairing a `PerpsEngineV2` position manager, an LP counterparty `LiquidityVault`, an automated `PriceKeeper` oracle updater, and Chainlink CCIP cross-chain margin messaging. Each position maintains an independent collateral slice, maintenance margin threshold, and deterministic keeper liquidation path, backed by a real-time Next.js trading interface.",
    smartContracts: [
      {
        name: "PerpsEngineV2",
        responsibility:
          "Manages 50x isolated long/short positions, per-position margin ratios, PnL settlement, and deterministic liquidation triggers.",
      },
      {
        name: "LiquidityVault",
        responsibility:
          "Holds counterparty LP liquidity, enforces open-interest utilization caps, and settles realized trader profits/losses safely.",
      },
      {
        name: "PriceKeeper & OracleRouter",
        responsibility:
          "Ingests signed/verified price updates with freshness bounds so mark-price liquidations execute deterministically under high volatility.",
      },
      {
        name: "CCIPMarginBridge",
        responsibility:
          "Handles cross-chain margin deposits and withdrawals with source-chain verification and replay protection.",
      },
    ],
    securityInvariants: [
      "Strict isolated margin containment: a liquidated position can never lose more than its dedicated collateral slice or drain a trader's other open positions.",
      "Open-interest utilization ceiling: total reserved long/short exposure is capped strictly below `LiquidityVault` solvency reserves.",
      "Deterministic liquidation threshold invariant: keeper liquidations become permissionlessly executable the moment equity drops below maintenance margin, preventing protocol bad debt.",
      "Oracle freshness and deviation guards reject stale or zero-price feeds before opening, closing, or liquidating positions.",
    ],
    gasOptimizations: [
      "Isolated position records pack direction, leverage tier, timestamps, and flags into tight 256-bit storage slots to cut `SSTORE` cost on open/close.",
      "Keeper price-update and liquidation calls execute atomically inside a single batched transaction, eliminating redundant cold storage reads.",
      "Custom Solidity errors and `calldata` order structs minimize calldata and runtime gas on Polkadot Hub EVM.",
    ],
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
    aliases: [
      "erc-5484 soulbound reputation",
      "erc 5484 reputation",
      "soulbound reputation",
      "rst reputation",
      "rst-reputation-protocol",
      "svg medal",
      "reputationstoragev1",
    ],
    description:
      "On-chain reputation system built on non-transferable ERC-5484 tokens that render evolving SVG medal metadata directly from contract state. EIP-1822 UUPS upgradeability with reserved storage gaps prevents slot collisions across future versions.",
    story:
      "Traditional Web3 credentials fail in two ways: transferable NFTs can be bought on secondary markets (breaking trust), and off-chain JSON metadata breaks when servers go dark. Amit built RST Reputation Protocol using consensual ERC-5484 Soulbound Tokens with 100% on-chain dynamic SVG rendering behind an upgrade-safe UUPS proxy.",
    architecture:
      "Implements ERC-5484 non-transferable tokens with immutable `BurnAuth` flags behind an EIP-1822 / ERC-1967 UUPS proxy. `ReputationStorageV1` packs each user's score, timestamp, tier, and revocation flag into a single 256-bit slot followed by a 48-slot `__gap`, while an on-chain `SVGRenderer` dynamically encodes Base64 JSON + SVG badges directly in `tokenURI()`.",
    smartContracts: [
      {
        name: "RSTReputation (UUPS Proxy Implementation)",
        responsibility:
          "ERC-5484 Soulbound Token core enforcing non-transferability, immutable `BurnAuth`, and authority-gated tier progression.",
      },
      {
        name: "ReputationStorageV1",
        responsibility:
          "Upgrade-safe storage schema packing `Profile` into 1 EVM slot with an explicit `uint256[48] private __gap`.",
      },
      {
        name: "OnChainSVGRenderer",
        responsibility:
          "Pure Solidity Base64 SVG generator dynamically composing medal visuals directly from on-chain tier and score state.",
      },
    ],
    securityInvariants: [
      "Non-transferability invariant: all secondary transfers (`transferFrom`, `safeTransferFrom`) revert unconditionally once a Soulbound Token is minted.",
      "Immutable `BurnAuth` enforcement: burn permissions recorded at mint time (`IssuerOnly`, `OwnerOnly`, `Both`, or `Neither`) cannot be altered retroactively.",
      "UUPS upgrade safety: `_disableInitializers()` locks the implementation contract, `_authorizeUpgrade` restricts upgrades to the owner/authority, and Foundry CI checks storage layout against the 48-slot `__gap`.",
    ],
    gasOptimizations: [
      "Single-slot struct packing (`uint64 score; uint64 lastUpdated; uint16 tier; bool revoked;` = 152 bits) updates an entire reputation profile in one `SSTORE`.",
      "SVG generation executes inside `view` `tokenURI()` calls (zero on-chain gas for viewers) while keeping state mutations minimal.",
      "UUPS proxy pattern eliminates per-call admin checks required by Transparent proxies.",
    ],
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
    aliases: [
      "decentralized stablecoin",
      "decentralized stablecoin engine",
      "dsc stablecoin",
      "dscengine",
      "dsc",
      "foundry-defi-stablecoin",
      "200% collateral",
    ],
    description:
      "Exogenous crypto-collateralized stablecoin pegged to USD with 200% minimum collateralization and automated liquidation bonuses. Handler-based Foundry invariant fuzzing and Chainlink staleness guards verify protocol solvency across adversarial sequences.",
    story:
      "Algorithmic stablecoins repeatedly collapse under bank runs when endogenous backing enters a death spiral. Amit built Decentralized StableCoin Engine as an exogenous-only (WETH/WBTC), governance-minimized CDP protocol modeled after MakerDAO DAI and proven solvent through handler-based Foundry invariant fuzzing.",
    architecture:
      "Pairs a minimal ERC-20 `DecentralizedStableCoin` token (exclusively owned by the engine) with `DSCEngine`, which manages multi-collateral vaults, 200% over-collateralization health factors (`LIQUIDATION_THRESHOLD = 50%`), 10% liquidator bonuses, and `OracleLib` Chainlink staleness validation.",
    smartContracts: [
      {
        name: "DSCEngine.sol",
        responsibility:
          "Core CDP vault managing collateral deposits, DSC minting/burning, health factor math, and permissionless liquidations.",
      },
      {
        name: "DecentralizedStableCoin.sol",
        responsibility:
          "ERC20Burnable USD-pegged token whose `mint` and `burn` privileges are locked exclusively to `DSCEngine`.",
      },
      {
        name: "OracleLib.sol",
        responsibility:
          "Chainlink `AggregatorV3Interface` safety wrapper reverting transactions if price feeds go stale beyond the 3-hour heartbeat.",
      },
      {
        name: "Handler.t.sol & Invariants.t.sol",
        responsibility:
          "Stateful Foundry invariant harness fuzzing thousands of randomized deposit, mint, redeem, and price-move sequences.",
      },
    ],
    securityInvariants: [
      "Core solvency invariant: `totalCollateralValueInUsd >= totalDscSupply` holds across every randomized handler-based Foundry fuzz sequence.",
      "Health factor enforcement: every `mintDsc` and `redeemCollateral` call reverts if the user's health factor drops below `1e18` (200% collateral ratio).",
      "Oracle staleness circuit breaker: `OracleLib.staleCheckLatestRoundData` reverts if `updatedAt` exceeds the heartbeat timeout so stale prices cannot enable underpriced minting.",
      "Liquidation health improvement check: `liquidate()` reverts unless the borrower's ending health factor strictly improves and the liquidator remains solvent.",
    ],
    gasOptimizations: [
      "Immutable collateral token and price-feed mappings avoid repeated storage lookups during health-factor calculations.",
      "Combined atomic functions (`depositCollateralAndMintDsc`, `redeemCollateralForDsc`) save a full transaction overhead and redundant health-factor recalculations.",
      "Custom Solidity errors (`DSCEngine__BreaksHealthFactor`, `DSCEngine__NeedsMoreThanZero`) reduce bytecode and revert gas.",
    ],
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
    aliases: [
      "automated provably fair raffle",
      "provably fair raffle",
      "vrf raffle",
      "raffle",
      "lottery",
      "raffle-lottery-foundry",
      "chainlink vrf raffle",
    ],
    description:
      "Autonomous on-chain raffle wired to Chainlink VRF v2.5 randomness and Chainlink Automation upkeep triggers. A strict finite state machine locks entry during settlement so reentrancy and timing manipulation are impossible.",
    story:
      "On-chain lotteries that use `block.timestamp` or `blockhash` for randomness can be gamed by validators, and manual operator draws introduce centralization risk. Amit built Automated Provably Fair Raffle to achieve zero-operator, cryptographically verifiable draws using Chainlink VRF v2.5 and Chainlink Automation.",
    architecture:
      "Implements a strict two-state Finite State Machine (`OPEN` / `CALCULATING`) inside `Raffle.sol`. Users enter by paying `i_entranceFee`. Chainlink Automation nodes monitor `checkUpkeep` (interval elapsed, state is `OPEN`, players > 0, balance > 0) and trigger `performUpkeep`, which locks state to `CALCULATING` and requests verifiable randomness from Chainlink VRF v2.5. `fulfillRandomWords` selects the winner via modulo, resets state before transfer, and pays the entire pot.",
    smartContracts: [
      {
        name: "Raffle.sol",
        responsibility:
          "Autonomous lottery FSM coordinating ticket entry, Chainlink Automation upkeep validation, VRF v2.5 requests, and CEI winner payouts.",
      },
      {
        name: "HelperConfig.s.sol & Interactions.s.sol",
        responsibility:
          "Network-aware Foundry deployment and Chainlink VRF subscription/funding/consumer automation scripts for local Anvil and live testnets.",
      },
    ],
    securityInvariants: [
      "Deterministic FSM lock: once `performUpkeep` transitions `s_raffleState` to `CALCULATING`, `enterRaffle()` reverts until VRF fulfillment completes, blocking front-running or mid-draw entry manipulation.",
      "Strict Checks-Effects-Interactions (CEI) in `fulfillRandomWords`: `s_raffleState`, `s_players`, and `s_lastTimeStamp` are reset BEFORE sending ETH via `.call`, neutralizing reentrancy.",
      "On-chain re-validation inside `performUpkeep`: re-calls `checkUpkeep` on-chain so unauthorized callers cannot force premature draws.",
      "Tamper-proof randomness via Chainlink VRF v2.5 cryptographic proofs verified on-chain.",
    ],
    gasOptimizations: [
      "Immutable configuration variables (`i_entranceFee`, `i_interval`, `i_gasLane`, `i_subscriptionId`, `i_callbackGasLimit`) are embedded in bytecode instead of occupying expensive `SLOAD` slots.",
      "Compact custom errors (`Raffle__SendMoreToEnterRaffle`, `Raffle__RaffleNotOpen`, `Raffle__UpkeepNotNeeded`) replace long revert strings.",
      "Resetting the dynamic players array with `new address payable[](0)` and emitting indexed events minimizes storage writes.",
    ],
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
    aliases: [
      "erc-4337 account abstraction core",
      "erc-4337 core",
      "erc 4337 core",
      "account abstraction core",
      "account abstraction foundry",
      "minimalaccount",
      "erc4337-account-abstraction-foundry",
    ],
    description:
      "Minimal smart account built directly against the canonical ERC-4337 EntryPoint with modular Paymaster gas sponsorship. Strict ECDSA UserOperation validation and EntryPoint-only execution gates isolate account funds from unauthorized callers.",
    story:
      "Standard EOAs tie key management, signature schemes, and ETH gas payments into one rigid account model. Amit built ERC-4337 Account Abstraction Core directly against the canonical `IEntryPoint` interface in Foundry to engineer minimal, auditable smart accounts and UserOperation execution pipelines from first principles.",
    architecture:
      "`MinimalAccount.sol` implements `IAccount` and interfaces directly with the singleton ERC-4337 `EntryPoint`. Off-chain bundlers submit signed `PackedUserOperation` structs to `EntryPoint`, which invokes `validateUserOp` (verifying EIP-191 ECDSA signatures and prefunding missing gas fees) before calling `execute(dest, value, functionData)`.",
    smartContracts: [
      {
        name: "MinimalAccount.sol",
        responsibility:
          "ERC-4337 `IAccount` smart wallet implementing `validateUserOp`, EntryPoint prefunding (`_payPrefund`), and gated `execute` calls.",
      },
      {
        name: "SendPackedUserOp.s.sol",
        responsibility:
          "Foundry script constructing, signing, and submitting `PackedUserOperation` structs to live or forked `EntryPoint` contracts.",
      },
    ],
    securityInvariants: [
      "Strict caller isolation: `validateUserOp` is callable ONLY by the immutable canonical `i_entryPoint`, and `execute` is gated strictly to `i_entryPoint` or `owner`.",
      "Signature verification returns canonical `SIG_VALIDATION_SUCCESS` (`0`) or `SIG_VALIDATION_FAILED` (`1`) via OpenZeppelin `ECDSA.tryRecover` without reverting on bad signatures, conforming to ERC-4337 bundler simulation rules.",
      "Replay protection is enforced via `EntryPoint`'s on-chain nonce management combined with `userOpHash` binding `chainId` and `EntryPoint` address.",
    ],
    gasOptimizations: [
      "Immutable `i_entryPoint` eliminates a 2,100-gas cold `SLOAD` on every single UserOperation validation and execution.",
      "Supports ERC-4337 v0.7 `PackedUserOperation` format, packing gas limits and fee fields into `bytes32` words to save calldata gas.",
      "Zero unnecessary proxy indirection or bloated modules keep `validateUserOp` well within strict bundler verification gas limits.",
    ],
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
    aliases: [
      "uups upgradeable protocol",
      "uups proxy core",
      "uups protocol",
      "uups-protocol-config",
      "boxv1",
      "boxv2",
    ],
    description:
      "EIP-1822 UUPS proxy framework with reproducible Foundry upgrade scripts from V1 to V2 implementations. Initializer locks, owner-gated upgrade checks, and explicit storage gaps prevent hijacking and layout corruption.",
    story:
      "Proxy upgrades are among the highest-severity failure points in smart contract engineering: an uninitialized implementation or a misaligned V2 storage variable can permanently brick a protocol or hand admin keys to an attacker. Amit built UUPS Upgradeable Protocol as a reproducible Foundry blueprint for collision-safe V1-to-V2 upgrades.",
    architecture:
      "Uses an ERC-1967 proxy delegating to EIP-1822 UUPS implementations (`BoxV1` -> `BoxV2`). Upgrade authorization lives inside the implementation (`_authorizeUpgrade`) rather than the proxy, paired with deterministic Foundry deploy (`DeployBox.s.sol`) and upgrade (`UpgradeBox.s.sol`) scripts that verify state persistence across versions.",
    smartContracts: [
      {
        name: "BoxV1.sol (UUPS Implementation V1)",
        responsibility:
          "Initial upgradeable implementation inheriting `UUPSUpgradeable`, `OwnableUpgradeable`, and `Initializable` with constructor lock.",
      },
      {
        name: "BoxV2.sol (UUPS Implementation V2)",
        responsibility:
          "Upgraded implementation preserving exact V1 storage slot ordering while safely extending functionality.",
      },
      {
        name: "DeployBox.s.sol & UpgradeBox.s.sol",
        responsibility:
          "Foundry deployment and `upgradeToAndCall` migration scripts tested end-to-end against ERC-1967 proxies.",
      },
    ],
    securityInvariants: [
      "Implementation hijacking prevention: `_disableInitializers()` runs in every implementation constructor so nobody can initialize the raw logic contract directly.",
      "Owner-gated upgrades: `_authorizeUpgrade(address newImplementation)` is protected by `onlyOwner` (or timelocked multisig).",
      "Zero storage slot drift: ERC-1967 unstructured slots isolate proxy pointers, while append-only state variables and `__gap` buffers guarantee V1 state survives V2 upgrades intact.",
    ],
    gasOptimizations: [
      "UUPS removes the admin `SLOAD` check that Transparent proxies execute on every single user call, reducing runtime gas for all protocol users.",
      "Lightweight ERC-1967 proxy bytecode minimizes deployment gas compared to TransparentUpgradeableProxy + ProxyAdmin stacks.",
    ],
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
    aliases: [
      "merkle-712 airdrop",
      "merkle 712",
      "merkle airdrop",
      "siso merkle",
      "siso-merkle-airdrop",
      "gasless claiming",
    ],
    description:
      "Gas-efficient token distribution engine combining O(log N) Merkle proof verification with relayer-sponsored gasless claiming. EIP-712 typed domain signatures and claimed-state flags close signature replay and double-claim vectors.",
    story:
      "Storing thousands of eligible airdrop recipients directly in contract mappings costs massive deployment gas, and requiring new users to hold ETH just to claim tokens creates onboarding friction. Amit built Merkle-712 Airdrop Protocol to compress the entire allowlist into a single 32-byte Merkle root while letting relayers sponsor claims via EIP-712 signatures.",
    architecture:
      "`MerkleAirdrop.sol` stores only an immutable `bytes32 i_merkleRoot` and `IERC20 i_airdropToken`. Claimants sign a human-readable EIP-712 `AirdropClaim(address account, uint256 amount)` struct; either the user or a gas-sponsoring relayer submits `(account, amount, merkleProof, v, r, s)`. The contract verifies the EIP-712 signature via `ECDSA.tryRecover`, double-hashes the leaf to prevent second-preimage attacks, verifies the proof via `MerkleProof.verify`, marks `s_hasClaimed[account] = true`, and transfers via `SafeERC20`.",
    smartContracts: [
      {
        name: "MerkleAirdrop.sol",
        responsibility:
          "EIP-712 signature verifier and O(log N) Merkle proof distributor supporting relayer-sponsored gasless claims.",
      },
      {
        name: "BagelToken / SisoToken",
        responsibility:
          "ERC-20 token distributed through the Merkle claim contract.",
      },
      {
        name: "GenerateInput.s.sol & MakeMerkle.s.sol",
        responsibility:
          "Deterministic Foundry scripts generating Merkle trees, roots, and proofs matching OpenZeppelin's double-hashed leaf encoding.",
      },
    ],
    securityInvariants: [
      "Double-claim prevention: `s_hasClaimed[account]` is checked and set to `true` strictly BEFORE `safeTransfer` (Checks-Effects-Interactions).",
      "Second-preimage resistance: leaves are double-hashed (`keccak256(bytes.concat(keccak256(abi.encode(account, amount))))`) to prevent forged internal node proofs.",
      "Cross-chain & cross-contract signature replay immunity: EIP-712 `DOMAIN_SEPARATOR` binds `chainId` and `verifyingContract`, and OpenZeppelin `ECDSA.tryRecover` blocks malleable `s` values and `address(0)`.",
    ],
    gasOptimizations: [
      "O(1) on-chain deployment storage: a single immutable 32-byte `i_merkleRoot` replaces tens of thousands of `SSTORE` writes.",
      "O(log N) proof verification reads `bytes32[] calldata merkleProof` directly from `calldata` without copying into memory.",
      "Immutable token and root variables avoid cold `SLOAD` fees on every claim.",
    ],
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
    aliases: [
      "cutecat",
      "cute cat",
      "cutecat nft",
      "erc721-advanced-ipfs-nft",
      "moodnft",
      "basicnft",
      "ipfs nft",
    ],
    description:
      "ERC-721 architecture demonstrating both content-addressed IPFS metadata and fully on-chain Base64 SVG token rendering. Deterministic Foundry deployment scripts and URI invariants verify immutability without centralized servers.",
    story:
      "Many NFT collections break or rug-pull because their `tokenURI` points to mutable Web2 servers. Amit built CuteCat NFT Protocol to compare and verify both immutable decentralized storage models: content-addressed IPFS pinning (`BasicNft`) and 100% on-chain dynamic Base64 SVG rendering (`MoodNft`).",
    architecture:
      "Includes two distinct ERC-721 contracts deployed and verified via Foundry scripts: an IPFS-backed NFT mapping `tokenId => ipfs://...` CIDs, and a dynamic on-chain SVG NFT that stores compressed SVG templates in storage/immutables, toggles token state (`flipMood`) exclusively by the owner/approved operator, and assembles `data:application/json;base64,...` metadata on the fly inside `tokenURI()`.",
    smartContracts: [
      {
        name: "BasicNft.sol",
        responsibility:
          "ERC-721 contract binding each minted `tokenId` to an immutable content-addressed IPFS URI.",
      },
      {
        name: "MoodNft.sol",
        responsibility:
          "Dynamic on-chain ERC-721 storing Base64 SVG art directly on the EVM and flipping visual state via owner-gated `flipMood`.",
      },
    ],
    securityInvariants: [
      "Access-controlled state transitions: `flipMood(tokenId)` verifies `_isAuthorized` (owner or approved operator) before mutating token state.",
      "Safe minting via `_safeMint` verifies `onERC721Received` on contract recipients so NFTs cannot be stranded inside incompatible contracts.",
      "Foundry URI tests deterministically assert exact Base64-decoded JSON/SVG payloads and zero broken metadata pointers.",
    ],
    gasOptimizations: [
      "Dynamic SVG JSON assembly runs inside `view` `tokenURI()` (zero gas for reads) rather than storing redundant full JSON strings per token.",
      "Pre-encoding static SVG strings as Base64 at deploy time avoids repeated Base64 encoding of large image buffers.",
      "Custom errors replace string reverts on unauthorized mood flips or nonexistent token queries.",
    ],
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
    aliases: [
      "siso token",
      "siso token standard",
      "siso erc-20",
      "siso erc20",
      "siso-token-erc20",
      "siso",
    ],
    description:
      "Hardened ERC-20 token primitive engineered with role-gated minting, hard supply ceilings, and emergency pause breakers. Custom errors and Foundry invariant checks enforce supply conservation on every state transition.",
    story:
      "Unbounded mint privileges and lax admin controls are frequent causes of token dilution exploits. Amit engineered SISO Token Standard as a clean, production-grade ERC-20 primitive enforcing strict RBAC roles, a hard supply cap, and automated Foundry supply-conservation tests.",
    architecture:
      "Extends OpenZeppelin ERC-20 with granular role-based access control (`MINTER_ROLE`, `PAUSER_ROLE`), an immutable hard supply cap (`MAX_SUPPLY`), burn mechanics, and emergency pause guards verified through Foundry unit and fuzz tests.",
    smartContracts: [
      {
        name: "SisoToken.sol",
        responsibility:
          "Role-gated, supply-capped, pausable ERC-20 token with custom errors and strict supply conservation invariants.",
      },
    ],
    securityInvariants: [
      "Hard supply conservation invariant: `totalSupply() <= MAX_SUPPLY` is enforced unconditionally on every mint call.",
      "Role separation: minting and emergency pausing require explicit `MINTER_ROLE` / `PAUSER_ROLE` assignments rather than a single unchecked owner key.",
      "Zero-address transfer and mint guards prevent accidental token burning or invalid allowance state.",
    ],
    gasOptimizations: [
      "Immutable `MAX_SUPPLY` embeds the supply cap in runtime bytecode instead of paying 2,100 gas for a cold `SLOAD` on each mint.",
      "Solidity 0.8+ custom errors cut deployment size and revert gas compared to string `require` messages.",
    ],
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
    aliases: [
      "oracle-pegged crowdfunding",
      "oracle fundme",
      "fundme",
      "fund me",
      "fundme-contract",
      "priceconverter",
      "crowdfunding",
    ],
    description:
      "Treasury contribution contract enforcing USD-denominated minimums through live Chainlink AggregatorV3Interface price feeds. Packed storage reads, cached memory withdrawal loops, and owner-only sweeps keep gas costs tight and safe.",
    story:
      "ETH-denominated contribution minimums fluctuate wildly with ETH/USD volatility, and naive withdrawal loops waste thousands of gas on repeated `SLOAD` array-length reads. Amit built Oracle-Pegged Crowdfunding (`FundMe`) to normalize ETH contributions via live Chainlink price feeds and demonstrate concrete Foundry gas-benchmarking techniques.",
    architecture:
      "Pairs `FundMe.sol` with `PriceConverter.sol` (library normalizing 8-decimal Chainlink `AggregatorV3Interface` ETH/USD prices into 18-decimal WAD precision). Tracks per-funder contributions and exposes `cheaperWithdraw()` which caches `s_funders.length` in memory before clearing storage and sweeping ETH to `i_owner`.",
    smartContracts: [
      {
        name: "FundMe.sol",
        responsibility:
          "ETH treasury contract enforcing $5+ USD minimum contributions via Chainlink, tracking funders, and executing gas-optimized owner withdrawals.",
      },
      {
        name: "PriceConverter.sol",
        responsibility:
          "Pure/view math library converting `msg.value` wei to USD using live Chainlink `AggregatorV3Interface` price feeds.",
      },
    ],
    securityInvariants: [
      "Owner-only treasury sweep: `withdraw` / `cheaperWithdraw` enforces `msg.sender == i_owner`, reverting with `FundMe__NotOwner` otherwise.",
      "Minimum USD threshold enforced atomically on both `fund()` and direct ETH sends via `receive()` / `fallback()`.",
      "Checks-Effects-Interactions: funder balances and the `s_funders` array are zeroed BEFORE sweeping ETH via low-level `.call{value: address(this).balance}(\"\")` with return success verification.",
    ],
    gasOptimizations: [
      "`cheaperWithdraw()` caches `s_funders.length` into a local stack variable (`uint256 fundersLength`) instead of executing a storage `SLOAD` on every loop iteration.",
      "`MINIMUM_USD` (`constant`) and `i_owner` / `s_priceFeed` (`immutable`) eliminate runtime storage reads entirely.",
      "Custom error `FundMe__NotOwner()` replaces string revert messages, saving both deploy and execution gas (benchmarked with `forge snapshot`).",
    ],
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