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

interface NormalizedQuery {
  raw: string;
  normalized: string;
  compact: string;
  tokens: Set<string>;
}

export function normalizeQuery(input: string): NormalizedQuery {
  const raw = input.trim();
  const normalized = raw
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9.+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const compact = normalized.replace(/[\s.]+/g, "");
  const tokens = new Set(normalized ? normalized.split(" ") : []);
  return { raw, normalized, compact, tokens };
}

function hasPhrase(q: NormalizedQuery, phrase: string): boolean {
  const clean = phrase
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9.+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return false;
  if (clean.includes(" ")) {
    const padded = ` ${q.normalized} `;
    if (padded.includes(` ${clean} `)) return true;
    const compactPhrase = clean.replace(/[\s.]+/g, "");
    return compactPhrase.length >= 5 && q.compact.includes(compactPhrase);
  }
  if (q.tokens.has(clean)) return true;
  if (clean.length >= 6 && q.compact.includes(clean.replace(/[\s.]+/g, ""))) {
    return true;
  }
  return false;
}

export interface FallbackHistoryTurn {
  role: string;
  text?: string;
  content?: string;
}

function getTurnText(turn: FallbackHistoryTurn): string {
  const raw =
    typeof turn.text === "string"
      ? turn.text
      : typeof turn.content === "string"
        ? turn.content
        : "";
  return raw.trim();
}

const PROJECT_STANDARD_SECONDARY: Record<string, readonly string[]> = {
  "nexus-rwa": ["erc3643", "erc 3643", "3643", "rwa", "kyc"],
  "onchain-automation": ["keeper", "keepers", "automation"],
  "sentinel-insurance": ["erc4626", "erc 4626", "4626", "aave v3", "aave"],
  fs1: ["perps", "ccip", "paymaster", "erc4337", "erc 4337"],
  fs2: ["dao", "timelock", "governance"],
  fs4: ["erc5484", "erc 5484", "5484", "soulbound", "sbt"],
  c1: ["stablecoin", "cdp"],
  c2: ["vrf"],
  c3: ["erc4337", "erc 4337", "4337", "entrypoint", "userop"],
  c4: ["uups", "eip1822", "1822", "erc1967", "1967"],
  c5: ["merkle", "airdrop", "eip712"],
  c6: ["erc721", "erc 721", "721", "nft"],
  c7: ["erc20", "erc 20"],
  c8: ["aggregatorv3"],
};

interface KnowledgeEntry {
  id: string;
  exactCompact?: readonly string[];
  exactPhrases: readonly string[];
  keywords: readonly string[];
  answer: () => string;
}

