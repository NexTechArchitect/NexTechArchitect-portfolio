"use client";

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Aurora + Particle Canvas ───────────────────────────
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    let raf: number, t = 0;

    const blobs = [
      { ox: 0.2, oy: 0.3, r: [230, 0, 122] as [number,number,number], s: 0.0006 },
      { ox: 0.8, oy: 0.6, r: [100, 0, 230] as [number,number,number], s: 0.0008 },
      { ox: 0.5, oy: 0.15, r: [255, 100, 180] as [number,number,number], s: 0.0005 },
      { ox: 0.15, oy: 0.8, r: [0, 180, 255] as [number,number,number], s: 0.001 },
    ];

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 1000, y: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.3, a: Math.random() * 0.35 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t++;

      // Aurora blobs
      blobs.forEach((b, i) => {
        const cx = W * (b.ox + Math.sin(t * b.s + i * 1.5) * 0.28);
        const cy = H * (b.oy + Math.cos(t * b.s * 1.2 + i) * 0.22);
        const rad = Math.min(W, H) * 0.6;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, `rgba(${b.r[0]},${b.r[1]},${b.r[2]},0.13)`);
        g.addColorStop(0.5, `rgba(${b.r[0]},${b.r[1]},${b.r[2]},0.05)`);
        g.addColorStop(1, `rgba(${b.r[0]},${b.r[1]},${b.r[2]},0)`);
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      });

      // Sine waves
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const y = H * (0.3 + j * 0.2) + Math.sin(x * 0.005 + t * 0.012 + j * 2.1) * H * 0.08;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(230,0,122,${0.035 - j * 0.008})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Particles
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,0,122,${p.a})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[inherit] bg-[#FAF8FC]">
      <canvas ref={canvasRef} className="w-full h-full" style={{ filter: "blur(18px)", opacity: 0.95 }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,240,248,0.65) 50%, rgba(240,240,255,0.72) 100%)", backdropFilter: "blur(40px)" }} />
    </div>
  );
}

// ── 3D Magnetic Glass Card ─────────────────────────────
function GCard({ children, className = "", d = 5 }: { children: React.ReactNode; className?: string; d?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [d, -d]), { stiffness: 160, damping: 20 });
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-d, d]), { stiffness: 160, damping: 20 });
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d", perspective: 900 }}
      className={`relative bg-white/55 backdrop-blur-2xl border border-white/80 shadow-[0_4px_30px_rgba(230,0,122,0.07),0_1px_0_rgba(255,255,255,0.9)_inset] rounded-2xl overflow-hidden ${className}`}>
      {/* Shimmer layer */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-700"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)" }} />
      {children}
    </motion.div>
  );
}

