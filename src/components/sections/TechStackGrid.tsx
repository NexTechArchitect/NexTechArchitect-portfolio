"use client";

import { motion } from "framer-motion";

// ─── SVG ICONS (Minimal & Clean) ──────────────────────────────────────────
const Icons = {
  Solidity: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M12 2L2 7.8v8.4L12 22l10-5.8V7.8L12 2zm0 3.3l7 4.1-7 4.1-7-4.1 7-4.1zm0 13.4l-7-4.1v-3l7 4.1 7-4.1v3l-7 4.1z" />
    </svg>
  ),
  Nextjs: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 8v-7h1v9l-6-8v7h-1z" />
    </svg>
  ),
  TypeScript: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M2 2h20v20H2V2zm10.5 14.5c0-.8-.5-1.3-1.4-1.8l-.8-.4c-.5-.3-.8-.5-.8-.9 0-.4.3-.8.9-.8.6 0 1 .2 1.4.6l1-1.3c-.6-.6-1.4-.9-2.3-.9-1.4 0-2.5.9-2.5 2.2 0 .8.5 1.3 1.4 1.7l.8.4c.6.3.8.6.8 1 0 .4-.4.8-1 .8-.7 0-1.2-.3-1.7-.8l-1 1.3c.7.7 1.6 1.1 2.7 1.1 1.5 0 2.5-.9 2.5-2.2zM15 7h-4.5v1.5H13v7.5h1.7v-7.5H17V7h-2z" />
    </svg>
  ),
  Foundry: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8l6-4 6 4v8l-6 4-6-4V8z" />
      <path d="M6 8l6 4 6-4" />
      <path d="M12 12v8" />
    </svg>
  ),
  Chainlink: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M12 2L3 7l4 2.5 5-3 5 3 4-2.5L12 2zm0 20l-9-5V7l4 2.5v5L3 17l9 5 9-5-4-2.5v-5L21 7v8l-9 5zM3 17V7l4 2.5v5L3 17zm18 0V7l-4 2.5v5l4 4.5z" />
    </svg>
  ),
  Wagmi: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 12 7 20 12 12 17 20 22 12" />
    </svg>
  ),
  OpenZeppelin: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  ),
  ERC4337: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" />
      <line x1="10.8" y1="12.2" x2="19" y2="4" />
      <line x1="14" y1="9" x2="16" y2="11" />
      <line x1="17" y1="6" x2="19" y2="8" />
    </svg>
  ),
  Slither: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M8 8l4-4 4 4" />
      <path d="M8 16l4 4 4-4" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EVM: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  ),
  Aave: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M12 2L2 22h5.5l1.5-3h6l1.5 3H22L12 2zm0 5.5l2 4.5h-4l2-4.5z" />
    </svg>
  ),
  Vault: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Tailwind: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M12.001,4.8c-3.208,0-5.604,1.603-7.206,4.809c1.201-1.603,2.802-2.404,4.804-2.404c1.554,0,2.666,0.763,3.882,1.96c1.189,1.171,2.545,2.507,5.726,2.507c3.208,0,5.604-1.603,7.206-4.809c-1.201,1.603-2.802,2.404-4.804,2.404c-1.554,0-2.666-0.763-3.882-1.96C16.538,6.136,15.183,4.8,12.001,4.8z M4.795,14.42c-3.208,0-5.604,1.603-7.206,4.809c1.201-1.603,2.802-2.404,4.804-2.404c1.554,0,2.666,0.763,3.882,1.96c1.189,1.171,2.545,2.507,5.726,2.507c3.208,0,5.604-1.603,7.206-4.809c-1.201,1.603-2.802,2.404-4.804,2.404c-1.554,0-2.666-0.763-3.882-1.96C11.332,15.755,9.977,14.42,4.795,14.42z" />
    </svg>
  ),
  IPFS: () => (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
};

// ─── TECH STACK DATA ──────────────────────────────────────────────────────
const techStack = [
  { name: "Solidity 0.8+",   icon: <Icons.Solidity />,     color: "#475569" },
  { name: "Foundry & Anvil", icon: <Icons.Foundry />,      color: "#D97706" },
  { name: "Yul & EVM",       icon: <Icons.EVM />,          color: "#64748b" },
  { name: "Slither & Fuzz",  icon: <Icons.Slither />,      color: "#EF4444" },
  { name: "Chainlink Oracles", icon: <Icons.Chainlink />,  color: "#2563EB" },
  { name: "Aave V3 Routing", icon: <Icons.Aave />,         color: "#0EA5E9" },
  { name: "ERC-4337 (AA)",   icon: <Icons.ERC4337 />,      color: "#0891B2" },
  { name: "UUPS & Proxies",  icon: <Icons.OpenZeppelin />, color: "#059669" },
  { name: "ERC-4626 Vaults", icon: <Icons.Vault />,        color: "#8B5CF6" }, // Replaced Base Mainnet
  { name: "IPFS & Arweave",  icon: <Icons.IPFS />,         color: "#06B6D4" },
  { name: "Next.js App Router", icon: <Icons.Nextjs />,    color: "#0f172a" },
  { name: "Wagmi & Viem",    icon: <Icons.Wagmi />,        color: "#0f766e" },
  { name: "TypeScript",      icon: <Icons.TypeScript />,   color: "#3B82F6" },
  { name: "Tailwind CSS",    icon: <Icons.Tailwind />,     color: "#14B8A6" },
];

export default function TechStackGrid() {
  return (
    <section className="pt-6 pb-14 sm:pt-12 sm:pb-24 relative z-10 overflow-hidden bg-slate-50" id="skills">

      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-400/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/10 blur-[100px]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 relative z-10">

        <div className="mb-10 sm:mb-16 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-blue-600 font-bold uppercase mb-3 sm:mb-4">
              Architecture & Security
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 sm:mb-6" style={{ fontFamily: "'Georgia', serif" }}>
              Core Engineering Stack
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-3xl leading-relaxed mx-auto sm:mx-0 font-medium">
              Focusing on threat-modeled security, invariant-proven solvency, and Yul-optimized gas reduction across every deployment[cite: 6]. Every tool is chosen for absolute precision and reliability.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
        >
          {techStack.map((tech) => (
            <motion.div
              key={tech.name}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
              }}
              whileHover={{
                scale: 1.04, y: -4,
                boxShadow: `0 12px 24px -8px ${tech.color}40`,
                borderColor: `${tech.color}50`,
              }}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center justify-center p-4 sm:p-7 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-[20px] transition-colors duration-300 select-none shadow-sm group"
            >
              <div className="mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110" style={{ color: tech.color }}>
                {tech.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-700 font-mono text-center tracking-tight">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}