const WEB3_KNOWLEDGE_BASE: readonly KnowledgeEntry[] = [
  {
    id: "erc-20",
    exactCompact: ["erc20", "eip20", "20"],
    exactPhrases: [
      "erc 20",
      "erc20",
      "eip 20",
      "fungible token",
      "safeerc20",
      "fee on transfer",
      "rebasing token",
      "approve race condition",
    ],
    keywords: [
      "20",
      "allowance",
      "transferfrom",
      "approve",
      "totalsupply",
      "decimals",
    ],
    answer: () =>
      [
        "### ERC-20: Fungible Token Standard",
        "**ERC-20** defines the canonical interface for interchangeable tokens on Ethereum and EVM chains: `totalSupply`, `balanceOf`, `transfer`, `approve`, `allowance`, and `transferFrom`, plus `Transfer` and `Approval` events.",
        "",
        "- **Allowance Race Condition:** Calling `approve(spender, newAmount)` directly lets a front-running spender consume the old allowance and then the new one. Production protocols use `safeIncreaseAllowance` / `safeDecreaseAllowance`, reset to `0` first, or adopt `ERC-2612` (`permit`).",
        "- **SafeERC20 Wrapper:** Non-standard tokens (notably USDT) omit the `bool` return value on `transfer` / `transferFrom`. Always wrap calls with OpenZeppelin `SafeERC20` so silent failures revert cleanly.",
        "- **Weird ERC-20 Edge Cases:** DeFi vaults must account for **fee-on-transfer tokens** (measure `balanceAfter - balanceBefore` instead of trusting the `amount` argument), **rebasing tokens** (like stETH, where balances drift), and non-18 decimals (USDC uses 6).",
        "- **In Amit's Portfolio:** See **SISO Token Standard** (`ERC-20 / RBAC`, https://github.com/NexTechArchitect/SISO-Token-ERC20) with role-gated minting, hard supply ceilings, custom errors, and Foundry supply-conservation invariants.",
      ].join("\n"),
  },
  {
    id: "erc-721",
    exactCompact: ["erc721", "erc721a", "eip721", "721"],
    exactPhrases: [
      "erc 721",
      "erc721",
      "erc 721a",
      "erc721a",
      "eip 721",
      "non fungible token",
      "nonfungible token",
      "ownerof",
      "safetransferfrom",
    ],
    keywords: ["721", "nft", "tokenuri", "onerc721received", "batch mint"],
    answer: () =>
      [
        "### ERC-721 & ERC-721A: Non-Fungible Token (NFT) Standards",
        "**ERC-721** is the core EVM standard for unique, individually identifiable assets where each `tokenId` has a single owner tracked on-chain.",
        "",
        "- **Core Interface & Safety Hooks:** Exposes `ownerOf(tokenId)`, `balanceOf(owner)`, `approve`, `setApprovalForAll`, `transferFrom`, and `safeTransferFrom`. `safeTransferFrom` invokes `onERC721Received` on recipient contracts so tokens are not permanently locked inside contracts that cannot handle NFTs (always follow Checks-Effects-Interactions because that callback is a reentrancy vector).",
        "- **On-Chain SVG vs. IPFS Metadata:** `tokenURI(tokenId)` either points to content-addressed IPFS JSON (`ipfs://...`) or returns fully on-chain Base64-encoded JSON + SVG generated directly in Solidity for zero external hosting dependency.",
        "- **ERC-721A Batch Mint Gas Optimization:** Standard OpenZeppelin `ERC721` writes an owner `SSTORE` slot per minted token. **ERC-721A** mints sequential IDs in a single storage write for the batch start index and lazily resolves `ownerOf` by scanning backward, cutting multi-NFT mint gas dramatically.",
        "- **In Amit's Portfolio:** Amit implemented dual IPFS + Base64 SVG rendering in **CuteCat NFT Protocol** (https://github.com/NexTechArchitect/ERC721-Advanced-IPFS-NFT) and tokenized underwriting policies as ERC-721 assets in **Sentinel Insurance Protocol**.",
      ].join("\n"),
  },
  {
    id: "erc-1155",
    exactCompact: ["erc1155", "eip1155", "1155", "1115", "erc1115"],
    exactPhrases: [
      "erc 1155",
      "erc1155",
      "eip 1155",
      "erc 1115",
      "erc1115",
      "1115",
      "1155",
      "multi token",
      "semi fungible",
      "safebatchtransferfrom",
    ],
    keywords: ["1155", "1115", "balanceofbatch", "onerc1155received"],
    answer: () =>
      [
        "### ERC-1155: Multi-Token Standard (Fungible, Semi-Fungible & NFTs)",
        "**ERC-1155** (often mistyped as `1115`) allows a single smart contract to manage an arbitrary number of fungible, semi-fungible, and non-fungible token types under one address, keyed by `(address owner, uint256 id) => uint256 balance`.",
        "",
        "- **Atomic Batch Operations:** `safeBatchTransferFrom` and `balanceOfBatch` move or query multiple token IDs in one transaction, eliminating per-token contract deployments and saving substantial gas across gaming inventories, LP positions, and RWA tranches.",
        "- **Semi-Fungibility Lifecycle:** A single ID can behave like a fungible ticket or bond tranche during minting/trading, and then transition into a unique collectible or redeemed receipt after settlement.",
        "- **Mandatory Receiver Hook:** Both single and batch transfers call `onERC1155Received` / `onERC1155BatchReceived` on contract recipients. Update internal accounting before invoking transfers to prevent callback reentrancy.",
      ].join("\n"),
  },
  {
    id: "erc-4337",
    exactCompact: ["erc4337", "eip4337", "4337", "aa"],
    exactPhrases: [
      "erc 4337",
      "erc4337",
      "eip 4337",
      "4337",
      "account abstraction",
      "useroperation",
      "userop",
      "entrypoint",
      "paymaster",
      "bundler",
      "what is aa",
    ],
    keywords: ["aa", "smart account", "gasless", "validateuserop", "alt mempool"],
    answer: () =>
      [
        "### ERC-4337: Account Abstraction (AA, Smart Accounts, Bundlers & Paymasters)",
        "**ERC-4337 (Account Abstraction / AA)** brings programmable smart-contract wallets to Ethereum without consensus-layer changes by routing pseudo-transactions called **UserOperations (`UserOp`)** through an alternative mempool.",
        "",
        "- **Execution Pipeline:** Users sign a `UserOperation` -> off-chain **Bundlers** simulate and pack multiple UserOps into one transaction -> the singleton **EntryPoint** contract calls `validateUserOp` on each Smart Account (supporting ECDSA, passkeys, multisig, or session keys) -> **EntryPoint** executes the wallet's calldata.",
        "- **Paymasters (Gas Sponsorship):** A `Paymaster` stakes ETH in the EntryPoint and implements `validatePaymasterUserOp` + `postOp` so users can pay gas in ERC-20 tokens (like USDC) or enjoy fully sponsored gasless UX.",
        "- **Security Boundaries:** Account execution functions must strictly gate `msg.sender == address(entryPoint)` (or owner), and bundlers enforce ERC-7562 storage access rules during validation to block mempool DoS attacks.",
        "- **In Amit's Portfolio:** Built both **ERC-4337 Account Abstraction Core** (https://github.com/NexTechArchitect/ERC4337-Account-Abstraction-Foundry) and **NexusPaymaster** (`0x20e302881494F79eF5E536d5533be04F913eE652`) for gasless 50x perp trading in **Nexus Perpetuals DEX**.",
      ].join("\n"),
  },
  {
    id: "erc-4626",
    exactCompact: ["erc4626", "eip4626", "4626", "5626", "erc5626"],
    exactPhrases: [
      "erc 4626",
      "erc4626",
      "eip 4626",
      "4626",
      "5626",
      "erc 5626",
      "erc5626",
      "tokenized vault",
      "inflation attack",
      "first depositor",
    ],
    keywords: ["vault", "converttoassets", "converttoshares", "totalassets", "shares"],
    answer: () =>
      [
        "### ERC-4626: Tokenized Vault Standard",
        "**ERC-4626** (sometimes mistyped as `5626`) standardizes yield-bearing vaults on top of ERC-20 so any DeFi protocol can compose with vaults through uniform `deposit`, `mint`, `withdraw`, `redeem`, `totalAssets`, `convertToShares`, and `convertToAssets` methods.",
        "",
        "- **Share/Asset Rounding Rule:** Conversions must always round in favor of the vault (round **down** shares minted on `deposit` and assets returned on `redeem`; round **up** assets pulled on `mint` and shares burned on `withdraw`) so attackers cannot extract dust via repeated deposit/redeem loops.",
        "- **First-Depositor Inflation Attack:** In a naive empty vault, an attacker deposits 1 wei for 1 share, donates 10,000 USDC directly via `transfer`, inflating share price so the next victim's deposit rounds down to `0` shares.",
        "- **Mitigations:** Use **virtual shares & virtual assets offsets** (OpenZeppelin `_decimalsOffset()`), burn initial dead shares (`1e3` to `address(0)`), or track internal accounted balances instead of raw `asset.balanceOf(address(this))`.",
        "- **In Amit's Portfolio:** **Sentinel Insurance Protocol** deploys `CoveragePool` (`0x374d949c7A575212d423Ecc0e765a59664d7C3eD`), an ERC-4626 vault routing idle underwriting capital into Aave V3 with virtual share inflation guards.",
      ].join("\n"),
  },
  {
    id: "erc-3643",
    exactCompact: ["erc3643", "eip3643", "3643", "trex"],
    exactPhrases: [
      "erc 3643",
      "erc3643",
      "eip 3643",
      "3643",
      "t rex",
      "onchainid",
      "permissioned token",
      "rwa standard",
      "real world asset",
    ],
    keywords: ["rwa", "tokenization", "kyc", "compliance", "identity registry"],
    answer: () =>
      [
        "### ERC-3643 (T-REX): Permissioned Institutional RWA Token Standard",
        "**ERC-3643** extends ERC-20 with modular on-chain identity and regulatory compliance checks executed automatically on every token transfer, mint, and burn.",
        "",
        "- **ONCHAINID & IdentityRegistry:** Investor wallets map to on-chain identity contracts holding cryptographic claims (KYC status, accredited investor tier, jurisdiction, sanctions clearance) signed by trusted claim issuers.",
        "- **Modular Transfer Compliance Hooks:** Before any transfer succeeds, the token queries `IdentityRegistry.isVerified(to)` and `Compliance.canTransfer(from, to, amount)` to enforce country caps, investor count limits, lockups, or OFAC screening natively on-chain without centralized signing servers.",
        "- **Forced Transfer & Recovery:** Regulated issuers retain auditable `forcedTransfer`, `freezePartialTokens`, and wallet-recovery hooks required for securities law compliance.",
        "- **In Amit's Portfolio:** **Nexus RWA Protocol** (https://nexus-rwa-protocol.vercel.app/) implements `ComplianceEngine` (`0x00c0E82e0C81c4Df096aAd98f2aA5A399b34131c`), `IdentityRegistry` (`0x18026c0BF58c978caDc8Df7f31b1cbC2f6A94c5A`), `nUSTB` token, O(1) Merkle yield distribution, and a 15% Chainlink NAV circuit breaker.",
      ].join("\n"),
  },
  {
    id: "erc-5484",
    exactCompact: ["erc5484", "eip5484", "5484"],
    exactPhrases: [
      "erc 5484",
      "erc5484",
      "eip 5484",
      "5484",
      "soulbound token",
      "soulbound",
      "burnauth",
    ],
    keywords: ["sbt", "non transferable", "reputation token"],
    answer: () =>
      [
        "### ERC-5484: Consensual Soulbound Tokens (SBTs)",
        "**ERC-5484** extends ERC-721 to define non-transferable **Soulbound Tokens** with explicit, immutable burn authorization agreed upon at issuance.",
        "",
        "- **Non-Transferability:** Transfer functions revert once minted, binding credentials, audit badges, DAO reputation, or KYC attestations permanently to a recipient address.",
        "- **Immutable `BurnAuth` Enum:** Every token records one of four immutable burn permissions at mint time: `IssuerOnly`, `OwnerOnly`, `Both`, or `Neither`, emitted via `Issued(from, to, tokenId, burnAuth)` and readable via `burnAuth(tokenId)`.",
        "- **In Amit's Portfolio:** **ERC-5484 Soulbound Reputation** (https://rst-reputation-protocol.vercel.app/) renders dynamic on-chain SVG medals directly from packed contract state behind a storage-gap-safe UUPS proxy (`ReputationStorageV1.sol`).",
      ].join("\n"),
  },
  {
    id: "erc-2612",
    exactCompact: ["erc2612", "eip2612", "2612"],
    exactPhrases: [
      "erc 2612",
      "erc2612",
      "eip 2612",
      "2612",
      "permit",
      "gasless approval",
      "gasless approve",
    ],
    keywords: ["permit", "nonces", "domain_separator"],
    answer: () =>
      [
        "### ERC-2612: Gasless Token Approvals via `permit()`",
        "**ERC-2612** adds a `permit(owner, spender, value, deadline, v, r, s)` function to ERC-20 tokens, letting users grant allowances with an off-chain **EIP-712** signature instead of sending an on-chain `approve()` transaction.",
        "",
        "- **Single-Transaction UX:** A DeFi router or vault submits the user's `permit` signature and executes `transferFrom` inside the same transaction, removing the two-tx approve-then-deposit flow and letting relayers pay gas.",
        "- **Security Gotchas:** Always verify `block.timestamp <= deadline`, increment per-owner `nonces[owner]++` to prevent replay, check `ecrecover != address(0)`, and wrap `permit()` in `try/catch` inside routers so an attacker cannot front-run and DoS a user's `permit + deposit` bundle by submitting the signature first.",
      ].join("\n"),
  },
  {
    id: "erc-2981",
    exactCompact: ["erc2981", "eip2981", "2981"],
    exactPhrases: [
      "erc 2981",
      "erc2981",
      "eip 2981",
      "2981",
      "nft royalty",
      "nft royalties",
      "royaltyinfo",
    ],
    keywords: ["royalties", "royalty"],
    answer: () =>
      [
        "### ERC-2981: NFT Royalty Standard",
        "**ERC-2981** provides a standardized read-only interface for ERC-721 and ERC-1155 contracts to declare secondary-sale royalty payouts across marketplaces.",
        "",
        "- **Single Function Interface:** `royaltyInfo(uint256 tokenId, uint256 salePrice)` returns `(address receiver, uint256 royaltyAmount)` computed in basis points (e.g., `500 / 10_000` for 5%) and advertises support via ERC-165 (`0x2a55205a`).",
        "- **Important Limitation:** ERC-2981 is **advisory, not protocol-enforced** at the transfer layer. Compliant marketplaces (or protocols with transfer validators) query `royaltyInfo` and route the payment during settlement.",
      ].join("\n"),
  },
  {
    id: "erc-3156",
    exactCompact: ["erc3156", "eip3156", "3156"],
    exactPhrases: [
      "erc 3156",
      "erc3156",
      "eip 3156",
      "3156",
      "flash loan standard",
      "onflashloan",
      "ierc3156",
    ],
    keywords: ["3156", "flashlender", "flashborrower"],
    answer: () =>
      [
        "### ERC-3156: Standardized Flash Loans (`IERC3156FlashLender` & `Borrower`)",
        "**ERC-3156** defines a uniform interface for single-asset uncollateralized flash loans across DeFi lenders (MakerDAO/Spark, ERC-4626 lenders, custom pools) so borrowers do not need per-protocol adapters.",
        "",
        "- **Core Methods:** `maxFlashLoan(token)`, `flashFee(token, amount)`, and `flashLoan(receiver, token, amount, data)` on the lender; `onFlashLoan(initiator, token, amount, fee, data)` on the borrower returning `keccak256(\"ERC3156FlashBorrower.onFlashLoan\")`.",
        "- **Critical Borrower Security Checks:** Inside `onFlashLoan`, ALWAYS verify BOTH `msg.sender == trustedLender` AND `initiator == address(this)` (or authorized caller). Skipping either check lets an attacker trigger your borrower callback with arbitrary `data` and drain approved tokens.",
      ].join("\n"),
  },
  {
    id: "erc-1967-uups",
    exactCompact: [
      "erc1967",
      "eip1967",
      "1967",
      "erc1822",
      "eip1822",
      "1822",
      "19000",
      "erc19000",
      "uups",
    ],
    exactPhrases: [
      "erc 1967",
      "erc1967",
      "eip 1967",
      "1967",
      "erc 1822",
      "erc1822",
      "eip 1822",
      "1822",
      "19000",
      "erc 19000",
      "uups",
      "transparent proxy",
      "storage collision",
      "storage gap",
      "upgradeable proxy",
    ],
    keywords: ["proxy", "upgradeable", "beacon proxy", "__gap", "initializer"],
    answer: () =>
      [
        "### ERC-1967 & EIP-1822 (UUPS): Upgradeable Proxies & Storage Safety",
        "**ERC-1967** (sometimes mistyped as `19000`) and **EIP-1822 (UUPS)** define how upgradeable EVM contracts separate persistent state (Proxy) from upgradeable logic (Implementation) via `delegatecall`.",
        "",
        "- **ERC-1967 Unstructured Storage Slots:** Stores the implementation, admin, and beacon addresses at deterministic pseudo-random slots such as `bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1)` so proxy metadata can never collide with Slot 0 of the implementation contract.",
        "- **UUPS (EIP-1822) vs. Transparent Proxy:** Transparent proxies keep upgrade logic in the proxy and check `msg.sender == admin` on every call. **UUPS** moves `upgradeToAndCall` + `_authorizeUpgrade` into the implementation contract, making proxies cheaper to deploy and execute (every V2+ implementation must retain UUPS inheritance or upgrades lock permanently).",
        "- **Storage Collisions & `__gap`:** Never reorder, delete, or change the type of existing state variables across upgrades. Reserve `uint256[48] private __gap;` (or adopt ERC-7201 namespaced storage), call `_disableInitializers()` in the implementation constructor, and diff storage layouts in Foundry CI.",
        "- **In Amit's Portfolio:** Inspect **UUPS Upgradeable Protocol** (https://github.com/NexTechArchitect/uups-protocol-config) and `ReputationStorageV1.sol` in the Workbench.",
      ].join("\n"),
  },
  {
    id: "erc-2535",
    exactCompact: ["erc2535", "eip2535", "2535"],
    exactPhrases: [
      "erc 2535",
      "erc2535",
      "eip 2535",
      "2535",
      "diamond proxy",
      "diamond standard",
      "diamondcut",
      "diamondloupe",
    ],
    keywords: ["facets", "diamond"],
    answer: () =>
      [
        "### ERC-2535: Diamond Proxy Standard (Multi-Facet Proxies)",
        "**ERC-2535 (Diamonds)** lets a single proxy contract delegate function calls to an unlimited number of modular implementation contracts called **Facets**, mapped by 4-byte function selector.",
        "",
        "- **Bypassing the 24KB EIP-170 Limit:** Complex protocols split logic across focused facets while sharing one unified address and storage state.",
        "- **Core Interfaces:** `IDiamondCut.diamondCut(...)` atomically adds, replaces, or removes function selectors across facets; `IDiamondLoupe` provides on-chain introspection (`facets()`, `facetAddress(selector)`) so block explorers and auditors can inspect active routing.",
        "- **AppStorage / Diamond Storage:** Facets isolate state inside structs anchored at unique `keccak256` storage positions (similar to ERC-7201) to avoid slot collisions across independent upgrades.",
      ].join("\n"),
  },
  {
    id: "erc-6551",
    exactCompact: ["erc6551", "eip6551", "6551"],
    exactPhrases: [
      "erc 6551",
      "erc6551",
      "eip 6551",
      "6551",
      "token bound account",
      "token bound accounts",
    ],
    keywords: ["tba", "6551"],
    answer: () =>
      [
        "### ERC-6551: Token Bound Accounts (TBAs)",
        "**ERC-6551** gives any existing or new **ERC-721 NFT** its own deterministic smart contract wallet without modifying the original NFT contract.",
        "",
        "- **Deterministic Registry (`CREATE2`):** A permissionless singleton Registry deploys minimal ERC-1167 proxies whose address is deterministically derived from `(chainId, tokenContract, tokenId, implementation, salt)`.",
        "- **Dynamic Ownership:** Whoever currently owns the NFT (`IERC721(tokenContract).ownerOf(tokenId)`) automatically controls the TBA, allowing an NFT to hold ETH, ERC-20s, other NFTs, DeFi positions, or on-chain reputation that travel atomically when the NFT is sold or transferred.",
      ].join("\n"),
  },
  {
    id: "erc-7702",
    exactCompact: ["erc7702", "eip7702", "7702"],
    exactPhrases: [
      "erc 7702",
      "erc7702",
      "eip 7702",
      "7702",
      "eoa code delegation",
      "pectra",
      "set eoa account code",
    ],
    keywords: ["7702", "delegation indicator"],
    answer: () =>
      [
        "### EIP-7702: EOA Smart Account Code Delegation",
        "**EIP-7702** (shipped in Ethereum's Pectra upgrade) introduces a transaction type (`0x04`) that lets a standard **EOA** sign an authorization tuple pointing its account code to a smart contract delegation indicator (`0xef0100 || contractAddress`).",
        "",
        "- **Smart Wallet UX Without Migration:** Existing EOAs gain atomic batching (`approve + swap` in one tx), gas sponsorship, and session keys without moving funds to a new ERC-4337 smart account address.",
        "- **Synergy with ERC-4337:** An EOA can delegate to an ERC-4337-compatible account implementation and immediately use existing bundlers and paymasters.",
        "- **Security Caution:** Delegated code executes in the EOA's storage context; use ERC-7201 namespaced storage to prevent collisions on re-delegation, and guard against phishing authorizations.",
      ].join("\n"),
  },
  {
    id: "eip-712",
    exactCompact: ["eip712", "erc712", "712"],
    exactPhrases: [
      "eip 712",
      "eip712",
      "erc 712",
      "712",
      "typed structured data",
      "domain separator",
      "signtypeddata",
      "signature replay",
      "signature malleability",
    ],
    keywords: ["712", "ecrecover", "malleability"],
    answer: () =>
      [
        "### EIP-712, Signature Replay & ECDSA Malleability Defense",
        "**EIP-712** replaces opaque hex signing with human-readable, domain-scoped structured signatures (`eth_signTypedData_v4`).",
        "",
        "- **Domain Separator (`DOMAIN_SEPARATOR`):** Hashes `(name, version, chainId, verifyingContract)` with the typed struct hash prefixed by `0x1901`. Binding `chainId` and `verifyingContract` closes cross-chain and cross-contract replay vectors.",
        "- **Nonce & Deadline Guards:** Track per-signer `nonces[signer]++` (or claimed bitmaps) and enforce `block.timestamp <= deadline` so valid signatures cannot be replayed or held indefinitely.",
        "- **ECDSA Malleability & Zero-Address Check:** Raw `ecrecover` returns `address(0)` on invalid signatures and accepts flipped `s` values (`secp256k1n - s`). Always use OpenZeppelin `ECDSA.recover`, which rejects `s > secp256k1n/2` and reverts on `address(0)`.",
        "- **In Amit's Portfolio:** Used in **Merkle-712 Airdrop Protocol** (https://github.com/NexTechArchitect/Siso-Merkle-Airdrop) for relayer-sponsored gasless Merkle proof claims.",
      ].join("\n"),
  },
  {
    id: "eip-1153",
    exactCompact: ["eip1153", "erc1153", "1153"],
    exactPhrases: [
      "eip 1153",
      "eip1153",
      "1153",
      "transient storage",
      "tload",
      "tstore",
    ],
    keywords: ["transient"],
    answer: () =>
      [
        "### EIP-1153: Transient Storage (`TLOAD` & `TSTORE`)",
        "**EIP-1153** (activated in Dencun) adds transaction-scoped key-value storage via `TLOAD` and `TSTORE` opcodes that behave like `SLOAD`/`SSTORE` during a transaction and automatically reset to zero when the transaction ends.",
        "",
        "- **100 Gas Flat Cost:** Both `TLOAD` and `TSTORE` cost **100 gas** with zero storage refund complexity, compared to 2,100-22,100 gas for persistent `SLOAD`/`SSTORE`.",
        "- **Key DeFi Use Cases:** Ultra-cheap **ReentrancyGuard** locks (`ReentrancyGuardTransient`), temporary callback context passing, and **Uniswap V4 Flash Accounting** where multi-hop swap deltas are tracked transiently and settled once at the end of `unlock()`.",
        "- **Security Rule:** Never assume transient storage clears between nested subcalls inside the same transaction unless you explicitly reset it, and remember `TSTORE` reverts inside `staticcall` frames.",
      ].join("\n"),
  },
  {
    id: "eip-1559",
    exactCompact: ["eip1559", "1559"],
    exactPhrases: [
      "eip 1559",
      "eip1559",
      "1559",
      "base fee",
      "priority fee",
      "fee burn",
    ],
    keywords: ["1559", "basefee", "maxfeepergas", "maxpriorityfeepergas"],
    answer: () =>
      [
        "### EIP-1559: Ethereum Fee Market & Base Fee Burn",
        "**EIP-1559** replaced first-price gas auctions with a two-part fee model and elastic block sizes targeting 50% capacity (15M gas target, 30M+ gas cap).",
        "",
        "- **Dynamic `baseFeePerGas`:** Protocol-adjusted block by block (up to +/-12.5% per block) based on whether the previous block exceeded or stayed below target gas. **100% of the base fee is burned**, removing ETH supply and preventing validators from spoofing congestion for fee capture.",
        "- **`maxPriorityFeePerGas` (Tip) & `maxFeePerGas`:** Users specify the tip paid to the block builder/validator and an absolute fee ceiling; any excess `maxFee - (baseFee + priorityFee)` is refunded automatically.",
      ].join("\n"),
  },
  {
    id: "eip-4844",
    exactCompact: ["eip4844", "4844"],
    exactPhrases: [
      "eip 4844",
      "eip4844",
      "4844",
      "proto danksharding",
      "danksharding",
      "blob transactions",
      "blob gas",
      "blobs",
    ],
    keywords: ["4844", "kzg", "data availability", "l2 fees", "blob"],
    answer: () =>
      [
        "### EIP-4844: Proto-Danksharding (Blobs & L2 Data Availability)",
        "**EIP-4844** introduced Type-3 **blob-carrying transactions** with a dedicated, independent fee market designed specifically for L2 rollup data availability.",
        "",
        "- **Ephemeral Blobs (~128 KB each):** Rollups (Arbitrum, Optimism, Base, zkSync, Scroll) post compressed transaction batches inside blobs instead of permanent EVM `calldata`. Nodes prune blob data after ~18 days while preserving cryptographic **KZG versioned hash commitments** accessible on-chain via the `BLOBHASH` opcode.",
        "- **10x-100x L2 Cost Reduction:** Because blobs have their own multidimensional fee market (`BLOBBASEFEE`), L1 execution spikes no longer price out L2 rollups.",
      ].join("\n"),
  },
  {
    id: "call-delegatecall-staticcall",
    exactPhrases: [
      "delegatecall",
      "staticcall",
      "delegatecall vs call",
      "call vs delegatecall",
      "call vs staticcall",
      "return data bomb",
    ],
    keywords: ["low level call", "returndatacopy"],
    answer: () =>
      [
        "### EVM External Calls: `call` vs. `delegatecall` vs. `staticcall`",
        "Understanding execution context is critical for proxies, routers, and security reviews:",
        "",
        "- **`call`:** Executes target code in the **target's** storage context (`msg.sender` becomes the calling contract; `address(this)` is the target; can send ETH and mutate target storage).",
        "- **`delegatecall`:** Executes target code in the **caller's** storage context (`msg.sender`, `msg.value`, and storage slots stay identical to the caller). Powers UUPS, Transparent, and Diamond proxies, but any `delegatecall` to an untrusted target lets the target overwrite caller storage or `selfdestruct`.",
        "- **`staticcall`:** Same as `call` except any state-modifying opcode (`SSTORE`, `TSTORE`, `LOG*`, `CREATE`, ETH transfer) reverts immediately. Used by `view`/`pure` external calls.",
        "- **Return-Data Bomb Defense:** Calling an untrusted contract via Solidity high-level or raw `.call` automatically copies all returned bytes into memory, letting a malicious callee spike quadratic memory expansion gas. Use bounded inline assembly (`returndatacopy` capped to max bytes) when invoking untrusted targets.",
      ].join("\n"),
  },
  {
    id: "create2-deterministic",
    exactPhrases: [
      "create2",
      "deterministic address",
      "deterministic deployment",
      "counterfactual",
      "metamorphic contract",
    ],
    keywords: ["create2", "salt", "initcode"],
    answer: () =>
      [
        "### `CREATE2`: Deterministic Smart Contract Deployment",
        "`CREATE2` (EIP-1014) computes a contract's deployment address before it is ever deployed on-chain:",
        "",
        "- **Formula:** `address = keccak256(0xff ++ deployerAddress ++ salt ++ keccak256(initCode))[12:]` (unlike `CREATE`, it does NOT depend on the deployer's nonce).",
        "- **Key Web3 Use Cases:** Identical multi-chain protocol addresses across Ethereum/L2s, counterfactual **ERC-4337** smart accounts (receive funds before wallet deployment), **Uniswap V2/V3** deterministic pair addresses, and **ERC-6551** Token Bound Accounts.",
        "- **Security Note:** Including constructor args inside `initCode` binds configuration to the address; historically `CREATE2` + `SELFDESTRUCT` enabled metamorphic contract swaps (largely neutralized post-Dencun EIP-6780, which restricts `SELFDESTRUCT` to same-transaction creation).",
      ].join("\n"),
  },
  {
    id: "abi-encoding",
    exactPhrases: [
      "abi encode",
      "abi encodepacked",
      "abi encodecall",
      "abi encoding",
      "abi decoding",
      "hash collision",
      "function selector",
    ],
    keywords: ["encodepacked", "encodewithselector", "calldata layout"],
    answer: () =>
      [
        "### Solidity ABI Encoding & Hash Collision Prevention",
        "Choosing the wrong ABI encoder is a frequent source of subtle signature and Merkle bugs:",
        "",
        "- **`abi.encode(...)`:** Pads every argument to 32-byte words with explicit length/offset pointers for dynamic types (`string`, `bytes`, arrays). Safe for hashing multiple dynamic arguments.",
        "- **`abi.encodePacked(...)` Collision Hazard:** Concatenates tight raw bytes without padding. Passing two dynamic types like `(\"ab\", \"c\")` and `(\"a\", \"bc\")` produces the **exact same keccak256 hash**, breaking signature verification or Merkle leaves! Never pass multiple dynamic arguments to `abi.encodePacked`.",
        "- **`abi.encodeCall(IFoo.bar, (a, b))`:** Compile-time type-checked alternative to `abi.encodeWithSignature` / `abi.encodeWithSelector`, eliminating silent selector typos.",
      ].join("\n"),
  },
  {
    id: "rounding-fixed-point",
    exactPhrases: [
      "rounding direction",
      "muldiv",
      "fixed point math",
      "precision loss",
      "divide before multiply",
      "wad",
      "ray",
    ],
    keywords: ["muldivup", "muldivdown", "rounding"],
    answer: () =>
      [
        "### DeFi Fixed-Point Math, `mulDiv` & Rounding Direction",
        "Solidity has no native floating-point types, so DeFi protocols encode fractional values as scaled integers (typically **WAD = `1e18`** or **RAY = `1e27`**).",
        "",
        "- **Always Multiply Before Dividing:** `(a / b) * c` truncates toward zero early and destroys precision; use 512-bit intermediate math (`Math.mulDiv(a, c, b)` from OpenZeppelin or Solady `FixedPointMathLib`) so `a * c` never overflows `uint256` before dividing by `b`.",
        "- **Protocol-Favorable Rounding Rule:** Every vault, AMM, and lending market must round **against the user** (round DOWN payouts/shares minted; round UP debt/assets pulled). Rounding in the user's favor by even 1 wei enables zero-cost dust extraction loops.",
      ].join("\n"),
  },
  {
    id: "access-control-timelock",
    exactPhrases: [
      "access control",
      "ownable2step",
      "timelock",
      "timelockcontroller",
      "rbac",
      "multisig",
      "pause breaker",
    ],
    keywords: ["ownable", "gnosis safe", "pausable"],
    answer: () =>
      [
        "### Smart Contract Access Control, RBAC & Timelocks",
        "Privileged admin keys are one of the highest-impact single points of failure in DeFi:",
        "",
        "- **Two-Step Ownership (`Ownable2Step`):** Prevents permanently bricking admin control from a mistyped address by requiring the new owner to explicitly call `acceptOwnership()`.",
        "- **Granular RBAC (`AccessControl`):** Separates duties (`PAUSER_ROLE`, `ORACLE_ADMIN_ROLE`, `UPGRADER_ROLE`) instead of granting one god-key total authority.",
        "- **TimelockController + Multisig:** Parameter updates, treasury sweeps, and UUPS upgrades queue behind a 24h-72h `TimelockController` controlled by a multisig or DAO so users can inspect changes and exit before execution (used in Amit's **Sentinel DAO Governance** and **Sentinel Insurance Protocol**).",
      ].join("\n"),
  },
  {
    id: "custom-errors",
    exactPhrases: [
      "custom error",
      "custom errors",
      "revert string",
      "revert strings",
      "require vs",
    ],
    keywords: ["eip-170", "4-byte", "revert"],
    answer: () =>
      [
        "### Custom Errors vs. Revert Strings in Solidity 0.8+",
        "Custom errors (`error Unauthorized(address caller);`) outperform string-based `require(..., \"...\")` checks in production EVM contracts:",
        "",
        "- **Deployment Bytecode Savings:** Revert strings embed full UTF-8 byte arrays into runtime bytecode, inflating deploy gas and pushing protocols toward the 24KB EIP-170 contract size limit. Custom errors encode only a 4-byte function selector (`keccak256(\"Unauthorized(address)\")[0:4]`).",
        "- **Runtime Revert Gas:** Reverting with a custom error skips dynamic string ABI headers and memory expansion, saving gas on failing transactions and keeper simulations.",
        "- **Typed Diagnostics:** Structured error parameters (like `FlashLoanSnapshotViolation(uint256 queryBlock, uint256 currentBlock)` in Amit's `ClaimsGovernor.sol`) decode cleanly in Foundry, Viem, and Wagmi.",
      ].join("\n"),
  },
  {
    id: "yul-storage-gas",
    exactPhrases: [
      "yul",
      "inline assembly",
      "storage packing",
      "slot packing",
      "calldata vs memory",
      "memory vs calldata",
      "storage vs memory",
      "unchecked arithmetic",
      "evm opcodes",
      "gas optimization",
      "gas mechanics",
      "mload",
      "mstore",
      "sload",
      "sstore",
    ],
    keywords: [
      "assembly",
      "opcodes",
      "calldata",
      "unchecked",
      "cold sload",
      "warm sload",
    ],
    answer: () =>
      [
        "### EVM Gas Mechanics, Storage Packing & Inline Yul Assembly",
        "On the EVM, state I/O dominates execution cost: a cold `SLOAD` costs **2,100 gas** (warm: 100), and a zero-to-nonzero `SSTORE` costs **22,100 gas** (vs. ~3 gas for `ADD`/`MLOAD`).",
        "",
        "- **Storage Slot Packing:** Group struct fields totaling <= 32 bytes into one 256-bit word (e.g., `uint64 score; uint64 lastUpdated; uint16 tier; bool revoked;` in Amit's `ReputationStorageV1.sol`) to turn multiple `SSTORE`s into one.",
        "- **`calldata` vs. `memory` vs. `storage`:** Keep read-only external params in `calldata` (immutable, zero copy cost); cache repeated `storage` reads into local stack/`memory` variables; wrap provably bounded loop increments in `unchecked { ++i; }`.",
        "- **Targeted Inline Yul (`mload`, `mstore`, `sload`, `sstore`):** Use Yul strictly on proven hot paths. In Amit's `SwapPopQueue.yul` (**On-Chain Automation Protocol**), 1-based index mappings + swap-and-pop removal + direct `sstore(activeIds.slot, lastIdx)` eliminate linear loop DoS and cut execution gas by up to **35%**.",
      ].join("\n"),
  },
  {
    id: "reentrancy-cei",
    exactPhrases: [
      "reentrancy",
      "checks effects interactions",
      "read only reentrancy",
      "cross function reentrancy",
      "reentrancyguard",
    ],
    keywords: ["cei"],
    answer: () =>
      [
        "### Reentrancy & Checks-Effects-Interactions (CEI) Pattern",
        "Reentrancy happens when an external call (native ETH `.call`, ERC-721/1155 receiver hooks, or ERC-777 callbacks) hands control to an untrusted contract before internal state balances or nonces finish updating.",
        "",
        "- **Strict CEI Ordering:** Validate all preconditions first (**Checks**), mutate every balance, debt, and nonce second (**Effects**), and perform external transfers or calls last (**Interactions**).",
        "- **Cross-Function & Read-Only Reentrancy:** Guard state-changing functions with OpenZeppelin `ReentrancyGuard` (or gas-cheap **EIP-1153 `TLOAD`/`TSTORE` transient storage locks**), and beware **read-only reentrancy** where an external protocol reads a stale view function (like LP share price) mid-callback.",
        "- **In Amit's Portfolio:** In `CCIPMarginReceiver.sol` (**Nexus Perpetuals DEX**), `processedMessages[messageId] = true` is locked strictly before `_depositMargin(...)` executes.",
      ].join("\n"),
  },
  {
    id: "flash-loan-governance",
    exactPhrases: [
      "flash loan",
      "flash loans",
      "flashloan",
      "governance attack",
      "snapshot defense",
      "vote buying",
    ],
    keywords: ["erc20votes", "checkpoint"],
    answer: () =>
      [
        "### Flash-Loan Attacks & Governance Snapshot Defense",
        "Flash loans provide uncollateralized, millions-of-dollars capital within a single atomic transaction as long as principal + fee are returned before the tx ends.",
        "",
        "- **Governance Takeover Vector:** If a DAO checks live `balanceOf(voter)` at the current `block.number`, an attacker can flash-borrow voting tokens, pass or swing a treasury proposal, and repay the loan inside one block.",
        "- **Oracle & Vault Manipulation Vector:** Attackers also use flash loans to skew spot AMM reserves (`getReserves()`) or inflate empty ERC-4626 share prices.",
        "- **Architectural Defenses:** Anchor voting weight to prior-block checkpoints (`snapshotBlock < block.number` via `ERC20Votes`, as implemented in Amit's `ClaimsGovernor.sol` for **Sentinel Insurance** and **Sentinel DAO**), enforce a `TimelockController` + Veto Council delay, and never price collateral from spot AMM reserves.",
      ].join("\n"),
  },
  {
    id: "oracle-manipulation",
    exactPhrases: [
      "oracle manipulation",
      "chainlink data feeds",
      "price oracle",
      "stale price",
      "circuit breaker",
      "twap",
      "aggregatorv3",
    ],
    keywords: ["oracle", "sequencer uptime", "staleness", "deviation"],
    answer: () =>
      [
        "### Oracle Manipulation, Chainlink Data Feeds & Circuit Breakers",
        "Spot DEX pool balances can be manipulated inside a single transaction via flash loans; production DeFi protocols rely on decentralized oracles with strict on-chain sanity checks.",
        "",
        "- **Mandatory Chainlink `latestRoundData()` Checks:** Verify `answer > 0`, `updatedAt > 0`, `block.timestamp - updatedAt <= HEARTBEAT`, `answeredInRound >= roundId`, and on L2s (Arbitrum/Optimism/Base) check the **Chainlink L2 Sequencer Uptime Feed** + grace period so liquidations do not fire on stale post-outage prices.",
        "- **Deviation Circuit Breakers:** Enforce max price-delta thresholds between updates so a misconfigured or compromised feed halts minting/redemptions automatically.",
        "- **In Amit's Portfolio:** `ComplianceHook.sol` (**Nexus RWA Protocol**) enforces a **15% 24-hour Chainlink NAV circuit breaker**, and **DSC StableCoin Engine** wraps Chainlink feeds in a dedicated `OracleLib` staleness guard.",
      ].join("\n"),
  },
  {
    id: "mev-sandwich",
    exactPhrases: [
      "mev",
      "sandwich attack",
      "front running",
      "frontrunning",
      "slippage protection",
      "back running",
      "flashbots",
    ],
    keywords: ["sandwich", "slippage", "mempool", "deadline", "amountoutmin"],
    answer: () =>
      [
        "### MEV, Sandwich Attacks, Front-Running & Slippage Protection",
        "**MEV (Maximal Extractable Value)** is profit extracted by block builders/searchers who reorder, insert, or censor transactions in the public mempool.",
        "",
        "- **Sandwich Attacks:** A searcher spots a large swap with loose slippage, **front-runs** it to push the pool price up, lets the victim execute at a worse rate, and **back-runs** by selling immediately for risk-free profit.",
        "- **Protocol-Level Protections:** Never hardcode `amountOutMin = 0`; require user-supplied `minAmountOut` and short `deadline` parameters (not `block.timestamp`, which is always satisfied when a stale tx gets mined later).",
        "- **Commit-Reveal & Private RPCs:** For auctions, mints, or sensitive liquidations, use commit-reveal schemes, batch auctions (CoW Swap / intent solvers), or private orderflow (Flashbots Protect / MEV-Share).",
      ].join("\n"),
  },
  {
    id: "amms-uniswap",
    exactPhrases: [
      "amm",
      "amms",
      "uniswap",
      "uniswap v2",
      "uniswap v3",
      "uniswap v4",
      "concentrated liquidity",
      "constant product",
      "impermanent loss",
      "uniswap hooks",
    ],
    keywords: ["x*y=k", "ticks", "poolmanager", "flash accounting"],
    answer: () =>
      [
        "### AMMs: Uniswap V2, V3 Concentrated Liquidity & V4 Hooks",
        "Automated Market Makers replace orderbooks with deterministic liquidity pool invariants:",
        "",
        "- **Uniswap V2 (`x * y = k`):** Spreads liquidity uniformly from price `0` to `infinity`. Simple, composable, and LP positions are fungible ERC-20 tokens, though capital efficiency is low.",
        "- **Uniswap V3 (Concentrated Liquidity):** LPs allocate capital within custom `[tickLower, tickUpper]` price ranges, multiplying capital efficiency and fee yield inside the active range (represented as ERC-721 positions, with steeper impermanent loss if price exits the range).",
        "- **Uniswap V4 (Singleton `PoolManager` & Hooks):** Consolidates all pools into a single contract with **EIP-1153 flash accounting** (netting multi-hop token deltas once at the end of a swap) and programmable **Hooks** (`beforeSwap`, `afterSwap`, `beforeAddLiquidity`) enabling dynamic fees, TWAMM orders, and on-chain KYC gates.",
      ].join("\n"),
  },
  {
    id: "lending-aave",
    exactPhrases: [
      "aave",
      "aave v3",
      "lending protocol",
      "health factor",
      "interest rate curve",
      "liquidation bonus",
      "collateralization",
    ],
    keywords: ["lending", "liquidation", "emode", "ltv", "kink", "utilization"],
    answer: () =>
      [
        "### DeFi Lending Protocols: Aave V3 Health Factor, Liquidations & Interest Curves",
        "Over-collateralized lending pools match passive depositors (earning yield via `aTokens`) with borrowers backed by collateral ratios enforced deterministically on-chain:",
        "",
        "- **Health Factor Formula:** `HF = (CollateralValueUSD * LiquidationThreshold) / TotalDebtUSD`. Whenever `HF < 1.0`, permissionless liquidators can repay part of the debt (close factor) and seize discounted collateral (`+ liquidationBonus`, e.g., 5%-10%) before bad debt accrues.",
        "- **Kinked Interest Rate Curve:** Borrow APY rises gradually with pool utilization (`Borrowed / TotalLiquidity`) up to an optimal utilization kink (e.g., 80%-90%), then climbs steeply past the kink to incentivize repayments and fresh liquidity.",
        "- **Aave V3 Risk Isolation:** Adds Efficiency Mode (**eMode**) for higher LTV on correlated pairs (e.g., wstETH/ETH), Isolation Mode debt ceilings, and supply/borrow caps.",
        "- **In Amit's Portfolio:** **Sentinel Insurance Protocol** routes ERC-4626 capital directly into Aave V3 reserves, and **DSC StableCoin Engine** implements a 200% min-collateral CDP with 10% liquidation bonuses verified via Foundry invariant fuzzing.",
      ].join("\n"),
  },
  {
    id: "perpetual-dex",
    exactPhrases: [
      "perpetual dex",
      "perpetuals",
      "perp dex",
      "funding rate",
      "funding rates",
      "isolated margin",
      "cross margin",
      "mark price",
    ],
    keywords: ["perps", "leverage", "liquidation price", "open interest"],
    answer: () =>
      [
        "### Perpetual DEX Architecture: Funding Rates, Margin & Liquidations",
        "Perpetual futures let traders hold leveraged long/short exposure with no expiry date by anchoring contract prices to spot via continuous funding payments:",
        "",
        "- **Funding Rates:** When perp **mark price** trades above spot **index price** (long-heavy skew), longs pay periodic funding to shorts; when mark < index, shorts pay longs. This keeps open interest balanced and protects LP vaults from directional insolvency.",
        "- **Isolated vs. Cross Margin:** Isolated margin caps a position's max loss to its dedicated collateral slice; cross margin pools account collateral across positions (higher capital efficiency, wider liquidation blast radius).",
        "- **Oracle Mark Pricing & Keepers:** Liquidations trigger deterministically when remaining margin drops below maintenance margin, executed by incentivized keeper bots using manipulation-resistant oracle feeds.",
        "- **In Amit's Portfolio:** Explore **Nexus Perpetuals DEX** (50x leverage, ERC-4337 gasless execution, Chainlink CCIP cross-chain margin: https://nexus-protocol-os.vercel.app/) and **Nexus Perps v2 on Polkadot Hub EVM**.",
      ].join("\n"),
  },
  {
    id: "staking-restaking",
    exactPhrases: [
      "staking",
      "restaking",
      "liquid staking",
      "eigenlayer",
      "avs",
      "steth",
      "reth",
      "slashing",
    ],
    keywords: ["lst", "lrt", "validator"],
    answer: () =>
      [
        "### Staking, Liquid Staking (LSTs) & Restaking (EigenLayer)",
        "Ethereum Proof-of-Stake secures L1 consensus with staked ETH, while LSTs and restaking extend that economic security across DeFi and middleware:",
        "",
        "- **Liquid Staking Tokens (LSTs):** Rebasing tokens like `stETH` adjust user balances daily (requiring wrapped `wstETH` inside DeFi vaults), whereas exchange-rate tokens like `rETH` or `cbETH` accrue yield by increasing the ETH-per-token redemption ratio.",
        "- **Restaking & AVSs (EigenLayer):** Validators opt into additional slashing conditions to secure Actively Validated Services (bridges, data availability layers, oracles, keeper networks) in exchange for extra yield.",
        "- **DeFi Integration Risks:** Watch withdrawal queue unbonding delays (depeg risk during mass exits), oracle pricing (price LSTs via exchange-rate + market bounds, never blindly 1:1 with ETH), and cascading slashing exposure in LRTs.",
      ].join("\n"),
  },
  {
    id: "l2-rollups",
    exactPhrases: [
      "l2",
      "layer 2",
      "rollup",
      "rollups",
      "optimistic rollup",
      "zk rollup",
      "arbitrum",
      "optimism",
      "zksync",
      "fraud proof",
      "validity proof",
    ],
    keywords: ["sequencer", "starknet", "scroll", "op stack"],
    answer: () =>
      [
        "### L2 Rollups: Optimistic vs. ZK Architecture",
        "Rollups execute transactions off L1 and inherit Ethereum security by posting compressed batch data (via EIP-4844 blobs) and state commitments back to L1:",
        "",
        "- **Optimistic Rollups (Arbitrum, Optimism, Base):** Assume state transitions are valid unless challenged during a ~7-day fraud-proof window. Offer near-100% EVM equivalence and simple prover infrastructure; fast exits rely on liquidity bridges.",
        "- **ZK Rollups (zkSync, Scroll, Starknet, Linea):** Attach succinct cryptographic **validity proofs** (SNARKs/STARKs) verifying execution immediately on L1, eliminating the 7-day withdrawal delay at the cost of heavier proving computation and subtle zkEVM opcode differences.",
        "- **L2 Smart Contract Gotchas:** Always check the **Chainlink L2 Sequencer Uptime Feed** before trusting prices, remember `block.number` semantics differ on Arbitrum (`ArbSys`), and avoid relying on L1-only assumptions about gas pricing (`L1 data fee + L2 execution fee`).",
      ].join("\n"),
  },
  {
    id: "fullstack-web3",
    exactPhrases: [
      "wagmi",
      "wagmi v2",
      "viem",
      "ethers",
      "ethers js",
      "the graph",
      "subgraph",
      "ipfs",
      "alchemy sdk",
      "full stack web3",
      "fullstack web3",
    ],
    keywords: ["multicall", "simulatecontract", "walletconnect", "rainbowkit"],
    answer: () =>
      [
        "### Full-Stack Web3 Engineering: Wagmi v2, Viem, Next.js, The Graph & IPFS",
        "Shipping a production DeFi application requires rock-solid client architecture on top of the Solidity layer:",
        "",
        "- **Viem & Wagmi v2:** TypeScript-first replacements for legacy Ethers.js v5 with strict ABI type inference, automatic **Multicall3** read batching, and `simulateContract` dry runs before prompting a user's wallet to sign `writeContract`.",
        "- **The Graph (Subgraphs) & Indexing:** RPC `eth_getLogs` does not scale for historical positions, liquidations, or yield leaderboards. Subgraphs index contract events into GraphQL schemas for instant, deterministic UI queries.",
        "- **IPFS & Decentralized Metadata:** Content-addressed CIDs (`ipfs://...`) guarantee NFT and governance proposal metadata cannot be silently swapped by a centralized web server.",
        "- **In Amit's Portfolio:** All 7 full-stack protocols (including **Nexus RWA**, **On-Chain Automation**, **Sentinel Insurance**, and **Nexus Perpetuals DEX**) pair Foundry Solidity cores with live Next.js, TypeScript, Wagmi, and Viem frontends.",
      ].join("\n"),
  },
  {
    id: "chainlink-suite",
    exactPhrases: [
      "chainlink",
      "chainlink ccip",
      "chainlink vrf",
      "chainlink automation",
      "cross chain interoperability",
      "verifiable random",
    ],
    keywords: ["ccip", "vrf", "upkeep", "automation"],
    answer: () =>
      [
        "### Chainlink Infrastructure: CCIP, VRF v2.5 & Automation",
        "Chainlink provides decentralized off-chain computation, verifiable randomness, and cross-chain messaging across EVM networks:",
        "",
        "- **Chainlink CCIP (Cross-Chain Interoperability Protocol):** Passes arbitrary data and token transfers across chains through independent Risk Management Networks. Receivers (`_ccipReceive`) must enforce **source-chain selector allowlists**, **trusted sender checks**, and **`messageId` replay protection** (see Amit's `CCIPMarginReceiver.sol`).",
        "- **Chainlink VRF v2.5:** Supplies cryptographically verifiable randomness via off-chain proof verified on-chain inside `fulfillRandomWords`, preventing miners/validators from biasing raffles or NFT trait reveals (used in Amit's **Automated Provably Fair Raffle**).",
        "- **Chainlink Automation (Keepers):** Decentralized nodes monitor off-chain `checkUpkeep` conditions and call `performUpkeep` on-chain (always re-validate upkeep conditions on-chain inside `performUpkeep`!).",
      ].join("\n"),
  },
  {
    id: "foundry-testing",
    exactPhrases: [
      "foundry",
      "forge test",
      "invariant testing",
      "stateful fuzzing",
      "fuzz testing",
      "fork testing",
      "anvil",
      "handler based",
    ],
    keywords: ["forge", "fuzz", "invariant", "cheatcodes", "chisel", "cast"],
    answer: () =>
      [
        "### Foundry Testing: Unit, Fuzz, Stateful Invariants & Mainnet Forks",
        "**Foundry** (`forge`, `anvil`, `cast`) runs Solidity-native tests directly on a Rust EVM at orders-of-magnitude higher speed than JS test runners:",
        "",
        "- **Stateless Fuzzing (`forge test`):** Pass arguments into `testFuzz_Deposit(uint256 amount)` and use `bound(amount, min, max)` (preferred over `vm.assume` to avoid wasted rejections) to test thousands of edge-case inputs automatically.",
        "- **Stateful Handler-Based Invariant Testing:** Define protocol invariants (e.g., `totalCollateralUsd >= totalDscMinted` in Amit's **DSC StableCoin Engine**) and route random multi-actor call sequences (`deposit -> mint -> crashPrice -> liquidate`) through bounded Handler contracts to uncover multi-step exploits.",
        "- **Mainnet Fork Testing (`--fork-url` / Anvil):** Run integration tests directly against live Ethereum/L2 state to verify real Aave V3 pools, Chainlink feeds, and ERC-4337 EntryPoint interactions before shipping.",
      ].join("\n"),
  },
  {
    id: "slither-auditing",
    exactPhrases: [
      "slither",
      "echidna",
      "smart contract audit",
      "auditing workflow",
      "static analysis",
      "formal verification",
      "security review",
    ],
    keywords: ["audit", "auditing", "halmos", "certora", "mythril"],
    answer: () =>
      [
        "### Smart Contract Auditing, Slither & Echidna Security Workflow",
        "Production DeFi security layers automated tooling on top of manual threat modeling:",
        "",
        "- **Static Analysis (Slither):** Parses Solidity AST/IR in seconds inside CI to catch reentrancy paths, uninitialized proxies, unchecked low-level calls, arbitrary `from` in `transferFrom`, shadowing, and divide-before-multiply precision loss.",
        "- **Property Fuzzing (Foundry Invariants & Echidna):** Explores stateful call sequences across actors to break accounting conservation, solvency, and access-control invariants.",
        "- **Manual Line-by-Line Threat Modeling:** Maps trust boundaries, economic attacks (flash loans, oracle lag, ERC-4626 inflation, rounding direction, weird ERC-20s, cross-chain replay, and UUPS storage layout diffs) before mainnet deployment.",
      ].join("\n"),
  },
  {
    id: "solidity-vyper-rust",
    exactPhrases: [
      "solidity vs vyper",
      "solidity vs rust",
      "vyper vs solidity",
      "rust vs solidity",
      "solana vs ethereum",
      "vyper",
      "solana",
    ],
    keywords: ["rust", "anchor", "vyper", "evm vs svm"],
    answer: () =>
      [
        "### Solidity vs. Vyper vs. Rust (Solana)",
        "Each smart contract language optimizes a different trade-off between ecosystem depth, auditability, and execution model:",
        "",
        "- **Solidity (EVM):** Dominant EVM language with the deepest audited library ecosystem (OpenZeppelin, Solmate, Solady), Foundry/Slither tooling, inline Yul assembly for low-level gas control, and universal deployment across Ethereum + EVM L2s.",
        "- **Vyper (EVM):** Pythonic EVM language intentionally omitting inheritance, function overloading, and inline assembly to prioritize readability and simple bytecode (famously used by Curve Finance), though with a smaller ecosystem.",
        "- **Rust / Anchor (Solana SVM):** Compiles to BPF/SBF on Solana's account-separated parallel runtime (Sealevel). High throughput and strong memory/type safety via Rust's borrow checker, paired with a steeper mental model around PDAs, explicit account passing, and signer/owner checks.",
      ].join("\n"),
  },
  {
    id: "tech-stack",
    exactPhrases: [
      "tech stack",
      "engineering stack",
      "skills",
      "what tools",
      "languages",
    ],
    keywords: ["stack", "tools", "experience"],
    answer: () => {
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
    },
  },
];

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

