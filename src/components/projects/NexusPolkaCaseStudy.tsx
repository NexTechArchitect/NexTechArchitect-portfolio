"use client";

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   NEXUS POLKADOT — Ultimate 5D Light Aurora Edition
   Theme: Pearlescent Glassmorphism · Moving Aurora Canvas · Deep Web3 Details
   Fixes: Removed min-heights to eliminate empty space on mobile modals
═══════════════════════════════════════════════════════════════════ */

// ── 5D Light Aurora Background Canvas ──────────────────────────────
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    let id: number;
    let time = 0;

    const colors = [
      [230, 0, 122],   // Polkadot Pink
      [0, 229, 255],   // Cyan
      [255, 182, 193], // Light Pink
      [240, 248, 255]  // Alice Blue
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      time += 0.002;

      // Create flowing 5D-like intersecting gradient meshes
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const cx = W / 2 + Math.sin(time * 0.8 + i) * (W * 0.4);
        const cy = H / 2 + Math.cos(time * 0.5 + i * 2) * (H * 0.4);
        const radius = (W + H) * 0.35 + Math.sin(time + i) * 100;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const [r, g, b] = colors[i];
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sine wave fluid lines
      ctx.lineWidth = 2;
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        for (let x = 0; x < W; x += 20) {
          const y = H / 2 + Math.sin(x * 0.003 + time * 2 + j) * 150 * Math.cos(time + x * 0.001);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(230, 0, 122, ${0.03 + j * 0.01})`;
        ctx.stroke();
      }

      id = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#FAFAFA] pointer-events-none rounded-[inherit]">
      <canvas ref={canvasRef} className="w-full h-full blur-[30px] opacity-80" />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[80px]" />
    </div>
  );
}

// ── 3D Glassmorphism Tilt Card ────────────────────────────────────
function GlassCard({ children, className = "", intensity = 3 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rX = useTransform(my, [-0.5, 0.5], [intensity, -intensity]);
  const rY = useTransform(mx, [-0.5, 0.5], [-intensity, intensity]);
  const srX = useSpring(rX, { stiffness: 200, damping: 25 });
  const srY = useSpring(rY, { stiffness: 200, damping: 25 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: srX, rotateY: srY, transformStyle: "preserve-3d", perspective: 1200 }}
      className={`bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(230,0,122,0.05)] rounded-3xl ${className}`}>
      {children}
    </motion.div>
  );
}

// ── Copyable Address Chip (Light Theme) ───────────────────────────
function AddressChipLight({ label, address }: { label: string; address: string; }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const short = address.slice(0, 6) + "…" + address.slice(-4);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white/50 border border-white/60 rounded-xl hover:border-[#E6007A]/40 transition-all shadow-sm">
      <div className="flex flex-col mb-2 sm:mb-0">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</span>
        <span className="text-xs sm:text-sm text-[#E6007A] font-mono mt-0.5">{short}</span>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button onClick={copy} className="flex-1 sm:flex-none p-2 rounded-lg bg-white/80 text-slate-600 hover:text-[#E6007A] hover:bg-white transition-colors border border-slate-200 shadow-sm text-center">
          {copied ? "Copied ✓" : "Copy"}
        </button>
        <Link href={`https://blockscout-passet-hub.parity-testnet.parity.io/address/${address}`} target="_blank" className="flex-1 sm:flex-none p-2 rounded-lg bg-[#E6007A]/10 text-[#E6007A] hover:bg-[#E6007A] hover:text-white transition-colors border border-[#E6007A]/20 shadow-sm text-center">
          Explorer ↗
        </Link>
      </div>
    </div>
  );
}

