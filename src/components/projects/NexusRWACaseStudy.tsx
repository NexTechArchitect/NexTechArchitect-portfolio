"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { Bricolage_Grotesque, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

const displayFont = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const monoFont = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"] });

// ─── CINEMATIC 3D "CARTOON" WEBGL-STYLE CANVAS ──────────────────────────────
function Cinematic3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let animationFrame: number;
    let time = 0;

    // Create 3D floating "Clay/Cartoon" orbs
    const orbs = Array.from({ length: 15 }, () => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      z: Math.random() * 400 + 100,
      baseRadius: Math.random() * 40 + 20,
      colorLight: Math.random() > 0.5 ? "#60A5FA" : "#34D399", // Soft Blue or Emerald
      colorDark: Math.random() > 0.5 ? "#2563EB" : "#059669",
      offset: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      const cx = width / 2;
      const cy = height / 2;
      const fov = 400;

      // Sort by Z for proper 3D depth (painters algorithm)
      const projected = orbs.map(orb => {
        // Floating math
        const floatY = orb.y + Math.sin(time + orb.offset) * 50;
        const floatX = orb.x + Math.cos(time * 0.8 + orb.offset) * 30;
        
        const scale = fov / (fov + orb.z);
        const px = cx + floatX * scale;
        const py = cy + floatY * scale;
        const pr = orb.baseRadius * scale;

        return { ...orb, px, py, pr, scale };
      }).sort((a, b) => b.z - a.z);

      projected.forEach(p => {
        if (p.pr < 0) return;

        // Draw Soft Shadow
        ctx.beginPath();
        ctx.arc(p.px, p.py + p.pr * 0.4, p.pr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${0.05 * p.scale})`;
        ctx.fill();

        // Draw 3D Cartoon Orb with Radial Gradient
        const grad = ctx.createRadialGradient(
          p.px - p.pr * 0.3, p.py - p.pr * 0.3, p.pr * 0.1, // Highlight spot
          p.px, p.py, p.pr // Outer edge
        );
        grad.addColorStop(0, "#FFFFFF"); // Shiny cartoon highlight
        grad.addColorStop(0.2, p.colorLight);
        grad.addColorStop(1, p.colorDark);

        ctx.beginPath();
        ctx.arc(p.px, p.py, p.pr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-multiply"
    />
  );
}

// ─── MODERN ADDRESS CHIP ──────────────────────────────────────────────────────
function AddressChip({ label, address, tag }: { label: string; address: string; tag: string }) {
  const [copied, setCopied] = useState(false);
  const short = address.slice(0, 8) + "…" + address.slice(-6);

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all gap-4"
    >
      <div>
        <div className={`text-sm md:text-base font-bold text-slate-800 ${displayFont.className}`}>{label}</div>
        <div className={`text-[10px] text-slate-500 uppercase tracking-widest mt-1 ${monoFont.className}`}>{tag}</div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <code className={`px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex-1 sm:flex-none text-center ${monoFont.className}`}>
          {short}
        </code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className={`px-4 py-2 bg-blue-50 text-[#0052FF] hover:bg-[#0052FF] hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm ${monoFont.className}`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function NexusRWACaseStudy() {
  const [activeTab, setActiveTab] = useState<"architecture" | "contracts">("architecture");

// Cartoon bouncy animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.5 } }
  };

  return (
    <div className={`relative w-full bg-[#F8FAFC] text-slate-900 rounded-[40px] overflow-hidden ${bodyFont.className}`}>
      
      {/* ── HERO SECTION ── */}
      <div className="relative w-full min-h-[350px] md:min-h-[450px] flex flex-col justify-center bg-white border-b-2 border-slate-100 overflow-hidden">
        
        {/* Cinematic Cartoon 3D Canvas */}
        <Cinematic3DCanvas />
        
        {/* Soft Background Blurs */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-300/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-300/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 px-6 md:px-12 pt-16 pb-12 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-6"
          >
            <span className={`px-4 py-1.5 bg-blue-50 border-2 border-blue-100 text-[#0052FF] text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-2 shadow-sm ${monoFont.className}`}>
              <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" /> Base Mainnet
            </span>
            <span className={`px-4 py-1.5 bg-slate-50 border-2 border-slate-200 text-slate-600 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full shadow-sm ${monoFont.className}`}>
              RWA Tokenization
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: "spring" }}
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 mb-6 leading-[1.05] drop-shadow-sm ${displayFont.className}`}
          >
            Nexus RWA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052FF] to-cyan-400">Protocol</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm md:text-lg max-w-2xl leading-relaxed mb-8 font-medium px-4"
          >
            Bridging TradFi and DeFi safely. A robust smart contract engine embedding global compliance, KYC verification, real-time NAV pricing, and automated yield distribution.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
          >
            <Link href="https://nexus-rwa-protocol.vercel.app/" target="_blank"
              className={`px-8 py-4 bg-[#0052FF] text-white hover:bg-blue-700 rounded-2xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all shadow-xl shadow-blue-500/30 text-center hover:-translate-y-1 ${monoFont.className}`}>
              Launch Protocol 🚀
            </Link>
            <Link href="https://github.com/NexTechArchitect/Nexus-RWA-Protocol/" target="_blank"
              className={`px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 rounded-2xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all shadow-sm text-center hover:-translate-y-1 ${monoFont.className}`}>
              View Source Code
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── KEY METRICS ── */}
      <div className="bg-white border-b-2 border-slate-100 relative z-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x-2 divide-slate-100">
          {[
            { v: "O(1)", l: "Gas Merkle Claims", c: "text-[#0052FF]" },
            { v: "15%", l: "Circuit Breaker", c: "text-emerald-500" },
            { v: "5000+", l: "Fuzz Sequences", c: "text-amber-500" },
            { v: "100%", l: "KYC Enforced", c: "text-cyan-500" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i*0.1 }} className="px-2 md:px-6 text-center">
              <p className={`text-[10px] md:text-xs text-slate-400 uppercase tracking-widest mb-2 font-bold ${monoFont.className}`}>{s.l}</p>
              <p className={`text-3xl md:text-4xl font-black ${s.c} drop-shadow-sm ${displayFont.className}`}>{s.v}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b-2 border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex gap-6 md:gap-10 overflow-x-auto hide-scrollbar">
          {[
            { id: "architecture", label: "Protocol Architecture" },
            { id: "contracts", label: "Deployed Infrastructure" },
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`relative py-5 md:py-6 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${monoFont.className} ${
                activeTab === t.id ? "text-[#0052FF]" : "text-slate-400 hover:text-slate-800"
              }`}
            >
              {t.label}
              {activeTab === t.id && (
                <motion.div layoutId="cartoon-tab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0052FF] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <AnimatePresence mode="wait">

          {/* ════ TAB 1: ARCHITECTURE ════ */}
          {activeTab === "architecture" && (
            <motion.div key="arch" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: "🛂", title: "IdentityRegistry", desc: "Tracks verification tiers & global OFAC sanction checks off-chain via cryptographic commitments.", bg: "bg-blue-50 border-blue-100", text: "text-blue-600" },
                  { icon: "⚖️", title: "ComplianceEngine", desc: "The Gatekeeper. Evaluates every transfer in real-time. Handles global blacklisting & legal clawbacks.", bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-600" },
                  { icon: "💸", title: "YieldDistributor", desc: "Pull-based yield distribution via off-chain Merkle Trees. Cycled by Chainlink Automation.", bg: "bg-amber-50 border-amber-100", text: "text-amber-600" },
                ].map((card, i) => (
                  <motion.div key={i} variants={itemVariants} className="bg-white border-2 border-slate-100 p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div className={`w-16 h-16 ${card.bg} border-2 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner`}>{card.icon}</div>
                    <h3 className={`text-xl font-bold text-slate-800 mb-3 ${displayFont.className}`}>{card.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{card.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} className="bg-white border-2 border-slate-100 p-8 md:p-10 rounded-[32px] shadow-sm">
                <h3 className={`text-sm font-black uppercase tracking-widest text-[#0052FF] mb-8 ${monoFont.className}`}>The Nexus Difference</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { n: "1", title: "Stateless Real-Time Compliance", desc: "Evaluates jurisdictional and sanction rules entirely on-chain. No off-chain API delays for peer-to-peer secondary trading." },
                    { n: "2", title: "Decoupled Architecture", desc: "Funds, ledgers, and rules are heavily siloed. A bug in yield distribution can never compromise the compliance registry." },
                    { n: "3", title: "Mathematical Certainty", desc: "Core constraints (Supply Cap, Blacklisted Holders) mathematically proven via Stateful Invariant Fuzzing." },
                    { n: "4", title: "Zero-Trust Legal Recovery", desc: "Court-ordered asset recoveries (forcedTransfer) are natively built-in and role-gated without dangerous proxy upgrades." },
                  ].map((step) => (
                    <div key={step.n} className="flex gap-5 items-start group">
                      <div className={`w-10 h-10 rounded-2xl bg-blue-50 border-2 border-blue-100 text-[#0052FF] font-black flex items-center justify-center shrink-0 text-sm group-hover:bg-[#0052FF] group-hover:text-white transition-colors shadow-sm ${monoFont.className}`}>
                        {step.n}
                      </div>
                      <div>
                        <h4 className={`text-base font-bold text-slate-800 mb-2 ${displayFont.className}`}>{step.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </motion.div>
          )}

          {/* ════ TAB 2: CONTRACTS ════ */}
          {activeTab === "contracts" && (
            <motion.div key="con" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} className="space-y-8">
              
              <motion.div variants={itemVariants} className="bg-white border-2 border-slate-100 p-8 md:p-10 rounded-[32px] shadow-sm">
                <h3 className={`text-sm font-black uppercase tracking-widest text-[#0052FF] mb-8 ${monoFont.className}`}>Base Mainnet Infrastructure</h3>
                <div className="flex flex-col gap-4">
                  <AddressChip label="IdentityRegistry" address="0x18026c0BF58c978caDc8Df7f31b1cbC2f6A94c5A" tag="KYC & Sanctions" />
                  <AddressChip label="AssetRegistry" address="0x88bb8025dc10Cc642d2F0D10F4335EcDBdC9A594" tag="Asset Ledger" />
                  <AddressChip label="ComplianceEngine" address="0x00c0E82e0C81c4Df096aAd98f2aA5A399b34131c" tag="The Gatekeeper" />
                  <AddressChip label="NAVOracle" address="0xE4BeA2a081BA5d7137618840aFD012883014cbdD" tag="Chainlink Price Feed" />
                  <AddressChip label="Genesis Token (nUSTB)" address="0xFDFda5Ca91bDC022EC85C9F2bE5d29A33f874EDE" tag="ERC-20 Token" />
                  <AddressChip label="YieldDistributor" address="0x8cbdAC28819d95b8425a0BdFD37610075F021996" tag="Merkle Payouts" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-slate-900 border-4 border-slate-800 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 text-8xl rotate-12">🔒</div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <h3 className={`text-emerald-400 text-xs font-black uppercase tracking-widest mb-3 ${monoFont.className}`}>Security & Audit Model</h3>
                    <h2 className={`text-3xl md:text-4xl font-black text-white mb-4 ${displayFont.className}`}>0 Critical / 0 High Risk</h2>
                    <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed font-medium">
                      100% test coverage across 219+ tests. Slither verified. Integrated with an autonomous 15% Circuit Breaker to halt protocol reads if a 24-hour flash crash is detected, preventing oracle manipulation.
                    </p>
                  </div>
                  <div className={`px-8 py-5 bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] ${monoFont.className}`}>
                    Mathematically Proven
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}