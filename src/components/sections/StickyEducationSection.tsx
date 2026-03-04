"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";

type Chapter = {
  id: string; num: string; year: string; tag: string;
  title: string; subtitle: string; accent: string; summary: string;
  points: { icon: string; label: string; detail: string }[];
  tags: string[];
};

const CHAPTERS: Chapter[] = [
  {
    id: "ch1", num: "01", year: "2024", tag: "Structured Course",
    title: "Cyfrin Updraft",
    subtitle: "Smart Contract & Security Foundations",
    accent: "#0055FF",
    summary: "Started with Cyfrin Updraft, the most rigorous smart contract course available. Covered Solidity from scratch through advanced security patterns, Foundry testing, and full-stack Web3 deployment.",
    points: [
      { icon: "⬡", label: "Solidity & EVM Internals", detail: "Beyond surface Solidity — opcodes, memory vs calldata, storage slot packing, gas at the bytecode level." },
      { icon: "🧪", label: "Foundry Testing & Fuzzing", detail: "Stateless and stateful invariant fuzzing to mathematically prove correctness. Not just tests — proofs." },
      { icon: "🔒", label: "Security-First Mindset", detail: "CEI patterns, reentrancy guards, flash-loan resistance baked in from line one — not patched in after." },
      { icon: "🚀", label: "Full-Stack Deployment", detail: "Full lifecycle from contract to live dApp — testnets, frontend wiring, production habits." },
    ],
    tags: ["Solidity 0.8", "Foundry", "Invariant Fuzzing", "EVM", "Testnet Deploy"],
  },
  {
    id: "ch2", num: "02", year: "Ongoing", tag: "Self-Study",
    title: "Independent Research",
    subtitle: "Advanced EIPs, Proxies & DAO Architecture",
    accent: "#7C3AED",
    summary: "After the structured course, moved into deep self-study on advanced Ethereum standards. Built production implementations from raw EIP specs, not tutorials. Every system deployable and auditable.",
    points: [
      { icon: "⚡", label: "ERC-4337 Account Abstraction", detail: "EntryPoint, UserOperation validation, custom Paymasters — gasless UX built from the spec, not a library." },
      { icon: "🔄", label: "UUPS Proxy Upgrades", detail: "ERC-1967 storage layout, collision-free proxies that preserve full state across protocol versions." },
      { icon: "🏛️", label: "DAO & Governor Systems", detail: "OpenZeppelin Governor, 48H Timelock, veto councils, RageQuit exit — governance that protects minorities." },
      { icon: "📐", label: "DeFi Math & Mechanisms", detail: "AMM math, liquidation curves, funding rates, oracle resistance — applied directly to Nexus Perps." },
    ],
    tags: ["ERC-4337", "UUPS Proxies", "DAO Governor", "Timelock", "DeFi Math"],
  },
  {
    id: "ch3", num: "03", year: "Current", tag: "Production",
    title: "Building & Deploying",
    subtitle: "Real Projects on Testnet & Mainnet",
    accent: "#059669",
    summary: "Everything learned became production code. Built and deployed multiple full-stack dApps, from NFT systems to perpetual exchanges, with real users and real on-chain state.",
    points: [
      { icon: "📈", label: "Nexus Perps — Perpetual Exchange", detail: "On-chain perp DEX — DeFi math, over-collateralized liquidity, Chainlink oracles, ERC-4337. Live on Sepolia." },
      { icon: "⚖️", label: "Sentinel DAO — Governance OS", detail: "256 tests, zero failures. 48H timelock, RageQuit, veto council, AA layer — deployed and auditable." },
      { icon: "🌐", label: "Next.js 14 Full-Stack", detail: "Wagmi v2 + Viem + TanStack Query. Zero backend — every state read from chain with optimistic UI." },
      { icon: "🔗", label: "Chainlink & Oracle Integration", detail: "Price feeds, VRF, CCIP cross-chain. Manipulation-resistance is a design requirement, not optional." },
    ],
    tags: ["Nexus Perps", "Sentinel DAO", "Next.js 14", "Wagmi v2", "Chainlink"],
  },
];

function TiltCard({ children, onClick, accent }: { children: React.ReactNode; onClick: () => void; accent: string; }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const cfg = { stiffness: 260, damping: 28 };
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), cfg);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), cfg);
  const glowX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);
  
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);
  
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="cursor-pointer h-full"
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.18 }}>
      <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative h-full flex flex-col" style={{ borderTop: `3px solid ${accent}` }}>
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{ background: useTransform([glowX, glowY], (v: string[]) => `radial-gradient(240px circle at ${v[0]} ${v[1]}, ${accent}0c, transparent 65%)`) as any }} 
        />
        <div className="relative z-10 flex-1">{children}</div>
      </div>
    </motion.div>
  );
}

