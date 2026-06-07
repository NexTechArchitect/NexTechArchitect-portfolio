"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

type Point = { label: string; detail: string };
type Chapter = {
  id: string; num: string; year: string; phase: string;
  title: string; subtitle: string;
  accent: string; rgb: string;
  network: "mainnet" | "testnet" | "both" | "course";
  summary: string;
  points: Point[];
  tags: string[];
};

const CHAPTERS: Chapter[] = [
  {
    id: "ch1", num: "01", year: "2024", phase: "Foundation",
    title: "Cyfrin Updraft",
    subtitle: "Patrick Collins · Advanced Security",
    accent: "#2563EB", rgb: "37,99,235", // Blue
    network: "course",
    summary: "The most rigorous Solidity curriculum available. Not a tutorial, a gauntlet. EVM internals, Foundry invariant fuzzing as mathematical proof, and security patterns baked into muscle memory from day one.",
    points: [
      { label: "EVM Internals", detail: "Opcodes, memory vs calldata, storage slot packing, gas at the bytecode level." },
      { label: "Invariant Fuzzing", detail: "Stateless and stateful fuzzing with Foundry to mathematically prove protocol correctness." },
      { label: "Security Architecture", detail: "CEI patterns, reentrancy guards, oracle staleness guards, designed in from line one." },
      { label: "Full Deployment Lifecycle", detail: "Contract to live dApp. Testnet flows, Etherscan verification, frontend wiring." },
    ],
    tags: ["Solidity 0.8", "Foundry", "EVM", "Slither", "Echidna"],
  },
  {
    id: "ch2", num: "02", year: "2024", phase: "Fundamentals",
    title: "Alchemy University",
    subtitle: "Ethereum Developer Bootcamp",
    accent: "#0891B2", rgb: "8,145,178", // Cyan
    network: "course",
    summary: "Ethereum fundamentals at the protocol level. Transactions, mempool mechanics, node infrastructure, and Web3 frontend integration — the plumbing every production dApp runs on.",
    points: [
      { label: "Ethereum Protocol", detail: "Transactions, blocks, mempool mechanics, gas economics under the hood." },
      { label: "Deployment Pipelines", detail: "Hardhat, verification scripts, testnet flows, environment configuration." },
      { label: "Web3 Frontend", detail: "ethers.js, wallet connections, bridging on-chain state to real user interfaces." },
      { label: "Infra and Storage", detail: "RPC endpoints, IPFS pinning, Pinata, decentralised storage patterns." },
    ],
    tags: ["Ethereum", "Hardhat", "ethers.js", "IPFS", "Wagmi"],
  },
  {
    id: "ch3", num: "03", year: "2024-25", phase: "Deep Research",
    title: "Independent Study",
    subtitle: "Raw EIP specs · No shortcuts",
    accent: "#D97706", rgb: "217,119,6", // Amber
    network: "testnet",
    summary: "No tutorials. Raw EIP specs, whitepaper math, protocol source code. ERC-4337, UUPS, Governor, ERC-4626, ERC-5484, each implemented from scratch on Sepolia. DSC Stablecoin with 10,000-run invariant fuzz suite.",
    points: [
      { label: "ERC-4337 Account Abstraction", detail: "EntryPoint, UserOperation validation, custom Paymasters, gasless UX from the raw spec." },
      { label: "UUPS Proxy Architecture", detail: "ERC-1967 storage layout, collision-free upgrades, V1 to V3 migration with full state preservation." },
      { label: "DAO and Governor Systems", detail: "48H Timelock, VetoCouncil, RageQuit exit, governance that protects minority holders." },
      { label: "DSC Stablecoin", detail: "Overcollateralised stablecoin with 10k-run invariant fuzz suite proving solvency under all conditions." },
    ],
    tags: ["ERC-4337", "UUPS", "DAO Governor", "ERC-4626", "Chainlink VRF"],
  },
  {
    id: "ch4", num: "04", year: "2025-26", phase: "Production",
    title: "Ship to Chain",
    subtitle: "Base Mainnet · Sepolia · 40+ contracts",
    accent: "#059669", rgb: "5,150,105", // Emerald
    network: "both",
    summary: "Everything became production code. Insurance vaults on Base Mainnet, perpetual DEX with 50x leverage and Chainlink CCIP, anti-flash DAO governance, on-chain reputation with soulbound tokens. Foundry suites, Slither audited, Basescan verified. Zero high-severity findings across 40+ contracts.",
    points: [
      { label: "Sentinel Insurance Protocol", detail: "ERC-4626 vault routing USDC into Aave V3. Flash-loan resistant DAO. 8 contracts on Base Mainnet, Slither: 0 high." },
      { label: "Nexus Perpetuals DEX", detail: "Gasless 50x leverage via ERC-4337. Chainlink CCIP cross-chain margin. Full invariant suite, zero solvency violations." },
      { label: "Sentinel DAO", detail: "48H Timelock, VetoCouncil rage-quit. 256 tests, zero failures. Treasury solvency fuzz-proved." },
      { label: "RST Reputation Protocol", detail: "ERC-5484 soulbound tokens, 5-tier SVG medals auto-upgrading on score change. UUPS upgradeable." },
    ],
    tags: ["Base Mainnet", "ERC-4626", "ERC-4337", "Chainlink CCIP", "ERC-5484", "Slither"],
  },
];

