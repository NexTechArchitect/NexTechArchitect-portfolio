"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   ERC-5484 REPUTATION — Cinematic Aura Edition (Light Theme)
   Aesthetic: Fluid Mesh Gradient, Frosted Glass, Luxury Web3
   FIXED: Mobile & Modal Optimized (No empty bottom space)
═══════════════════════════════════════════════════════════════════ */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  
  .l-root { 
    font-family: 'Inter', sans-serif; 
    background-color: #F8F9FA; 
    color: #1E293B; 
    overflow-x: hidden; 
  }
  .l-serif { font-family: 'Cinzel', serif; }
  .l-mono { font-family: 'JetBrains Mono', monospace; }
  
  .hide-scroll::-webkit-scrollbar { display: none; }
  .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(50px) saturate(150%);
    -webkit-backdrop-filter: blur(50px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow: 
      0 20px 50px -10px rgba(0,0,0,0.03), 
      inset 0 1px 0 rgba(255,255,255,1),
      inset 0 0 20px rgba(255,255,255,0.5);
  }
  
  .rose-gold-text {
    background: linear-gradient(135deg, #B76E79 0%, #D4A5A5 40%, #9B88ED 80%, #B76E79 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 4s linear infinite;
  }

  @keyframes shine {
    to { background-position: 200% center; }
  }
`;

// ── Cinematic Video-Like Fluid Canvas ─────────────────────────────
function CinematicFluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let W = c.width = window.innerWidth;
    let H = c.height = window.innerHeight;
    let id: number, time = 0;

    const colors = [
      { r: 212, g: 165, b: 165 }, // Rose/Peach
      { r: 155, g: 136, b: 237 }, // Soft Lilac/Purple
      { r: 247, g: 231, b: 206 }, // Champagne
      { r: 186, g: 225, b: 255 }  // Ice Blue
    ];

    const draw = () => {
      ctx.fillStyle = "#F8F9FA";
      ctx.fillRect(0, 0, W, H);
      time += 0.002; 

      ctx.globalCompositeOperation = "multiply";

      colors.forEach((color, i) => {
        const x = W * 0.5 + Math.sin(time * (i + 1)) * (W * 0.4) * Math.cos(time * 0.5);
        const y = H * 0.5 + Math.cos(time * (i + 1.2)) * (H * 0.4) * Math.sin(time * 0.3);
        const radius = W * 0.6 + Math.sin(time * 0.8 + i) * (W * 0.1);

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`);
        grad.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`);
        grad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
      id = requestAnimationFrame(draw);
    };

    draw();
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[inherit]">
      <canvas ref={canvasRef} className="w-full h-full blur-[60px] opacity-80" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30 pointer-events-none" />
    </div>
  );
}

// ── 3D Frosted Glass Tilt Card ────────────────────────────────────
function GlassCard({ children, className = "", depth = 10 }: { children: React.ReactNode; className?: string; depth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rX = useTransform(my, [-0.5, 0.5], [depth, -depth]);
  const rY = useTransform(mx, [-0.5, 0.5], [-depth, depth]);
  const srX = useSpring(rX, { stiffness: 150, damping: 20 });
  const srY = useSpring(rY, { stiffness: 150, damping: 20 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: srX, rotateY: srY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={`glass-card rounded-3xl transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(183,110,121,0.15)] ${className}`}>
      {children}
    </motion.div>
  );
}

// ── Smooth Cinematic Reveal ───────────────────────────────────────
function Reveal({ children, delay = 0, className = "", direction = "up" }: { children: React.ReactNode; delay?: number; className?: string; direction?: "up"|"left" }) {
  const init = direction === "up" ? { opacity: 0, y: 30, filter: "blur(12px)" } : { opacity: 0, x: -30, filter: "blur(12px)" };
  const anim = direction === "up" ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 1, x: 0, filter: "blur(0px)" };
  
  return (
    <motion.div 
      initial={init} whileInView={anim} viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }} className={className}
    >
      {children}
    </motion.div>
  );
}

// ── 3D Interactive Soulbound Token Visualizer ─────────────────────
function SoulboundVisualizer() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rX = useTransform(my, [-0.5, 0.5], [20, -20]);
  const rY = useTransform(mx, [-0.5, 0.5], [-20, 20]);
  const srX = useSpring(rX, { stiffness: 100, damping: 15 });
  const srY = useSpring(rY, { stiffness: 100, damping: 15 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[340px] mx-auto flex items-center justify-center perspective-[1200px]">
      <motion.div 
        ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{ rotateX: srX, rotateY: srY, transformStyle: "preserve-3d" }}
        className="w-full h-full relative"
      >
        <motion.div style={{ translateZ: -30 }} className="absolute inset-2 rounded-full border border-slate-300/40 shadow-[0_0_50px_rgba(183,110,121,0.15)]" />
        
        <motion.div style={{ translateZ: 20 }} className="absolute inset-8 rounded-full bg-white/60 backdrop-blur-xl border-[4px] border-[#B76E79]/30 shadow-[0_30px_60px_rgba(0,0,0,0.08),inset_0_0_30px_rgba(183,110,121,0.2)] flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <div className="l-serif text-6xl sm:text-7xl text-[#B76E79] mb-1 drop-shadow-md">🥇</div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Soulbound</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">Gold Tier</div>
          </div>
        </motion.div>

        {/* Orbiting rings */}
        <motion.div style={{ translateZ: 60 }} className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_25s_linear_infinite] opacity-40 text-[#9B88ED]">
            <polygon points="50,2 98,25 98,75 50,98 2,75 2,25" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 4" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Interactive Tier Showcase ─────────────────────────────────────
const TIERS = [
  { id: "unranked", name: "Unranked", score: "0-99", color: "#94A3B8", pwr: "0.5x", loan: "None", icon: "⬡" },
  { id: "bronze", name: "Bronze", score: "100-299", color: "#CD7F32", pwr: "1.0x", loan: "20% LTV", icon: "🥉" },
  { id: "silver", name: "Silver", score: "300-599", color: "#9CA3AF", pwr: "1.5x", loan: "40% LTV", icon: "🥈" },
  { id: "gold", name: "Gold", score: "600-849", color: "#B76E79", pwr: "2.0x", loan: "60% LTV", icon: "🥇" },
  { id: "platinum", name: "Platinum", score: "850-1000", color: "#9B88ED", pwr: "3.0x", loan: "80% LTV", icon: "💎" }
];

function TierShowcase() {
  const [active, setActive] = useState(3); 
  const t = TIERS[active];

  return (
    <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 items-center bg-white/30 border border-white/80 rounded-3xl p-5 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] backdrop-blur-md">
      <div className="w-40 h-40 sm:w-64 sm:h-64 relative flex items-center justify-center shrink-0">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={t.id}
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-32 h-32 sm:w-56 sm:h-56 rounded-full flex items-center justify-center bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border-[4px] relative"
                 style={{ borderColor: t.color }}>
              <span className="text-5xl sm:text-8xl drop-shadow-lg">{t.icon}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-1 w-full space-y-6 sm:space-y-8">
        <div className="flex gap-2 overflow-x-auto hide-scroll pb-2">
          {TIERS.map((tier, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-[9px] sm:text-xs font-bold uppercase tracking-widest transition-all border shrink-0 ${
                active === i ? 'bg-white shadow-md' : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-white/40'
              }`}
              style={{ borderColor: active === i ? tier.color : 'transparent', color: active === i ? tier.color : undefined }}>
              {tier.name}
            </button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 sm:space-y-5">
            <h3 className="l-serif text-2xl sm:text-4xl font-bold" style={{ color: t.color }}>{t.name} Protocol Tier</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-slate-200/50 pt-4 sm:pt-5">
              <div className="p-3 sm:p-4 bg-white/60 rounded-2xl border border-white">
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-mono uppercase mb-1">Score Requirement</p>
                <p className="text-base sm:text-lg font-black text-slate-800">{t.score}</p>
              </div>
              <div className="p-3 sm:p-4 bg-white/60 rounded-2xl border border-white">
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-mono uppercase mb-1">Governance Multiplier</p>
                <p className="text-base sm:text-lg font-black text-slate-800">{t.pwr}</p>
              </div>
              <div className="p-3 sm:p-4 bg-white/60 rounded-2xl border border-white">
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-mono uppercase mb-1">DeFi Margin Limit</p>
                <p className="text-base sm:text-lg font-black text-emerald-600">{t.loan}</p>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-200/50 flex items-start gap-3">
              <span className="text-lg sm:text-xl">✨</span>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium">
                As the wallet performs actions, the UUPS Engine computes the score. The SVG data is reconstructed instantly on-chain. <strong className="text-slate-800">No IPFS delays. No centralized servers.</strong>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Address Chip ──────────────────────────────────────────────────
