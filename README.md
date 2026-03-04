
#  NexTechArchitect | Web3 Full-Stack Portfolio

A high-performance, interactive portfolio showcasing **10 production-grade Web3 projects** (8 Core Solidity Architectures & 2 Full-Stack dApps). Built with a focus on deep technical explanations, gas-optimized smart contracts, and seamless modern user experiences.

🌍 **Live Demo:** [nex-tech-architect-portfolio.vercel.app](https://nex-tech-architect-portfolio.vercel.app/)

---

## 🛠️ Tech Stack & Ecosystem

### Frontend & UI
* **Next.js 14** (App Router)
* **React & TypeScript**
* **Tailwind CSS** (Custom responsive design)
* **Framer Motion** (Complex 5D canvas animations & smooth transitions)

### Web3 & Smart Contracts
* **Solidity** (Gas-optimized, security-first)
* **Foundry & Hardhat** (Testing, Scripting & Deployment)
* **Ethers.js / Wagmi** (Frontend integration)

### Infrastructure & Security
* **Vercel** (Hosting & CI/CD)
* **Upstash Redis** (API Rate Limiting protection)

---

## 🏗️ Project Gallery (10 Projects)

### 💻 Full-Stack dApps (2)
End-to-end decentralized applications featuring robust on-chain logic paired with highly interactive, consumer-grade Next.js frontends.
1. **Nexus Perpetuals DEX**: Full-stack decentralized perpetual exchange interface and core logic.
2. **DAO Governance System**: A complete decentralized autonomous organization platform featuring proposal creation, token-weighted voting mechanisms, and automated on-chain execution.

### ⚙️ Core Solidity & Architecture (8)
Deep technical implementations of complex Ethereum standards, focusing on storage safety, gas efficiency, and cryptography.
1. **Account Abstraction (ERC-4337)**: Custom EntryPoint validation and Paymaster gas sponsorship bypassing high-level SDKs.
2. **UUPS Upgradeable Protocol**: Demonstrating atomic state migrations, collision-proof EIP-1967 storage, and zero-overhead delegation.
3. **Merkle-712 Airdrop Protocol**: Gas-optimized (O(1)) distribution using off-chain trees and EIP-712 anti-front-running signatures.
4. **Decentralized Stablecoin Engine**: Mathematically modeled, exogenous, over-collateralized stablecoin system.
5. **Automated Provably Fair Raffle**: Decentralized gaming protocol utilizing Chainlink VRF and Automation.
6. **Oracle Funding Protocol**: Precision price-feed integration using Chainlink Data Networks.
7. **SISO Token Economy**: Advanced ERC-20 implementation with custom tokenomic mechanics.
8. **CuteCat NFT & Sentinel Core**: Gas-optimized ERC-721 infrastructure with enhanced protocol security modules.

---

## ⚙️ Running Locally

If you want to run this project on your local machine, follow these steps:

### Prerequisites
* Node.js (v18 or higher)
* Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/NexTechArchitect/portfolio-site.git](https://github.com/NexTechArchitect/portfolio-site.git)
   cd portfolio-site

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