type ProjectIntent =
  | "walkthrough"
  | "gas"
  | "security"
  | "architecture"
  | "links"
  | "story";

function formatProjectLinks(project: ProjectItem): string[] {
  const lines: string[] = [];
  if (project.liveUrl) {
    lines.push(`- **Live App:** ${project.liveUrl}`);
  }
  lines.push(`- **GitHub:** ${project.link}`);
  return lines;
}

function formatProjectContracts(project: ProjectItem): string[] {
  if (project.smartContracts.length === 0) return [];
  const lines: string[] = ["- **Smart Contracts:**"];
  for (const c of project.smartContracts) {
    const addr = c.address ? ` (\`${c.address}\`)` : "";
    lines.push(`  - **${c.name}**${addr}: ${c.responsibility}`);
  }
  return lines;
}

function formatProjectWalkthrough(project: ProjectItem): string {
  const lines: string[] = [
    `### ${project.title}`,
    `**Category:** ${
      project.category === "fullstack"
        ? "Full-Stack Web3 Protocol"
        : "Core EVM Contract"
    } | **Network:** ${project.network} | **Standard:** ${project.standard}`,
    "",
    `**Story & Problem Solved:** ${project.story}`,
    "",
    `**Core Architecture:** ${project.architecture}`,
    "",
    ...formatProjectContracts(project),
    "",
    "- **Security Invariants:**",
    ...project.securityInvariants.map((inv) => `  - ${inv}`),
    "",
    "- **Gas Optimizations:**",
    ...project.gasOptimizations.map((opt) => `  - ${opt}`),
    "",
    `- **Key Highlight:** ${project.metric} (${project.metricDetail})`,
    `- **Tech Stack:** ${project.tech.join(", ")}`,
    ...formatProjectLinks(project),
  ];

  const relatedInsight = findInsightForProject(project);
  if (relatedInsight) {
    lines.push(
      `- **Workbench Code Reference:** \`${relatedInsight.filename}\` (${relatedInsight.outcome})`
    );
  }

  return lines.join("\n");
}