// ── Interactive PnL & Liquidation Sandbox ─────────────────────────
function PnLSandbox() {
  const [collateral, setCollateral] = useState(1000);
  const [leverage, setLeverage] = useState(10);
  const [entryPrice, setEntryPrice] = useState(2500);
  const [currentPrice, setCurrentPrice] = useState(2400);

  const positionSize = collateral * leverage;
  const priceDelta = currentPrice - entryPrice;
  const pnl = (priceDelta * positionSize) / entryPrice;
  const equity = collateral + pnl;
  const maintenanceMargin = collateral * 0.05; // 5% MM
  const isLiquidatable = equity <= maintenanceMargin;

  return (
    <div className="p-5 sm:p-6 bg-white/50 border border-white/60 rounded-2xl shadow-inner mt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">Live Math Engine Sandbox</h4>
        {isLiquidatable && <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-full animate-pulse">Liquidation Triggered</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Collateral (USDC)</label>
          <input type="range" min="100" max="10000" step="100" value={collateral} onChange={(e) => setCollateral(Number(e.target.value))} className="w-full accent-[#E6007A]" />
          <div className="text-sm font-mono text-slate-800 mt-1">${collateral}</div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Leverage (x)</label>
          <input type="range" min="1" max="50" value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} className="w-full accent-[#E6007A]" />
          <div className="text-sm font-mono text-slate-800 mt-1">{leverage}x</div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Entry Price (ETH)</label>
          <input type="range" min="1000" max="5000" step="50" value={entryPrice} onChange={(e) => setEntryPrice(Number(e.target.value))} className="w-full accent-[#E6007A]" />
          <div className="text-sm font-mono text-slate-800 mt-1">${entryPrice}</div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Price (ETH)</label>
          <input type="range" min="1000" max="5000" step="50" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} className="w-full accent-[#E6007A]" />
          <div className="text-sm font-mono text-slate-800 mt-1">${currentPrice}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t border-slate-200/50 pt-4">
        <div className="p-2 sm:p-3 bg-slate-100/50 rounded-xl border border-slate-200">
          <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold">Position Size</div>
          <div className="text-xs sm:text-lg font-mono font-bold text-slate-800">${positionSize.toLocaleString()}</div>
        </div>
        <div className={`p-2 sm:p-3 rounded-xl border ${pnl >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
          <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold">Unrealized PnL</div>
          <div className={`text-xs sm:text-lg font-mono font-bold ${pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
          </div>
        </div>
        <div className={`p-2 sm:p-3 rounded-xl border ${isLiquidatable ? 'bg-red-100 border-red-300' : 'bg-blue-50 border-blue-200'}`}>
          <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold">Total Equity</div>
          <div className={`text-xs sm:text-lg font-mono font-bold ${isLiquidatable ? 'text-red-600' : 'text-blue-600'}`}>
            ${equity.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function NexusPolkaCaseStudy() {
  const [tab, setTab] = useState<"overview"|"architecture"|"security"|"tests">("overview");

  const TABS = [
    { id: "overview", label: "Deep Overview" },
    { id: "architecture", label: "Architecture & Math" },
    { id: "security", label: "Security Models" },
    { id: "tests", label: "Tests & Deployments" }
  ] as const;

  return (
    // FIXED: Removed min-h-screen, making height responsive to content
    <div className="w-full relative h-auto text-slate-800 font-sans selection:bg-[#E6007A]/20 overflow-hidden rounded-[20px] md:rounded-[40px]">
      
      {/* Aurora Background Component */}
      <AuroraCanvas />

      {/* Foreground Content Container */}
      <div className="relative z-10 w-full h-auto flex flex-col">
        
        {/* ── HERO SECTION ── */}
        <div className="w-full px-5 sm:px-10 pt-10 sm:pt-16 pb-8 sm:pb-12 border-b border-white/40">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-center lg:items-start">
            
            <div className="flex-1 w-full text-center lg:text-left">
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4 sm:mb-6">
                <span className="px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-black tracking-widest uppercase bg-white/60 border border-white backdrop-blur-md text-[#E6007A] rounded-full shadow-sm">
                  🏆 Polkadot Hackathon 2026
                </span>
                <span className="px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-black tracking-widest uppercase bg-white/40 border border-white/60 backdrop-blur-md text-slate-600 rounded-full shadow-sm">
                  Asset Hub / DeFi
                </span>
              </motion.div>
              
              <motion.h1 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6 drop-shadow-sm"
              >
                Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6007A] to-[#FF80BF]">Perps.</span>
              </motion.h1>
              
              <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
                className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium bg-white/30 p-4 rounded-2xl border border-white/50 backdrop-blur-sm shadow-inner"
              >
                An institutional-grade, fully on-chain perpetuals exchange natively deployed on the Polkadot Hub Testnet. We engineered a robust system featuring <strong className="text-[#E6007A]">50x leverage</strong>, custom PriceKeeper oracles, and zero off-chain settlement dependencies.
              </motion.p>
              
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center lg:justify-start"
              >
                <Link href="https://nexus-protocol-v2.vercel.app/" target="_blank"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-2xl bg-[#E6007A] text-white hover:bg-[#C20067] hover:shadow-[0_10px_40px_rgba(230,0,122,0.3)] hover:-translate-y-1 transition-all text-center">
                  Launch App ⚡
                </Link>
                <Link href="https://github.com/NexTechArchitect/nexus-polka-perps" target="_blank"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-2xl bg-white/70 border border-white backdrop-blur-md text-slate-700 hover:text-[#E6007A] hover:bg-white shadow-sm hover:shadow-md transition-all text-center">
                  Source Code ↗
                </Link>
              </motion.div>
            </div>

            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.15 }}
              className="flex-1 w-full max-w-sm lg:max-w-xl relative mt-4 lg:mt-0"
            >
              <GlassCard className="p-1.5 sm:p-2 aspect-video overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none z-10 rounded-3xl" />
                <video src="https://github.com/user-attachments/assets/0aa71e44-42ef-43c6-8a9a-1ffb3fe06fd4" autoPlay loop muted playsInline className="w-full h-full object-cover rounded-xl sm:rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity" />
              </GlassCard>
            </motion.div>

          </div>
        </div>

        {/* ── SCROLLABLE TABS ── */}
        <div className="sticky top-0 z-40 bg-white/50 backdrop-blur-2xl border-b border-white/60 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-5 flex gap-1 sm:gap-4 overflow-x-auto scrollbar-hide items-center h-14 sm:h-16">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`shrink-0 relative px-3 sm:px-6 py-2 text-[9px] sm:text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                  tab === t.id 
                  ? 'text-[#E6007A] bg-white shadow-sm border border-white/80' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── DEEP CONTENT AREA ── */}
        {/* FIXED: Removed min-h-[60vh] to stop forcing empty space on small tabs */}
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-10 py-8 sm:py-10 pb-16 h-auto">
          <AnimatePresence mode="wait">
            
            {/* ════ OVERVIEW ════ */}
            {tab === "overview" && (
              <motion.div key="ov" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                <GlassCard className="p-6 sm:p-8 md:col-span-2">
                  <h3 className="text-[#E6007A] text-[10px] font-black uppercase tracking-widest mb-3">Core Philosophy</h3>
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-4">Redefining On-Chain Perpetuals.</h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
                    Existing decentralized exchanges often rely on centralized infrastructure disguised as decentralized tools. Thin markets lead to oracle manipulation, and custodial bridges introduce massive counterparty risks. Nexus was engineered from scratch on the Polkadot Hub to eliminate these attack vectors using localized state manipulation and deterministic math.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { t: "Oracle Integrity", d: "MockAggregatorV3 wrapped with strict heartbeat staleness guards. Syncs directly via frontend wallets." },
                      { t: "Cross-Chain Sync", d: "Native CCIP integration with robust per-trader nonce replay protection." },
                      { t: "Zero Custody", d: "All collateral lives purely inside PerpsVault.sol. No admin multisigs hold your funds." }
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-white/60 border border-white rounded-2xl shadow-sm">
                        <div className="text-[10px] sm:text-xs font-black text-slate-800 uppercase mb-2">{item.t}</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">{item.d}</div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6 sm:p-8">
                  <h3 className="text-[#E6007A] text-[10px] font-black uppercase tracking-widest mb-4">Precision Dynamics</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                      <h4 className="text-red-600 text-[10px] sm:text-xs font-black uppercase mb-1 line-through">Dust Sweep / Drain Attacks</h4>
                      <p className="text-slate-600 text-[10px] sm:text-xs leading-relaxed">
                        Protocols using USDC (6 dec) often suffer from dust sweeping during division.
                      </p>
                    </div>
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                      <h4 className="text-emerald-600 text-[10px] sm:text-xs font-black uppercase mb-1">18-Decimal Normalization</h4>
                      <p className="text-slate-600 text-[10px] sm:text-xs leading-relaxed">
                        We enforce <code className="font-mono bg-white px-1 py-0.5 rounded text-emerald-700">DECIMALS_SCALAR = 10^(18-6)</code>. Furthermore, <code className="font-mono bg-white px-1 py-0.5 rounded text-emerald-700">scaledAmount % SCALAR != 0</code> forcefully reverts any withdrawal attempting precision drain.
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6 sm:p-8">
                  <h3 className="text-[#E6007A] text-[10px] font-black uppercase tracking-widest mb-4">Inflation Vectors</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                      <h4 className="text-red-600 text-[10px] sm:text-xs font-black uppercase mb-1 line-through">ERC-4626 Share Inflation</h4>
                      <p className="text-slate-600 text-[10px] sm:text-xs leading-relaxed">
                        First depositor manipulating the exchange rate by sending direct asset transfers to the vault.
                      </p>
                    </div>
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                      <h4 className="text-emerald-600 text-[10px] sm:text-xs font-black uppercase mb-1">Permanent Burn Genesis</h4>
                      <p className="text-slate-600 text-[10px] sm:text-xs leading-relaxed">
                        On the very first deposit, <code className="font-mono bg-white px-1 py-0.5 rounded text-emerald-700">MINIMUM_LIQUIDITY = 1000</code> shares are permanently minted to address(0), securing the ratio for all future LPs.
                      </p>
                    </div>
                  </div>
                </GlassCard>

              </motion.div>
            )}

            {/* ════ ARCHITECTURE & MATH ════ */}
            {tab === "architecture" && (
              <motion.div key="arch" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                  {/* Layer Diagram */}
                  <GlassCard className="p-6 sm:p-8">
                    <h3 className="text-[#E6007A] text-[10px] font-black uppercase tracking-widest mb-6">5 Isolated Network Layers</h3>
                    <div className="relative pl-5 sm:pl-6 border-l-2 border-[#E6007A]/20 space-y-5 sm:space-y-6">
                      {[
                        { title: "Interface Layer", sub: "Next.js 15 App Router · Viem · Wagmi v2", desc: "Stateless read-layer. Client-side auto-syncs oracles." },
                        { title: "Trading Engine", sub: "PositionManager.sol · LiquidationEngine.sol", desc: "Processes market/limit orders, validates margins, handles keepers." },
                        { title: "Vault Storage", sub: "PerpsVault.sol", desc: "Dual accounting system isolating lockedCollateral from free trader collateral." },
                        { title: "Oracle Layer", sub: "PriceOracle.sol · MockAggregatorV3", desc: "Staleness guards and 60-second cooldown permissioned updates." },
                        { title: "Cross-Chain (CCIP)", sub: "CrossChainRouter.sol · MessageReceiver.sol", desc: "Encodes trade requests, decodes, deduplicates nonces, try/catch pipelines." },
                      ].map((node, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[27px] sm:-left-[31px] top-1 w-3 h-3 sm:w-4 sm:h-4 bg-white border-2 border-[#E6007A] rounded-full" />
                          <h4 className="text-xs sm:text-sm font-black text-slate-800">{node.title}</h4>
                          <p className="text-[9px] sm:text-[10px] font-mono text-[#E6007A] my-0.5 sm:my-1">{node.sub}</p>
                          <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">{node.desc}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Math Sandbox */}
                  <div className="flex flex-col h-full gap-5 sm:gap-6">
                    <GlassCard className="p-6 sm:p-8 flex-1">
                      <h3 className="text-[#E6007A] text-[10px] font-black uppercase tracking-widest mb-2">Deterministic Math</h3>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">PnLCalculator.sol</h2>
                      <p className="text-[10px] sm:text-xs text-slate-600 mb-0">Pure Solidity library. Zero state. Interactive demonstration below.</p>
                      
                      <PnLSandbox />
                    </GlassCard>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ════ SECURITY ════ */}
            {tab === "security" && (
              <motion.div key="sec" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-6">
                
                <GlassCard className="p-6 sm:p-8">
                  <h3 className="text-[#E6007A] text-[10px] font-black uppercase tracking-widest mb-6">Threat Vectors & Mitigations</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { a: "Cross-Chain Message Replay", f: "Per-trader nonce mapping in MessageReceiver ensures executing a CCIP message twice naturally reverts.", lvl: "High Risk" },
                      { a: "Unauthorized Router Access", f: "onlyCrossChainReceiver + source chain whitelist + sender whitelist required to execute trades.", lvl: "High Risk" },
                      { a: "Reentrancy Attacks", f: "ReentrancyGuard applied rigidly on settleTrade(), transferByManager(), and batchLiquidate(). Standard CEI patterns used.", lvl: "Critical" },
                      { a: "CCIP Pipeline Blocking", f: "A failing trade could block the entire CCIP queue. Fixed via try/catch in _ccipReceive emitting TradeFailed instead of reverting.", lvl: "Medium" }
                    ].map((sec, i) => (
                      <div key={i} className="p-4 sm:p-5 bg-white/50 border border-white/60 rounded-2xl hover:border-[#E6007A]/30 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-[10px] sm:text-xs font-black text-rose-600 line-through opacity-70 pr-2">{sec.a}</h4>
                          <span className="px-2 py-0.5 bg-slate-800 text-white text-[8px] sm:text-[9px] font-black uppercase rounded shrink-0">{sec.lvl}</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-700 leading-relaxed font-medium">{sec.f}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-5 sm:p-6 flex items-start sm:items-center gap-3 sm:gap-4 border-amber-200/50 bg-amber-50/50">
                  <div className="text-2xl sm:text-3xl shrink-0">⚠️</div>
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-black text-amber-700 uppercase tracking-widest mb-1">No Formal Audit</h4>
                    <p className="text-[10px] sm:text-xs text-amber-900/80 font-medium">This protocol was built for the Polkadot Solidity Hackathon 2026. It is deployed on the Testnet and uses mock assets. It has not undergone formal verification by external auditors.</p>
                  </div>
                </GlassCard>

              </motion.div>
            )}

            {/* ════ TESTS & DEPLOYMENTS ════ */}
            {tab === "tests" && (
              <motion.div key="ts" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
                  
                  {/* Terminal Trace */}
                  <GlassCard className="p-0 overflow-hidden lg:col-span-3 flex flex-col h-[400px] sm:h-[500px]">
                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-white/60 border-b border-white/60 flex items-center gap-2">
                      <div className="flex gap-1.5"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500"/><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400"/><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"/></div>
                      <span className="ml-2 sm:ml-3 text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 truncate">forge test -vvv --match-contract NexusPolka</span>
                    </div>
                    <div className="p-4 sm:p-6 bg-slate-900 flex-1 overflow-y-auto text-[10px] sm:text-xs font-mono leading-loose shadow-inner custom-scrollbar">
                      <div className="text-slate-300">Compiling 14 files with Solc 0.8.24... <span className="text-emerald-400">[✓]</span></div>
                      <div className="text-slate-500 mt-2">Running 95 tests for src/core...</div>
                      <br/>
                      {[
                        {n: "invariant_VaultIsSolvent()", t: "INVARIANT"},
                        {n: "invariant_InternalAccountingConsistent()", t: "INVARIANT"},
                        {n: "invariant_MaxActiveAssetsRespected()", t: "INVARIANT"},
                        {n: "testFuzz_LiquidationMathSolvency(uint256,uint8)", t: "FUZZ"},
                        {n: "testFuzz_OpenRandomPositions(uint96,uint8)", t: "FUZZ"},
                        {n: "test_CrossChainFlow_FullPipeline()", t: "INTEGRATION"},
                        {n: "test_LiquidationBatchResilience()", t: "INTEGRATION"},
                      ].map((test, i) => (
                        <div key={i} className="flex justify-between items-center hover:bg-white/5 px-1 sm:px-2 py-1 rounded gap-2">
                          <span className="text-emerald-400 truncate">[PASS] <span className="text-slate-300">{test.n}</span></span>
                          <span className="text-[8px] sm:text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded shrink-0">{test.t}</span>
                        </div>
                      ))}
                      <div className="text-slate-500 px-2 py-1">... 88 more tests ...</div>
                      <br/>
                      <div className="px-2">
                        <span className="text-emerald-400 font-bold">Test result: ok. 95 passed; 0 failed.</span>
                        <div className="text-slate-500 mt-1">Fuzz: 256 runs/test · Invariant: 128 runs × 50 calls = 6,400 mutations</div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Deployments List */}
                  <div className="lg:col-span-2 flex flex-col gap-4">
                    <GlassCard className="p-5 sm:p-6">
                      <h3 className="text-[#E6007A] text-[10px] font-black uppercase tracking-widest mb-1">Polkadot Hub Testnet</h3>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-4">Chain ID: 420420417</p>
                      
                      <div className="flex flex-col gap-2 sm:gap-3">
                        <AddressChipLight label="PositionManager" address="0xd16150d0B2a04ECb1Aa09f840556347D5251fB53" />
                        <AddressChipLight label="PerpsVault" address="0x9495fE47049a7aFe8180E9e8Aee743D533c67173" />
                        <AddressChipLight label="LiquidationEngine" address="0x01721d6502547faFD3049BE60b1485B12407f58B" />
                        <AddressChipLight label="PriceKeeper" address="0x481EC593F7bD9aB4219a0d0A185C16F2687871C2" />
                        <AddressChipLight label="MessageReceiver" address="0xdcd169ca4Ab081C1B926Dc56430ADa8fE1E10A64" />
                      </div>
                    </GlassCard>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}