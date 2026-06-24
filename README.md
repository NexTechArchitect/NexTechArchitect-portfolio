
<div align="center">

# 🌐 NexTechArchitect | Web3 Full-Stack Portfolio

A high-performance, interactive portfolio showcasing **13 production-grade Web3 projects** (8 Core Solidity Architectures & 5 Full-Stack dApps). Built with a focus on deep technical explanations, gas-optimized smart contracts, and seamless, cinematic modern user experiences.

🌍 **Live Demo:** [nex-tech-architect-portfolio.vercel.app](https://nex-tech-architect-portfolio.vercel.app/)

</div>

---

## 🛠️ Tech Stack & Ecosystem

### Frontend & UI
* **Next.js 14/15** (App Router)
* **React & TypeScript**
* **Tailwind CSS** (Custom responsive design)
* **Framer Motion & WebGL** (Complex 4D/5D fluid mesh canvas animations & cinematic transitions)

### Web3 & Smart Contracts
* **Solidity** (Gas-optimized, security-first)
* **Foundry & Hardhat** (Testing, Scripting & Deployment)
* **Ethers.js / Wagmi / Viem** (Frontend integration)

### Infrastructure & Security
* **Vercel** (Hosting & CI/CD)
* **Upstash Redis** (API Rate Limiting protection)

---

## 🏗️ Project Gallery (13 Projects)

### 💻 Full-Stack dApps (5)
End-to-end decentralized applications featuring robust on-chain logic paired with highly interactive, consumer-grade Next.js frontends.

1. **Sentinel Insurance Protocol:** A highly modular, security-first DeFi insurance architecture featuring ERC-4626 yield routing via Aave V3 and flash-loan resistant DAO adjudication.
2. **ERC-5484 On-Chain Reputation:** A fully on-chain reputation protocol built on Soulbound Tokens. Features mathematical scoring and dynamic on-chain SVG art generation with zero IPFS dependency.
3. **Nexus Perps v2 (Polkadot):** Advanced perpetuals infrastructure deployed on Polkadot Hub Testnet. Features automated price keepers, 50x leverage, and cross-chain margin relay. *(Hackathon Entry 🚀)*
4. **Nexus Protocol OS (ERC-4337):** An institutional-grade, fully on-chain Perpetuals DEX interface and core logic.
5. **Sentinel DAO Governance:** A complete modular decentralized autonomous organization platform featuring token-weighted voting mechanisms and Timelock execution.

### ⚙️ Core Solidity & Architecture (8)
Deep technical implementations of complex Ethereum standards, focusing on storage safety, gas efficiency, and cryptography.

1. **Account Abstraction Core (ERC-4337):** Custom EntryPoint validation and Paymaster gas sponsorship bypassing high-level SDKs.
2. **UUPS Upgradeable Protocol:** Demonstrating atomic state migrations, collision-proof EIP-1967 storage, and zero-overhead delegation.
3. **Merkle-712 Airdrop Protocol:** Gas-optimized (O(1)) distribution using off-chain trees and EIP-712 anti-front-running signatures.
4. **Decentralized Stablecoin Engine:** Mathematically modeled, exogenous, over-collateralized stablecoin system.
5. **Automated Provably Fair Raffle:** Decentralized gaming protocol utilizing Chainlink VRF and Automation.
6. **Oracle Funding Protocol:** Precision price-feed integration using Chainlink Data Networks.
7. **SISO Token Economy:** Advanced ERC-20 implementation with custom tokenomic mechanics and strict RBAC.
8. **CuteCat NFT Protocol:** Gas-optimized ERC-721 infrastructure demonstrating decentralized asset provenance (IPFS).

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
*(Note: Using `--legacy-peer-deps` is required to resolve Framer Motion and React 19 versioning)*
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

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the result.

---

## 🛡️ License & Disclaimer

This repository is for educational purposes and protocol exploration. The core smart contract concepts demonstrated are implemented for learning, and the code has not been formally audited. Do not deploy the contract logic to production without a thorough security review.

Designed & Built by **Amit (NexTechArchitect)**.

```

```