function formatProjectGasDeepDive(project: ProjectItem): string {
  const relatedInsight = findInsightForProject(project);
  const deployed = project.smartContracts.filter((c) => Boolean(c.address));
  const lines: string[] = [
    `### Gas Optimizations in ${project.title}`,
    `Built on **${project.network}** (${project.standard}), **${project.title}** minimizes EVM execution and storage cost through targeted contract-level optimizations:`,
    "",
    ...project.gasOptimizations.map((opt) => `- ${opt}`),
    "",
    `- **Key Metric:** ${project.metric} (${project.metricDetail})`,
  ];

  if (deployed.length > 0) {
    lines.push(
      `- **Deployed Contracts:** ${deployed
        .map((c) => `**${c.name}** (\`${c.address}\`)`)
        .join(", ")}`
    );
  }

  if (relatedInsight) {
    lines.push(
      `- **Related Workbench Code:** \`${relatedInsight.filename}\` (${relatedInsight.tradeoff})`
    );
  }

  lines.push(...formatProjectLinks(project));
  lines.push(
    "",
    `Want to inspect the **security invariants** or **smart contract architecture** of ${project.shortTitle} next?`
  );
  return lines.join("\n");
}

function formatProjectSecurityDeepDive(project: ProjectItem): string {
  const relatedInsight = findInsightForProject(project);
  const deployed = project.smartContracts.filter((c) => Boolean(c.address));
  const lines: string[] = [
    `### Security Invariants & Threat Model: ${project.title}`,
    `In **${project.title}** (${project.network} | ${project.standard}), security invariants are enforced at the contract boundary:`,
    "",
    ...project.securityInvariants.map((inv) => `- ${inv}`),
    "",
    `- **Architecture Context:** ${project.architecture}`,
  ];

  if (deployed.length > 0) {
    lines.push(
      `- **Deployed Contracts:** ${deployed
        .map((c) => `**${c.name}** (\`${c.address}\`)`)
        .join(", ")}`
    );
  }

  if (relatedInsight) {
    lines.push(
      `- **Related Workbench Guard:** \`${relatedInsight.filename}\` (${relatedInsight.outcome})`
    );
  }

  lines.push(...formatProjectLinks(project));
  lines.push(
    "",
    `Ask if you'd like a breakdown of ${project.shortTitle}'s **gas optimizations** or **individual contracts**.`
  );
  return lines.join("\n");
}

