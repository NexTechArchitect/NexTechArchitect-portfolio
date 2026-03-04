"use client";

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   NEXUS PROTOCOL — Premium White 3D Case Study
   Aesthetic: Apple-meets-Bloomberg · Crisp white · Electric blue accents
═══════════════════════════════════════════════════════════════════ */

// ── Animated Counter ──────────────────────────────────────────────
function Counter({ end, suffix = "", duration = 1800 }: {
  end: number; suffix?: string; duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let startTime: number;
        const tick = (ts: number) => {
          if (!startTime) startTime = ts;
          const p = Math.min((ts - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setVal(Math.floor(eased * end));
          if (p < 1) requestAnimationFrame(tick);
          else setVal(end);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── 3D Tilt Card ──────────────────────────────────────────────────
function TiltCard({ children, className = "", intensity = 12 }: {
  children: React.ReactNode; className?: string; intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rotY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);
  const sc = { stiffness: 300, damping: 30 };
  const springRotX = useSpring(rotX, sc);
  const springRotY = useSpring(rotY, sc);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: springRotX, rotateY: springRotY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Particle Canvas ───────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let id: number;
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      a: Math.random() * 0.35 + 0.08,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20,80,255,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(20,80,255,${0.07 * (1 - d / 110)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ── Address Chip with copy ────────────────────────────────────────
function AddressChip({ label, address, href }: { label: string; address: string; href: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const short = address.slice(0, 6) + "…" + address.slice(-4);
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-[#EBEBEB] rounded-xl hover:border-[#1450FF]/30 hover:shadow-[0_0_0_3px_rgba(20,80,255,0.05)] transition-all">
      <span className="text-[11px] font-bold text-[#555] uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        <code className="text-[11px] font-mono text-[#1450FF] bg-[#F0F4FF] px-2 py-0.5 rounded">{short}</code>
        <button onClick={copy} title="Copy" className="w-6 h-6 flex items-center justify-center rounded text-[#AAA] hover:text-[#1450FF] hover:bg-[#F0F4FF] transition-all">
          {copied
            ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1.5" y="3.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 3.5V2.5A1 1 0 014.5 1.5h5a1 1 0 011 1v5a1 1 0 01-1 1H9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          }
        </button>
        <Link href={href} target="_blank" title="Etherscan" className="w-6 h-6 flex items-center justify-center rounded text-[#AAA] hover:text-[#1450FF] hover:bg-[#F0F4FF] transition-all">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 10L9.5 1.5M9.5 1.5H4M9.5 1.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────────
export default function NexusCaseStudy() {
  const [tab, setTab] = useState<"overview" | "contracts" | "security" | "tests">("overview");

  const TABS = [
    { id: "overview",   label: "Overview"   },
    { id: "contracts",  label: "Contracts"  },
    { id: "security",   label: "Security"   },
    { id: "tests",      label: "Test Suite" },
  ] as const;

  return (
    <div className="w-full bg-white text-[#0A0A0A] overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative w-full min-h-[400px] bg-[#F7F9FF] overflow-hidden">
        <ParticleCanvas />
        {/* dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(rgba(20,80,255,0.12) 1px,transparent 1px)", backgroundSize:"28px 28px" }}
        />
        {/* glow blobs */}
        <div className="absolute top-[-60px] right-[-80px] w-[320px] h-[320px] rounded-full bg-[#1450FF] opacity-[0.05] blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-[30%] w-[200px] h-[200px] rounded-full bg-[#F59E0B] opacity-[0.04] blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-8 pt-12 pb-10">
          {/* badges */}
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} className="flex flex-wrap gap-2 mb-6">
            {[
              { label:"⬤ Live · Sepolia", c:"text-[#16a34a] border-[#22c55e]/30" },
              { label:"ERC-4337 AA",      c:"text-[#1450FF] border-[#1450FF]/25" },
              { label:"Chainlink CCIP",   c:"text-[#D97706] border-[#F59E0B]/25" },
              { label:"50× Leverage",     c:"text-[#7C3AED] border-[#8B5CF6]/25" },
              { label:"Zero Gas",         c:"text-[#DB2777] border-[#EC4899]/25" },
            ].map((b,i) => (
              <motion.span key={i} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.05 }}
                className={`px-3 py-1 bg-white border text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm ${b.c}`}
              >{b.label}</motion.span>
            ))}
          </motion.div>

          {/* title */}
          <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            <h1 className="text-[54px] md:text-[76px] font-black tracking-[-3.5px] leading-[0.88] text-[#0A0A0A] mb-4">
              Nexus<br /><span className="text-[#1450FF]">Protocol</span>
            </h1>
            <p className="text-[#555] text-[15px] font-medium max-w-[480px] leading-relaxed">
              Fully on-chain perpetuals exchange. Every execution, liquidation, and settlement runs on Ethereum Sepolia with zero off-chain dependencies.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="flex flex-wrap gap-3 mt-8">
            <Link href="https://nexus-protocol-os.vercel.app/" target="_blank"
              className="flex items-center gap-2 px-6 py-3 bg-[#1450FF] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#0038DD] hover:shadow-[0_8px_30px_rgba(20,80,255,0.35)] hover:-translate-y-0.5 transition-all">
              ⚡ Launch App
            </Link>
            <Link href="https://github.com/NexTechArchitect/Nexus-Protocol" target="_blank"
              className="flex items-center gap-2 px-6 py-3 bg-white border border-[#E0E0E0] text-[#0A0A0A] text-[11px] font-black uppercase tracking-widest rounded-xl hover:border-[#1450FF] hover:text-[#1450FF] transition-all">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013.01-.4c1.02 0 2.05.14 3.01.4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </Link>
            <Link href="https://sepolia.etherscan.io/address/0x6952144C5dfb64DF54a64b61B3321Fd2C24cB42A" target="_blank"
              className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E0E0E0] text-[#888] text-[11px] font-black uppercase tracking-widest rounded-xl hover:border-[#1450FF] hover:text-[#1450FF] transition-all">
              Etherscan ↗
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── STAT CARDS ───────────────────────────────────────── */}
      <div className="px-8 py-7 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { end:6400, suf:"+", label:"State Mutations",  sub:"Zero Reverts",              color:"#1450FF" },
          { end:95,   suf:"",  label:"Tests Passing",    sub:"Unit · Fuzz · Invariant",    color:"#22c55e" },
          { end:50,   suf:"×", label:"Max Leverage",     sub:"Isolated & cross margin",    color:"#F59E0B" },
          { end:18,   suf:"",  label:"Decimal Precision",sub:"No dust sweep possible",     color:"#EC4899" },
        ].map((s, i) => (
          <TiltCard key={i} intensity={8}
            className="p-5 bg-white rounded-2xl border border-[#EBEBEB] shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.09)] transition-shadow cursor-default"
          >
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.08 + i*0.07 }}>
              <p className="text-[36px] font-black leading-none mb-2" style={{ color: s.color }}>
                <Counter end={s.end} suffix={s.suf} duration={1600 + i*80} />
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#111] mb-1">{s.label}</p>
              <p className="text-[10px] text-[#AAA] font-medium">{s.sub}</p>
            </motion.div>
          </TiltCard>
        ))}
      </div>

      {/* ── TABS ─────────────────────────────────────────────── */}
      <div className="px-8 mb-5">
        <div className="flex gap-1 bg-[#F4F5F7] p-1 rounded-xl w-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`relative px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${
                tab === t.id ? "bg-white text-[#1450FF] shadow-sm" : "text-[#888] hover:text-[#444]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ═══════════ OVERVIEW ═══════════ */}
        {tab === "overview" && (
          <motion.div key="ov" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} className="px-8 pb-10 space-y-8">

            {/* Problem / Solution grid */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#BBB] mb-4">Why Nexus Exists</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon:"⛓", p:"Oracle manipulation via thin markets",     s:"Chainlink aggregators with heartbeat staleness guard per asset" },
                  { icon:"⛽", p:"Gas costs block small traders",             s:"ERC-4337 SmartAccount · NexusPaymaster sponsors 100% gas" },
                  { icon:"🌉", p:"Liquidity fragmented across chains",        s:"Chainlink CCIP cross-chain margin relay + nonce replay protection" },
                  { icon:"🔒", p:"Custodial bridges = counterparty risk",    s:"All collateral in PerpsVault.sol — non-custodial, fully on-chain" },
                  { icon:"💧", p:"LP inflation attack on first deposit",     s:"MINIMUM_LIQUIDITY = 1000 shares permanently burned on genesis" },
                  { icon:"🎯", p:"Precision drain / dust sweep attacks",     s:"scaledAmount % DECIMALS_SCALAR ≠ 0 enforced on every withdrawal" },
                ].map((item, i) => (
                  <TiltCard key={i} intensity={5}>
                    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                      className="p-5 bg-white border border-[#EBEBEB] rounded-2xl h-full hover:border-[#1450FF]/20 hover:shadow-[0_4px_24px_rgba(20,80,255,0.07)] transition-all"
                    >
                      <span className="text-xl block mb-3">{item.icon}</span>
                      <p className="text-[10px] font-bold text-[#CC3300] uppercase tracking-wider mb-1.5 line-through opacity-50">{item.p}</p>
                      <p className="text-[12px] font-semibold text-[#0A0A0A] leading-snug">{item.s}</p>
                    </motion.div>
                  </TiltCard>
                ))}
              </div>
            </div>

            {/* Architecture layers */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#BBB] mb-4">System Architecture — 5 Isolated Layers</p>
              <div className="relative bg-[#F7F9FF] rounded-3xl border border-[#E5EAFF] p-7 overflow-hidden"
                style={{ backgroundImage:"radial-gradient(circle at 85% 15%, rgba(20,80,255,0.04) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(245,158,11,0.04) 0%, transparent 55%)" }}
              >
                <div className="flex flex-col gap-3 max-w-xl mx-auto">
                  {[
                    { label:"Interface",               sub:"Next.js 14 · Wagmi v2 · Viem · RainbowKit",                                   icon:"🖥",  cls:"bg-white border-[#EBEBEB] text-[#0A0A0A]",     z:3 },
                    { label:"Account Abstraction (ERC-4337)", sub:"SmartAccount.sol · AccountFactory.sol · NexusPaymaster.sol",           icon:"🔑",  cls:"bg-[#EEF2FF] border-[#1450FF]/20 text-[#1450FF]", z:2 },
                    { label:"Trading Engine",           sub:"PositionManager.sol · PnLCalculator.sol · LiquidationEngine.sol",            icon:"⚡",  cls:"bg-[#FFFBEC] border-[#F59E0B]/20 text-[#D97706]", z:1 },
                  ].map((l, i) => (
                    <motion.div key={i} initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.07 }}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${l.cls}`}
                      style={{ transform:`translateZ(${l.z * 3}px)` }}
                    >
                      <span className="text-xl shrink-0">{l.icon}</span>
                      <div>
                        <p className="text-[12px] font-black">{l.label}</p>
                        <p className="text-[10px] opacity-50 font-mono mt-0.5">{l.sub}</p>
                      </div>
                    </motion.div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label:"Vault Layer",   sub:"PerpsVault.sol · 18-dec precision · LP shares", icon:"🏦", cls:"bg-[#F0FDF4] border-[#22c55e]/20 text-[#16a34a]" },
                      { label:"Oracle Layer",  sub:"PriceOracle.sol · Chainlink BTC+ETH/USD",       icon:"📡", cls:"bg-[#FDF4FF] border-[#8B5CF6]/20 text-[#7C3AED]" },
                    ].map((l, i) => (
                      <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.22+i*0.06 }}
                        className={`flex items-center gap-3 px-4 py-4 rounded-2xl border ${l.cls}`}
                      >
                        <span className="text-lg shrink-0">{l.icon}</span>
                        <div>
                          <p className="text-[11px] font-black">{l.label}</p>
                          <p className="text-[9px] opacity-50 font-mono mt-0.5">{l.sub}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.34 }}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl border bg-[#0A0A0A] border-[#222] text-white"
                  >
                    <span className="text-xl shrink-0">🌐</span>
                    <div>
                      <p className="text-[12px] font-black">Cross-Chain (Chainlink CCIP)</p>
                      <p className="text-[10px] opacity-35 font-mono mt-0.5">CrossChainRouter.sol · MessageReceiver.sol · nonce dedup · try/catch pipeline safety</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Core invariants */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#BBB] mb-4">Core Design Invariants</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { n:"01", title:"No Off-Chain Trust",         desc:"Price discovery, execution, liquidation, settlement — 100% on-chain. Zero external coordination layer.",                                             c:"#1450FF" },
                  { n:"02", title:"18-Decimal Precision",       desc:"DECIMALS_SCALAR normalises USDC (6 dec) to 1e18 throughout, eliminating dust-sweep and rounding edge-cases.",                                      c:"#22c55e" },
                  { n:"03", title:"Vault Solvency Invariant",   desc:"128 runs × 50 calls = 6,400 state mutations, zero reverts. totalLiquidity + lockedCollateral + freeCollateral == ASSET.balanceOf(vault).",         c:"#F59E0B" },
                  { n:"04", title:"Isolated Margin Default",    desc:"Cross-margin mode calls _calculateGlobalPnL across all active positions for holistic equity check before any liquidation.",                          c:"#EC4899" },
                ].map((inv, i) => (
                  <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}
                    className="flex gap-4 p-5 bg-white border border-[#EBEBEB] rounded-2xl"
                  >
                    <span className="text-[30px] font-black leading-none shrink-0" style={{ color: inv.c, opacity:0.2 }}>{inv.n}</span>
                    <div>
                      <p className="text-[12px] font-black text-[#0A0A0A] mb-1">{inv.title}</p>
                      <p className="text-[11px] text-[#777] leading-relaxed">{inv.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════ CONTRACTS ═══════════ */}
        {tab === "contracts" && (
          <motion.div key="ct" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} className="px-8 pb-10 space-y-8">
            {[
              { group:"Core Trading Engine", color:"#1450FF", items:[
                { label:"PositionManager",     address:"0x6952144C5dfb64DF54a64b61B3321Fd2C24cB42A", href:"https://sepolia.etherscan.io/address/0x6952144C5dfb64DF54a64b61B3321Fd2C24cB42A" },
                { label:"PerpsVault",          address:"0x891FBf3C860333FB05f3f80526C3a1919de2d83c", href:"https://sepolia.etherscan.io/address/0x891FBf3C860333FB05f3f80526C3a1919de2d83c" },
                { label:"LiquidationEngine",   address:"0xEE17eAF240c6b7C566E7431088FfC99551472669", href:"https://sepolia.etherscan.io/address/0xEE17eAF240c6b7C566E7431088FfC99551472669" },
                { label:"PriceOracle",         address:"0x4Ca4A6fa3763b1AE2F3a09B17189152a608920f5", href:"https://sepolia.etherscan.io/address/0x4Ca4A6fa3763b1AE2F3a09B17189152a608920f5" },
              ]},
              { group:"Account Abstraction (ERC-4337)", color:"#7C3AED", items:[
                { label:"SmartAccount (Impl)", address:"0x1e821F5796bc833FE020c05007f84dF040878d81", href:"https://sepolia.etherscan.io/address/0x1e821F5796bc833FE020c05007f84dF040878d81" },
                { label:"AccountFactory",      address:"0xb6445BF0F856FDF2Fd261A5c32409d226D134221", href:"https://sepolia.etherscan.io/address/0xb6445BF0F856FDF2Fd261A5c32409d226D134221" },
                { label:"NexusPaymaster",      address:"0x20e302881494F79eF5E536d5533be04F913eE652", href:"https://sepolia.etherscan.io/address/0x20e302881494F79eF5E536d5533be04F913eE652" },
                { label:"EntryPoint",          address:"0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", href:"https://sepolia.etherscan.io/address/0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" },
              ]},
              { group:"Cross-Chain (Chainlink CCIP)", color:"#0EA5E9", items:[
                { label:"CrossChainRouter",    address:"0xE9b7f8F6c78054fb8d0D97585F32e7e026F5dd24", href:"https://sepolia.etherscan.io/address/0xE9b7f8F6c78054fb8d0D97585F32e7e026F5dd24" },
                { label:"MessageReceiver",     address:"0x5A371254b7e69d83C3aA4823D0e6ec4de91e95ec", href:"https://sepolia.etherscan.io/address/0x5A371254b7e69d83C3aA4823D0e6ec4de91e95ec" },
                { label:"CCIP Router (Sep.)",  address:"0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", href:"https://sepolia.etherscan.io/address/0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59" },
              ]},
            ].map((g, gi) => (
              <motion.div key={gi} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: gi*0.1 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#888]">{g.group}</p>
                </div>
                <div className="space-y-2">
                  {g.items.map((c,ci) => <AddressChip key={ci} {...c} />)}
                </div>
              </motion.div>
            ))}

            {/* Math */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#BBB] mb-3">PnLCalculator.sol — Pure Math Library</p>
              <TiltCard intensity={3}>
                <div className="bg-[#0A0A0A] rounded-2xl p-6 font-mono text-[12px] overflow-x-auto border border-[#1A1A1A]">
                  {[
                    { k:"positionSize   ", v:"= (collateral × leverage) / 1e18",                             color:"#60A5FA" },
                    { k:"PnL            ", v:"= (priceDelta × positionSize) / entryPrice",                   color:"#34D399" },
                    { k:"isLiquidatable ", v:"= equity ≤ maintenanceMargin",                                  color:"#F87171" },
                    { k:"               ", v:"= (collateral + PnL) ≤ (collateral × liquidationBps / 10000)", color:"#F87171" },
                  ].map((row, i) => (
                    <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.06 }} className="flex gap-2 mb-2">
                      <span className="text-[#444] shrink-0 select-none">{row.k}</span>
                      <span style={{ color: row.color }}>{row.v}</span>
                    </motion.div>
                  ))}
                </div>
              </TiltCard>
            </div>
          </motion.div>
        )}

        {/* ═══════════ SECURITY ═══════════ */}
        {tab === "security" && (
          <motion.div key="sec" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} className="px-8 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon:"📡", attack:"Oracle Price Manipulation",          fix:"Chainlink latestRoundData() + heartbeat staleness revert on every price fetch",                              level:"Critical" },
                { icon:"🔄", attack:"Reentrancy",                         fix:"ReentrancyGuard on settleTrade, transferByManager, and batchLiquidate",                                    level:"Critical" },
                { icon:"💹", attack:"LP Share Inflation",                 fix:"MINIMUM_LIQUIDITY = 1000 permanently burned on genesis deposit",                                          level:"High"     },
                { icon:"🎯", attack:"Dust Sweep / Precision Drain",       fix:"scaledAmount % DECIMALS_SCALAR != 0 enforced on every withdrawal",                                        level:"High"     },
                { icon:"⛓", attack:"Cross-Chain Replay",                  fix:"Per-trader nonce map in MessageReceiver + block.chainid binding in NexusPaymaster",                      level:"High"     },
                { icon:"🚫", attack:"Unauthorized Cross-Chain Call",      fix:"onlyCrossChainReceiver + source chain whitelist + sender whitelist — 3 independent layers",               level:"High"     },
                { icon:"🔐", attack:"Over-withdrawal (Active Position)",  fix:"lockedCollateral tracking prevents withdrawing margin from open positions",                               level:"Med"      },
                { icon:"✍️", attack:"Paymaster Signature Forgery",        fix:"keccak256(userOpHash, block.chainid, address(this)) — chain + contract bound signature",                 level:"High"     },
                { icon:"🌉", attack:"CCIP Pipeline Block",                fix:"try/catch in _ccipReceive — TradeFailed events emitted; pipeline never blocked",                          level:"Med"      },
                { icon:"🏭", attack:"Implementation Initialisation",      fix:"_disableInitializers() in SmartAccount constructor prevents impl contract attack",                        level:"Med"      },
              ].map((item, i) => {
                const lc: Record<string,string> = { Critical:"#EF4444", High:"#F59E0B", Med:"#3B82F6" };
                return (
                  <TiltCard key={i} intensity={4}>
                    <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.04 }}
                      className="p-5 bg-white border border-[#EBEBEB] rounded-2xl h-full hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: lc[item.level]+"18", color: lc[item.level] }}>{item.level}</span>
                      </div>
                      <p className="text-[10px] font-bold text-[#CC3300] mb-1.5 line-through opacity-45">{item.attack}</p>
                      <p className="text-[12px] font-semibold text-[#0A0A0A] leading-snug">{item.fix}</p>
                    </motion.div>
                  </TiltCard>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══════════ TESTS ═══════════ */}
        {tab === "tests" && (
          <motion.div key="ts" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} className="px-8 pb-10 space-y-6">

            {/* Terminal */}
            <TiltCard intensity={3}>
              <div className="bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-2xl border border-[#181818]">
                <div className="flex items-center gap-2 px-5 py-3 bg-[#111] border-b border-[#1A1A1A]">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C940]" />
                  <span className="ml-4 text-[10px] text-[#3A3A3A] font-mono">forge test -vv — Nexus Protocol</span>
                </div>
                <div className="p-6 font-mono text-[12px] space-y-1.5">
                  <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }} className="text-[#444]">$ forge test --match-contract Nexus -vv</motion.p>
                  <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }} className="text-[#666]">Compiling 12 files... [✓]</motion.p>
                  <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }} className="text-white">Running 95 tests for src/...</motion.p>
                  <div className="mt-3 space-y-1.5">
                    {[
                      { name:"[PASS] testFuzz_OpenRandomPositions(uint96,uint8)",     t:"0.3ms",  type:"FUZZ"       },
                      { name:"[PASS] testFuzz_LiquidationMathSolvency(uint96,uint8)", t:"0.2ms",  type:"FUZZ"       },
                      { name:"[PASS] invariant_VaultIsSolvent()",                     t:"1.2s",   type:"INVARIANT"  },
                      { name:"[PASS] invariant_InternalAccountingConsistent()",       t:"1.1s",   type:"INVARIANT"  },
                      { name:"[PASS] invariant_MaxActiveAssetsRespected()",           t:"0.9s",   type:"INVARIANT"  },
                      { name:"[PASS] test_AAFlow_DeployAndExecute()",                 t:"0.4ms",  type:"INTEGRATION"},
                      { name:"[PASS] test_CrossChainFlow_FullPipeline()",             t:"0.6ms",  type:"INTEGRATION"},
                      { name:"[PASS] test_LiquidationBatchResilience()",              t:"0.5ms",  type:"INTEGRATION"},
                    ].map((row, i) => {
                      const tc: Record<string,string> = { FUZZ:"#60A5FA", INVARIANT:"#F59E0B", INTEGRATION:"#34D399" };
                      return (
                        <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: 1.0 + i*0.09 }}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="text-[#22c55e] text-[11px] truncate">{row.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: tc[row.type]+"20", color: tc[row.type] }}>{row.type}</span>
                            <span className="text-[#444] text-[10px]">{row.t}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.0 }} className="mt-4 pt-4 border-t border-[#1C1C1C]">
                    <p className="text-[#22c55e] font-bold">✓ 95 tests passed · 0 failed · 2.87s</p>
                    <p className="text-[#444] text-[11px] mt-1">Fuzz: 256 runs · Invariant: 128 runs × 50 calls = 6,400 mutations</p>
                  </motion.div>
                </div>
              </div>
            </TiltCard>

            {/* Invariant table */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#BBB] mb-3">Invariant Handler Results</p>
              <div className="rounded-2xl border border-[#EBEBEB] overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead className="bg-[#F7F9FF] border-b border-[#EBEBEB]">
                    <tr>
                      {["Handler","Function","Calls","Reverts"].map(h => (
                        <th key={h} className={`py-3 font-black text-[10px] uppercase tracking-widest text-[#888] ${h === "Calls" || h === "Reverts" ? "text-right px-5" : "text-left px-5"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["PositionHandler","changeOraclePrice","1,541","0"],
                      ["PositionHandler","createTrader","1,603","0"],
                      ["PositionHandler","openRandomPosition","1,659","0"],
                      ["PositionHandler","tryLiquidation","1,598","0"],
                    ].map((row, i) => (
                      <motion.tr key={i} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.05 }}
                        className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                      >
                        <td className="px-5 py-3 font-mono text-[#555]">{row[0]}</td>
                        <td className="px-5 py-3 font-mono text-[#1450FF]">{row[1]}</td>
                        <td className="px-5 py-3 text-right font-bold text-[#0A0A0A]">{row[2]}</td>
                        <td className="px-5 py-3 text-right font-black text-[#22c55e]">{row[3]}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Test type breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type:"Unit Tests",       count:"70+",           desc:"Every function in isolation — success paths, reverts, access control, zero-address and stale-price edge cases", color:"#1450FF", bg:"#EEF2FF" },
                { type:"Fuzz Tests",       count:"256 runs",      desc:"Random collateral/leverage combinations verify no panics or unexpected reverts under any input domain",           color:"#F59E0B", bg:"#FFFBEC" },
                { type:"Invariant Tests",  count:"6,400 mutations",desc:"128 runs × 50 calls mathematically prove vault solvency holds across every reachable state permutation",         color:"#22c55e", bg:"#F0FDF4" },
              ].map((t, i) => (
                <TiltCard key={i} intensity={5}>
                  <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.1*i }}
                    className="p-5 bg-white rounded-2xl border border-[#EBEBEB] h-full"
                  >
                    <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3" style={{ backgroundColor: t.bg, color: t.color }}>{t.type}</span>
                    <p className="text-[22px] font-black text-[#0A0A0A] mb-2">{t.count}</p>
                    <p className="text-[11px] text-[#777] leading-relaxed">{t.desc}</p>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── FOOTER BAR ───────────────────────────────────────── */}
      <div className="mx-8 mb-8 px-5 py-4 bg-[#F7F9FF] border border-[#E5EAFF] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {["Solidity","Foundry","Next.js 14","Wagmi v2","Viem","Chainlink","ERC-4337","CCIP","TypeScript"].map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-white border border-[#EBEBEB] text-[10px] font-black uppercase tracking-widest text-[#666] rounded-lg">{tag}</span>
          ))}
        </div>
        <p className="text-[10px] text-[#BBB] font-medium shrink-0">⚠ Sepolia testnet only · No real funds · No formal audit</p>
      </div>
    </div>
  );
}