function AddressChip({ label, address }: { label: string; address: string; }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const short = address.slice(0, 6) + "…" + address.slice(-4);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white/60 border border-white rounded-2xl hover:border-[#9B88ED]/40 hover:bg-white/90 transition-all group shadow-sm">
      <div className="flex flex-col mb-2 sm:mb-0">
        <span className="text-[8px] sm:text-[9px] text-slate-400 l-mono uppercase tracking-widest">{label}</span>
        <span className="text-[11px] sm:text-sm text-slate-800 l-mono mt-0.5 font-bold group-hover:text-[#9B88ED] transition-colors">{short}</span>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button onClick={copy} className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
          {copied ? "Copied" : "Copy"}
        </button>
        <Link href={`https://sepolia.etherscan.io/address/${address}`} target="_blank" className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-[#9B88ED]/10 text-[#9B88ED] hover:bg-[#9B88ED] hover:text-white transition-colors text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-center">
          Etherscan ↗
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function ReputationCaseStudy() {
  const [tab, setTab] = useState<"philosophy"|"mechanics"|"art"|"security"|"deployment">("philosophy");
  const scrollRef = useRef(null);

  const TABS = [
    { id: "philosophy", label: "The Philosophy" },
    { id: "mechanics", label: "Engine & Logic" },
    { id: "art", label: "On-Chain SVG Art" },
    { id: "security", label: "Threat Models" },
    { id: "deployment", label: "Deployments" }
  ] as const;

  return (
    <>
      <style>{STYLES}</style>
      {/* Fix: Removed min-h-screen. Replaced with h-full. 
        This prevents the modal from forcing empty space at the bottom on mobile. 
      */}
      <div className="l-root w-full relative h-full overflow-hidden selection:bg-[#B76E79]/20 selection:text-[#B76E79] flex flex-col">
        
        {/* Animated Fluid Canvas */}
        <CinematicFluidCanvas />

        {/* ── HERO SECTION ── */}
        <div className="w-full px-4 sm:px-10 pt-10 sm:pt-24 pb-6 sm:pb-20 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
            
            <div className="flex-1 w-full text-center lg:text-left">
              <Reveal direction="up" className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-5 sm:mb-6 mt-4 sm:mt-0">
                <span className="px-3 sm:px-4 py-1.5 text-[8px] sm:text-[10px] font-bold tracking-widest uppercase border border-[#B76E79]/30 bg-[#B76E79]/10 text-[#B76E79] rounded-full shadow-sm">
                  🛡️ ERC-5484 Protocol
                </span>
                <span className="px-3 sm:px-4 py-1.5 text-[8px] sm:text-[10px] font-bold tracking-widest uppercase border border-[#9B88ED]/30 bg-[#9B88ED]/10 text-[#9B88ED] rounded-full shadow-sm">
                  Identity & Reputation
                </span>
              </Reveal>
              
              <Reveal direction="up" delay={0.1} className="mb-4 sm:mb-6">
                <h1 className="l-serif text-[38px] sm:text-6xl md:text-[80px] font-bold tracking-tight text-slate-900 leading-[1.05]">
                  Unforgeable <br/>
                  <span className="rose-gold-text">Identity.</span>
                </h1>
              </Reveal>
              
              <Reveal direction="up" delay={0.2}>
                <p className="text-[13px] sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium px-2 sm:px-0">
                  On-chain identity is broken. Wallets are anonymous ghosts. The <strong className="text-[#B76E79]">ERC-5484 Reputation System</strong> assigns an immutable Soulbound Token to track behavior. As you interact, your score evolves autonomously. <br/>Zero IPFS. Pure Mathematics.
                </p>
              </Reveal>
              
              <Reveal direction="up" delay={0.3} className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 justify-center lg:justify-start px-4 sm:px-0">
                <Link href="https://rst-reputation-protocol.vercel.app/" target="_blank"
                  className="px-6 sm:px-8 py-3.5 sm:py-4 text-[9px] sm:text-xs font-black uppercase tracking-widest rounded-2xl bg-slate-900 text-white hover:bg-[#B76E79] hover:shadow-[0_10px_30px_rgba(183,110,121,0.3)] hover:-translate-y-1 transition-all text-center">
                  Live Dashboard ↗
                </Link>
                <Link href="https://github.com/NexTechArchitect/RST-Reputation-Protocol" target="_blank"
                  className="px-6 sm:px-8 py-3.5 sm:py-4 text-[9px] sm:text-xs font-black uppercase tracking-widest rounded-2xl border border-slate-200 text-slate-600 bg-white/60 hover:border-[#9B88ED]/50 hover:bg-white hover:text-[#9B88ED] transition-all text-center shadow-sm">
                  Source Code
                </Link>
              </Reveal>
            </div>

            {/* Interactive SBT Visualizer */}
            <Reveal direction="left" delay={0.2} className="flex-1 w-full max-w-[280px] sm:max-w-md lg:max-w-lg mt-4 sm:mt-8 lg:mt-0 relative z-20">
              <SoulboundVisualizer />
            </Reveal>

          </div>
        </div>

        {/* ── SCROLLABLE TABS ── */}
        <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-2xl border-y border-slate-200/50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 flex gap-1 sm:gap-6 overflow-x-auto hide-scroll items-center h-12 sm:h-16">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`shrink-0 relative px-3 sm:px-4 py-3 sm:py-4 text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                  tab === t.id ? 'text-[#B76E79]' : 'text-slate-400 hover:text-slate-800'
                }`}
              >
                {t.label}
                {tab === t.id && <motion.div layoutId="l-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B76E79]" />}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT AREA ── */}
        {/* Fix: Reduced py-12 pb-24 to py-8 pb-10 on mobile to remove bottom empty space */}
        <div ref={scrollRef} className="w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 sm:py-12 pb-10 sm:pb-16 relative z-10 flex-1">
          <AnimatePresence mode="wait">
            
            {/* ════ PHILOSOPHY ════ */}
            {tab === "philosophy" && (
              <motion.div key="ph" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="space-y-5 sm:space-y-8">
                
                <GlassCard className="p-6 sm:p-12">
                  <h3 className="text-[#B76E79] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4">The Problem Statement</h3>
                  <h2 className="l-serif text-2xl sm:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">Anonymous Capital vs <br className="hidden sm:block"/>Proven Trust.</h2>
                  <p className="text-[13px] sm:text-base text-slate-600 leading-relaxed font-medium max-w-3xl">
                    In DeFi, a wallet with $10M and 1 hour of history is treated identically to a wallet with $10M and 5 years of DAO governance, loan repayments, and protocol loyalty. This lack of qualitative identity prevents undercollateralized lending and targeted airdrops.
                    <br/><br/>
                    We utilize <strong className="text-slate-900 font-bold">ERC-5484 Soulbound Tokens</strong> to create a permanent, non-transferable record of behavior. The Token contract is strictly immutable, but the UUPS Engine upgrades the metadata dynamically based on live score calculations.
                  </p>
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { t: "Immutable Truth", d: "SBT ownership is permanent. The ReputationToken.sol is strictly immutable post-deploy to prevent tampering. _update() is overridden to revert." },
                    { t: "Evolving Logic", d: "ReputationEngine is a UUPS Proxy. Scoring parameters can evolve via DAO governance without burning the physical tokens." },
                    { t: "Zero IPFS", d: "Metadata and SVG art are generated 100% on-chain in Solidity. The medal lives exactly as long as Ethereum lives." }
                  ].map((item, i) => (
                    <GlassCard key={i} className="p-5 sm:p-8 flex flex-col justify-center text-center items-center hover:-translate-y-1 transition-transform">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#9B88ED]/30 bg-[#9B88ED]/10 flex items-center justify-center text-[#9B88ED] mb-3 sm:mb-4 font-black l-serif text-base sm:text-lg shadow-sm">0{i+1}</div>
                      <h4 className="text-[11px] sm:text-xs font-black text-slate-800 mb-2 sm:mb-3 uppercase tracking-widest">{item.t}</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">{item.d}</p>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ════ ENGINE & MECHANICS ════ */}
            {tab === "mechanics" && (
              <motion.div key="mech" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="space-y-5 sm:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                  <GlassCard className="p-5 sm:p-8">
                    <h3 className="text-[#B76E79] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4 sm:mb-6">Action Scoring Matrix</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { a: "DAO Proposal", p: "+25", c: "24h Cooldown" },
                        { a: "Loan Repaid", p: "+30", c: "Natural Gate" },
                        { a: "Airdrop Held 30d", p: "+15", c: "Time Lock" },
                        { a: "Loan Defaulted", p: "−50", c: "Admin Slashed", bad: true },
                        { a: "Airdrop Dumped", p: "−20", c: "Immediate", bad: true },
                      ].map((act, i) => (
                        <div key={i} className="flex justify-between items-center p-3 sm:p-4 bg-white/60 border border-white/80 rounded-xl sm:rounded-2xl shadow-sm">
                          <div>
                            <p className="text-[9px] sm:text-xs font-black text-slate-800 uppercase tracking-wider">{act.a}</p>
                            <p className="text-[8px] sm:text-[10px] l-mono text-slate-400 mt-0.5 sm:mt-1">{act.c}</p>
                          </div>
                          <span className={`text-xs sm:text-lg font-black l-mono ${act.bad ? 'text-rose-500' : 'text-emerald-500'}`}>{act.p}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5 sm:p-8 flex flex-col">
                    <h3 className="text-[#9B88ED] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4">ReputationMath.sol</h3>
                    <h2 className="l-serif text-xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">Strict Clamping.</h2>
                    <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed font-medium mb-4 sm:mb-6">
                      The core math library ensures the score never breaches the bounds of <code className="text-[#9B88ED] bg-[#9B88ED]/10 px-1 py-0.5 rounded l-mono text-[10px] sm:text-xs border border-[#9B88ED]/20">[0, 1000]</code>. Underflows from massive defaults are caught and floored to 0. Overflows ceiling at 1000.
                    </p>
                    <div className="flex-1 p-3 sm:p-5 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl l-mono text-[8px] sm:text-[10px] text-slate-300 overflow-x-auto shadow-inner leading-loose">
                      <span className="text-slate-500">// Early-exit guards for overflow</span><br/>
                      <span className="text-purple-400">if</span> (current + delta &gt; <span className="text-emerald-400">MAX_SCORE</span>) {'{'}<br/>
                      &nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-emerald-400">MAX_SCORE</span>;<br/>
                      {'}'}<br/><br/>
                      <span className="text-slate-500">// Enum-gated deltas. Raw int256 never exposed.</span><br/>
                      <span className="text-blue-400">function</span> <span className="text-yellow-200">applyAction</span>(uint256 curr, Action act) <span className="text-purple-400">pure returns</span> (uint256) ...
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* ════ ART & SVG ════ */}
            {tab === "art" && (
              <motion.div key="art" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="space-y-6 sm:space-y-8">
                <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
                  <h3 className="text-[#B76E79] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2 sm:mb-3">Dynamically Injected SVGs</h3>
                  <h2 className="l-serif text-2xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Art via Mathematics.</h2>
                  <p className="text-[12px] sm:text-sm text-slate-600 leading-relaxed font-medium">
                    The entire medal graphic is generated inside <code className="text-[#B76E79] l-mono">ReputationSVG.sol</code>. The Engine proxy reads your score, resolves the tier, and injects the corresponding geometry into a base64 encoded payload.
                  </p>
                </div>
                <TierShowcase />
              </motion.div>
            )}

            {/* ════ SECURITY ════ */}
            {tab === "security" && (
              <motion.div key="sec" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="space-y-5 sm:space-y-6">
                <GlassCard className="p-5 sm:p-8">
                  <h3 className="text-[#9B88ED] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4 sm:mb-6">Security Invariants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { a: "Transfer Lock", f: "_update() override inside ERC721 catches all OpenZeppelin transfer paths. Token strictly reverts on transfer attempt.", lvl: "Critical" },
                      { a: "One SBT Per Wallet", f: "s_walletToToken mapping checked inside issue(). Mathematically impossible to mint two identities to one EOA.", lvl: "High" },
                      { a: "Engine Immutability", f: "setEngine() reverts with EngineAlreadySet after the first invocation. Ensures token logic cannot be hijacked.", lvl: "High" },
                      { a: "CEI & NonReentrant", f: "All ReputationVault actions strictly follow Checks-Effects-Interactions and use OpenZeppelin ReentrancyGuard.", lvl: "Critical" }
                    ].map((sec, i) => (
                      <div key={i} className="p-4 sm:p-5 bg-white/60 border border-white/80 rounded-xl sm:rounded-2xl shadow-sm hover:border-[#9B88ED]/40 transition-colors">
                        <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
                          <h4 className="text-[9px] sm:text-xs font-black text-slate-800 uppercase tracking-widest leading-relaxed">{sec.a}</h4>
                          <span className="px-1.5 sm:px-2 py-0.5 bg-[#9B88ED]/10 text-[#9B88ED] border border-[#9B88ED]/20 text-[7px] sm:text-[8px] font-black uppercase rounded shrink-0">{sec.lvl}</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">{sec.f}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* ════ DEPLOYMENT ════ */}
            {tab === "deployment" && (
              <motion.div key="dep" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
                  <GlassCard className="lg:col-span-3 p-0 overflow-hidden flex flex-col h-[300px] sm:h-[500px]">
                    <div className="px-3 sm:px-5 py-3 sm:py-4 bg-white/80 border-b border-slate-200 flex items-center gap-2 sm:gap-3 backdrop-blur-md">
                      <div className="flex gap-1.5"><span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-rose-500"/><span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400"/><span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-400"/></div>
                      <span className="l-mono text-[8px] sm:text-[10px] text-slate-500 truncate">forge test -vvv --match-path test/integration/*</span>
                    </div>
                    <div className="p-3 sm:p-6 bg-slate-900 flex-1 overflow-y-auto text-[8px] sm:text-xs l-mono leading-loose shadow-inner text-slate-400 custom-scrollbar">
                      <p className="text-white">Compiler run successful <span className="text-emerald-400">[✓]</span></p>
                      <br/>
                      <p className="text-emerald-400 truncate">[PASS] <span className="text-slate-300">test_UnrankedToBronzeFlow()</span></p>
                      <p className="text-emerald-400 truncate">[PASS] <span className="text-slate-300">test_ScoreClampingOnDefault()</span></p>
                      <p className="text-emerald-400 truncate">[PASS] <span className="text-slate-300">test_SVGGenerationMatchesTier()</span></p>
                      <p className="text-emerald-400 truncate">[PASS] <span className="text-slate-300">test_SoulboundTransferReverts()</span></p>
                      <p className="text-emerald-400 truncate">[PASS] <span className="text-slate-300">test_UUPSUpgradeModifiesScoring()</span></p>
                      <p className="text-slate-500 my-1 sm:my-2">... 54 unit & fuzz tests ...</p>
                      <br/>
                      <p className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 w-fit rounded border border-emerald-500/20">✓ 60 tests passed. 0 failed.</p>
                    </div>
                  </GlassCard>

                  <div className="lg:col-span-2 flex flex-col gap-4">
                    <GlassCard className="p-5 sm:p-8">
                      <h3 className="text-[#B76E79] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">Sepolia Testnet Mocks</h3>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 mb-4 sm:mb-6 leading-relaxed">
                        Replace these placeholder addresses with your actual deployments when live. Chain ID: 11155111.
                      </p>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <AddressChip label="SBT Token" address="0x9c77Ce31a110e360d62e4eF8B1F4cf8576F70F46" />
                        <AddressChip label="Engine Proxy" address="0x4eFC1adc7Dd594C4bB04865B6dCc5101392FaBD8" />
                        <AddressChip label="Engine Impl" address="0xC81532619d5fB4728932A43A77Bfea04c3df5957" />
                        <AddressChip label="Reputation Vault" address="0xd53320CDEF6f3DfA54436D2806e765d6d6bD98b6" />
                      </div>
                    </GlassCard>

                    <GlassCard className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4 bg-rose-50/50 border-rose-100">
                      <span className="text-xl sm:text-3xl shrink-0">🔒</span>
                      <div>
                        <p className="text-[8px] sm:text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Transfer Locked</p>
                        <p className="text-[9px] sm:text-[11px] text-rose-800/70 font-medium leading-relaxed">It is mathematically impossible to sell or trade your reputation.</p>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </>
  );
}