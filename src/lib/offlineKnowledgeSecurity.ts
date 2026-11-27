/**
 * Extended Offline Senior Web3 Knowledge Encyclopedia (Part 2):
 * - B. Real-World Historic DeFi Hack Post-Mortems (15 entries)
 * - C. Advanced Solidity Design Patterns, Gas Micro-Optimizations & EVM Internals (20 entries)
 * - F. Foundry Mastery, Auditing Process & Senior Web3 Interview Q&A (20 entries)
 *
 * Pure static data module consumed by `localAgentFallback.ts`.
 */

import type { KnowledgeEntry } from "./offlineKnowledgeBase";

export const WEB3_KNOWLEDGE_SECURITY: readonly KnowledgeEntry[] = [
  // =========================================================================
  // B. REAL-WORLD HISTORIC DEFI HACK POST-MORTEMS (15 ENTRIES)
  // =========================================================================
  {
    id: "hack-the-dao",
    category: "security",
    exactCompact: ["thedao", "daohack"],
    exactPhrases: [
      "the dao hack",
      "the dao",
      "dao hack",
      "2016 dao hack",
      "ethereum classic fork",
    ],
    keywords: ["reentrancy", "splitdao", "withdrawrewardfor", "60m"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: The DAO (2016, ~$60M)",
        "The most famous smart contract exploit in Ethereum history drained ~3.6M ETH (~14% of circulating ETH at the time) and triggered the Ethereum / Ethereum Classic hardfork.",
        "",
        "- **Root Cause (Classic Recursive Reentrancy):** `splitDAO()` sent ETH to `msg.sender` via a raw `.call.value()` *before* setting the user's internal balance to zero. The attacker's malicious fallback function recursively re-entered `splitDAO()` dozens of times in one transaction.",
        "- **Permanent Defense:** Enforce strict **Checks-Effects-Interactions (CEI)** (zero balances before any external call) plus a `ReentrancyGuard` (or `EIP-1153` transient lock) across all state-mutating external entrypoints.",
      ].join("\n"),
  },
  {
    id: "hack-parity-multisig",
    category: "security",
    exactCompact: ["paritymultisig", "parityhack"],
    exactPhrases: [
      "parity multisig",
      "parity hack",
      "parity wallet hack",
      "initwallet",
      "library selfdestruct",
    ],
    keywords: ["delegatecall", "selfdestruct", "280m", "frozen eth"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Parity Multi-Sig (2017, ~$30M Stolen + ~$280M Frozen)",
        "Parity suffered two back-to-back catastrophic failures rooted in unprotected library initialization and `delegatecall`:",
        "",
        "- **Hack 1 (Unprotected `initWallet` via Fallback `delegatecall`):** Every Parity wallet proxy forwarded unknown selectors via `delegatecall` to `WalletLibrary`, allowing an attacker to call `initWallet()` on live wallets and overwrite the owner list.",
        "- **Hack 2 (Library `selfdestruct`):** After patching wallets, the shared `WalletLibrary` contract itself was left uninitialized. A user called `initWallet()` directly on the library, became its owner, and invoked `kill()` (`selfdestruct`), permanently freezing ~513,000 ETH across 587 dependent wallets.",
        "- **Permanent Defense:** Always invoke `_disableInitializers()` in proxy implementation constructors, never place `selfdestruct` inside shared logic libraries, and restrict `delegatecall` targets strictly.",
      ].join("\n"),
  },
  {
    id: "hack-ronin-bridge",
    category: "security",
    exactCompact: ["roninbridge", "roninhack"],
    exactPhrases: [
      "ronin bridge",
      "ronin hack",
      "ronin exploit",
      "axie infinity hack",
    ],
    keywords: ["validator keys", "5 of 9", "625m", "multisig compromise"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Ronin Bridge (2022, ~$625M)",
        "The largest single DeFi theft by value drained 173,600 ETH and 25.5M USDC without a single Solidity bug:",
        "",
        "- **Root Cause (Operational Key Compromise + Stale Allowlist):** Ronin relied on a 5-of-9 validator multisig. Attackers socially engineered an engineer to steal 4 Sky Mavis validator keys and gained the 5th signature via a forgotten Axie DAO RPC allowlist that had never been revoked after a temporary traffic spike.",
        "- **Permanent Defense:** Never rely on small centralized multisig quorums for massive bridge lockboxes; enforce **automated rate limits / TVL circuit breakers**, anomaly-halting monitoring (like Chainlink CCIP's RMN), strict key rotation, and zero-trust revocation of temporary permissions.",
      ].join("\n"),
  },
  {
    id: "hack-wormhole",
    category: "security",
    exactCompact: ["wormholehack", "wormholeexploit"],
    exactPhrases: [
      "wormhole hack",
      "wormhole exploit",
      "wormhole bridge hack",
      "sysvar spoofing",
    ],
    keywords: ["signature bypass", "120000 weth", "325m", "solana"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Wormhole Bridge (2022, ~$325M)",
        "An attacker minted 120,000 unbacked `wETH` on Solana and bridged ~93,750 ETH back to Ethereum:",
        "",
        "- **Root Cause (Deprecated Account Verification Bypass):** Wormhole's Solana contract used a deprecated `load_instruction_at` call that did not verify the supplied `Sysvar` account address actually matched Solana's real `Instructions` sysvar. The attacker passed a fake account holding crafted signature-verification data, bypassing Guardian validation completely.",
        "- **Permanent Defense:** Always validate canonical system/precompile addresses explicitly, pair cross-chain minting with strict **invariant accounting and outbound rate-limit circuit breakers**, and audit every upgrade diff before deployment.",
      ].join("\n"),
  },
  {
    id: "hack-nomad-bridge",
    category: "security",
    exactCompact: ["nomadbridge", "nomadhack", "nomadexploit"],
    exactPhrases: [
      "nomad bridge",
      "nomad hack",
      "nomad exploit",
      "zero root bug",
      "acceptable root",
    ],
    keywords: ["0x00", "upgrade initialization", "190m", "copy paste drain"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Nomad Bridge (2022, ~$190M)",
        "Nomad suffered the first 'crowd-sourced' DeFi drain where hundreds of copycat users simply replaced the recipient address in the original exploit calldata:",
        "",
        "- **Root Cause (Zero-Root Upgrade Initialization Bug):** During a routine contract upgrade, `Replica.initialize()` set `confirmAt[0x00] = 1`, inadvertently marking the zero hash `bytes32(0)` as a pre-proven **acceptable Merkle root**. Because unmapped messages default to `messages[hash] == bytes32(0)` in EVM storage, `acceptableRoot(messages[hash])` returned `true` for ANY fabricated withdrawal message!",
        "- **Permanent Defense:** Never treat Solidity's default zero value (`0x00` / `0`) as an authorized or initialized state; explicitly reject `bytes32(0)` roots and run Foundry fork tests against live upgrade scripts before signing.",
      ].join("\n"),
  },
  {
    id: "hack-euler-finance",
    category: "security",
    exactCompact: ["eulerfinance", "eulerhack", "donatetoreserves"],
    exactPhrases: [
      "euler finance",
      "euler hack",
      "euler exploit",
      "donatetoreserves",
      "donate to reserves",
    ],
    keywords: ["health check", "self liquidation", "197m", "flash loan"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Euler Finance (2023, ~$197M)",
        "An attacker used a flash loan to create a massive leveraged position, voluntarily made themselves deeply insolvent, and liquidated themselves for a huge discount:",
        "",
        "- **Root Cause (Missing Health Check on `donateToReserves`):** Euler added a `donateToReserves()` helper that burned a user's collateral `eTokens` without burning their `dToken` debt AND omitted the mandatory `checkLiquidity` solvency check. The attacker levered up 10x with a flash loan, donated their collateral away to push their own health factor far below 1, and immediately self-liquidated with a second account at Euler's generous ~20% liquidation discount.",
        "- **Permanent Defense:** Every single state transition that reduces user collateral MUST run the protocol's global solvency invariant check (`FREI-PI`), and handler-based **Foundry stateful invariant tests** must fuzz multi-function call sequences including self-liquidation.",
      ].join("\n"),
  },
  {
    id: "hack-curve-vyper",
    category: "security",
    exactCompact: ["curvevyper", "vyperhack", "vyperbug"],
    exactPhrases: [
      "curve vyper",
      "vyper hack",
      "vyper reentrancy",
      "curve hack",
      "vyper compiler bug",
    ],
    keywords: ["nonreentrant", "0.2.15", "0.3.0", "70m", "cross function reentrancy"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Curve / Vyper Compiler Reentrancy Bug (2023, ~$70M)",
        "Several high-TVL Curve pools (`pETH`, `msETH`, `alETH`, `CRV/ETH`) were drained despite having `@nonreentrant('lock')` decorators on every critical function:",
        "",
        "- **Root Cause (Compiler Lock-Slot Allocation Bug):** Vyper versions `0.2.15`, `0.2.16`, and `0.3.0` erroneously allocated a *separate storage slot* per function for `@nonreentrant` locks instead of sharing one unified slot across the contract. Attackers re-entered `add_liquidity()` during the ETH refund callback inside `remove_liquidity()`, minting inflated LP tokens against stale balances.",
        "- **Permanent Defense:** Follow **Checks-Effects-Interactions (CEI)** even when reentrancy guards are present (defense in depth), verify compiled bytecode storage slots, and never assume compiler modifiers replace sound state-update ordering.",
      ].join("\n"),
  },
  {
    id: "hack-mango-markets",
    category: "security",
    exactCompact: ["mangomarkets", "mangohack"],
    exactPhrases: [
      "mango markets",
      "mango markets hack",
      "mango exploit",
      "avraham eisenberg",
    ],
    keywords: ["oracle manipulation", "thin liquidity", "114m", "spot price"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Mango Markets (2022, ~$114M)",
        "Mango Markets lost its entire treasury through pure economic **oracle & thin-liquidity manipulation** rather than a memory or logic bug:",
        "",
        "- **Root Cause (Thin Spot Oracle + Uncapped Borrowing):** The attacker opened massive offsetting long/short `MNGO-PERP` positions across two accounts, then pumped thin spot markets for `MNGO` by >1,000% in minutes. Because Mango priced unrealized perp PnL directly off spot oracles without borrow caps or liquidity-adjusted haircuts, the attacker borrowed $114M of real USDC/SOL against illusory paper PnL and walked away.",
        "- **Permanent Defense:** Enforce strict **per-asset borrow caps**, disallow illiquid governance tokens as collateral, apply TWAP/medianized oracle deviation circuit breakers, and cap unrealized PnL borrowability.",
      ].join("\n"),
  },
  {
    id: "hack-beanstalk",
    category: "security",
    exactCompact: ["beanstalk", "beanstalkhack", "emergencycommit"],
    exactPhrases: [
      "beanstalk",
      "beanstalk hack",
      "beanstalk exploit",
      "flash loan governance",
      "governance takeover",
    ],
    keywords: ["182m", "bip18", "timelock", "prior block snapshot"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Beanstalk ($182M Flash-Loan Governance Takeover) vs. Amit's `ClaimsGovernor.sol`",
        "In April 2022, an attacker stole ~$182M from Beanstalk Farms in a single Ethereum transaction:",
        "",
        "- **Root Cause:** Beanstalk allowed instantaneous voting power from current-block token balances and included an `emergencyCommit()` function that executed a passing proposal immediately once a 67% supermajority voted. The attacker submitted a malicious proposal (`BIP-18`), waited one day, flash-loaned $1B in assets from Aave/Uniswap, acquired >79% voting power, voted YES, called `emergencyCommit()`, drained the treasury, and repaid the flash loan in one block.",
        "- **Direct Contrast with Amit's `ClaimsGovernor.sol` (`Sentinel Insurance` & `Sentinel DAO`):** Amit eliminates this entire exploit class at design time by anchoring voting power strictly to **prior-block ERC20Votes checkpoints (`block.number - 1`)** AND enforcing a mandatory **`TimelockController` execution delay** so flash-loaned tokens carry zero voting weight and stakeholders always have an exit window.",
      ].join("\n"),
  },
  {
    id: "hack-kyberswap-elastic",
    category: "security",
    exactCompact: ["kyberswap", "kyberswaphack", "kyberelastic"],
    exactPhrases: [
      "kyberswap",
      "kyberswap elastic",
      "kyberswap hack",
      "tick rounding exploit",
    ],
    keywords: ["concentrated liquidity", "precision rounding", "48m", "double liquidity"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: KyberSwap Elastic (2023, ~$48M)",
        "One of the most mathematically sophisticated DeFi exploits ever executed drained ~$48M across 6 chains from KyberSwap's concentrated-liquidity AMM:",
        "",
        "- **Root Cause (Tick-Boundary Rounding & Double-Counted Liquidity):** Inside `computeSwapStep`, an edge-case rounding error pushed the pool's `sqrtP` *just* past a tick boundary without triggering the tick-crossing branch. When the attacker swapped slightly in reverse across the same boundary, the pool applied the tick's `liquidityNet` a **second time** in the same direction, manufacturing phantom virtual liquidity out of thin air and draining real reserves.",
        "- **Permanent Defense:** Use exact round-in-favor-of-pool inequalities (`>=` vs `>`), formally verify fixed-point boundary invariants (`sqrtP` monotonicity & conservation of `liquidityNet`), and run differential Foundry fuzzing against reference Python/arbitrary-precision models.",
      ].join("\n"),
  },
  {
    id: "hack-radiant-bybit-safe",
    category: "security",
    exactCompact: ["radiantcapital", "bybithack", "blindsiging"],
    exactPhrases: [
      "radiant capital",
      "radiant hack",
      "bybit hack",
      "bybit safe",
      "blind signing",
      "frontend supply chain",
    ],
    keywords: ["safe ui spoofing", "hardware wallet", "delegatecall", "1.4b"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Radiant Capital (2024, ~$50M) & Bybit Safe (2025, ~$1.4B)",
        "Both catastrophic losses proved that even audited Solidity + Safe Multisig + Hardware Wallets fail when signers blindly trust a compromised UI:",
        "",
        "- **Root Cause (Frontend Supply Chain + Blind Signing):** Attackers compromised developer devices / Safe UI JavaScript to display a benign routine transfer on screen while secretly swapping the EIP-712 payload sent to hardware signers into a malicious `delegatecall` / `transferOwnership` upgrade.",
        "- **Permanent Defense:** Never blind-sign raw hashes! Independently reconstruct and verify Safe `domainHash` and `messageHash` via an air-gapped CLI (`safe-tx-hashes-util` / Foundry `cast`), enforce **Timelock delays** with automated on-chain Tenderly/Forta alerts, and keep protocol cores minimally upgradeable.",
      ].join("\n"),
  },
  {
    id: "hack-balancer-readonly",
    category: "security",
    exactCompact: ["readonlyreentrancy", "balancerhack", "getrate"],
    exactPhrases: [
      "read only reentrancy",
      "read-only reentrancy",
      "balancer reentrancy",
      "getrate reentrancy",
      "stale view function",
    ],
    keywords: ["view function", "virtual price", "nonreentrant", "cross protocol"],
    answer: () =>
      [
        "### Historic Attack Vector: Read-Only Reentrancy (Balancer & Curve Pools)",
        "**Read-Only Reentrancy** occurs when Protocol A has a `nonReentrant` lock protecting its own state-changing functions, yet exposes an unguarded `view` function (like `getRate()` or `get_virtual_price()`) that returns a **temporarily distorted value** mid-execution:",
        "",
        "- **How the Exploit Works:** During an ETH withdrawal callback from Protocol A, the attacker calls into **Protocol B** (a lending market using Protocol A's LP token as collateral). Protocol B calls Protocol A's `view` oracle (`getRate()`), sees a massively inflated LP price before Protocol A finishes updating its total supply, and lets the attacker borrow way more than their collateral is worth.",
        "- **Permanent Defense:** Protocol B must verify Protocol A's reentrancy lock before trusting its `view` price (e.g., Balancer's `VaultReentrancyLib.ensureNotInVaultContext()` or Curve's `claim_admin_fees` lock check), or rely on TWAP / Chainlink feeds.",
      ].join("\n"),
  },
  {
    id: "hack-poly-network",
    category: "security",
    exactCompact: ["polynetwork", "polyhack"],
    exactPhrases: [
      "poly network",
      "poly network hack",
      "poly exploit",
      "ethcrosschainmanager",
    ],
    keywords: ["611m", "arbitrary call", "selector collision", "keeper pubkey"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Poly Network (2021, ~$611M)",
        "An attacker hijacked Poly Network's cross-chain keeper registry across Ethereum, BSC, and Polygon in one of the largest hacks in history:",
        "",
        "- **Root Cause (Privileged Arbitrary External Call + 4-Byte Selector Grinding):** `EthCrossChainManager` held ownership over `EthCrossChainData` (which stored the trusted keeper public keys) and executed arbitrary cross-chain target calls using `bytes4(keccak256(abi.encodePacked(method, \"(bytes,bytes,uint64)\")))`. The attacker brute-forced a function name whose 4-byte selector collided with `putCurEpochConPubKeyBytes(bytes)` (`0x41973cd9`), tricking the manager into calling its own data contract and replacing all keeper keys with the attacker's key.",
        "- **Permanent Defense:** Never let a generic cross-chain relayer hold privileged admin ownership over its own verification registry, strictly allowlist target contracts + selectors, and enforce separation of concerns.",
      ].join("\n"),
  },
  {
    id: "hack-cream-erc777",
    category: "security",
    exactCompact: ["creamfinance", "erc777reentrancy", "ampreentrancy"],
    exactPhrases: [
      "cream finance",
      "cream hack",
      "erc 777 reentrancy",
      "erc777 reentrancy",
      "token hook reentrancy",
    ],
    keywords: ["tokensreceived", "borrow reentrancy", "130m", "amp"],
    answer: () =>
      [
        "### Historic Hack Post-Mortem: Cream Finance & ERC-777 Callback Reentrancy ($18M / $130M)",
        "Integrating tokens with transfer hooks (`ERC-777` `tokensToSend`/`tokensReceived`, `ERC-677`, `ERC-1363`, or `ERC-721` `safeTransferFrom`) introduces hidden reentrancy inside innocent-looking token transfers:",
        "",
        "- **Root Cause:** Cream forked Compound V2 without reentrancy guards on `borrow()` when listing `AMP` (an ERC-777-like hook token). During the token transfer callback, the attacker re-entered `borrow()` before their debt updated, draining reserves twice against the same collateral.",
        "- **Permanent Defense:** Always treat every external token transfer as an untrusted external call: update all internal accounting first (CEI) AND protect cross-function entrypoints with a shared `ReentrancyGuard`.",
      ].join("\n"),
  },
  {
    id: "hack-uninitialized-proxy",
    category: "security",
    exactCompact: ["uninitializedproxy", "audiushack"],
    exactPhrases: [
      "uninitialized implementation",
      "uninitialized proxy",
      "audius hack",
      "proxy initialization bug",
    ],
    keywords: ["disableinitializers", "initialize", "storage collision", "uups"],
    answer: () =>
      [
        "### Historic Attack Vector: Uninitialized Proxy Implementations & Re-Initialization (Audius / Wormhole Proxy)",
        "Upgradeable proxies use `initialize()` instead of constructors, creating two recurring critical bugs:",
        "",
        "- **1. Uninitialized Implementation Takeover:** Leaving an implementation contract uninitialized lets an attacker call `initialize()` directly on the implementation, become its owner, and trigger a `delegatecall` / `upgradeToAndCall` payload (which on UUPS used to allow `selfdestruct` bricking).",
        "- **2. Storage-Slot Masking / Re-Initialization (Audius $6M):** A storage layout collision between the proxy's `proxyAdmin` slot and the implementation's `initialized` boolean caused `initialize()` to see `initialized == false`, letting an attacker re-initialize governance and pass a malicious proposal.",
        "- **Permanent Defense:** Call `_disableInitializers()` in every implementation `constructor()`, anchor proxy slots via **ERC-1967**, and verify layouts via `forge inspect storage-layout` in CI.",
      ].join("\n"),
  },

  // =========================================================================
  // C. ADVANCED SOLIDITY PATTERNS, GAS MICRO-OPT & EVM INTERNALS (20 ENTRIES)
  // =========================================================================
  {
    id: "pattern-eip-1167-clones",
    category: "standard",
    standardNumbers: ["1167", "erc1167", "eip1167"],
    exactCompact: ["eip1167", "erc1167", "1167", "minimalproxy", "clones"],
    exactPhrases: [
      "eip 1167",
      "eip1167",
      "erc 1167",
      "minimal proxy",
      "minimal proxy clones",
      "clones library",
    ],
    keywords: ["45 bytes", "clonedeterministic", "factory gas", "delegatecall"],
    answer: () =>
      [
        "### EIP-1167: Minimal Proxy Clones (45-Byte Factory Pattern)",
        "**EIP-1167** deploys ultra-cheap, immutable contract instances whose entire runtime bytecode is just **45 bytes**, forwarding every call via `delegatecall` to one pre-deployed master implementation:",
        "",
        "- **~90% Deployment Gas Savings:** Deploying a full 15KB vault costs >2M gas, whereas `Clones.clone(impl)` or `Clones.cloneDeterministic(impl, salt)` (via `CREATE2`) costs only **~41,000-45,000 gas**.",
        "- **When to Use:** Ideal for factories deploying thousands of identical vaults, escrow contracts, pair pools, or ERC-6551 Token Bound Accounts that do NOT need individual upgrades.",
        "- **Critical Rule:** Master implementations cannot rely on `constructor` storage; initialize every clone atomically inside the factory's deployment transaction.",
      ].join("\n"),
  },
  {
    id: "pattern-beacon-proxy",
    category: "evm",
    exactCompact: ["beaconproxy", "upgradeablebeacon"],
    exactPhrases: [
      "beacon proxy",
      "upgradeable beacon",
      "beacon proxy pattern",
    ],
    keywords: ["fleet upgrade", "erc1967", "implementation lookup"],
    answer: () =>
      [
        "### Beacon Proxy Pattern (Atomic Fleet Upgrades)",
        "When a factory deploys hundreds of upgradeable vaults or user accounts, upgrading each proxy individually via UUPS is expensive and error-prone.",
        "",
        "- **How It Works:** Every `BeaconProxy` stores the address of a single shared `UpgradeableBeacon` (at the ERC-1967 beacon slot). On every call, the proxy makes a cheap `STATICCALL` to `beacon.implementation()` and `delegatecall`s the returned logic address.",
        "- **Tradeoff:** Upgrading one `UpgradeableBeacon` atomically upgrades every instance in a single transaction, at the cost of one extra `STATICCALL` (~100 warm / 2,600 cold gas) per user interaction.",
      ].join("\n"),
  },
  {
    id: "pattern-diamond-vs-uups",
    category: "evm",
    exactCompact: ["diamondvsuups", "uupsvsdiamond"],
    exactPhrases: [
      "diamond vs uups",
      "uups vs diamond",
      "erc 2535 vs uups",
      "eip 2535 vs eip 1822",
    ],
    keywords: ["facet", "24kb limit", "proxy tradeoff", "upgradeability"],
    answer: () =>
      [
        "### Architectural Tradeoff: Diamond (`ERC-2535`) vs. UUPS (`EIP-1822`)",
        "Choosing between UUPS and Diamond proxies depends on contract size and upgrade granularity:",
        "",
        "- **Choose UUPS (`EIP-1822`) when:** Your contract fits cleanly under the 24KB EIP-170 limit, you want minimal call-routing overhead, simpler auditability, standard Etherscan verification, and clean ERC-7201 / storage-gap layouts (used in Amit's **UUPS Upgradeable Protocol** and **RST Reputation**).",
        "- **Choose Diamond (`ERC-2535`) when:** A monolithic protocol (like a multi-module perps DEX or lending suite) genuinely exceeds 24KB while requiring shared state across modules, and you need surgical per-facet selector upgrades.",
        "- **Audit Warning:** Diamonds add selector-collision, facet-routing, and shared-AppStorage complexity; never reach for ERC-2535 unless you truly outgrow modular UUPS contracts.",
      ].join("\n"),
  },
  {
    id: "pattern-pull-over-push",
    category: "security",
    exactCompact: ["pulloverpush", "pushvspull"],
    exactPhrases: [
      "pull over push",
      "pull-over-push",
      "push vs pull",
      "withdrawal pattern",
      "griefing dos",
    ],
    keywords: ["claimable", "revert dos", "batch payout", "merkle claim"],
    answer: () =>
      [
        "### Pull-over-Push Payment Pattern (Stopping Batch Payout DoS)",
        "Never loop through an array of recipients pushing ETH or ERC-20 tokens inside a single settlement transaction:",
        "",
        "- **Why Push Fails:** A single malicious recipient contract whose `receive()` reverts (or burns all forwarded gas), or a blocklisted USDC address, permanently bricks payouts for every honest user in the loop.",
        "- **Pull Solution:** Record each recipient's entitlement in a mapping (or publish an O(1) Merkle root as Amit does in **Nexus RWA** yield distribution and **Siso Merkle Airdrop**) and let each user call `claim()` / `withdraw()` in their own isolated transaction.",
      ].join("\n"),
  },
  {
    id: "pattern-commit-reveal",
    category: "security",
    exactCompact: ["commitreveal"],
    exactPhrases: [
      "commit reveal",
      "commit-reveal",
      "commit reveal scheme",
      "frontrun resistant auction",
    ],
    keywords: ["salt", "keccak256", "sealed bid", "mempool privacy"],
    answer: () =>
      [
        "### Commit-Reveal Scheme (Defeating Mempool Front-Running)",
        "When users submit answers, ENS domain registrations, sealed-bid auctions, or governance votes on a public mempool, bots can copy profitable calldata and front-run them:",
        "",
        "- **Phase 1 (Commit):** User submits `commitHash = keccak256(abi.encode(msg.sender, choice, secretSalt))` (binding `msg.sender` stops copycats from stealing the commit hash!).",
        "- **Phase 2 (Reveal):** After a minimum block delay (so the commit is finalized), the user reveals `(choice, secretSalt)`. The contract verifies the hash and executes.",
        "- **Caveat:** For fairness against selective non-reveal griefing (e.g., last-revealer bias in randomness), require slashing deposits on unrevealed commits or use **Chainlink VRF v2.5** instead.",
      ].join("\n"),
  },
  {
    id: "pattern-merkle-bitmaps",
    category: "evm",
    exactCompact: ["bitmaps", "merklebitmap", "bitmapssol"],
    exactPhrases: [
      "bitmaps",
      "bitmap",
      "bitmaps.sol",
      "merkle bitmap",
      "packed booleans",
    ],
    keywords: ["256 bits", "sstore savings", "airdrop claim", "bitwise"],
    answer: () =>
      [
        "### Merkle Trees & `BitMaps.sol` (256 Claims in One Storage Slot)",
        "Tracking claimed airdrop or reward indices with `mapping(uint256 => bool)` wastes a full 20,000-gas zero-to-nonzero `SSTORE` for every single claimant:",
        "",
        "- **BitMap Compression:** OpenZeppelin's `BitMaps.sol` packs **256 boolean flags** into a single `uint256` word (`bucket = index >> 8`, `mask = 1 << (index & 0xff)`). Only the first claimant in each 256-user bucket pays 20,000 gas; the next 255 claimants pay only **2,900 gas** for a warm nonzero-to-nonzero `SSTORE`!",
        "- **Paired with Merkle Proofs:** Gives O(1) contract deployment cost for 100,000+ eligible addresses with minimal claim gas.",
      ].join("\n"),
  },
  {
    id: "pattern-signature-allowlists",
    category: "security",
    exactCompact: ["signatureallowlist", "merkleallowlist"],
    exactPhrases: [
      "signature allowlist",
      "signature allowlists",
      "merkle vs signature",
      "allowlist pattern",
    ],
    keywords: ["eip712", "ecdsa", "revocation", "whitelist"],
    answer: () =>
      [
        "### Signature Allowlists vs. Merkle Roots (Tradeoffs)",
        "Two gas-efficient ways to gate mints, claims, or private vault deposits without storing giant on-chain whitelists:",
        "",
        "- **Merkle Proof Allowlist:** Fully decentralized and immutable once the root is published; costs `~O(log N)` calldata + `keccak256` per claim. Best for static snapshots.",
        "- **EIP-712 Signature Allowlist:** A backend signer issues short-lived signed vouchers `(user, quota, nonce, deadline)`. Zero on-chain root updates when adding users dynamically, cheaper calldata (64-65 bytes), and easy revocation via expiry or nonce bumps; requires protecting the signer key in an HSM/KMS.",
      ].join("\n"),
  },
  {
    id: "pattern-circuit-breakers",
    category: "security",
    exactCompact: ["circuitbreaker", "ratelimiter", "tvlcap"],
    exactPhrases: [
      "circuit breaker",
      "circuit breakers",
      "rate limiter",
      "rate limiters",
      "outflow cap",
      "erc 7265",
    ],
    keywords: ["nav deviation", "withdrawal limit", "anomaly halt", "blast radius"],
    answer: () =>
      [
        "### Circuit Breakers & Rate Limiters (Containing Exploit Blast Radius)",
        "Even heavily audited protocols install deterministic on-chain **circuit breakers** so a zero-day exploit or broken oracle cannot drain 100% of TVL in one block:",
        "",
        "- **Rolling Outflow Rate Limiters (ERC-7265 style):** Cap net asset outflows per rolling window (e.g., max 15% of vault TVL per hour). If triggered, excess withdrawals enter a cooldown queue for multisig/governance review.",
        "- **Oracle Deviation Halts:** Compare incoming Chainlink/Pyth prices against the prior checkpoint and automatically halt mint/redeem if the move exceeds sanity bounds.",
        "- **In Amit's Portfolio:** **Nexus RWA Protocol** enforces an automated **15% 24-hour Chainlink NAV deviation circuit breaker** directly inside `ComplianceHook.sol`.",
      ].join("\n"),
  },
  {
    id: "pattern-pause-vs-immutable",
    category: "security",
    exactCompact: ["emergencypause", "hyperstructure", "pausable"],
    exactPhrases: [
      "emergency pause",
      "pause vs immutable",
      "pausable",
      "immutable governance",
      "hyperstructure",
    ],
    keywords: ["guardian", "unpause", "timelock", "censorship resistance"],
    answer: () =>
      [
        "### Emergency Pause Guardians vs. Immutable Hyperstructures",
        "A core DeFi architecture decision is how much emergency control to retain after mainnet launch:",
        "",
        "- **Asymmetric Pause Guardian:** Grant a fast security multisig (or automated Forta/Hypernative bot) **pause-only** power (`PAUSER_ROLE`) to freeze minting/borrowing during an active exploit, while requiring a **48h DAO Timelock** to upgrade or unpause — and NEVER allow pausing user debt repayment or emergency withdrawals unless strictly required.",
        "- **Immutable Core (Uniswap V2/V3, Morpho Blue):** Zero admin keys and zero pause switches maximize institutional censorship resistance, but demand exhaustive formal verification and isolated risk boundaries because bugs cannot be patched.",
      ].join("\n"),
  },
  {
    id: "pattern-cei-frei-pi",
    category: "security",
    exactCompact: ["freipi", "ceipattern"],
    exactPhrases: [
      "frei pi",
      "frei-pi",
      "cei and frei pi",
      "checks effects interactions",
      "protocol invariants",
    ],
    keywords: ["nascent", "solvency invariant", "post condition", "reentrancy"],
    answer: () =>
      [
        "### CEI & FREI-PI (Function Requirements, Effects, Interactions, Protocol Invariants)",
        "Senior DeFi architects extend classic **CEI (Checks-Effects-Interactions)** into Nascent's **FREI-PI** framework:",
        "",
        "- **F (Function Requirements):** Validate inputs, caller roles, deadlines, and oracle freshness.",
        "- **R / E (Effects):** Apply all internal storage updates (balances, debt, shares) cleanly.",
        "- **I (Interactions):** Perform untrusted external token transfers, hooks, or flash-loan callbacks.",
        "- **PI (Protocol Invariants):** Enforce critical post-conditions *at the very end of the function* (e.g., `assert(healthFactor >= MIN_HF)` or `balanceAfter >= balanceBefore + fee`). Had Euler Finance applied FREI-PI to `donateToReserves()`, the $197M exploit would have reverted immediately.",
      ].join("\n"),
  },
  {
    id: "evm-memory-layout",
    category: "evm",
    exactCompact: ["evmmemory", "freememorypointer", "scratchspace"],
    exactPhrases: [
      "evm memory layout",
      "memory layout",
      "free memory pointer",
      "0x40",
      "0x60",
      "scratch space",
    ],
    keywords: ["0x00", "0x80", "mload", "mstore", "dirty bits"],
    answer: () =>
      [
        "### EVM Memory Layout (`0x00`, `0x40`, `0x60`, `0x80`)",
        "Solidity reserves the first 128 bytes (`0x00` to `0x7f`) of linear EVM memory with strict conventions every Yul engineer must obey:",
        "",
        "- **`0x00` - `0x3f` (64 bytes Scratch Space):** Free temporary workspace for inline hashing (`keccak256(0x00, 0x40)`) or 4-byte custom error reverts without advancing the free memory pointer.",
        "- **`0x40` - `0x5f` (Free Memory Pointer):** Holds the next unallocated byte offset (initialized to `0x80`). Any assembly allocating persistent memory must update `mstore(0x40, newPtr)`.",
        "- **`0x60` - `0x7f` (Zero Slot):** Permanent 32-byte zero word pointed to by empty dynamic memory arrays/bytes. **NEVER write non-zero bytes to `0x60`**, or empty arrays across your contract corrupt silently!",
      ].join("\n"),
  },
  {
    id: "evm-memory-expansion",
    category: "evm",
    exactCompact: ["memoryexpansion", "quadraticmemory"],
    exactPhrases: [
      "memory expansion",
      "quadratic memory",
      "memory expansion gas",
      "evm memory cost",
    ],
    keywords: ["w squared", "512", "oog", "mload", "mstore"],
    answer: () =>
      [
        "### EVM Quadratic Memory Expansion Gas",
        "EVM memory is priced by the highest 32-byte word index `w` touched during a call frame:",
        "",
        "- **Formula:** `memory_cost(w) = 3 * w + floor(w^2 / 512)`. For small allocations (<1 KB), memory feels nearly free (~3 gas/word). At huge offsets (e.g., copying megabytes of return data or writing to an unchecked user-controlled offset), the quadratic `w^2 / 512` term explodes gas cost into an instant Out-of-Gas (`OOG`) revert.",
        "- **Optimization Rule:** Reuse `0x00` scratch space in Yul, keep arrays in `calldata`, and never allocate unbounded arrays in memory.",
      ].join("\n"),
  },
  {
    id: "evm-returnbomb",
    category: "security",
    exactCompact: ["returnbomb", "returndatacopy", "excessivelysafecall"],
    exactPhrases: [
      "returnbomb",
      "return bomb",
      "returndatacopy",
      "excessivelysafecall",
    ],
    keywords: ["memory expansion", "low level call", "relayer dos", "gas griefing"],
    answer: () =>
      [
        "### `returndatacopy` & Returnbomb Attacks",
        "Even when you cap forwarded gas on a Solidity low-level call (`target.call{gas: 50000}(data)`), Solidity automatically copies **100% of the callee's return data into caller memory** after the call returns!",
        "",
        "- **The Attack:** A malicious callee uses cheap memory/revert-return tricks to return megabytes of zero bytes. Even if the callee fails inside its 50k gas stipend, the **caller** pays the catastrophic quadratic memory expansion gas to copy `returndatasize()`, causing the caller (e.g., a relayer, keeper, or cross-chain executor) to run Out-of-Gas and revert.",
        "- **Defense:** Drop to inline assembly `call(gas, target, value, inPtr, inSize, 0, 0)` (ignoring return data) or use Nomad/Solady's **`ExcessivelySafeCall`**, which caps `returndatacopy` at a fixed max byte length (e.g., 256 bytes).",
      ].join("\n"),
  },
  {
    id: "evm-extcodesize-bypass",
    category: "security",
    exactCompact: ["extcodesize", "iscontract"],
    exactPhrases: [
      "extcodesize",
      "extcodesize bypass",
      "constructor bypass",
      "iscontract",
      "eoa check",
    ],
    keywords: ["constructor", "eip7702", "codesize", "contract check"],
    answer: () =>
      [
        "### Why `extcodesize == 0` (and `tx.origin == msg.sender`) Fail as EOA Checks",
        "Protocols historically tried to block smart-contract attackers or flash loans with `require(msg.sender.code.length == 0)`. That check is completely broken for **two** reasons:",
        "",
        "- **1. Constructor Bypass:** During a contract's `constructor()`, its runtime bytecode has not yet been deployed to state, so `extcodesize(address(this))` returns **`0`** while the constructor executes arbitrary calls against your protocol!",
        "- **2. EIP-7702 Smart EOAs (Pectra):** Even `tx.origin == msg.sender` no longer guarantees a simple non-programmable EOA, because an EOA can delegate smart-contract code (`0xef0100 || impl`) and execute batched flash loans directly.",
        "- **Senior Takeaway:** Design economic invariants (like prior-block snapshots and commit-reveal) that stay safe regardless of whether the caller is an EOA or contract.",
      ].join("\n"),
  },
  {
    id: "evm-tx-origin-phishing",
    category: "security",
    exactCompact: ["txorigin", "txoriginphishing"],
    exactPhrases: [
      "tx.origin",
      "tx origin",
      "tx.origin phishing",
      "tx origin phishing",
    ],
    keywords: ["authorization", "msg.sender", "phishing contract"],
    answer: () =>
      [
        "### `tx.origin` Phishing Attacks",
        "`tx.origin` always returns the original external account that signed the transaction, whereas `msg.sender` returns the immediate caller of the current frame:",
        "",
        "- **How the Attack Works:** If a wallet/vault authorizes withdrawals via `require(tx.origin == owner)`, an attacker tricks the owner into claiming a fake airdrop on a malicious contract. Inside `claim()`, the malicious contract calls `victimVault.withdrawAll(attacker)`. Since `tx.origin` is still the victim's EOA, the check passes and the vault is drained.",
        "- **Rule:** **NEVER** use `tx.origin` for authentication or ownership checks; always authorize strictly against `msg.sender`.",
      ].join("\n"),
  },
  {
    id: "evm-eip150-63-64",
    category: "evm",
    standardNumbers: ["150", "eip150"],
    exactCompact: ["eip150", "150", "6364rule", "gasleft"],
    exactPhrases: [
      "eip 150",
      "eip150",
      "63/64 rule",
      "63 64 rule",
      "gasleft",
      "gas griefing",
    ],
    keywords: ["gas forwarding", "meta transaction", "relayer", "subcall"],
    answer: () =>
      [
        "### `gasleft()` & the EIP-150 63/64 Gas Forwarding Rule",
        "**EIP-150** caps the maximum gas forwarded to any external `CALL` / `DELEGATECALL` / `STATICCALL` at **`63/64` of remaining `gasleft()`**, reserving `1/64` for the parent frame to finish cleanly:",
        "",
        "- **Insufficient Gas Griefing on Relayers & Keepers:** If a relayer executes a user's subcall with barely enough gas so the inner call runs Out-of-Gas (`success == false`) while the outer frame still has `1/64` gas left to succeed and mark the nonce/job as 'completed', the user's action fails permanently without reverting!",
        "- **Defense (EIP-150 Safe Check):** Before calling a target requiring `minGas`, verify `gasleft() >= (minGas * 64) / 63` (or `assert(gasleft() > minGas / 63)` after the call) so an under-funded relayer cannot censor execution.",
      ].join("\n"),
  },
  {
    id: "evm-eip3529-refunds",
    category: "evm",
    standardNumbers: ["3529", "eip3529"],
    exactCompact: ["eip3529", "3529", "sstorerefund"],
    exactPhrases: [
      "eip 3529",
      "eip3529",
      "sstore gas refund",
      "sstore refunds",
      "gas refund",
      "gas tokens",
    ],
    keywords: ["4800 gas", "20 percent cap", "delete storage", "chi gastoken"],
    answer: () =>
      [
        "### EIP-3529: `SSTORE` Gas Refunds & Why Gas Tokens Died",
        "Activated in Ethereum's London upgrade, **EIP-3529** slashed storage clearing refunds to stop `GST2` / `CHI` gas-token block-size bloat:",
        "",
        "- **Current Refund Rules:** Clearing a non-zero storage slot back to `0` (`delete` / `sstore(slot, 0)`) grants a **4,800 gas** refund (down from 15,000), and total transaction refunds are strictly capped at **20% (`1/5`) of total gas spent** (down from 50%).",
        "- **Gas Design Tip:** For ephemeral state (like reentrancy locks or flash-accounting balances), prefer **EIP-1153 `TSTORE`/`TLOAD`** (100 gas flat) over `SSTORE` + refund, and prefer keeping active queue slots warm (`1 -> 2 -> 1`) over repeatedly zeroing and re-initializing (`0 -> 1 -> 0`).",
      ].join("\n"),
  },
  {
    id: "evm-selector-dispatch",
    category: "evm",
    exactCompact: ["selectordispatch", "payableconstructor", "functionselector"],
    exactPhrases: [
      "selector dispatch",
      "function selector ordering",
      "leading zero selector",
      "payable constructor",
      "payable admin",
    ],
    keywords: ["binary search", "22 gas", "callvalue", "micro optimization"],
    answer: () =>
      [
        "### EVM Micro-Optimizations: Function Selector Dispatch & `payable` Savings",
        "Beyond major algorithmic wins (like O(1) swap-and-pop), low-level Solidity/Yul engineers trim bytecode and hot-path gas via:",
        "",
        "- **Selector Dispatch Ordering:** Solidity compiles external function routing into a sorted binary search over 4-byte selectors. Mining a function name whose `bytes4(keccak256(...))` starts with leading zeros (`0x0000...`) places hot functions (like `swap` or `execute`) at the top of the dispatch tree AND saves 12 gas per zero byte in calldata.",
        "- **`payable` Constructors & Admin Functions:** Every non-`payable` function injects `CALLVALUE; DUP1; ISZERO; PUSH revert; JUMPI` (~24 gas + bytecode bytes). Marking admin/constructor functions `payable` removes that guard safely when callers control value.",
      ].join("\n"),
  },
  {
    id: "yul-custom-error-revert",
    category: "evm",
    exactCompact: ["assemblyrevert", "yulrevert", "scratchspacehash"],
    exactPhrases: [
      "assembly revert",
      "revert 0 4",
      "revert(0, 4)",
      "yul custom error",
      "yul assembly revert",
    ],
    keywords: ["mstore", "error selector", "yul", "gas savings"],
    answer: () =>
      [
        "### Inline Yul Custom Error Reverts (`revert(0x00, 0x04)`) & Scratch-Space Hashing",
        "Even standard Solidity `revert CustomError()` expands memory or adds compiler boilerplate in older IR paths. Writing it in Yul keeps hot paths razor-thin:",
        "",
        "```solidity",
        "assembly {",
        "    // bytes4(keccak256(\"Unauthorized()\")) == 0x82b42900",
        "    mstore(0x00, 0x82b42900)",
        "    revert(0x1c, 0x04)",
        "}",
        "```",
        "",
        "- **Why `0x1c` (28) Offset?** `mstore(0x00, 0x82b42900)` right-aligns the 4-byte selector into bytes `28..31` of scratch space (or use left-shifted `0x82b42900 << 224` with `revert(0x00, 0x04)`), touching ZERO memory beyond `0x20` and never altering the `0x40` free memory pointer.",
      ].join("\n"),
  },
  {
    id: "fixed-point-math",
    category: "defi",
    exactCompact: ["wad", "ray", "q6496", "prbmath", "fixedpointmathlib", "muldiv"],
    exactPhrases: [
      "fixed point math",
      "wad and ray",
      "wad ray",
      "q64.96",
      "prbmath",
      "fixedpointmathlib",
      "muldiv",
    ],
    keywords: ["1e18", "1e27", "rounding", "precision loss", "fullmath"],
    answer: () =>
      [
        "### Fixed-Point Math in DeFi (`WAD`, `RAY`, `Q64.96`, `mulDiv`, `PRBMath` & Solady)",
        "Because Solidity has no floating-point types, DeFi protocols standardize on scaled integer precision:",
        "",
        "- **`WAD` (`1e18`):** Standard ERC-20 token & price precision (18 decimals).",
        "- **`RAY` (`1e27`):** High-precision interest-rate and compounding index math (MakerDAO, Aave V3) to eliminate per-second truncation drift.",
        "- **`Q64.96` (Binary Fixed Point):** Used by Uniswap V3 `sqrtPriceX96` so division by `2^96` compiles to cheap bit-shifts (`>> 96`).",
        "- **`mulDiv` & Libraries (`PRBMath`, Solady `FixedPointMathLib`, OpenZeppelin `Math.mulDiv`):** Use 512-bit intermediate multiplication to prevent `a * b` overflow before dividing by `c`, with explicit `Floor` vs `Ceil` rounding in favor of the protocol.",
      ].join("\n"),
  },

  // =========================================================================
  // F. FOUNDRY MASTERY, AUDITING PROCESS & SENIOR INTERVIEW Q&A (20 ENTRIES)
  // =========================================================================
  {
    id: "foundry-forge-commands",
    category: "tooling",
    exactCompact: ["forgetest", "forgecoverage", "forgesnapshot", "forgeinspect"],
    exactPhrases: [
      "forge test",
      "forge coverage",
      "forge snapshot",
      "forge inspect",
      "storage layout inspect",
      "foundry commands",
    ],
    keywords: ["vvvv", "gas report", "match test", "ci gates"],
    answer: () =>
      [
        "### Foundry `forge` Power Commands for Production DeFi",
        "Daily CLI workflow for senior smart contract engineering and CI security gates:",
        "",
        "- **`forge test -vvvv --match-test testExploit`:** Prints full call traces, decoded events, internal reverts, and per-call gas breakdown to diagnose failing fuzz or exploit proofs.",
        "- **`forge snapshot --diff`:** Records exact gas usage per function and diffs regressions across PRs (essential when tuning inline Yul or struct packing).",
        "- **`forge inspect Contract storage-layout --pretty`:** Dumps every slot, byte offset, and type to verify **UUPS / ERC-1967** upgrade storage safety before shipping V2.",
        "- **`forge coverage --report lcov`:** Maps branch and line test coverage across core accounting contracts.",
      ].join("\n"),
  },
  {
    id: "foundry-chisel-cast",
    category: "tooling",
    exactCompact: ["chisel", "castcli", "castcall", "cast4byte"],
    exactPhrases: [
      "chisel",
      "foundry chisel",
      "foundry cast",
      "cast call",
      "cast send",
      "cast storage",
      "cast 4byte",
    ],
    keywords: ["repl", "abi decode", "cast sig", "storage slot inspection"],
    answer: () =>
      [
        "### Foundry `chisel` & `cast` Power Reference",
        "Two indispensable tools alongside `forge` for rapid EVM debugging and mainnet incident response:",
        "",
        "- **`chisel` (Interactive Solidity REPL):** Test bitwise shifts, Yul assembly, `abi.encodePacked` layouts, or mainnet fork calls interactively in seconds without scaffolding a full test file.",
        "- **`cast sig \"transfer(address,uint256)\"` & `cast 4byte 0xa9059cbb`:** Instantly compute or reverse-lookup 4-byte selectors.",
        "- **`cast storage <addr> <slot> --rpc-url ...`:** Inspect raw 32-byte storage slots directly on mainnet (critical for verifying proxy implementation slots `0x3608...` or admin ownership).",
        "- **`cast call` / `cast send` / `cast run <txHash> --trace`:** Replay any historical mainnet transaction locally with full opcode and call-stack traces!",
      ].join("\n"),
  },
  {
    id: "foundry-handler-invariants",
    category: "tooling",
    exactCompact: ["handlerinvariants", "ghostvariables", "targetcontract"],
    exactPhrases: [
      "handler based invariant",
      "handler-based invariant",
      "ghost variables",
      "ghost variable",
      "targetcontract",
      "excludesender",
      "invariant testing",
    ],
    keywords: ["bound", "stateful fuzzing", "solvency invariant", "foundry invariant"],
    answer: () =>
      [
        "### Foundry Handler-Based Stateful Invariant Testing",
        "Open (unbounded) invariant fuzzing wastes 99% of calls reverting on invalid addresses or `uint256.max` amounts. **Handler-based fuzzing** directs Foundry into deep realistic protocol states:",
        "",
        "- **1. Dedicated Handler Contract:** Wraps protocol actions (`deposit`, `borrow`, `liquidate`, `warpTime`, `updateOracle`), clamps inputs with `bound(amount, 1, maxAvail)`, and selects realistic actors from an actor array.",
        "- **2. `targetContract(address(handler))` & `excludeSender(...)`:** Directs the fuzzer exclusively through valid handler entrypoints while preventing the fuzzer from impersonating privileged/zero addresses.",
        "- **3. Ghost Variables:** Track shadow accounting inside the handler (`ghost_totalDeposited`, `ghost_totalBurned`, `ghost_sumOfUserBalances`) and assert system-wide invariants after every call sequence (`assertGe(vault.totalAssets(), ghost_minBackedAssets)`).",
        "- **In Amit's Portfolio:** Used across **Sentinel Insurance**, **Decentralized StableCoin Engine**, and **Nexus RWA**.",
      ].join("\n"),
  },
  {
    id: "foundry-differential-fork",
    category: "tooling",
    exactCompact: ["differentialfuzzing", "vmffi", "forktesting"],
    exactPhrases: [
      "differential fuzzing",
      "vm.ffi",
      "fork testing",
      "mainnet fork",
      "createselectfork",
    ],
    keywords: ["anvil", "rollfork", "reference implementation", "foundry fork"],
    answer: () =>
      [
        "### Differential Fuzzing (`vm.ffi`) & Mainnet Fork Testing in Foundry",
        "Two advanced Foundry techniques for high-assurance DeFi deployments:",
        "",
        "- **Differential Fuzzing:** Fuzzes your optimized Solidity/Yul implementation side-by-side against a simple unoptimized Solidity reference or external Python/Rust model (invoked via `vm.ffi`), asserting identical outputs across 10,000+ random edge cases — especially valuable for fixed-point AMM math and Yul refactors.",
        "- **Pinned Mainnet Fork Testing (`vm.createSelectFork(rpc, BLOCK_NUM)`):** Tests live integrations against real Aave V3 pools, Uniswap routers, Chainlink feeds, and real USDC/USDT bytecode at a deterministic pinned block for reproducible CI runs.",
      ].join("\n"),
  },
  {
    id: "interview-mapping-vs-array",
    category: "evm",
    exactCompact: ["mappingvsarray"],
    exactPhrases: [
      "mapping vs array",
      "array vs mapping",
      "when to use mapping vs array",
      "iterate over mapping",
    ],
    keywords: ["o(1)", "block gas limit", "swap and pop", "storage slot"],
    answer: () =>
      [
        "### Senior Solidity Interview Q&A: Mapping vs. Array",
        "- **Mappings (`mapping(K => V)`):** Constant **O(1)** lookup (`keccak256(k, slot)`), no length tracking, not natively iterable, and cannot be cleared in one op. Default choice for balances, allowances, and nonces.",
        "- **Dynamic Arrays (`T[]`):** Iterable and tracks `.length`, but linear search or unbounded `for` loops over growing arrays cause **block-gas-limit DoS**.",
        "- **Senior Pattern (Indexed Swap-and-Pop):** Combine BOTH — an array of active IDs + a 1-based `mapping(id => indexPlusOne)` — to get O(1) lookup, O(1) membership check, AND O(1) deletion (used in Amit's `SwapPopQueue.yul` for 35% gas savings).",
      ].join("\n"),
  },
  {
    id: "interview-proxy-collision",
    category: "security",
    exactCompact: ["proxystoragecollision", "storagecollision"],
    exactPhrases: [
      "proxy storage collision",
      "storage collision",
      "slot 0 collision",
      "upgrade storage layout",
    ],
    keywords: ["delegatecall", "eip1967", "storage gap", "erc7201"],
    answer: () =>
      [
        "### Senior Solidity Interview Q&A: Proxy Storage Collision",
        "Because a proxy executes implementation bytecode in the **proxy's own storage context** via `delegatecall`, storage slots are addressed purely by numeric index — variable names do not exist at runtime:",
        "",
        "- **How Collisions Happen:** (1) Proxy stores `address implementation` at Slot 0 while implementation stores `address owner` at Slot 0 -> overwriting `owner` corrupts the proxy target! (2) A V2 upgrade inserts a new state variable *above* existing variables, shifting every downstream slot.",
        "- **How to Prevent It:** Store proxy admin/implementation pointers in **ERC-1967** unstructured slots (`keccak256(...) - 1`), only append new variables at the end of V2 (consuming explicit `uint256[50] __gap` slots) or use **ERC-7201 namespaced structs**, and gate upgrades with `forge inspect storage-layout` diffs.",
      ].join("\n"),
  },
  {
    id: "interview-uint256-vs-uint8",
    category: "evm",
    exactCompact: ["uint256vsuint8", "uint8vsuint256"],
    exactPhrases: [
      "uint256 vs uint8",
      "uint8 vs uint256",
      "why uint256 is cheaper",
      "why use uint256",
    ],
    keywords: ["256 bit word", "bitmasking", "storage packing", "evm stack"],
    answer: () =>
      [
        "### Senior Solidity Interview Q&A: Why `uint256` Often Beats `uint8` on Gas",
        "The EVM operates natively on **256-bit (32-byte) stack words**:",
        "",
        "- **On the Stack & Standalone Variables (`uint256` Wins):** Using `uint8` for a loop counter or standalone state variable forces the compiler to inject extra bitwise masking/cleanup opcodes (`AND 0xff`) to keep upper 248 bits clean, costing **more** gas and bytecode than `uint256`.",
        "- **Inside Packed Structs & Storage (`uint8` / `uint64` / `uint128` Wins):** Packing multiple smaller fields tightly inside one 32-byte storage slot (e.g., `address` + `uint64` + `uint32`) eliminates entire `SLOAD` (2,100 gas) and `SSTORE` (20,000 gas) operations, massively outweighing the tiny 3-gas masking cost.",
      ].join("\n"),
  },
  {
    id: "interview-flashloan-math",
    category: "defi",
    exactCompact: ["flashloanmath", "flashloaninvariant"],
    exactPhrases: [
      "flash loan math",
      "flash loan accounting",
      "how do flash loans work internally",
      "flash loan invariant",
    ],
    keywords: ["balancebefore", "balanceafter", "revert", "erc3156"],
    answer: () =>
      [
        "### Senior Solidity Interview Q&A: Flash-Loan Accounting & Security Invariants",
        "A flash loan works because the EVM makes every transaction **atomic** — any revert undoes every state mutation from the entire call stack:",
        "",
        "- **Core Lender Invariant:** Record `balanceBefore = token.balanceOf(address(this))` -> transfer `amount` to borrower -> call `borrower.onFlashLoan(...)` -> compute `fee = (amount * feeBps) / 10_000` (rounding UP) -> assert `token.balanceOf(address(this)) >= balanceBefore + fee`.",
        "- **3 Classic Lender/Borrower Bugs:** (1) Letting a borrower repay by calling `deposit()` on the same vault (double-counting collateral as repayment!), (2) Failing to authenticate `msg.sender == lender && initiator == address(this)` inside the borrower's callback, and (3) Using flash-loanable spot balances for governance or pricing.",
      ].join("\n"),
  },
  {
    id: "interview-4626-inflation",
    category: "security",
    exactCompact: ["vaultinflation", "firstdepositorattack", "decimalsoffset"],
    exactPhrases: [
      "vault inflation attack",
      "first depositor attack",
      "donation attack",
      "erc4626 inflation",
      "decimals offset",
    ],
    keywords: ["virtual shares", "dead shares", "rounding to zero", "erc4626"],
    answer: () =>
      [
        "### Senior Solidity Interview Q&A: ERC-4626 First-Depositor Inflation Attack Math",
        "In a naive empty ERC-4626 vault (`shares = assets * totalSupply / totalAssets`):",
        "",
        "- **The Exploit:** (1) Attacker deposits `1 wei` -> gets `1 share`. (2) Attacker directly `transfer`s `10,000e6` USDC to the vault -> `totalAssets = 10,000e6 + 1`, `totalSupply = 1`. (3) Victim deposits `19,999e6` USDC -> `shares = floor(19,999e6 * 1 / (10,000e6 + 1)) = 1 share`, OR if victim deposits `9,999e6` -> **`0 shares`**! Attacker redeems their 1 share and steals the victim's deposit.",
        "- **OpenZeppelin `_decimalsOffset()` Virtual Shares Fix:** Computes `shares = assets * (totalSupply + 10^offset) / (totalAssets + 1)`. With `offset = 3` (1,000 virtual shares), inflating the share price enough to steal 1 wei costs the attacker **1,000x** more donation loss than they can ever extract, making the attack economically irrational.",
      ].join("\n"),
  },
  {
    id: "interview-safetransfer-reentrancy",
    category: "security",
    exactCompact: ["safetransferreentrancy", "onerc721receivedreentrancy"],
    exactPhrases: [
      "why safetransferfrom triggers reentrancy",
      "safetransferfrom reentrancy",
      "safemint reentrancy",
      "onerc721received reentrancy",
    ],
    keywords: ["nft callback", "erc721", "erc1155", "cei"],
    answer: () =>
      [
        "### Senior Solidity Interview Q&A: Why `safeTransferFrom` / `_safeMint` Triggers Reentrancy",
        "Unlike ERC-20 `transfer`, ERC-721 `_safeMint` / `safeTransferFrom` and ERC-1155 `safeTransferFrom` perform an **external call** to the recipient if `to.code.length > 0`:",
        "",
        "- **The Callback Hook:** The token calls `IERC721Receiver(to).onERC721Received(...)` (or `onERC1155Received`). A malicious buyer contract can re-enter `mint()` inside that callback *before* `mintedPerWallet[msg.sender]++` or supply caps update, bypassing per-wallet mint limits or draining staking rewards.",
        "- **Fix:** Always increment supply/user counters BEFORE calling `_safeMint`, and wrap public mint/claim/withdraw functions with `nonReentrant`.",
      ].join("\n"),
  },
  {
    id: "interview-msgsender-vs-txorigin",
    category: "evm",
    exactCompact: ["msgsendervstxorigin"],
    exactPhrases: [
      "msg.sender vs tx.origin",
      "msg sender vs tx origin",
      "difference between msg.sender and tx.origin",
    ],
    keywords: ["call chain", "delegatecall", "eoa", "phishing"],
    answer: () =>
      [
        "### Senior Solidity Interview Q&A: `msg.sender` vs. `tx.origin`",
        "Suppose EOA `Alice` calls `Contract A`, which calls `Contract B`:",
        "",
        "- **Inside `Contract A`:** `msg.sender == Alice` and `tx.origin == Alice`.",
        "- **Inside `Contract B`:** `msg.sender == Contract A` (immediate caller), while `tx.origin == Alice` (original transaction signer). Inside a `delegatecall`, `msg.sender` is preserved from the outer frame.",
        "- **Security Rule:** Always use `msg.sender` for access control. Using `tx.origin` opens phishing drains and breaks smart-contract wallets (Safe, ERC-4337, EIP-7702).",
      ].join("\n"),
  },
  {
    id: "audit-report-writing",
    category: "security",
    exactCompact: ["auditreport", "severitytriage", "foundrypoc"],
    exactPhrases: [
      "audit report",
      "writing audit reports",
      "audit severity",
      "critical high medium low",
      "audit methodology",
    ],
    keywords: ["poc", "root cause", "impact", "mitigation", "threat model"],
    answer: () =>
      [
        "### Senior Smart Contract Auditing Process & Report Writing",
        "An actionable audit report prioritizes reproducibility and root-cause clarity over noisy automated output:",
        "",
        "- **Audit Workflow:** (1) Threat-model trust boundaries, roles, and invariants from docs/specs -> (2) Line-by-line manual review across accounting, external calls, upgrades, and weird-token edges -> (3) Run Slither/Aderyn for baseline hygiene -> (4) Write Foundry stateful invariant fuzzers and executable PoCs.",
        "- **Severity Classification:** **Critical/High** = direct theft/permanent freeze of user funds or protocol insolvency; **Medium** = conditional loss, griefing/DoS, or broken core functionality; **Low/Informational** = edge-case hardening, events, gas.",
        "- **Gold-Standard Finding Format:** Title + Severity -> Concise Root Cause -> Concrete Attack Path -> Runnable **Foundry PoC (`forge test`)** proving profit/loss -> Minimal Diff Mitigation.",
      ].join("\n"),
  },
  {
    id: "bug-bounties-contests",
    category: "security",
    exactCompact: ["immunefi", "sherlock", "code4rena", "cantina"],
    exactPhrases: [
      "bug bounties",
      "bug bounty",
      "immunefi",
      "sherlock",
      "code4rena",
      "cantina",
      "audit contests",
    ],
    keywords: ["security researcher", "triage", "poc", "competitive audits"],
    answer: () =>
      [
        "### Web3 Bug Bounties & Competitive Audit Platforms",
        "Top venues where smart contract security researchers harden live and pre-launch DeFi protocols:",
        "",
        "- **Immunefi:** Live production bug bounties (up to $10M+ max payouts for critical fund-drain vulnerabilities). Requires responsible disclosure and a deterministic mainnet-fork Foundry PoC — never test exploits on live mainnet!",
        "- **Code4rena, Sherlock & Cantina:** Pre-launch competitive audits and solo/team reviews where researchers hunt High/Medium bugs in scoped commits before mainnet deployment.",
        "- **High-Signal Hunting Strategy:** Focus on fresh custom math, cross-contract integration boundaries, upgrade migrations, oracle/liquidation edge cases, and non-standard ERC-20 interactions.",
      ].join("\n"),
  },
  {
    id: "foundry-repo-layout",
    category: "tooling",
    exactCompact: ["foundryrepolayout", "foundrystructure"],
    exactPhrases: [
      "foundry repo layout",
      "foundry project structure",
      "production foundry layout",
      "foundry.toml",
    ],
    keywords: ["remappings", "test/invariant", "test/fuzz", "script/deploy"],
    answer: () =>
      [
        "### Production Foundry Repository Architecture",
        "How senior protocol teams structure maintainable multi-contract Foundry codebases:",
        "",
        "- **`src/`:** Modular `core/`, `interfaces/`, `libraries/`, and `errors/` directories with clean NatSpec.",
        "- **`test/`:** Split into `unit/` (deterministic branch tests), `fuzz/` (stateless property fuzzing), `invariant/` (handler + ghost-variable stateful campaigns), and `fork/` (pinned mainnet integration tests).",
        "- **`script/`:** Idempotent `Deploy.s.sol` + `HelperConfig.s.sol` (per-chain Chainlink/Aave/Router configs) + `Upgrade.s.sol`.",
        "- **`foundry.toml` & CI:** Pinned `solc_version`, explicit `optimizer_runs`, `fuzz.runs = 1000`, `invariant.depth = 64`, plus GitHub Actions running `forge fmt --check`, `forge test`, `slither .`, and storage-layout diffs.",
      ].join("\n"),
  },
  {
    id: "dapp-frontend-security",
    category: "tooling",
    exactCompact: ["dappsecurity", "wagmiviem", "bigintprecision"],
    exactPhrases: [
      "dapp security",
      "frontend web3 security",
      "rpc fallbacks",
      "tx simulation",
      "reorg handling",
      "bigint precision",
      "viem wagmi security",
    ],
    keywords: ["simulatecontract", "fallback transport", "parseunits", "formatunits"],
    answer: () =>
      [
        "### Full-Stack Web3 dApp Security & Engineering (Next.js, Wagmi v2 & Viem)",
        "Great smart contracts still lose users if the frontend layer mishandles RPCs, numbers, or calldata:",
        "",
        "- **Zero Floating-Point Token Math:** Never convert token balances to JS `Number` (`2^53` precision breaks 18-decimal wei!). Keep all amounts as native **`BigInt`** using Viem's `parseUnits` / `formatUnits`.",
        "- **Pre-Flight Simulation (`simulateContract`):** Always simulate writes against the latest block before prompting wallet signatures so users see clear decoded custom errors instead of paying gas on guaranteed reverts.",
        "- **Multi-RPC Fallback & Reorg Resilience:** Configure Viem `fallback([http(alchemy), http(infura), http(public)])` transports, wait for safe confirmation counts on L1/L2 state updates, and verify chain ID + contract addresses strictly via typed ABIs.",
      ].join("\n"),
  },
  {
    id: "solidity-abi-encoding-pitfalls",
    category: "evm",
    exactCompact: ["abiencoding", "abidecode", "calldatayout"],
    exactPhrases: [
      "abi encoding",
      "abi.decode",
      "abi.encode vs encodepacked",
      "calldata layout",
      "dirty upper bits",
    ],
    keywords: ["head tail", "offset", "padding", "bytes32", "collision"],
    answer: () =>
      [
        "### Deep Solidity ABI Encoding & Calldata Pitfalls",
        "- **Head/Tail Dynamic Layout:** Standard `abi.encode` pads every static value to 32 bytes and encodes dynamic types (`string`, `bytes`, `T[]`) as a byte offset in the head pointing to `length + data` in the tail.",
        "- **`abi.encodePacked` Collision:** Concatenates multiple dynamic arguments without length prefixes (`encodePacked(\"ab\", \"c\") == encodePacked(\"a\", \"bc\")`), breaking signature/Merkle hashes. Use `abi.encode` for hashing dynamic types!",
        "- **Dirty Upper Bits in Assembly:** Calling `calldataload` for an `address` or `uint96` can contain non-zero upper bits if crafted maliciously. Always mask (`and(val, 0xffffffffffffffffffffffffffffffffffffffff)`) when reading sub-256-bit types in Yul.",
      ].join("\n"),
  },
  {
    id: "solidity-unchecked-overflow",
    category: "evm",
    exactCompact: ["unchecked", "safecast", "overflowunderflow"],
    exactPhrases: [
      "unchecked block",
      "unchecked overflow",
      "when is unchecked safe",
      "safecast",
      "solidity 0.8 overflow",
    ],
    keywords: ["loop counter", "arithmetic", "downcast", "truncation"],
    answer: () =>
      [
        "### Solidity 0.8+ `unchecked {}` & Downcasting (`SafeCast`) Traps",
        "Solidity 0.8+ automatically checks overflow/underflow on arithmetic, saving developers from legacy `SafeMath` — with **two critical nuances**:",
        "",
        "- **Where `unchecked {}` Is Safe:** Incrementing bounded loop counters (`unchecked { ++i; }`) and subtracting after an explicit dominance check (`if (a < b) revert; unchecked { c = a - b; }`) save ~40-80 gas per iteration cleanly.",
        "- **Silent Downcast Truncation Trap:** Solidity 0.8+ does **NOT** revert on explicit narrowing casts like `uint128(hugeUint256)` or `int256(largeUint256)`! Always use OpenZeppelin **`SafeCast.toUint128()` / `toInt256()`** whenever narrowing token amounts, timestamps, or PnL deltas.",
      ].join("\n"),
  },
  {
    id: "solidity-receive-vs-fallback",
    category: "evm",
    exactCompact: ["receivevsfallback", "forcedeth"],
    exactPhrases: [
      "receive vs fallback",
      "fallback vs receive",
      "forced eth",
      "selfdestruct eth",
      "address(this).balance",
    ],
    keywords: ["msg.data", "coinbase", "strict equality", "accounting"],
    answer: () =>
      [
        "### `receive()` vs. `fallback()` & Forced ETH Balance Invariants",
        "- **Dispatch Rule:** When a contract receives a call with empty `msg.data` and ETH value, the EVM invokes `receive() external payable` (if defined), otherwise `fallback()`. Non-empty `msg.data` with no matching selector always routes to `fallback()`.",
        "- **Forced ETH Pitfall:** Even a contract with NO `receive()` and NO `payable` functions can still be forced to receive ETH via `selfdestruct(target)` (same-tx post-Dencun EIP-6780), validator `coinbase` block rewards, or pre-funding a deterministic `CREATE2` address before deployment.",
        "- **Security Rule:** Never rely on strict equality `address(this).balance == expectedTotal` for protocol invariants; track internal accounting variables explicitly.",
      ].join("\n"),
  },
  {
    id: "solidity-erc20-weird-tokens",
    category: "security",
    exactCompact: ["weirdtokens", "weirderc20", "feeontransfer", "rebasingtoken"],
    exactPhrases: [
      "weird erc20",
      "weird tokens",
      "fee on transfer",
      "fee-on-transfer",
      "usdt approval",
      "non standard erc20",
    ],
    keywords: ["safeerc20", "forceapprove", "blocklist", "decimals", "zero transfer"],
    answer: () =>
      [
        "### Weird ERC-20 Tokens Production Integration Checklist",
        "Real mainnet tokens frequently violate naive ERC-20 assumptions (see d-xo's Weird ERC20 list):",
        "",
        "- **Missing Bool Return (USDT, BNB):** Always use OpenZeppelin `SafeERC20` (`safeTransfer`, `safeTransferFrom`).",
        "- **Non-Zero Approve Revert (USDT):** Changing allowance from `X > 0` to `Y > 0` reverts; use `SafeERC20.forceApprove(token, spender, amount)` which resets to `0` first if needed.",
        "- **Fee-on-Transfer & Rebasing Tokens:** Measure actual received tokens (`balAfter - balBefore`) on deposit, and prefer wrapped non-rebasing versions (`wstETH`) inside vaults.",
        "- **Blocklistable / Pausable Tokens (USDC, USDT):** Never push payouts to arbitrary users in one loop (a single frozen address blocks everyone) — always use Pull-over-Push!",
      ].join("\n"),
  },
  {
    id: "solidity-time-randomness",
    category: "security",
    exactCompact: ["prevrandao", "blocktimestamp", "onchainrandomness"],
    exactPhrases: [
      "on chain randomness",
      "onchain randomness",
      "prevrandao",
      "block.timestamp manipulation",
      "block.timestamp vs block.number",
    ],
    keywords: ["vrf", "chainlink vrf", "validator bias", "12 seconds"],
    answer: () =>
      [
        "### Time (`block.timestamp` vs. `block.number`) & Secure On-Chain Randomness",
        "- **`block.timestamp` vs. `block.number`:** On PoS Ethereum, slots tick deterministically every 12 seconds (`block.timestamp` has minimal drift, though L2 sequencers vary). Prefer `block.timestamp` for human durations (lockups, vesting, oracle staleness) and `block.number` for same-block flash-loan checkpoints.",
        "- **Why `block.prevrandao` / `blockhash` Are Unsafe for High-Stakes RNG:** Validators know `prevrandao` before proposing and can sacrifice one slot's reward to skip an unfavorable lottery/liquidation outcome (1-bit bias).",
        "- **Production Solution:** Use **Chainlink VRF v2.5** verifiable cryptographic randomness (as Amit implemented in **Automated Provably Fair Raffle** with strict `OPEN` -> `CALCULATING` state locking).",
      ].join("\n"),
  },
];