function formatProjectArchitectureDeepDive(project: ProjectItem): string {
  const lines: string[] = [
    `### Architecture & Smart Contracts: ${project.title}`,
    `**Network:** ${project.network} | **Standard:** ${project.standard} | **Stack:** ${project.tech.join(", ")}`,
    "",
    project.architecture,
    "",
    ...formatProjectContracts(project),
    "",
    ...formatProjectLinks(project),
  ];
  return lines.join("\n");
}

function formatProjectStoryDeepDive(project: ProjectItem): string {
  const lines: string[] = [
    `### Why Amit Built ${project.title}`,
    project.story,
    "",
    `**How It Works:** ${project.architecture}`,
    "",
    `- **Highlight:** ${project.metric} (${project.metricDetail})`,
    ...formatProjectLinks(project),
  ];
  return lines.join("\n");
}

function formatProjectLinksOnly(project: ProjectItem): string {
  const lines: string[] = [
    `### Links & Deployed References: ${project.title}`,
    `**Network:** ${project.network} | **Standard:** ${project.standard}`,
    "",
    ...formatProjectLinks(project),
  ];

  const deployed = project.smartContracts.filter((c) => Boolean(c.address));
  if (deployed.length > 0) {
    lines.push("- **Verified Contract Addresses:**");
    for (const c of deployed) {
      lines.push(`  - **${c.name}:** \`${c.address}\``);
    }
  }

  return lines.join("\n");
}