// ── Copy Address ───────────────────────────────────────
function AddrChip({ label, address }: { label: string; address: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-3 bg-white/60 border border-white/80 rounded-xl gap-2 hover:border-[#E6007A]/30 transition-all">
      <div className="min-w-0 flex-1">
        <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{label}</div>
        <div className="text-[10px] text-[#E6007A] font-mono truncate mt-0.5">{address.slice(0,10)}…{address.slice(-6)}</div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button onClick={() => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="px-2 py-1 text-[9px] font-black bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#E6007A] transition-colors">
          {copied ? "✓" : "Copy"}
        </button>
        <Link href={`https://blockscout-passet-hub.parity-testnet.parity.io/address/${address}`} target="_blank"
          className="px-2 py-1 text-[9px] font-black bg-[#E6007A]/10 border border-[#E6007A]/20 rounded-lg text-[#E6007A] hover:bg-[#E6007A] hover:text-white transition-all">↗</Link>
      </div>
    </motion.div>
  );
}

// ── PnL Sandbox ────────────────────────────────────────
function PnLSandbox() {
  const [col, setCol] = useState(1000);
  const [lev, setLev] = useState(10);
  const [entry, setEntry] = useState(2500);
  const [cur, setCur] = useState(2400);
  const size = col * lev;
  const pnl = ((cur - entry) * size) / entry;
  const equity = col + pnl;
  const liq = equity <= col * 0.05;

  return (
    <div className="mt-3 p-4 bg-white/50 border border-white/70 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em]">Live Math Engine</span>
        <AnimatePresence>
          {liq && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black rounded-full">⚡ LIQUIDATION</motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { label: "Collateral", val: col, set: setCol, min: 100, max: 10000, step: 100, fmt: (v: number) => `$${v}` },
          { label: "Leverage", val: lev, set: setLev, min: 1, max: 50, step: 1, fmt: (v: number) => `${v}×` },
          { label: "Entry Price", val: entry, set: setEntry, min: 1000, max: 5000, step: 50, fmt: (v: number) => `$${v}` },
          { label: "Current Price", val: cur, set: setCur, min: 1000, max: 5000, step: 50, fmt: (v: number) => `$${v}` },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
              onChange={(e) => s.set(Number(e.target.value))}
              className="w-full h-1.5 accent-[#E6007A] cursor-pointer rounded-full" />
            <div className="text-xs font-mono font-bold text-slate-700 mt-0.5">{s.fmt(s.val)}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: "Position", v: `$${(size/1000).toFixed(1)}K`, c: "text-slate-800", bg: "bg-slate-50/80" },
          { l: "PnL", v: `${pnl >= 0 ? "+" : ""}${pnl.toFixed(0)}`, c: pnl >= 0 ? "text-emerald-600" : "text-rose-600", bg: pnl >= 0 ? "bg-emerald-50/80" : "bg-rose-50/80" },
          { l: "Equity", v: `$${equity.toFixed(0)}`, c: liq ? "text-red-600" : "text-blue-600", bg: liq ? "bg-red-50/80" : "bg-blue-50/80" },
        ].map((s) => (
          <div key={s.l} className={`${s.bg} rounded-xl p-2 border border-white/80`}>
            <div className="text-[9px] text-slate-400 font-black uppercase">{s.l}</div>
            <div className={`text-sm font-mono font-black ${s.c} mt-0.5 tabular-nums`}>{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────
type TabId = "overview" | "architecture" | "security" | "tests";
const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "security", label: "Security" },
  { id: "tests", label: "Tests & Deploy" },
];

export default function NexusPolkaCaseStudy() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    // KEY FIX: h-auto everywhere, no min-h-screen, no fixed heights on content
    <div className="w-full relative text-slate-800 font-sans selection:bg-[#E6007A]/20 overflow-hidden rounded-[20px] md:rounded-[36px]">
      <AuroraCanvas />

      <div className="relative z-10 flex flex-col">

        {/* ── HERO ── */}
        <div className="px-4 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-6 border-b border-white/50">
          <div className="max-w-5xl mx-auto">

            {/* Badges */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-4">
              {[
                { text: "🏆 Polkadot Hackathon 2026", pink: true },
                { text: "Asset Hub · DeFi", pink: false },
                { text: "50× Leverage", pink: false },
              ].map((b, i) => (
                <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className={`px-3 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase rounded-full ${
                    b.pink
                      ? "bg-[#E6007A] text-white shadow-[0_4px_16px_rgba(230,0,122,0.35)]"
                      : "bg-white/70 border border-white/80 text-slate-600"
                  }`}>
                  {b.text}
                </motion.span>
              ))}
            </motion.div>

            {/* Title + Video side by side on desktop */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
              <div className="flex-1 min-w-0">
                {/* Word-by-word title */}
                <div className="overflow-hidden mb-3">
                  <motion.h1 initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-5xl md:text-[64px] font-black tracking-tight text-slate-900 leading-[0.95]">
                    Nexus{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6007A] via-[#FF4FA3] to-[#C20067]">
                      Perps.
                    </span>
                  </motion.h1>
                </div>

                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="text-sm text-slate-600 leading-relaxed font-medium max-w-md bg-white/50 p-3.5 rounded-xl border border-white/70 mb-4">
                  Institutional-grade, fully on-chain perpetuals on <strong className="text-[#E6007A]">Polkadot Hub Testnet</strong>. Custom PriceKeeper oracles, ERC-4337 gasless accounts, zero off-chain settlement.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2">
                  <Link href="https://nexus-protocol-v2.vercel.app/" target="_blank"
                    className="group relative px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl bg-[#E6007A] text-white overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(230,0,122,0.45)] transition-all">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    <span className="relative">Launch App ⚡</span>
                  </Link>
                  {/* FIXED: correct GitHub URL */}
                  <Link href="https://github.com/NexTechArchitect/nexus-protocol-v2" target="_blank"
                    className="px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl bg-white/70 border border-white/80 text-slate-700 hover:text-[#E6007A] hover:bg-white hover:shadow-md transition-all">
                    Source Code ↗
                  </Link>
                </motion.div>

                {/* Stats */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                  className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/50">
                  {[
                    { v: "95", l: "Tests" }, { v: "6.4K", l: "Mutations" },
                    { v: "50×", l: "Leverage" }, { v: "5", l: "Contracts" },
                  ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.07 }}
                      className="flex flex-col items-center text-center group cursor-default">
                      <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#E6007A] transition-colors tabular-nums">{s.v}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{s.l}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Video — hidden on very small, shown alongside on md+ */}
              <motion.div initial={{ opacity: 0, scale: 0.9, rotateY: -12 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.15, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-[380px] xl:w-[440px] shrink-0"
                style={{ perspective: 1000 }}>
                <GCard className="p-1.5 overflow-hidden" d={6}>
                  <video src="https://github.com/user-attachments/assets/0aa71e44-42ef-43c6-8a9a-1ffb3fe06fd4"
                    autoPlay loop muted playsInline
                    className="w-full rounded-xl object-cover aspect-video" />
                </GCard>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="sticky top-0 z-40 bg-white/55 backdrop-blur-2xl border-b border-white/60 shadow-[0_2px_20px_rgba(230,0,122,0.05)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 flex gap-1 overflow-x-auto scrollbar-hide h-12 sm:h-14 items-center">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`relative shrink-0 px-3 sm:px-5 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 ${
                  tab === t.id
                    ? "text-[#E6007A] bg-white shadow-sm border border-[#E6007A]/15"
                    : "text-slate-400 hover:text-slate-700 hover:bg-white/50"
                }`}>
                {tab === t.id && (
                  <motion.div layoutId="active-tab" className="absolute inset-0 bg-white rounded-xl" style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT — KEY: pb-8 not pb-32, no min-h ── */}
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 pt-5 pb-8">
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {tab === "overview" && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                className="flex flex-col gap-4">

                <GCard className="p-5 sm:p-7">
                  <div className="text-[#E6007A] text-[9px] font-black uppercase tracking-[0.3em] mb-2">Core Philosophy</div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 leading-tight">Redefining On-Chain Perpetuals.</h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    Existing DEXes rely on centralized infrastructure disguised as decentralized. Thin markets enable oracle manipulation; custodial bridges introduce counterparty risk. Nexus eliminates these using localized state manipulation and deterministic math on Polkadot Hub.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { t: "Oracle Integrity", d: "MockAggregatorV3 + heartbeat staleness guards. Auto-syncs via frontend wallet.", icon: "🔮" },
                      { t: "Cross-Chain Sync", d: "Native CCIP with per-trader nonce replay protection.", icon: "🔗" },
                      { t: "Zero Custody", d: "All collateral in PerpsVault.sol. No admin multisigs, no bridges.", icon: "🔐" },
                    ].map((item) => (
                      <motion.div key={item.t} whileHover={{ y: -2, scale: 1.01 }}
                        className="p-3.5 bg-white/70 border border-white/90 rounded-xl shadow-sm">
                        <div className="text-xl mb-2">{item.icon}</div>
                        <div className="text-[10px] font-black text-slate-800 uppercase mb-1">{item.t}</div>
                        <div className="text-[10px] text-slate-500 leading-relaxed">{item.d}</div>
                      </motion.div>
                    ))}
                  </div>
                </GCard>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Precision Dynamics",
                      bad: "Dust Sweep / Drain Attacks",
                      badD: "Protocols using USDC (6 dec) suffer dust sweeping during division operations.",
                      good: "18-Decimal Normalization",
                      goodD: "DECIMALS_SCALAR = 10^(18-6). scaledAmount % SCALAR != 0 forcefully reverts precision drain.",
                    },
                    {
                      title: "Inflation Vectors",
                      bad: "ERC-4626 Share Inflation",
                      badD: "First depositor manipulates exchange rate via direct asset transfers to vault.",
                      good: "Permanent Burn Genesis",
                      goodD: "MINIMUM_LIQUIDITY = 1000 shares burned to address(0) on first deposit permanently.",
                    },
                  ].map((card) => (
                    <GCard key={card.title} className="p-5">
                      <div className="text-[#E6007A] text-[9px] font-black uppercase tracking-[0.3em] mb-3">{card.title}</div>
                      <div className="space-y-2.5">
                        <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl">
                          <div className="text-red-500 text-[9px] font-black uppercase line-through mb-1">{card.bad}</div>
                          <div className="text-slate-500 text-[10px] leading-relaxed">{card.badD}</div>
                        </div>
                        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                          <div className="text-emerald-600 text-[9px] font-black uppercase mb-1">✓ {card.good}</div>
                          <div className="text-slate-600 text-[10px] leading-relaxed font-medium">{card.goodD}</div>
                        </div>
                      </div>
                    </GCard>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ARCHITECTURE */}
            {tab === "architecture" && (
              <motion.div key="arch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                className="flex flex-col gap-4">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <GCard className="p-5 sm:p-6">
                    <div className="text-[#E6007A] text-[9px] font-black uppercase tracking-[0.3em] mb-4">5 Isolated Network Layers</div>
                    <div className="relative pl-5 border-l-2 border-[#E6007A]/25 flex flex-col gap-4">
                      {[
                        { title: "Interface Layer", sub: "Next.js 15 · Viem · Wagmi v2", desc: "Stateless. Auto-syncs oracle every 2min via connected wallet." },
                        { title: "Trading Engine", sub: "PositionManager.sol · PnLCalculator.sol", desc: "Market/limit orders, isolated/cross margin, batch liquidation." },
                        { title: "Vault Storage", sub: "PerpsVault.sol", desc: "Dual accounting: traderCollateral (free) + lockedCollateral (open). 18-dec." },
                        { title: "Oracle Layer", sub: "PriceOracle.sol · PriceKeeper.sol", desc: "Staleness guards + 60s cooldown. BTC + ETH mock Chainlink feeds." },
                        { title: "Cross-Chain (CCIP)", sub: "CrossChainRouter.sol · MessageReceiver.sol", desc: "Nonce dedup, try/catch pipeline, source + sender whitelist." },
                      ].map((node, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="relative">
                          <motion.div
                            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                            transition={{ delay: i * 0.07 + 0.1, type: "spring", stiffness: 400 }}
                            className="absolute -left-[22px] top-1 w-3 h-3 bg-white border-2 border-[#E6007A] rounded-full shadow-[0_0_6px_rgba(230,0,122,0.4)]" />
                          <div className="text-xs font-black text-slate-800">{node.title}</div>
                          <div className="text-[9px] font-mono text-[#E6007A] my-0.5">{node.sub}</div>
                          <div className="text-[10px] text-slate-500 leading-relaxed">{node.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </GCard>

                  <GCard className="p-5 sm:p-6">
                    <div className="text-[#E6007A] text-[9px] font-black uppercase tracking-[0.3em] mb-1">PnLCalculator.sol</div>
                    <div className="text-lg font-black text-slate-900 mb-1">Live Math Sandbox</div>
                    <div className="text-[10px] text-slate-500 mb-0">Pure Solidity library. Zero state. Try it live.</div>
                    <PnLSandbox />
                  </GCard>
                </div>

                {/* Math formulas */}
                <GCard className="p-5">
                  <div className="text-[#E6007A] text-[9px] font-black uppercase tracking-[0.3em] mb-3">Core Formulas</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Position Size", formula: "collateral × leverage / 1e18" },
                      { label: "Unrealized PnL", formula: "(priceDelta × posSize) / entryPrice" },
                      { label: "Liquidation Check", formula: "equity ≤ collateral × threshold / 10000" },
                    ].map((f) => (
                      <div key={f.label} className="p-3 bg-slate-900 rounded-xl">
                        <div className="text-[9px] text-slate-400 font-black uppercase mb-1.5">{f.label}</div>
                        <code className="text-[10px] text-emerald-400 font-mono leading-relaxed">{f.formula}</code>
                      </div>
                    ))}
                  </div>
                </GCard>
              </motion.div>
            )}

            {/* SECURITY */}
            {tab === "security" && (
              <motion.div key="sec" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                className="flex flex-col gap-4">

                <GCard className="p-5 sm:p-6">
                  <div className="text-[#E6007A] text-[9px] font-black uppercase tracking-[0.3em] mb-4">Threat Vectors & Mitigations</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { a: "Cross-Chain Message Replay", f: "Per-trader nonce mapping in MessageReceiver — double execution naturally reverts.", lvl: "HIGH" },
                      { a: "Unauthorized Router Access", f: "onlyCrossChainReceiver + source chain whitelist + sender whitelist all required.", lvl: "HIGH" },
                      { a: "Reentrancy Attacks", f: "ReentrancyGuard on settleTrade(), transferByManager(), batchLiquidate(). Strict CEI.", lvl: "CRITICAL" },
                      { a: "CCIP Pipeline Blocking", f: "try/catch in _ccipReceive emits TradeFailed instead of reverting. Queue never blocks.", lvl: "MEDIUM" },
                      { a: "Oracle Price Manipulation", f: "Heartbeat staleness guard reverts on stale data. 60s PriceKeeper cooldown.", lvl: "HIGH" },
                      { a: "LP Inflation Attack", f: "MINIMUM_LIQUIDITY = 1000 permanently burned on genesis. Ratio secured forever.", lvl: "HIGH" },
                    ].map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 bg-white/60 border border-white/80 rounded-xl hover:border-[#E6007A]/25 transition-all">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <div className="text-[9px] font-black text-rose-500 line-through opacity-80 leading-tight">{s.a}</div>
                          <span className={`px-1.5 py-0.5 text-white text-[8px] font-black rounded shrink-0 ${
                            s.lvl === "CRITICAL" ? "bg-red-600" : s.lvl === "HIGH" ? "bg-slate-800" : "bg-amber-500"
                          }`}>{s.lvl}</span>
                        </div>
                        <p className="text-[10px] text-slate-700 leading-relaxed font-medium">{s.f}</p>
                      </motion.div>
                    ))}
                  </div>
                </GCard>

                <GCard className="p-4 sm:p-5 flex items-start gap-3 bg-amber-50/60 border-amber-200/60">
                  <div className="text-2xl shrink-0">⚠️</div>
                  <div>
                    <div className="text-[9px] font-black text-amber-700 uppercase tracking-widest mb-1">No Formal Audit</div>
                    <p className="text-[10px] text-amber-800/80 font-medium leading-relaxed">
                      Built for Polkadot Solidity Hackathon 2026. Deployed on Testnet with mock assets only. Not formally verified by external auditors. Do not use with real funds.
                    </p>
                  </div>
                </GCard>
              </motion.div>
            )}

            {/* TESTS */}
            {tab === "tests" && (
              <motion.div key="ts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                className="flex flex-col gap-4">

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {/* Terminal — fixed height only on this element, not outer */}
                  <GCard className="p-0 overflow-hidden lg:col-span-3">
                    <div className="px-4 py-2.5 bg-white/60 border-b border-white/70 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="ml-2 text-[9px] font-mono font-bold text-slate-400 truncate">forge test -vvv</span>
                    </div>
                    <div className="p-4 bg-slate-900 h-[320px] sm:h-[380px] overflow-y-auto text-[10px] sm:text-[11px] font-mono leading-loose">
                      <div className="text-slate-300">Compiling 14 files with Solc 0.8.24... <span className="text-emerald-400">[✓]</span></div>
                      <div className="text-slate-500 mt-1 mb-2">Running 95 tests for src/core...</div>
                      {[
                        { n: "invariant_VaultIsSolvent()", t: "INVARIANT" },
                        { n: "invariant_InternalAccountingConsistent()", t: "INVARIANT" },
                        { n: "invariant_MaxActiveAssetsRespected()", t: "INVARIANT" },
                        { n: "testFuzz_LiquidationMathSolvency(uint256,uint8)", t: "FUZZ" },
                        { n: "testFuzz_OpenRandomPositions(uint96,uint8)", t: "FUZZ" },
                        { n: "test_CrossChainFlow_FullPipeline()", t: "INTEGRATION" },
                        { n: "test_LiquidationBatchResilience()", t: "INTEGRATION" },
                        { n: "test_DustDrainPrevention()", t: "UNIT" },
                        { n: "test_ShareInflationGenesis()", t: "UNIT" },
                      ].map((test, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex justify-between items-center hover:bg-white/5 px-2 py-0.5 rounded gap-2">
                          <span className="text-emerald-400 truncate">[PASS] <span className="text-slate-300">{test.n}</span></span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded shrink-0 font-black ${
                            test.t === "INVARIANT" ? "bg-purple-900 text-purple-300" :
                            test.t === "FUZZ" ? "bg-blue-900 text-blue-300" :
                            test.t === "INTEGRATION" ? "bg-amber-900 text-amber-300" :
                            "bg-slate-800 text-slate-400"
                          }`}>{test.t}</span>
                        </motion.div>
                      ))}
                      <div className="text-slate-500 px-2 py-1">... 86 more tests ...</div>
                      <div className="px-2 mt-2 pb-2">
                        <span className="text-emerald-400 font-bold">Test result: ok. 95 passed; 0 failed; 0 skipped</span>
                        <div className="text-slate-500 mt-1">Fuzz: 256 runs/test · Invariant: 128 runs × 50 calls = 6,400 mutations</div>
                      </div>
                    </div>
                  </GCard>

                  {/* Deployments */}
                  <GCard className="lg:col-span-2 p-4 sm:p-5">
                    <div className="text-[#E6007A] text-[9px] font-black uppercase tracking-[0.3em] mb-1">Polkadot Hub Testnet</div>
                    <div className="text-[9px] text-slate-400 font-bold mb-3">Chain ID: 420420417</div>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: "PositionManager", address: "0xd16150d0B2a04ECb1Aa09f840556347D5251fB53" },
                        { label: "PerpsVault", address: "0x9495fE47049a7aFe8180E9e8Aee743D533c67173" },
                        { label: "LiquidationEngine", address: "0x01721d6502547faFD3049BE60b1485B12407f58B" },
                        { label: "PriceKeeper", address: "0x481EC593F7bD9aB4219a0d0A185C16F2687871C2" },
                        { label: "MessageReceiver", address: "0xdcd169ca4Ab081C1B926Dc56430ADa8fE1E10A64" },
                      ].map((c) => <AddrChip key={c.label} {...c} />)}
                    </div>
                  </GCard>
                </div>

                {/* Invariant table */}
                <GCard className="p-5 overflow-x-auto">
                  <div className="text-[#E6007A] text-[9px] font-black uppercase tracking-[0.3em] mb-3">Invariant Test Results</div>
                  <table className="w-full text-[10px] font-mono min-w-[400px]">
                    <thead>
                      <tr className="text-left text-slate-400 border-b border-white/50">
                        <th className="pb-2 font-black uppercase text-[9px] pr-4">Handler</th>
                        <th className="pb-2 font-black uppercase text-[9px] pr-4">Selector</th>
                        <th className="pb-2 font-black uppercase text-[9px] pr-4 text-right">Calls</th>
                        <th className="pb-2 font-black uppercase text-[9px] text-right">Reverts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/30">
                      {[
                        { h: "PositionHandler", s: "changeOraclePrice", calls: 1541, rev: 0 },
                        { h: "PositionHandler", s: "createTrader", calls: 1603, rev: 0 },
                        { h: "PositionHandler", s: "openRandomPosition", calls: 1659, rev: 0 },
                        { h: "PositionHandler", s: "tryLiquidation", calls: 1598, rev: 0 },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white/20 transition-colors">
                          <td className="py-1.5 text-slate-700 pr-4">{row.h}</td>
                          <td className="py-1.5 text-[#E6007A] pr-4">{row.s}</td>
                          <td className="py-1.5 text-slate-700 text-right pr-4 tabular-nums">{row.calls.toLocaleString()}</td>
                          <td className="py-1.5 text-emerald-500 font-black text-right">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </GCard>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