// ── PREMIUM COLOR-SHIFTING AURA BACKGROUND ──────────────────────────────────
function AuraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#FAFAFA]" /> {/* Base White */}
      
      {/* Orb 1: Shifts between soft Blue, Purple, and Rose */}
      <motion.div
        animate={{ 
          x: ["-10%", "15%", "-10%"], 
          y: ["-10%", "20%", "-10%"], 
          scale: [1, 1.1, 1],
          backgroundColor: ["rgba(224, 242, 254, 0.6)", "rgba(243, 232, 255, 0.6)", "rgba(255, 228, 230, 0.6)", "rgba(224, 242, 254, 0.6)"]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-15%] left-[-15%] w-[65vw] h-[65vw] rounded-full blur-[140px]"
      />
      
      {/* Orb 2: Shifts between Emerald, Cyan, and soft Indigo */}
      <motion.div
        animate={{ 
          x: ["15%", "-15%", "15%"], 
          y: ["15%", "-10%", "15%"], 
          scale: [1, 1.2, 1],
          backgroundColor: ["rgba(209, 250, 229, 0.5)", "rgba(207, 250, 254, 0.5)", "rgba(224, 231, 255, 0.5)", "rgba(209, 250, 229, 0.5)"]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-15%] right-[-15%] w-[75vw] h-[75vw] rounded-full blur-[160px]"
      />
      
      {/* Orb 3: Shifts between Amber, Rose, and Peach */}
       <motion.div
        animate={{ 
          x: ["-20%", "25%", "-20%"], 
          y: ["20%", "-15%", "20%"], 
          scale: [1, 1.05, 1],
          backgroundColor: ["rgba(254, 243, 199, 0.4)", "rgba(255, 228, 230, 0.4)", "rgba(255, 237, 213, 0.4)", "rgba(254, 243, 199, 0.4)"]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[130px]"
      />

      {/* Blueprint Grid & Subtle Grain for texture */}
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay"
        style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: "200px",
        }}
      />
    </div>
  );
}