function formatProjectForIntent(
  project: ProjectItem,
  intent: ProjectIntent
): string {
  switch (intent) {
    case "gas":
      return formatProjectGasDeepDive(project);
    case "security":
      return formatProjectSecurityDeepDive(project);
    case "architecture":
      return formatProjectArchitectureDeepDive(project);
    case "story":
      return formatProjectStoryDeepDive(project);
    case "links":
      return formatProjectLinksOnly(project);
    case "walkthrough":
    default:
      return formatProjectWalkthrough(project);
  }
}

function formatProjectComparison(a: ProjectItem, b: ProjectItem): string {
  const formatContractsBrief = (p: ProjectItem) =>
    p.smartContracts.map((c) => `\`${c.name}\``).join(", ");

  return [
    `### Side-by-Side Comparison: ${a.title} vs. ${b.title}`,
    "",
    `**1. ${a.title}** (${a.network} | ${a.standard})`,
    `- **Problem Solved:** ${a.story}`,
    `- **Core Contracts:** ${formatContractsBrief(a)}`,
    `- **Top Security Invariant:** ${a.securityInvariants[0] ?? a.metricDetail}`,
    `- **Top Gas Optimization:** ${a.gasOptimizations[0] ?? a.metric}`,
    `- **Stack:** ${a.tech.join(", ")}`,
    ...(a.liveUrl ? [`- **Live App:** ${a.liveUrl}`] : []),
    `- **GitHub:** ${a.link}`,
    "",
    `**2. ${b.title}** (${b.network} | ${b.standard})`,
    `- **Problem Solved:** ${b.story}`,
    `- **Core Contracts:** ${formatContractsBrief(b)}`,
    `- **Top Security Invariant:** ${b.securityInvariants[0] ?? b.metricDetail}`,
    `- **Top Gas Optimization:** ${b.gasOptimizations[0] ?? b.metric}`,
    `- **Stack:** ${b.tech.join(", ")}`,
    ...(b.liveUrl ? [`- **Live App:** ${b.liveUrl}`] : []),
    `- **GitHub:** ${b.link}`,
    "",
    `Ask a follow-up on either **${a.shortTitle}** or **${b.shortTitle}** to drill into its contracts, invariants, or gas benchmarks.`,
  ].join("\n");
}

