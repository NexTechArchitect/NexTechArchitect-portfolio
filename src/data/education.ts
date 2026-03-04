export type EducationTopic = {
  slug: string;
  tag: string;
  title: string;
  description: string;
  readTime: string;
  content: { heading: string; text: string; imageTag: string }[];
};

export const educationData: EducationTopic[] = [
  {
    slug: "evm-security-fundamentals",
    tag: "Structured Learning",
    title: "EVM Mechanics and Security Fundamentals",
    description: "A deep-dive into the EVM execution layer from opcode-level gas costs to invariant fuzzing and security-first engineering.",
    readTime: "12 min",
    content: [
      {
        heading: "Low-Level EVM Mastery",
        text: "Studied the execution layer from opcodes up. Memory vs calldata allocation, precise storage slot packing, and gas cost implications at the bytecode level. Every contract decision now starts from first principles rather than framework assumptions.",
        imageTag: "EVM Stack",
      },
      {
        heading: "Foundry and Invariant Fuzzing",
        text: "Replaced surface-level unit tests with stateless and stateful fuzzing to mathematically prove smart contract invariants. Adversarial edge cases are found before deployment through automated property-based testing.",
        imageTag: "Foundry",
      },
      {
        heading: "Security-First Engineering",
        text: "CEI pattern compliance, flash-loan resistance, and reentrancy guard architecture are non-negotiable baselines. Every line of Solidity is written assuming an attacker is reading it.",
        imageTag: "CEI Pattern",
      },
    ],
  },
  {
    slug: "protocol-architecture-eips",
    tag: "Independent Research",
    title: "Protocol Architecture and Advanced EIPs",
    description: "Building production-grade ERC-4337 wallets, UUPS proxy systems, and complete DAO governance infrastructure from raw EIP specifications.",
    readTime: "15 min",
    content: [
      {
        heading: "Advanced EIP Implementation",
        text: "Studied and built production-grade implementations directly from raw EIP specifications, not tutorials. The goal was always a deployable, auditable system that handles real adversarial conditions.",
        imageTag: "EIP Specifications",
      },
      {
        heading: "Account Abstraction and Proxy Patterns",
        text: "Engineered ERC-4337 smart wallets with custom Paymasters for fully gasless user experiences. Mastered ERC-1967 storage layout to deploy collision-free UUPS proxies enabling seamless protocol upgrades without any state migration.",
        imageTag: "ERC-4337 Flow",
      },
      {
        heading: "DAO and Governance Architecture",
        text: "Built complete governance systems using OpenZeppelin Governor standards with timelock controllers, veto councils, RageQuit minority exit mechanisms, and proposal spam protection.",
        imageTag: "Governor Contract",
      },
    ],
  },
  {
    slug: "fullstack-dapps-production",
    tag: "Execution and Deployment",
    title: "Full-Stack dApps and Production Integration",
    description: "Connecting robust on-chain backends to Next.js 14 frontends using Wagmi v2 and Viem. Type-safe, zero-backend, production-ready.",
    readTime: "10 min",
    content: [
      {
        heading: "On-Chain to Frontend Pipeline",
        text: "Bridged low-level Solidity engineering with modern frontend architecture. Building complete dApps that deliver Web2-quality experiences entirely on decentralized infrastructure with no centralized indexers.",
        imageTag: "Next.js 14",
      },
      {
        heading: "Nexus Perps Perpetual Exchange",
        text: "Built the core smart contract architecture for a fully on-chain perpetual exchange. Required complex DeFi math, over-collateralized liquidity routing, ERC-4337 account abstraction, and Chainlink oracle feeds.",
        imageTag: "Perpetual Exchange",
      },
      {
        heading: "Type-Safe Web3 State",
        text: "Connected on-chain backends to responsive Next.js 14 interfaces using Wagmi v2 and Viem for type-safe, zero-backend telemetry. Every interaction is optimistic and every state is derived directly from chain data.",
        imageTag: "Wagmi v2",
      },
    ],
  },
];