// ── NETWORK PILL ─────────────────────────────────────────────────────────────
function NetworkPill({ type }: { type: Chapter["network"] }) {
  if (type === "both") {
    return (
      <div className="flex gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
          Mainnet
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
          Testnet
        </span>
      </div>
    );
  }

  const map = {
    mainnet: { label: "Base Mainnet", color: "text-emerald-700", dot: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200/50" },
    testnet: { label: "Sepolia",      color: "text-amber-700", dot: "bg-amber-500", bg: "bg-amber-50 border-amber-200/50" },
    course:  { label: "Certified",    color: "text-blue-700", dot: "bg-blue-500", bg: "bg-blue-50 border-blue-200/50" },
  };
  const cfg = map[type as "mainnet" | "testnet" | "course"];
  
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-md border ${cfg.bg} shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shadow-sm`} />
      {cfg.label}
    </span>
  );
}

// ── CINEMATIC HEADING ANIMATION ─────────────────────────────────────────────
function AnimatedHeading() {
  const text = "How I Build.";
  const words = text.split(" ");
  
  return (
    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 sm:mb-6" style={{ fontFamily: "'Georgia', serif" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.1 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mr-2 sm:mr-3 last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
}

// ── GLASS CHAPTER CARD ───────────────────────────────────────────────────────
function ChapterCard({ ch, index, onClick }: { ch: Chapter; index: number; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const mx  = useMotionValue(0), my = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); setHov(false); }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", perspective: 1200, flex: "1 1 0", minWidth: 0 }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      onMouseEnter={() => setHov(true)}
      onClick={onClick}
      className="cursor-pointer group relative h-full"
    >
      <motion.div
        className="relative rounded-[28px] overflow-hidden h-full flex flex-col transition-all duration-500"
        animate={{
          y: hov ? -6 : 0, 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{
          background: hov
            ? `linear-gradient(160deg, rgba(${ch.rgb},0.08) 0%, rgba(255,255,255,0.85) 60%)`
            : "rgba(255,255,255,0.5)", 
          backdropFilter: "blur(35px)", 
          WebkitBackdropFilter: "blur(35px)",
          border: `1px solid ${hov ? `rgba(${ch.rgb},0.3)` : "rgba(0,0,0,0.06)"}`,
          boxShadow: hov
            ? `0 25px 50px -15px rgba(${ch.rgb},0.2), inset 0 1px 0 rgba(255,255,255,0.9)` 
            : "0 10px 30px -10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)", 
          minHeight: 380,
        }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px]"
          animate={{ opacity: hov ? 1 : 0.4, scaleX: hov ? 1 : 0.3 }}
          style={{ background: `linear-gradient(90deg, transparent, ${ch.accent}, transparent)`, transformOrigin: "center" }}
          transition={{ duration: 0.4 }}
        />

        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          animate={{ opacity: hov ? 1 : 0 }}
          style={{ background: `radial-gradient(circle at 50% 0%, rgba(${ch.rgb}, 0.06) 0%, transparent 70%)` }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <NetworkPill type={ch.network} />
            <motion.span
              className="font-black leading-none select-none transition-colors duration-300"
              style={{ color: "rgba(0,0,0,0.04)", fontSize: "3.5rem", fontFamily: "monospace" }}
              animate={{ color: hov ? `rgba(${ch.rgb}, 0.2)` : "rgba(0,0,0,0.04)" }}
              transition={{ duration: 0.3 }}
            >
              {ch.num}
            </motion.span>
          </div>

          <p className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: ch.accent }}>
            {ch.phase}
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-slate-800 transition-colors" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
            {ch.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 font-mono mb-6 leading-relaxed font-medium">{ch.subtitle}</p>

          <div className="space-y-3 flex-1 mb-6">
            {ch.points.slice(0, 3).map((pt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + i * 0.1 + 0.3 }}
                className="flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full mt-[6px] flex-shrink-0" style={{ background: ch.accent, opacity: 0.7 }} />
                <span className="text-[12px] sm:text-[13px] text-slate-600 font-medium leading-snug">{pt.label}</span>
              </motion.div>
            ))}
            {ch.points.length > 3 && (
              <p className="text-[10px] text-slate-400 font-mono pl-4 italic">+{ch.points.length - 3} more modules...</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-5 mt-auto" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
            <span className="font-mono text-[10px] text-slate-400 font-semibold tracking-wide">{ch.year}</span>
            <motion.span
              className="text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: ch.accent }}
              animate={{ x: hov ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              Details <span className="text-lg leading-none mb-0.5">↗</span>
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ ch, onClose }: { ch: Chapter; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden"; 
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)" }} 
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto bg-white rounded-t-[32px] sm:rounded-[24px] shadow-2xl custom-scrollbar-hide"
        style={{ borderTop: `4px solid ${ch.accent}` }}
      >
        <div className="sticky top-0 right-0 z-20 flex justify-end p-4 pointer-events-none">
           <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors pointer-events-auto shadow-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="px-6 sm:px-10 pb-12 pt-2 sm:pt-6 -mt-10 relative">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="font-mono text-[10px] font-black tracking-[0.25em] uppercase px-3 py-1 rounded-md bg-slate-50 border border-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]" style={{ color: ch.accent }}>
                {ch.phase}
              </span>
              <NetworkPill type={ch.network} />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-2" style={{ fontFamily: "'Georgia', serif" }}>
              {ch.title}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-slate-500 font-semibold">{ch.subtitle}</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl mb-8 bg-slate-50 border border-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <p className="text-[13px] sm:text-[15px] text-slate-700 leading-relaxed font-medium">
              {ch.summary}
            </p>
          </div>

          <div className="space-y-4 mb-10">
            <h4 className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-4">Core Focus Areas</h4>
            {ch.points.map((pt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-black text-sm shadow-md" style={{ background: ch.accent }}>
                  {i + 1}
                </div>
                <div>
                  <p className="text-[14px] sm:text-[15px] font-bold text-slate-900 mb-1">{pt.label}</p>
                  <p className="text-[12px] sm:text-[13px] text-slate-600 leading-relaxed font-medium">{pt.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100">
            {ch.tags.map((tag, i) => (
              <span key={i}
                className="font-mono text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN SECTION ─────────────────────────────────────────────────────────────
export default function StickyEducationSection() {
  const [active, setActive] = useState<Chapter | null>(null);

  return (
    <section className="relative overflow-hidden bg-[#FAFAFA]" id="education">
      <AuraBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 py-20 sm:py-32">

        <div className="mb-14 sm:mb-24 text-center sm:text-left">
          <AnimatedHeading />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch">
          {CHAPTERS.map((ch, i) => (
            <ChapterCard key={ch.id} ch={ch} index={i} onClick={() => setActive(ch)} />
          ))}
        </div>

      </div>

      <AnimatePresence>
        {active && <Modal ch={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}