function detectProjectIntent(q: NormalizedQuery): ProjectIntent {
  const asksWalkthrough =
    /\b(walkthrough|walk me through|overview|full breakdown|everything about|deep dive|summarize|summary|all details)\b/.test(
      q.normalized
    );
  const asksGas =
    /\b(gas|yul|assembly|optimi[sz]\w*|sload|sstore|storage pack\w*|cheaper|cost|calldata|efficiency)\b/.test(
      q.normalized
    );
  const asksSecurity =
    /\b(security|invariants?|audit\w*|vulnerab\w*|attack\w*|threat\w*|risks?|reentrancy|flash ?loan|exploit\w*|safeguard\w*|fuzz\w*|slither|defen[cs]e)\b/.test(
      q.normalized
    );
  const asksArchitecture =
    /\b(architecture|smart contracts?|contracts?|components?|modules?|tech stack|stack|how does it work|how it works|design)\b/.test(
      q.normalized
    );
  const asksLinks =
    /\b(github|repo|repository|source code|live app|live demo|demo|url|links?|website|contract address\w*|addresses)\b/.test(
      q.normalized
    );
  const asksStory =
    /\b(story|why did|motivation|problem solved|what problem|purpose|background)\b/.test(
      q.normalized
    );

  const dimensionCount =
    Number(asksGas) +
    Number(asksSecurity) +
    Number(asksArchitecture) +
    Number(asksStory);

  if (asksWalkthrough || dimensionCount >= 2) {
    return "walkthrough";
  }
  if (asksGas) return "gas";
  if (asksSecurity) return "security";
  if (asksArchitecture) return "architecture";
  if (asksStory) return "story";
  if (asksLinks) return "links";
  return "walkthrough";
}

