export const journeyData = [
  {
    id: "arch1",
    role: "EVM & Security Researcher",
    company: "Foundation Phase",
    year: "2024 - 2025",
    description: "Started with a hardcore focus on EVM internals. I didn't just learn Solidity syntax; I learned how the EVM executes bytecode, memory vs storage tradeoffs, and how to break contracts.",
    tech: ["Solidity", "Foundry", "Yul / Assembly", "Security Patterns"],
    accent: "#0055FF", // Blue
    content: [
      { 
        heading: "Foundry Testing Mastery", 
        text: "Moved away from Hardhat to write exhaustive Foundry test suites. Learned how to mathematically prove contract solvency using stateless and stateful invariant fuzzing." 
      },
      { 
        heading: "EVM Mechanics & Gas", 
        text: "Deep dive into storage slot packing, opcode gas costs, and unchecked math optimizations to write highly efficient smart contracts." 
      },
      { 
        heading: "Attack Vectors", 
        text: "Studied real-world exploits. Implemented strict Checks-Effects-Interactions (CEI) patterns and reentrancy guards as muscle memory." 
      }
    ]
  },
  {
    id: "arch2",
    role: "Core Smart Contract Engineer",
    company: "Independent Architecture",
    year: "2025 - 2026",
    description: "Graduated from testing to building complex, standalone Solidity architectures. Focused heavily on standard EIP implementations and secure DeFi primitives.",
    tech: ["UUPS Proxies", "Merkle Trees", "DeFi Math", "EIP-712"],
    accent: "#7C3AED", // Purple
    content: [
      { 
        heading: "Upgradeable Systems (UUPS)", 
        text: "Mastered the ERC-1967 universal upgradeable proxy standard. Architected collision-free storage layouts allowing protocols to scale without migrating core contracts." 
      },
      { 
        heading: "O(1) Gas Airdrops", 
        text: "Generated massive Merkle Trees off-chain and verified proofs on-chain, enabling highly gas-efficient whitelists and distribution mechanisms." 
      },
      { 
        heading: "Stablecoin Primitives", 
        text: "Engineered core math for over-collateralized stablecoins, including health factor calculations and liquidation thresholds." 
      }
    ]
  },
  {
    id: "arch3",
    role: "Full-Stack Protocol Architect",
    company: "Solo Developer",
    year: "Current",
    description: "Bridged hardcore smart contract backends with seamless Next.js interfaces. Built and deployed enterprise-grade protocols like Nexus Perps and Sentinel DAO completely solo.",
    tech: ["Nexus Perps", "Sentinel DAO", "Next.js 14", "ERC-4337 AA"],
    accent: "#059669", // Emerald Green
    content: [
      { 
        heading: "Nexus Perps (Perpetual DEX)", 
        text: "Engineered a fully on-chain 50x leverage perpetuals exchange. Handled complex liquidation math, Chainlink CCIP cross-chain routing, and oracle staleness guards." 
      },
      { 
        heading: "Sentinel DAO (Governance OS)", 
        text: "Built a modular protocol-level governance OS using OpenZeppelin. Integrated a 48H Timelock execution and a RageQuit module for minority token-holder protection." 
      },
      { 
        heading: "Account Abstraction & Frontend", 
        text: "Deployed custom Paymasters for gasless user experiences. Connected these backends to Next.js 14 using Wagmi v2 and Viem for zero-backend, fully decentralized telemetry." 
      }
    ]
  }
];