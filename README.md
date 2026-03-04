
# NexTechArchitect | Web3 Full-Stack Portfolio

A high-performance, interactive portfolio showcasing production-grade Smart Contracts, decentralized architectures, and modern Web3 frontends. Built with a focus on deep technical explanations, gas-optimized Solidity, and seamless user experiences.

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
* **Foundry** (Testing & Deployment)
* **Ethers.js / Wagmi** (Frontend integration)

### Infrastructure & Security
* **Vercel** (Hosting & CI/CD)
* **Upstash Redis** (API Rate Limiting protection)

---

## 🏗️ Featured Architectural Case Studies

The portfolio features deep dives into complex blockchain protocols, complete with custom-built interactive visualizers:

1. **Account Abstraction (ERC-4337)**
   * From-scratch implementation bypassing high-level SDKs.
   * Exposes raw UserOperation packing, EntryPoint validation, and Paymaster gas sponsorship mechanics.
2. **Universal Upgradeable Proxy Standard (UUPS)**
   * Production-ready implementation of EIP-1822 and EIP-1967.
   * Demonstrates atomic state migrations, storage layout safety (preventing collisions), and zero-overhead delegation.
3. **Merkle-712 Airdrop Protocol**
   * Solves the "Million User Problem" using off-chain Merkle Trees for extreme data compression.
   * Integrates on-chain EIP-712 structured signatures to prevent front-running claim bots.

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