function matchWorkbenchSnippet(
  q: NormalizedQuery
): ArchitectureInsight | undefined {
  for (const insight of ARCHITECTURE_INSIGHTS) {
    const fname = insight.filename.toLowerCase();
    const baseName = fname.replace(/\.(sol|yul)$/, "");
    if (
      q.raw.toLowerCase().includes(fname) ||
      q.compact.includes(baseName) ||
      hasPhrase(q, baseName)
    ) {
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

function extractRepoSlug(githubUrl: string): string {
  const trimmed = githubUrl.replace(/\/+$/, "");
  const parts = trimmed.split("/");
  return (parts[parts.length - 1] ?? "").toLowerCase();
}

const EXPLICIT_PROJECT_THRESHOLD = 70;

function scoreProjects(
  q: NormalizedQuery,
  hasPortfolioContext: boolean
): Array<{ project: ProjectItem; score: number }> {
  const scored: Array<{ project: ProjectItem; score: number }> = [];

  for (const project of ALL_PROJECTS) {
    let score = 0;

    if (hasPhrase(q, project.title)) score += 220;
    if (project.shortTitle.length >= 4 && hasPhrase(q, project.shortTitle)) {
      score += 150;
    }

    const repoSlug = extractRepoSlug(project.link);
    if (repoSlug.length >= 6 && hasPhrase(q, repoSlug)) {
      score += 160;
    }

    for (const alias of project.aliases) {
      if (hasPhrase(q, alias)) {
        score += alias.length >= 6 ? 120 : 90;
      }
    }

    for (const c of project.smartContracts) {
      const cleanName = c.name.replace(/\.(sol|yul)$/i, "").split(" ")[0] ?? "";
      if (
        (cleanName.length >= 5 && hasPhrase(q, cleanName)) ||
        (c.address && q.raw.toLowerCase().includes(c.address.toLowerCase()))
      ) {
        score += 140;
      }
    }

    const secondary = PROJECT_STANDARD_SECONDARY[project.id] ?? [];
    for (const term of secondary) {
      if (hasPhrase(q, term)) {
        if (score > 0) {
          score += 25;
        } else if (hasPortfolioContext) {
          score += 45;
        } else {
          score += 4;
        }
      }
    }

    if (score > 0) {
      scored.push({ project, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function resolveProjectFromHistory(
  history?: readonly FallbackHistoryTurn[]
): ProjectItem | undefined {
  if (!history || history.length === 0) return undefined;
  const recent = history.slice(-4).reverse();

  for (const turn of recent) {
    const text = getTurnText(turn);
    if (!text) continue;

    // 1. Check exact heading match in recent assistant replies (e.g., "### Nexus Perps v2 (Polkadot Hub)")
    const firstLine = text.split("\n")[0]?.toLowerCase() ?? "";
    if (firstLine.startsWith("### ")) {
      for (const project of ALL_PROJECTS) {
        if (
          firstLine.includes(project.title.toLowerCase()) ||
          (project.shortTitle.length >= 5 &&
            firstLine.includes(project.shortTitle.toLowerCase()))
        ) {
          return project;
        }
      }
    }

    // 2. Otherwise score the turn text against all projects
    const turnQuery = normalizeQuery(text);
    const matches = scoreProjects(turnQuery, true);
    if (matches[0] && matches[0].score >= EXPLICIT_PROJECT_THRESHOLD) {
      return matches[0].project;
    }
  }

  return undefined;
}

function isLikelyProjectFollowUp(q: NormalizedQuery): boolean {
  const hasPronounOrDeictic =
    /\b(it|its|this one|that one|this project|that project|this protocol|that protocol|the project|the protocol|the contract|the contracts|same project|same protocol)\b/.test(
      q.normalized
    );

  const isShortDimensionFollowUp =
    q.tokens.size <= 8 &&
    /\b(gas|security|invariants?|risks?|contracts?|architecture|stack|github|repo|link|demo|live|story|why|address|addresses|audit|vulnerabilities|tradeoffs?|how does it|what about)\b/.test(
      q.normalized
    );

  return hasPronounOrDeictic || isShortDimensionFollowUp;
}

function scoreKnowledgeBase(
  q: NormalizedQuery,
  isConceptualQuestion: boolean
): Array<{ entry: KnowledgeEntry; score: number }> {
  const scored: Array<{ entry: KnowledgeEntry; score: number }> = [];

  for (const entry of WEB3_KNOWLEDGE_BASE) {
    let score = 0;

    if (entry.exactCompact) {
      for (const compactTerm of entry.exactCompact) {
        if (q.compact === compactTerm || q.tokens.has(compactTerm)) {
          score += 24;
        } else if (
          compactTerm.length >= 4 &&
          q.compact.includes(compactTerm)
        ) {
          score += 18;
        }
      }
    }

    for (const phrase of entry.exactPhrases) {
      if (hasPhrase(q, phrase)) {
        score += phrase.includes(" ") ? 15 : 12;
      }
    }

    for (const kw of entry.keywords) {
      if (hasPhrase(q, kw)) {
        score += 6;
      }
    }

    if (score > 0 && isConceptualQuestion) {
      score += 8;
    }

    if (score > 0) {
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
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
    "Ask about any specific protocol (for example **Nexus RWA**, **Nexus Perps v2**, **Sentinel Insurance**, or **DSC StableCoin**) to inspect contracts, security invariants, and gas mechanics.",
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
    `- **Flash-Loan & Governance Hardening:** ${
      govInsight
        ? govInsight.summary
        : "Prior-block vote checkpoints (block.number - 1) and TimelockController execution delays prevent same-block vote capture."
    } (\`ClaimsGovernor.sol\`)`,
    `- **O(1) Data Structures & Inline Yul:** ${
      yulInsight
        ? yulInsight.outcome
        : "Up to 35% execution gas reduction via 1-based index mappings, swap-and-pop removal, and direct storage length updates."
    } (\`SwapPopQueue.yul\`)`,
    `- **On-Chain Compliance & Oracle Circuit Breakers:** ${
      rwaInsight
        ? rwaInsight.summary
        : "ERC-3643 transfer hooks verify KYC/OFAC status on-chain alongside a 15% 24-hour Chainlink NAV deviation circuit breaker."
    } (\`ComplianceHook.sol\`)`,
    "- **Invariant Testing & Static Analysis:** Handler-based stateful Foundry fuzz campaigns, Anvil mainnet fork testing, Slither CI sweeps, strict Checks-Effects-Interactions (CEI), custom errors, and 50-slot UUPS storage gaps.",
    "",
    "Scroll to the **Workbench** section or ask me to explain `SwapPopQueue.yul`, `ClaimsGovernor.sol`, `ComplianceHook.sol`, `CCIPMarginReceiver.sol`, or `ReputationStorageV1.sol`.",
  ].join("\n");
}

function buildOverviewMenu(isGreeting: boolean): string {
  const opener = isGreeting
    ? "Hey! Great to meet you. I'm **Ask Amit**, Amit Kumar's personal protocol assistant."
    : "I can help with **Amit Kumar's (NexTechArchitect)** DeFi protocols, Solidity & Yul code, or deep Web3/EVM engineering questions:";

  return [
    opener,
    "",
    "- **Flagship & Gallery Protocols:** Ask for a deep dive or comparison on **Nexus RWA**, **On-Chain Automation**, **Sentinel Insurance**, **Nexus Perpetuals DEX**, **Nexus Perps v2 (Polkadot Hub)**, **DSC StableCoin**, **VRF Raffle**, **Merkle-712 Airdrop**, or any other gallery project.",
    "- **ERC / EIP Standards & DeFi Mechanics:** Ask about `ERC-20`, `ERC-721/721A`, `ERC-1155`, `ERC-4337` (AA), `ERC-4626`, `ERC-3643`, `ERC-5484`, `ERC-2612`, `ERC-2981`, `ERC-3156`, `ERC-1967/UUPS`, `ERC-2535` Diamonds, `ERC-6551`, `EIP-7702`, `EIP-712`, `EIP-1153`, `EIP-1559`, `EIP-4844`, `CREATE2`, Uniswap V2/V3/V4, Aave V3, MEV, L2 rollups, or Foundry invariant testing.",
    "- **Workbench & Contact:** Inspect `SwapPopQueue.yul`, `ClaimsGovernor.sol`, `ComplianceHook.sol`, `CCIPMarginReceiver.sol`, or reach Amit at `nextech.amit@gmail.com`.",
    "",
    "What would you like to explore first?",
  ].join("\n");
}

function buildHelpfulOffTopicReply(): string {
  return [
    "I'm currently running in local portfolio knowledge mode, where my focus is **Amit Kumar's DeFi protocols, smart contracts, and Web3/EVM engineering**.",
    "",
    "Here are a few things I can answer in depth right now:",
    "- **Project Deep Dives & Comparisons:** Ask about **Nexus Perps v2**, **Nexus RWA**, **Sentinel Insurance**, **On-Chain Automation**, **DSC StableCoin**, or compare any two protocols side by side.",
    "- **Web3 & Solidity Engineering:** Ask about ERC/EIP standards (`ERC-4337`, `ERC-4626`, `ERC-3643`, `EIP-712`, `EIP-1153`, `EIP-4844`), Foundry invariant testing, Yul gas optimization, MEV, or DeFi security.",
    "- **Connect Directly with Amit:** Email `nextech.amit@gmail.com` or open his **Resume** in the top navigation bar.",
  ].join("\n");
}

/**
 * Project-First + Multi-Turn + Sub-Intent offline reasoning engine grounded in
 * `src/data/projects.ts` and deep EVM/DeFi engineering knowledge.
 */
export function generateLocalFallbackReply(
  userMessage: string,
  history?: readonly FallbackHistoryTurn[]
): string {
  const q = normalizeQuery(userMessage);

  if (!q.normalized) {
    return sanitizeEditorialCopy(buildOverviewMenu(false));
  }

  // Step 0: Direct Workbench code file walkthrough (e.g. SwapPopQueue.yul, ClaimsGovernor.sol)
  const matchedSnippet = matchWorkbenchSnippet(q);
  if (matchedSnippet) {
    return sanitizeEditorialCopy(formatWorkbenchWalkthrough(matchedSnippet));
  }

  const hasPortfolioContext =
    /\b(amit|nextecharchitect|portfolio|his|your|flagship|built|shipped|deployed|protocol gallery|case study|walkthrough)\b/.test(
      q.normalized
    );

  const isConceptualQuestion =
    /^(what is|what are|whats|explain|define|how does|how do|difference between|compare|tell me about)\b/.test(
      q.normalized
    ) && !hasPortfolioContext;

  // Step 1: Project Detection First (10x Priority over generic words like "security" or "gas")
  const projectMatches = scoreProjects(q, hasPortfolioContext);
  const explicitProjects = projectMatches.filter(
    (m) => m.score >= EXPLICIT_PROJECT_THRESHOLD
  );

  // Side-by-side comparison if 2+ distinct projects are explicitly mentioned
  const asksComparison =
    /\b(compare|comparison|vs|versus|difference between|differ|better)\b/.test(
      q.normalized
    );
  if (
    explicitProjects.length >= 2 &&
    (asksComparison || explicitProjects[1].score >= 100)
  ) {
    return sanitizeEditorialCopy(
      formatProjectComparison(
        explicitProjects[0].project,
        explicitProjects[1].project
      )
    );
  }

  // Single explicit project matched -> tailor answer to user sub-intent
  if (explicitProjects.length >= 1) {
    const intent = detectProjectIntent(q);
    return sanitizeEditorialCopy(
      formatProjectForIntent(explicitProjects[0].project, intent)
    );
  }

  // Step 2: Pure greeting or capability menu
  const isPureGreeting =
    /^(hi|hello|hey|yo|hola|namaste|kaise ho|kya haal|gm|good morning|good afternoon|good evening|sup|greetings)(\s+(there|amit|bro|mate|man|kaise ho|kya haal))?$/.test(
      q.normalized
    );
  const asksCapabilities =
    /\b(what can you do|how can you help|help me|what do you know|menu|options)\b/.test(
      q.normalized
    );
  if (isPureGreeting || asksCapabilities) {
    return sanitizeEditorialCopy(buildOverviewMenu(isPureGreeting));
  }

  // Step 3: Explicit Flagship / Portfolio gallery overview
  const asksFlagshipOverview =
    /\b(flagship|top projects|best projects|all projects|what projects|his projects|your projects|project gallery|what has amit built|what did amit build|portfolio projects)\b/.test(
      q.normalized
    );
  if (asksFlagshipOverview) {
    return sanitizeEditorialCopy(buildFlagshipOverview());
  }

  // Step 4: Multi-Turn Follow-Up Memory (scan last 4 turns for active project)
  const knowledgeMatches = scoreKnowledgeBase(q, isConceptualQuestion);
  const topKnowledge = knowledgeMatches[0];
  const strongNewWeb3Concept =
    Boolean(topKnowledge) &&
    topKnowledge.score >= 22 &&
    !/\b(it|its|this project|that project|this protocol|that protocol)\b/.test(
      q.normalized
    );

  if (!strongNewWeb3Concept && isLikelyProjectFollowUp(q)) {
    const activeProject = resolveProjectFromHistory(history);
    if (activeProject) {
      const intent = detectProjectIntent(q);
      return sanitizeEditorialCopy(
        formatProjectForIntent(activeProject, intent)
      );
    }
  }

  // Step 5: Contact, hiring, resume, bio, or credentials (only when not asking for a project's github link)
  if (
    /\b(contact|connect|hire|hiring|email|reach|linkedin|github|twitter|resume|cv|location|where is amit|available|remote|background|education|certif|cyfrin|alchemy|who is amit|about amit)\b/.test(
      q.normalized
    ) &&
    !q.normalized.includes("alchemy sdk")
  ) {
    return sanitizeEditorialCopy(buildContactAndBioReply());
  }

  // Step 6: General Amit security & gas engineering overview (only when NO project matched)
  if (
    q.normalized.includes("security") &&
    (q.normalized.includes("gas") ||
      q.normalized.includes("approach") ||
      q.normalized.includes("optimization"))
  ) {
    return sanitizeEditorialCopy(buildSecurityAndGasReply());
  }

  // Step 7: Portfolio-contextualized secondary project match vs. Deep Web3 Knowledge Base
  const topProject = projectMatches[0];
  if (
    topProject &&
    hasPortfolioContext &&
    (!topKnowledge || topProject.score > topKnowledge.score)
  ) {
    const intent = detectProjectIntent(q);
    return sanitizeEditorialCopy(
      formatProjectForIntent(topProject.project, intent)
    );
  }

  if (topKnowledge) {
    return sanitizeEditorialCopy(topKnowledge.entry.answer());
  }

  // Step 8: Generic "projects" inquiry with no specific project matched
  if (q.tokens.has("projects") || q.tokens.has("project")) {
    return sanitizeEditorialCopy(buildFlagshipOverview());
  }

  // Step 9: Helpful off-topic fallback (never dead-end or unrelated dump)
  return sanitizeEditorialCopy(buildHelpfulOffTopicReply());
}