function EducationModal({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-zinc-950/55 backdrop-blur-md z-[1000] flex items-end sm:items-center justify-center sm:p-6">
      <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-[28px] sm:rounded-[28px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_-20px_80px_rgba(0,0,0,0.18)]" 
        style={{ borderTop: `4px solid ${chapter.accent}` }}>
        
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-zinc-200" />
        </div>

        <div className="p-6 sm:p-8 md:p-10 pb-12">
          <div className="flex items-start justify-between mb-6 gap-4">
            <div className="flex-1">
              <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase px-2.5 py-1 rounded-md inline-block mb-3" style={{ color: chapter.accent, background: `${chapter.accent}10`, border: `1px solid ${chapter.accent}25` }}>
                {chapter.year} · {chapter.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-[1.1] mb-2">{chapter.title}</h2>
              <p className="font-mono text-[10px] sm:text-xs text-zinc-400">{chapter.subtitle}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center transition-colors flex-shrink-0">✕</button>
          </div>
          
          <p className="text-sm sm:text-[15px] text-zinc-800 leading-[1.85] mb-8 p-4 sm:p-5 bg-zinc-50 rounded-xl border-l-4" style={{ borderColor: chapter.accent }}>
            {chapter.summary}
          </p>
          
          <div className="flex flex-col gap-3 mb-8">
            {chapter.points.map((pt, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + idx * 0.07 }}
                className="flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors">
                <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="text-[13px] sm:text-sm font-bold text-zinc-900 mb-1 tracking-tight">{pt.label}</p>
                  <p className="text-[13px] sm:text-sm text-zinc-600 leading-[1.75]">{pt.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {chapter.tags.map((tag, idx) => (
              <span key={idx} className="font-mono text-[9px] sm:text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1.5 rounded-lg" style={{ color: chapter.accent, background: `${chapter.accent}0d`, border: `1px solid ${chapter.accent}22` }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StickyEducationSection() {
  const [active, setActive] = useState<Chapter | null>(null);
  
  return (
    <section className="bg-[#FDFCF8] border-t border-[#ede9e2]">
      {/* 🔥 FIX: Changed pt-16 to pt-4 to drastically reduce the gap above 🔥 */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-4 sm:pt-6 pb-16 sm:pb-24">
        
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-[3.8rem] font-black leading-[1.0] text-[#09090B] tracking-tight">
            How I Learned <span className="text-[#a3a3a3] font-normal">to Build.</span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTERS.map((ch, i) => (
            <motion.div key={ch.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="h-full">
              <TiltCard accent={ch.accent} onClick={() => setActive(ch)}>
                <div className="p-6 sm:p-7 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-5">
                    <div className="font-mono text-[10px] font-bold w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${ch.accent}10`, color: ch.accent, border: `1px solid ${ch.accent}20` }}>
                      {ch.num}
                    </div>
                    <span className="font-mono text-[9px] text-zinc-400 tracking-[0.1em] uppercase">{ch.year}</span>
                  </div>
                  
                  <p className="font-mono text-[9px] font-semibold tracking-[0.18em] uppercase mb-1.5" style={{ color: ch.accent }}>{ch.tag}</p>
                  <h3 className="text-xl sm:text-[1.3rem] font-black text-zinc-950 tracking-tight leading-[1.2] mb-1.5">{ch.title}</h3>
                  <p className="font-mono text-[9px] text-zinc-400 mb-5 line-clamp-1">{ch.subtitle}</p>
                  
                  <div className="flex flex-col gap-2.5 mb-6 flex-1">
                    {ch.points.slice(0, 3).map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className="text-[13px] flex-shrink-0">{pt.icon}</span>
                        <span className="text-xs text-zinc-800 leading-[1.5] font-semibold line-clamp-1">{pt.label}</span>
                      </div>
                    ))}
                    {ch.points.length > 3 && <span className="text-[11px] text-zinc-400 font-mono pl-6 mt-1">+{ch.points.length - 3} more</span>}
                  </div>
                  
                  <div className="flex items-center gap-1.5 pt-4 mt-auto border-t border-zinc-100 group-hover:gap-2.5 transition-all">
                    <span className="text-[11px] font-bold" style={{ color: ch.accent }}>Read more</span>
                    <span className="text-xs" style={{ color: ch.accent }}>→</span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
        
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="font-mono text-[10px] text-zinc-300 text-center mt-12 tracking-[0.14em] uppercase">
          Self-taught · Security-first · Always building
        </motion.p>
      </div>
      
      <AnimatePresence>{active && <EducationModal chapter={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
