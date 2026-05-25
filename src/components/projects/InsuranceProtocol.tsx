"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   SENTINEL INSURANCE PROTOCOL — Pearl Cosmos Edition
   Aesthetic: Deep Space Luxury · Cinematic 5D · True Light Theme
   Palette: Pearl White · Soft Azure · Lavender Sheen
═══════════════════════════════════════════════════════════════════ */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
  
  .l-root { 
    font-family: 'Inter', sans-serif; 
    background-color: #FAFAFA; 
    color: #1E293B; 
    overflow-x: hidden; 
  }
  .l-serif { font-family: 'Cinzel', serif; }
  .l-mono { font-family: 'JetBrains Mono', monospace; }
  
  .hide-scroll::-webkit-scrollbar { display: none; }
  .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  
  /* The 5D Cinematic Background */
  .mesh-bg {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 0;
    pointer-events: none;
    background-color: #f8fafc;
    background-image: 
      radial-gradient(circle at 15% 50%, rgba(200, 215, 255, 0.4), transparent 50%),
      radial-gradient(circle at 85% 30%, rgba(230, 215, 255, 0.3), transparent 50%),
      radial-gradient(circle at 50% 80%, rgba(190, 240, 255, 0.3), transparent 50%);
    animation: pulseBg 15s ease-in-out infinite alternate;
  }

  @keyframes pulseBg {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }

  .grain-overlay {
    position: fixed; inset: -50%; width: 200%; height: 200%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.04;
    pointer-events: none;
    z-index: 1;
    animation: grainMove 8s steps(10) infinite;
  }
  
  @keyframes grainMove {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -10%); }
    30% { transform: translate(5%, -15%); }
    50% { transform: translate(-10%, 5%); }
    70% { transform: translate(15%, 10%); }
    90% { transform: translate(-5%, 5%); }
  }

  /* Deep Frosted Glass Cards */
  .glass-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow: 
      0 30px 60px -15px rgba(0,0,0,0.05), 
      inset 0 1px 0 rgba(255,255,255,1),
      inset 0 0 30px rgba(255,255,255,0.4);
    border-radius: 32px;
  }
  
  /* Text Gradients */
  .azure-text {
    background: linear-gradient(135deg, #2563EB 0%, #38BDF8 50%, #4F46E5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .lavender-text {
    background: linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #8B5CF6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .emerald-text {
    background: linear-gradient(135deg, #059669 0%, #34D399 50%, #10B981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Floating Orbs */
  .orb {
    position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; mix-blend-mode: multiply; opacity: 0.5;
  }
`;

// ── Background Orbs ──────────────────────────────────────────────
function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
       <motion.div className="orb bg-blue-200 w-[50vw] h-[50vw] top-[-10%] left-[-10%]" 
         animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }} 
         transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
       <motion.div className="orb bg-indigo-200 w-[60vw] h-[60vw] bottom-[-20%] right-[-10%]" 
         animate={{ x: [0, -40, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }} 
         transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
       <motion.div className="orb bg-cyan-100 w-[40vw] h-[40vw] top-[40%] left-[30%]" 
         animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }} 
         transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}

// ── 3D Tilt Card ─────────────────────────────────────────────────
function TiltCard({ children, className = "", depth = 15 }: { children: React.ReactNode; className?: string; depth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [depth, -depth]), { stiffness: 200, damping: 25 });
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-depth, depth]), { stiffness: 200, damping: 25 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d", perspective: 1200 }}
      className={`glass-card transition-transform duration-300 hover:scale-[1.01] ${className}`}>
      {children}
    </motion.div>
  );
}

// ── Smooth Cinematic Reveal ───────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} 
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }} 
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }} 
      className={className}>
      {children}
    </motion.div>
  );
}

// ── Address Chip ──────────────────────────────────────────────────
function AddressChip({ label, address }: { label: string; address: string; }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const short = address.slice(0, 6) + "…" + address.slice(-4);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/70 border border-white rounded-2xl hover:border-blue-200 hover:bg-white shadow-sm transition-all group">
      <div className="flex flex-col mb-2 sm:mb-0">
        <span className="text-[10px] text-slate-500 l-mono uppercase tracking-widest">{label}</span>
        <span className="text-[13px] text-slate-800 l-mono mt-1 font-bold group-hover:text-blue-600 transition-colors">{short}</span>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button onClick={copy} className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-slate-100 text-slate-600 hover:text-white hover:bg-slate-800 transition-colors text-[10px] font-bold uppercase tracking-widest shadow-sm">
          {copied ? "Copied" : "Copy"}
        </button>
        <Link href={`https://sepolia.etherscan.io/address/${address}`} target="_blank" className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest text-center shadow-sm">
          Etherscan ↗
        </Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
export default function InsuranceProtocol() {
  const [tab, setTab] = useState<"architecture" | "contracts" | "security" | "deployment">("architecture");

  const TABS = [
    { id: "architecture", label: "Architecture" },
    { id: "contracts",    label: "Contracts"    },
    { id: "security",     label: "Security"     },
    { id: "deployment",   label: "Deployed"     },
  ] as const;

  return (
    <div className="l-root relative min-h-screen flex flex-col">
      <style>{STYLES}</style>
      
      {/* 5D Background Layers */}
      <div className="mesh-bg" />
      <div className="grain-overlay" />
      <BackgroundOrbs />

      {/* ══ HERO SECTION ══ */}
      <section className="relative z-10 w-full px-5 sm:px-10 pt-16 sm:pt-24 pb-12 sm:pb-16 flex flex-col items-center justify-center text-center">
        <Reveal>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase border border-blue-200 bg-blue-50/80 text-blue-700 rounded-full shadow-sm backdrop-blur-sm">
              🛡️ DeFi Insurance
            </span>
            <span className="px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase border border-indigo-200 bg-indigo-50/80 text-indigo-700 rounded-full shadow-sm backdrop-blur-sm">
              ERC-4626 Yield Routing
            </span>
          </div>
        </Reveal>
        
        <Reveal delay={0.1}>
          <h1 className="l-serif text-[40px] sm:text-6xl md:text-[80px] font-bold tracking-tight text-slate-900 leading-[1.05] mb-6">
            Sentinel Insurance <br/>
            <span className="azure-text">Infrastructure.</span>
          </h1>
        </Reveal>
        
        <Reveal delay={0.2}>
          <p className="text-[14px] sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium mb-10">
            A highly modular, security-first DeFi insurance architecture. Token-weighted consensus adjudication, automated capital optimization via Aave V3, and flash-loan resistant governance voting.
          </p>
        </Reveal>
        
        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://sentinel-insurance-protocol.vercel.app/" target="_blank"
              className="px-8 py-4 text-[11px] sm:text-xs font-black uppercase tracking-widest rounded-2xl bg-blue-600 text-white hover:bg-blue-700 hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all">
              Launch App ↗
            </Link>
            <Link href="https://github.com/NexTechArchitect/Sentinel-Insurance-Protocol" target="_blank"
              className="px-8 py-4 text-[11px] sm:text-xs font-black uppercase tracking-widest rounded-2xl border border-slate-300 text-slate-700 bg-white/80 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm">
              Source Code
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ══ TABS BAR ══ */}
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-y border-slate-200/60 shadow-sm mt-4">
        <div className="max-w-6xl mx-auto px-4 flex gap-2 sm:gap-6 overflow-x-auto hide-scroll items-center h-14 sm:h-16">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`shrink-0 relative px-4 py-4 text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all ${
                tab === t.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
              {tab === t.id && <motion.div layoutId="l-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* ══ CONTENT AREA ══ */}
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-10 py-12 pb-24 relative z-10 flex-1">
        <AnimatePresence mode="wait">

          {/* ─ ARCHITECTURE ─ */}
          {tab === "architecture" && (
            <motion.div key="arch" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-8">
              
              <TiltCard className="p-8 sm:p-12">
                <h3 className="azure-text text-[11px] font-black uppercase tracking-widest mb-4">The Tri-Layer Design</h3>
                <h2 className="l-serif text-3xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">Solving Idle Capital & Centralization.</h2>
                <p className="text-[14px] sm:text-[16px] text-slate-600 leading-relaxed font-medium mb-10 max-w-3xl">
                  Most decentralized insurance protocols suffer from idle capital inefficiency and centralized claim adjudication. SentinelShield isolates execution across three layers: a Policy Engine, an ERC-4626 Capital Vault connected to Aave V3, and a Snapshot-based Claims Governor.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: "📈", t: "Capital Efficiency", d: "CoveragePool implements ERC-4626, routing idle USDC collateral natively into Aave V3 for continuous APY." },
                    { icon: "🛡️", t: "Flash-Loan Resistant", d: "ClaimsGovernor enforces historical checkpoint tracking (block.number - 1) to neutralize voting attacks." },
                    { icon: "🖼️", t: "Dynamic NFTs", d: "Policies are minted as ERC-721 receipts with 100% on-chain SVG art reflecting live policy states." }
                  ].map((item, i) => (
                    <div key={i} className="p-6 bg-white/70 border border-white rounded-2xl shadow-sm hover:-translate-y-1 transition-transform">
                      <span className="text-3xl mb-4 block drop-shadow-sm">{item.icon}</span>
                      <h4 className="text-[12px] font-black text-slate-800 mb-3 uppercase tracking-widest">{item.t}</h4>
                      <p className="text-[11px] sm:text-[13px] text-slate-500 leading-relaxed">{item.d}</p>
                    </div>
                  ))}
                </div>
              </TiltCard>

            </motion.div>
          )}

          {/* ─ CONTRACTS ─ */}
          {tab === "contracts" && (
            <motion.div key="con" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { c: "azure", domain: "ROUTING & ISSUANCE",      title: "PolicyEngine.sol",     desc: "Central hub for policy origination. Validates risk thresholds via RiskRegistry, locks premiums, and triggers PolicyNFT minting." },
                  { c: "lavender", domain: "CAPITAL VAULT (4626)", title: "CoveragePool.sol",   desc: "Ensures capital efficiency by sweeping surplus USDC into Aave V3 lending pools to accrue yield for Liquidity Providers." },
                  { c: "emerald", domain: "DAO ADJUDICATION", title: "ClaimsGovernor.sol", desc: "Handles the entire lifecycle of an insurance claim. Features strict block-snapshot queries to neutralize flash-loan attacks." },
                  { c: "rose", domain: "EMERGENCY SAFEGUARD",     title: "VetoCouncil.sol",     desc: "Multi-signature threshold contract acting as a final fail-safe mechanism to void maliciously approved claims." },
                ].map((item, i) => (
                  <TiltCard key={i} className="p-8">
                    <h3 className={`${item.c}-text text-[10px] font-black uppercase tracking-widest mb-3`}>{item.domain}</h3>
                    <h2 className="l-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{item.title}</h2>
                    <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                  </TiltCard>
                ))}
            </motion.div>
          )}

          {/* ─ SECURITY ─ */}
          {tab === "security" && (
            <motion.div key="sec" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-8">
              <TiltCard className="p-8 sm:p-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b border-slate-200/60 pb-8">
                  <div>
                    <h3 className="azure-text text-[11px] font-black uppercase tracking-widest mb-2">Slither Static Analysis</h3>
                    <h2 className="l-serif text-3xl sm:text-5xl font-bold text-slate-900">Audit Profile.</h2>
                  </div>
                  <span className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                    ✅ Production Cleared
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  {[
                    { n: "0",  l: "High Risk", c: "text-slate-300" },
                    { n: "2",  l: "Medium (False Pos)", c: "text-amber-500" },
                    { n: "11", l: "Low (ERC Std)", c: "text-blue-500" },
                    { n: "16", l: "Info (NatSpec)", c: "text-emerald-500" },
                  ].map((s, i) => (
                    <div key={i} className="p-6 bg-white/70 rounded-2xl border border-white text-center shadow-sm">
                      <p className={`text-4xl sm:text-5xl font-black mb-2 ${s.c}`}>{s.n}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.l}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                  <span className="text-2xl">🛡️</span>
                  <p className="text-[12px] sm:text-sm text-slate-600 leading-relaxed font-medium">
                    <strong className="text-blue-700 font-bold">Defense Validation:</strong> Static scanning confirms zero structural data-leakage vectors, non-reentrant state transitions, and absolute mathematical precision across internal processing paths.
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          )}

          {/* ─ DEPLOYMENT ─ */}
          {tab === "deployment" && (
            <motion.div key="dep" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="space-y-6">
                  <h3 className="azure-text text-[11px] font-black uppercase tracking-widest ml-1">Core Engines (Sepolia)</h3>
                  <AddressChip label="PolicyEngine" address="0xa373BD4d832E34C960A7bF6BBf6190c939932b40" />
                  <AddressChip label="CoveragePool" address="0x2bC42ae97A20b4f06F35C42e2Fb82A0550fAAf18" />
                  <AddressChip label="RiskRegistry"  address="0xE94a55ac7678013ff68B8c26A3337A0DCe7a5210" />
                </div>
                
                <div className="space-y-6">
                  <h3 className="lavender-text text-[11px] font-black uppercase tracking-widest ml-1">Governance (Sepolia)</h3>
                  <AddressChip label="ClaimsGovernor" address="0xDc89D29Dc89178bE772EAf6E3587eB863Df6Ae8a" />
                  <AddressChip label="VetoCouncil"    address="0x00493Da33899ea9FB9Fe5401dDa9EcE7F92319Ab" />
                  <AddressChip label="PayoutExecutor" address="0x004FF5Ce04AcC4106100C283edf2A69Fb879BdCb" />
                </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}