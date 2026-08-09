
<div align="center">

# 🌐 NexTechArchitect | Web3 Full-Stack & Protocol Architecture Portfolio

A high-performance, interactive portfolio showcasing **15 production-grade Web3 projects** (7 Full-Stack dApps & 8 Core Solidity Architectures) deployed across **Base Mainnet**, **Ethereum Sepolia**, and **Polkadot Hub Testnet**.

Built with a focus on threat-modeled security, Yul-optimized gas reduction, invariant-proven solvency, and cinematic modern user experiences.

🌍 **Live Demo:** [nex-tech-architect-portfolio.vercel.app](https://nex-tech-architect-portfolio.vercel.app/)

</div>

---

## 🛠️ Tech Stack & Ecosystem

### Frontend & UI
* **Next.js 14/15** (App Router)
* **React & TypeScript**
* **Tailwind CSS** (Custom responsive design)
* **Framer Motion & WebGL** (3D Claymorphic Orbs, fluid mesh canvases, and smooth spring transitions)

### Smart Contracts & Security
* **Solidity 0.8.x & Yul** (EVM Inline Assembly, storage slot packing, O(1) data structures)
* **Foundry & Hardhat** (Stateful Invariant Fuzzing, Unit/Integration tests, Scripting & Deployment)
* **Slither v0.10** (Static analysis with 0 High/Critical findings across 70+ verified contracts)
* **Wagmi v2 / Viem / Ethers.js / RainbowKit** (Web3 frontend integrations)

### Standards & Protocols
* **ERC-3643 (RWA Compliance)** · **ERC-4337 (Account Abstraction)** · **ERC-[#0052FF] / ERC-4626 (Yield Vaults)** · **ERC-5484 (Soulbound)** · **ERC-20 / ERC-721 / ERC-1155**
* **Chainlink** (CCIP, VRF, Data Feeds, Automation/Keepers) · **Aave V3** · **OpenZeppelin** · **IPFS**

### Infrastructure
* **Base Mainnet** · **Ethereum Sepolia** · **Polkadot Hub Testnet**
* **Vercel** (CI/CD Hosting) · **Upstash Redis** (API Rate Limiting Protection)

---

## 🏗️ Project Gallery (15 Projects)

### 💻 Full-Stack dApps (7)
End-to-end decentralized applications featuring robust on-chain logic paired with highly interactive, consumer-grade Next.js frontends.

1. **Nexus RWA Protocol (Base Mainnet):** Institutional-grade Real-World Asset tokenization engine with real-time on-chain compliance (KYC/OFAC), Chainlink-automated Merkle yield drops at O(1) gas, and circuit-breaker-protected NAV oracles.
2. **On-Chain Automation Protocol (Base Mainnet):** Permissionless keeper network with ETH-bonded operator slashing, try/catch gas-griefing isolation, and O(1) swap-and-pop batch queues for autonomous job execution.
3. **Sentinel Insurance Protocol (Base Mainnet):** Modular DeFi insurance architecture featuring ERC-4626 yield routing via Aave V3, flash-loan resistant snapshot governance, and dynamic soulbound PolicyNFTs.
4. **ERC-5484 On-Chain Reputation:** On-chain reputation protocol built on Soulbound Tokens. Features mathematical scoring, UUPS upgradeable engine, and dynamic on-chain SVG art generation with zero IPFS dependency.
5. **Nexus Perps v2 (Polkadot Hub):** Non-custodial 50x leverage exchange deployed on Polkadot Hub Testnet. Features CCIP cross-chain margin relay, Binance WebSocket live PnL, and nonce replay protection. *(Polkadot Hackathon Entry)*
6. **Nexus Protocol OS (ERC-4337):** Institutional-grade perpetuals exchange featuring 100% gasless ERC-4337 paymasters, staleness-guarded Chainlink price feeds, and inflation-protected LP shares.
7. **Sentinel DAO Governance:** Modular governance platform featuring 48H TimelockController, minority treasury rage-quit module, Aave V3 yield integration, and ERC-4337 gasless voting.

### ⚙️ Core Solidity & Architecture (8)
Deep technical implementations of complex Ethereum standards, focusing on storage safety, gas efficiency, and cryptography.

1. **Account Abstraction Core (ERC-4337):** Custom EntryPoint validation and Paymaster gas sponsorship bypassing high-level SDKs.
2. **UUPS Upgradeable Protocol:** EIP-1822 storage-safe proxy migrations with gap arrays and EIP-1967 collision-proof layout.
3. **Merkle-712 Airdrop Protocol:** Gas-optimized (O(1)) distribution using off-chain Merkle trees and EIP-712 typed anti-front-running signatures.
4. **Decentralized Stablecoin Engine:** Mathematically modeled, exogenous, over-collateralized stablecoin system anchored via Chainlink price feeds.
5. **Automated Provably Fair Raffle:** Decentralized gaming protocol utilizing Chainlink VRF for randomness and Chainlink Automation for self-execution.
6. **Oracle Funding Protocol:** Precision price-feed integration using Chainlink Data Networks with staleness guards.
7. **SISO Token Economy:** Production-ready ERC-20 primitive with Role-Based Access Control (RBAC), deflationary burn mechanics, and emergency circuit breakers.
8. **CuteCat NFT Protocol:** Gas-optimized ERC-721 infrastructure demonstrating decentralized asset provenance with immutable IPFS metadata.

---

## ⚙️ Running Locally

If you want to run this project on your local machine, follow these steps:

### Prerequisites
* Node.js (v18 or higher)
* Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/NexTechArchitect/NexTechArchitect-portfolio.git](https://github.com/NexTechArchitect/NexTechArchitect-portfolio.git)
   cd NexTechArchitect-portfolio

```

2. **Install dependencies:**
*(Note: Using `--legacy-peer-deps` is required to resolve Framer Motion and React versioning)*
```bash
npm install --legacy-peer-deps

```


3. **Environment Variables:**
Create a `.env` file in the root directory and add your Upstash Redis keys for rate limiting:
```env
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

```


4. **Start the development server:**
```bash
npm run dev

```



Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛡️ License & Disclaimer

This repository is built for protocol exploration, architecture demonstration, and educational purposes. Smart contract concepts demonstrated are thoroughly tested with Foundry, but code should undergo formal auditing before deployment to production environments.

Architected & Built by **Amit (NexTechArchitect)**.

```

```
