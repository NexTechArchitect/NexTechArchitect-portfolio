"use client";

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";


// ── Animated Counter (supports decimals) ─────────────────────────
function Counter({ end, suffix = "", prefix = "", decimals = 0, duration = 1600 }: {
  end: number; suffix?: string; prefix?: string; decimals?: number; duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let t0: number;
        const tick = (ts: number) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / duration, 1);
          setVal((1 - Math.pow(1 - p, 4)) * end);
          if (p < 1) requestAnimationFrame(tick); else setVal(end);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{val.toFixed(decimals)}{suffix}</span>;
}

// ── 3D Tilt Card ──────────────────────────────────────────────────
function TiltCard({ children, className = "", intensity = 8 }: {
  children: React.ReactNode; className?: string; intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sc = { stiffness: 280, damping: 28 };
  const sRX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), sc);
  const sRY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), sc);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }, [x, y]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: sRX, rotateY: sRY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >{children}</motion.div>
  );
}

// ── Live Peg Chart Canvas (light bg) ─────────────────────────────
function PegChart({ height = "h-[140px]" }: { height?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let id: number; let t = 0;

    const pts: number[] = Array.from({ length: 100 }, (_, i) => {
      const noise = Math.sin(i * 0.13) * 0.016 + Math.sin(i * 0.41) * 0.007;
      return 1.0 + noise * Math.exp(-i * 0.028);
    });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.035;

      // Light grid
      ctx.strokeStyle = "rgba(16,185,129,0.08)";
      ctx.lineWidth = 1;
      for (let xi = 0; xi < 8; xi++) { const gx = (xi / 7) * W; ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (let yi = 0; yi < 5; yi++) { const gy = (yi / 4) * H; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

      // $1.00 peg dashed line
      const pegY = H * 0.5;
      ctx.setLineDash([5, 7]);
      ctx.strokeStyle = "rgba(16,185,129,0.4)";
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, pegY); ctx.lineTo(W, pegY); ctx.stroke();
      ctx.setLineDash([]);

      // "$1.00" label
      ctx.fillStyle = "rgba(16,185,129,0.5)";
      ctx.font = "bold 9px monospace";
      ctx.fillText("$1.000", 6, pegY - 5);

      // Update + add new pt
      const newNoise = (Math.sin(t * 0.8) * 0.005 + Math.sin(t * 2.1) * 0.002) * 0.6;
      pts.push(1.0 + newNoise);
      if (pts.length > 110) pts.shift();

      const minP = 0.975, maxP = 1.025;
      const toY = (p: number) => H - ((p - minP) / (maxP - minP)) * H;

      // Gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "rgba(16,185,129,0.15)");
      grad.addColorStop(1, "rgba(16,185,129,0.01)");
      ctx.beginPath();
      pts.forEach((p, i) => {
        const px = (i / (pts.length - 1)) * W;
        if (i === 0) ctx.moveTo(px, toY(p)); else ctx.lineTo(px, toY(p));
      });
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();

      // Main line
      ctx.beginPath();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "#059669";
      ctx.shadowColor = "#10B981"; ctx.shadowBlur = 6;
      pts.forEach((p, i) => {
        const px = (i / (pts.length - 1)) * W;
        if (i === 0) ctx.moveTo(px, toY(p)); else ctx.lineTo(px, toY(p));
      });
      ctx.stroke(); ctx.shadowBlur = 0;

      // Live dot
      const lastY = toY(pts[pts.length - 1]);
      ctx.beginPath(); ctx.arc(W - 5, lastY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#059669"; ctx.shadowColor = "#10B981"; ctx.shadowBlur = 12;
      ctx.fill(); ctx.shadowBlur = 0;

      id = requestAnimationFrame(draw);
    };
    draw();
    const onR = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onR);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onR); };
  }, []);
  return <canvas ref={ref} className={`w-full ${height}`} />;
}

// ── Collateral Health Bars ────────────────────────────────────────
function HealthBar({ label, value, max = 3.0 }: { label: string; value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value >= 1.5 ? "#059669" : value >= 1.0 ? "#F59E0B" : "#EF4444";
  const bg    = value >= 1.5 ? "#DCFCE7" : value >= 1.0 ? "#FEF9C3" : "#FEE2E2";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] md:text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{label}</span>
        <span className="text-[11px] md:text-[12px] font-black font-mono" style={{ color }}>{value.toFixed(2)}</span>
      </div>
      <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}40` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-[#94A3B8]">
        <span>Liquidation zone</span>
        <span style={{ color, backgroundColor: bg }} className="px-1.5 py-0.5 rounded font-bold">
          {value >= 1.5 ? "Healthy" : value >= 1.0 ? "At Risk" : "LIQUIDATABLE"}
        </span>
      </div>
    </div>
  );
}

// ── Live Liquidation Simulator ────────────────────────────────────
function LiqSim() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % 5), 2200);
    return () => clearInterval(id);
  }, []);
  const steps = [
    { icon: "🏦", label: "Collateral Deposited", sub: "$200 wETH locked in vault",     c: "#059669", bg: "#F0FDF4" },
    { icon: "💵", label: "100 DSC Minted",        sub: "Health Factor = 2.00 ✓",        c: "#3B82F6", bg: "#EFF6FF" },
    { icon: "📉", label: "ETH Price -40%",         sub: "Collateral → $120 · HF = 0.87",c: "#F59E0B", bg: "#FFFBEB" },
    { icon: "🩸", label: "Liquidator Triggers",    sub: "Burns DSC · Seizes collateral", c: "#EF4444", bg: "#FEF2F2" },
    { icon: "✅", label: "Protocol Rebalanced",    sub: "Solvency restored · +10% bonus",c: "#059669", bg: "#F0FDF4" },
  ];
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <motion.div key={i}
          animate={{ opacity: step === i ? 1 : 0.35, scale: step === i ? 1 : 0.98 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl border transition-all"
          style={{ borderColor: step === i ? `${s.c}35` : "#E2E8F0", backgroundColor: step === i ? s.bg : "transparent" }}
        >
          <span className="text-base md:text-lg shrink-0">{s.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] md:text-[12px] font-black truncate" style={{ color: step === i ? s.c : "#94A3B8" }}>{s.label}</p>
            <p className="text-[9px] md:text-[10px] text-[#CBD5E1] font-mono mt-0.5 truncate">{s.sub}</p>
          </div>
          {step === i && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: s.c, boxShadow: `0 0 8px ${s.c}` }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ── Hub Spoke Architecture Diagram ───────────────────────────────
function HubSpoke() {
  const [active, setActive] = useState<string | null>(null);
  const nodes = [
    { id: "user",       icon: "👤", label: "User",           sub: "Deposit & Mint",     color: "#3B82F6", angle: 270, r: 120 },
    { id: "liquidator", icon: "🩸", label: "Liquidator",     sub: "Monitor & Seize",    color: "#EF4444", angle: 330, r: 120 },
    { id: "oracle",     icon: "👁️", label: "Chainlink",      sub: "Price Feed",         color: "#8B5CF6", angle: 30,  r: 120 },
    { id: "collateral", icon: "🏦", label: "Vault",          sub: "wETH / wBTC",        color: "#F59E0B", angle: 90,  r: 120 },
    { id: "token",      icon: "💵", label: "DSC Token",      sub: "ERC20 Mintable",     color: "#059669", angle: 150, r: 120 },
    { id: "oracle2",    icon: "⚙️", label: "OracleLib",      sub: "Staleness Guard",    color: "#64748B", angle: 210, r: 120 },
  ];
  const toXY = (angle: number, r: number) => ({
    x: 160 + r * Math.cos((angle * Math.PI) / 180),
    y: 140 + r * Math.sin((angle * Math.PI) / 180),
  });

  return (
    <div className="relative w-full flex justify-center">
      <svg viewBox="0 0 320 280" className="w-full max-w-[320px] md:max-w-[380px]" style={{ overflow: "visible" }}>
        {/* Center glow */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="160" cy="140" rx="70" ry="55" fill="url(#centerGlow)" />

        {/* Spokes */}
        {nodes.map((n) => {
          const { x, y } = toXY(n.angle, n.r);
          const isActive = active === n.id;
          return (
            <line key={n.id}
              x1="160" y1="140" x2={x} y2={y}
              stroke={isActive ? n.color : "#E2E8F0"}
              strokeWidth={isActive ? 1.5 : 1}
              strokeDasharray={isActive ? "none" : "4 4"}
              opacity={isActive ? 1 : 0.7}
              style={{ transition: "stroke 0.2s" }}
            />
          );
        })}

        {/* Center Engine */}
        <rect x="110" y="115" width="100" height="50" rx="12"
          fill="white" stroke="#059669" strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 4px 12px rgba(5,150,105,0.15))" }}
        />
        <text x="160" y="135" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="900" fontFamily="monospace">⚙️ DSCEngine.sol</text>
        <text x="160" y="148" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="monospace">Central Controller</text>
        <text x="160" y="159" textAnchor="middle" fill="#94A3B8" fontSize="6.5" fontFamily="monospace">Mint · Burn · Liquidate</text>

        {/* Outer Nodes */}
        {nodes.map((n) => {
          const { x, y } = toXY(n.angle, n.r);
          const isActive = active === n.id;
          return (
            <g key={n.id} style={{ cursor: "pointer" }}
              onMouseEnter={() => setActive(n.id)}
              onMouseLeave={() => setActive(null)}
            >
              <circle cx={x} cy={y} r={isActive ? 28 : 24}
                fill={isActive ? n.color : "white"}
                stroke={n.color}
                strokeWidth={isActive ? 0 : 1.5}
                style={{ transition: "all 0.2s", filter: isActive ? `drop-shadow(0 4px 14px ${n.color}50)` : "none" }}
              />
              <text x={x} y={y - 2} textAnchor="middle" fontSize="13" style={{ userSelect: "none" }}>{n.icon}</text>
              <text x={x} y={y + 11} textAnchor="middle"
                fill={isActive ? "white" : "#374151"}
                fontSize="6.5" fontWeight="800" fontFamily="monospace"
                style={{ transition: "fill 0.2s" }}
              >{n.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────────
export default function StableCoinCaseStudy() {
  const [tab, setTab] = useState<"mechanics" | "architecture" | "math">("mechanics");

  const TABS = [
    { id: "mechanics",    label: "Mechanics"    },
    { id: "architecture", label: "Architecture" },
    { id: "math",         label: "Math & Proof" },
  ] as const;

  return (
    <div className="w-full bg-[#F8FFFE] text-[#0F172A] overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative w-full min-h-[360px] md:min-h-[400px] bg-white overflow-hidden border-b border-[#E2F5EE]">
        {/* Soft dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(5,150,105,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        {/* Emerald glow blobs */}
        <div className="absolute top-[-40px] right-[5%] w-[280px] h-[280px] rounded-full bg-[#10B981] opacity-[0.06] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-[20%] w-[200px] h-[160px] rounded-full bg-[#8B5CF6] opacity-[0.04] blur-[60px] pointer-events-none" />

        <div className="relative z-10 px-5 md:px-8 pt-10 md:pt-12 pb-8">
          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-5">
            {[
              { label: "⬤ $1.00 Peg",           c: "text-[#059669] border-[#059669]/25 bg-[#DCFCE7]" },
              { label: "200% Collateralized",    c: "text-[#7C3AED] border-[#7C3AED]/25 bg-[#EDE9FE]" },
              { label: "Chainlink Oracle",       c: "text-[#2563EB] border-[#2563EB]/25 bg-[#DBEAFE]" },
              { label: "No Governance Token",    c: "text-[#DC2626] border-[#DC2626]/25 bg-[#FEE2E2]" },
              { label: "10k+ Fuzz Sequences",    c: "text-[#D97706] border-[#D97706]/25 bg-[#FEF3C7]" },
            ].map((b, i) => (
              <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className={`px-2.5 py-1 border text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full ${b.c}`}
              >{b.label}</motion.span>
            ))}
          </motion.div>

          {/* Title + chart side by side */}
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#059669] opacity-70">DeFi Protocol</span>
              </div>
              <h1 className="text-[44px] md:text-[68px] font-black tracking-[-3px] leading-[0.88] text-[#0F172A] mb-4">
                DSC<br /><span className="text-[#059669]">Engine</span>
              </h1>
              <p className="text-[#64748B] text-[13px] md:text-[14px] font-medium max-w-[420px] leading-relaxed">
                Mathematically modeled, exogenous, over-collateralized stablecoin. Anchored to USD via Chainlink oracles. Solvency invariants proven across 10,000+ random fuzz sequences with zero breaks.
              </p>

              {/* DSC vs Terra/USDC positioning */}
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  { label: "≠ USDC (Custodial)", c: "text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]" },
                  { label: "≠ Terra (Algorithmic)", c: "text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]" },
                  { label: "= On-chain Collateral ✓", c: "text-[#059669] bg-[#F0FDF4] border-[#BBF7D0]" },
                ].map((t, i) => (
                  <span key={i} className={`px-2.5 py-1 text-[9px] md:text-[10px] font-bold rounded-lg border ${t.c}`}>{t.label}</span>
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="flex flex-wrap gap-3 mt-6">
                <Link href="https://github.com/NexTechArchitect/Foundry-Defi-StableCoin" target="_blank"
                  className="flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-[#059669] text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#047857] hover:shadow-[0_8px_28px_rgba(5,150,105,0.3)] hover:-translate-y-0.5 transition-all">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013.01-.4c1.02 0 2.05.14 3.01.4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  Inspect Source
                </Link>
                <span className="flex items-center gap-1.5 px-4 py-2.5 md:py-3 bg-[#F0FDF4] border border-[#059669]/25 text-[#059669] text-[10px] font-black uppercase tracking-widest rounded-xl font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                  Peg Live: $1.000
                </span>
              </motion.div>
            </motion.div>

            {/* Live Peg Chart */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="w-full md:w-[280px] shrink-0 bg-white border border-[#E2F5EE] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(5,150,105,0.08)]"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2F5EE]">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#059669]">DSC / USD</p>
                  <p className="text-[11px] font-black text-[#0F172A] font-mono">$1.000 <span className="text-[#059669] text-[9px]">+0.00%</span></p>
                </div>
                <span className="flex items-center gap-1 text-[9px] text-[#059669] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />LIVE</span>
              </div>
              <div className="px-3 pt-2 pb-3">
                <PegChart height="h-[110px] md:h-[130px]" />
              </div>
              <div className="flex justify-between px-4 pb-3 text-[9px] text-[#94A3B8] font-mono">
                <span>0.975</span><span>Peg: 1.000</span><span>1.025</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ───────────────────────────────────────── */}
      <div className="px-5 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { end: 1.00, suf: "",   prefix: "$", dec: 2, label: "Strict Peg",        sub: "USD anchored always",    color: "#059669", bg: "#F0FDF4" },
          { end: 200,  suf: "%",  prefix: "", dec: 0,  label: "Min Collateral",    sub: "Before minting allowed", color: "#7C3AED", bg: "#F5F3FF" },
          { end: 10,   suf: "%",  prefix: "", dec: 0,  label: "Liquidation Bonus", sub: "Arbitrage incentive",    color: "#D97706", bg: "#FFFBEB" },
          { end: 10,   suf: "k+", prefix: "", dec: 0,  label: "Fuzz Sequences",    sub: "Zero invariant breaks",  color: "#2563EB", bg: "#EFF6FF" },
        ].map((s, i) => (
          <TiltCard key={i} intensity={6}
            className="p-4 md:p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-shadow cursor-default"
          >
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.07 }}>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg mb-3 text-lg" style={{ backgroundColor: s.bg }}>
                {["💵","🔒","🩸","🔬"][i]}
              </div>
              <p className="text-[26px] md:text-[32px] font-black leading-none mb-1.5" style={{ color: s.color }}>
                <Counter end={s.end} suffix={s.suf} prefix={s.prefix} decimals={s.dec} duration={1500 + i * 80} />
              </p>
              <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#0F172A] mb-0.5">{s.label}</p>
              <p className="text-[9px] md:text-[10px] text-[#CBD5E1] font-medium">{s.sub}</p>
            </motion.div>
          </TiltCard>
        ))}
      </div>

      {/* ── TABS ─────────────────────────────────────────────── */}
      <div className="px-5 md:px-8 mb-5">
        <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-xl w-fit border border-[#E2E8F0]">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 md:px-5 py-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${
                tab === t.id ? "bg-[#059669] text-white shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >{t.label}</button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ═══════════ MECHANICS ═══════════ */}
        {tab === "mechanics" && (
          <motion.div key="mech" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="px-5 md:px-8 pb-10 space-y-6">

            {/* Top 2 mechanic cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TiltCard intensity={5}>
                <div className="p-5 md:p-6 bg-white border border-[#E2E8F0] rounded-2xl h-full shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-lg md:text-xl mb-4 shadow-[0_0_12px_rgba(5,150,105,0.1)]">💵</div>
                  <h3 className="text-[14px] md:text-[16px] font-black text-[#0F172A] mb-2">Minting & Borrowing</h3>
                  <p className="text-[#64748B] text-[12px] md:text-[13px] leading-relaxed mb-4">
                    Users deposit exogenous collateral (<code className="text-[#7C3AED] bg-[#F5F3FF] px-1 rounded text-[10px]">wETH</code> or <code className="text-[#D97706] bg-[#FEF3C7] px-1 rounded text-[10px]">wBTC</code>) to mint DSC against it.
                  </p>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 font-mono">
                    <p className="text-[10px] text-[#059669] mb-2">{"// Minimum collateral to mint $100 DSC"}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#64748B]">Target mint</span>
                        <span className="text-[#0F172A] font-bold">$100.00 DSC</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#64748B]">Min. deposit</span>
                        <span className="text-[#7C3AED] font-bold">≥ $200.00 wETH</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#64748B]">Health Factor</span>
                        <span className="text-[#059669] font-bold">2.00 ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>

              <TiltCard intensity={5}>
                <div className="p-5 md:p-6 bg-white border border-[#E2E8F0] rounded-2xl h-full shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-lg md:text-xl mb-4 shadow-[0_0_12px_rgba(239,68,68,0.1)]">🩸</div>
                  <h3 className="text-[14px] md:text-[16px] font-black text-[#0F172A] mb-2">Liquidation Engine</h3>
                  <p className="text-[#64748B] text-[12px] md:text-[13px] leading-relaxed mb-4">
                    If ETH price crashes and Health Factor drops below <code className="text-[#DC2626] bg-[#FEF2F2] px-1 rounded text-[10px]">1.0</code>, anyone can liquidate and earn a 10% bonus.
                  </p>
                  <div className="bg-[#FFF7F7] border border-[#FEE2E2] rounded-xl p-4 font-mono">
                    <p className="text-[10px] text-[#DC2626] mb-2">{"// Liquidation incentive structure"}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#64748B]">Liquidator pays</span>
                        <span className="text-[#0F172A] font-bold">User's DSC debt</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#64748B]">Liquidator gets</span>
                        <span className="text-[#059669] font-bold">Collateral + 10%</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#64748B]">Trigger</span>
                        <span className="text-[#DC2626] font-bold">HF {"<"} 1.0e18</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Live Liquidation Sim + Health Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] text-[#059669] mb-4">Live Liquidation Flow Simulation</p>
                <LiqSim />
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] text-[#64748B] mb-5">Health Factor Examples</p>
                <div className="space-y-5">
                  <HealthBar label="Alice · $200 deposit · $100 DSC" value={2.0} />
                  <HealthBar label="Bob   · $150 deposit · $100 DSC" value={1.1} />
                  <HealthBar label="Carol · $118 deposit · $100 DSC" value={0.87} />
                </div>
                <p className="text-[9px] text-[#CBD5E1] mt-4 font-mono">Threshold = CollateralUSD × 0.5 / DSCMinted</p>
              </div>
            </div>

            {/* Collateral comparison */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] text-[#64748B] mb-4">DSC vs. Other Stablecoin Models</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: "USDC", type: "Fiat-Backed", desc: "Circle holds $1 in bank for every USDC. Centralized, KYC-gated, censorable.", good: false, icon: "🏛️" },
                  { name: "UST (Terra)", type: "Algorithmic", desc: "Minted by burning LUNA. No real backing. Collapsed May 2022. $60B wiped.", good: false, icon: "💀" },
                  { name: "DSC Engine", type: "Over-Collateralized", desc: "On-chain wETH/wBTC collateral. Permissionless. Provably solvent via invariants.", good: true, icon: "✅" },
                ].map((c, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${c.good ? "bg-[#F0FDF4] border-[#BBF7D0]" : "bg-[#FAFAFA] border-[#E2E8F0]"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{c.icon}</span>
                      <div>
                        <p className={`text-[11px] md:text-[12px] font-black ${c.good ? "text-[#059669]" : "text-[#0F172A]"}`}>{c.name}</p>
                        <p className="text-[9px] text-[#94A3B8] uppercase tracking-wider">{c.type}</p>
                      </div>
                    </div>
                    <p className="text-[10px] md:text-[11px] text-[#64748B] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════ ARCHITECTURE ═══════════ */}
        {tab === "architecture" && (
          <motion.div key="arch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="px-5 md:px-8 pb-10 space-y-6">

            {/* SVG Hub-Spoke + contract cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] text-[#059669] mb-4">Hub-and-Spoke — Hover to explore</p>
                <HubSpoke />
                <p className="text-[9px] text-[#CBD5E1] text-center mt-2 font-mono">Hover each node to highlight the connection</p>
              </div>

              <div className="space-y-3">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] text-[#64748B]">Contract Breakdown</p>
                {[
                  { name: "DSCEngine.sol", role: "The Brain", desc: "Central controller. Handles deposits, minting, burning, liquidation. Enforces Health Factor on every state change. Non-custodial.", color: "#059669", bg: "#F0FDF4" },
                  { name: "DecentralizedStableCoin.sol", role: "The Currency", desc: "ERC20 Burnable + Mintable token. Owned exclusively by DSCEngine — no other entity can mint or burn.", color: "#7C3AED", bg: "#F5F3FF" },
                  { name: "OracleLib.sol", role: "Safety Wrapper", desc: "Wraps Chainlink latestRoundData(). Checks block.timestamp - updatedAt > heartbeat and reverts on stale feeds.", color: "#2563EB", bg: "#EFF6FF" },
                ].map((c, i) => (
                  <TiltCard key={i} intensity={4}>
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="p-4 bg-white border border-[#E2E8F0] rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ backgroundColor: c.bg }}>
                          {["⚙️","💵","👁️"][i]}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-[11px] md:text-[12px] font-black text-[#0F172A] font-mono">{c.name}</p>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>{c.role}</span>
                          </div>
                          <p className="text-[10px] md:text-[11px] text-[#64748B] leading-relaxed">{c.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  </TiltCard>
                ))}
              </div>
            </div>

            {/* Value flow steps */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] text-[#64748B] mb-4">Value Flow — 7 Steps</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { n: "1", label: "Deposit wETH/wBTC", c: "#059669" },
                  { n: "2", label: "Lock in Vault",     c: "#2563EB" },
                  { n: "3", label: "Oracle Price Check",c: "#7C3AED" },
                  { n: "4", label: "Mint DSC",          c: "#059669" },
                  { n: "5", label: "Transfer to User",  c: "#0F172A" },
                  { n: "6", label: "Monitor HF",        c: "#D97706" },
                  { n: "7", label: "Liquidate if HF<1", c: "#DC2626" },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-2 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl"
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0" style={{ backgroundColor: s.c }}>{s.n}</span>
                    <span className="text-[10px] md:text-[11px] font-semibold text-[#374151] whitespace-nowrap">{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════ MATH ═══════════ */}
        {tab === "math" && (
          <motion.div key="math" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="px-5 md:px-8 pb-10 space-y-6">

            {/* Math formula block */}
            <TiltCard intensity={3}>
              <div className="bg-[#0F172A] rounded-2xl p-5 md:p-6 border border-[#1E293B] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#059669] opacity-[0.05] blur-[50px]" />
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] text-[#059669] mb-5">Solvency Mathematics</p>
                <div className="font-mono text-[11px] md:text-[13px] space-y-4">
                  {[
                    {
                      comment: "// 1. Health Factor — primary solvency metric",
                      lines: [
                        { k: "healthFactor", eq: "=", v: "(collateralUSD × liquidationThreshold) / totalDSCMinted", c: "#34D399" },
                        { k: "             ", eq: "=", v: "(collateralUSD × 0.50) / totalDSCMinted", c: "#6EE7B7" },
                      ]
                    },
                    {
                      comment: "// 2. Liquidation trigger",
                      lines: [
                        { k: "isLiquidatable", eq: "=", v: "healthFactor < 1.0e18", c: "#F87171" },
                      ]
                    },
                    {
                      comment: "// 3. Global protocol solvency invariant (proven by fuzzing)",
                      lines: [
                        { k: "invariant", eq: ":", v: "Σ collateralValueUSD  >  Σ totalDSCSupply", c: "#818CF8" },
                      ]
                    },
                  ].map((block, bi) => (
                    <div key={bi}>
                      <p className="text-[#334155] text-[10px] mb-1">{block.comment}</p>
                      {block.lines.map((row, ri) => (
                        <motion.div key={ri} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: bi * 0.15 + ri * 0.06 }}
                          className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2"
                        >
                          <span className="text-[#475569] shrink-0">{row.k}</span>
                          <span className="text-[#64748B] shrink-0">{row.eq}</span>
                          <span className="break-all md:break-normal" style={{ color: row.c }}>{row.v}</span>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Foundry invariants */}
            <div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] text-[#64748B] mb-3">Stateful Fuzzing Results (Foundry) — 10,000+ Sequences</p>
              <div className="space-y-3">
                {[
                  { id: "INV_01", title: "Protocol Solvency",    desc: "Total collateral value is ALWAYS strictly greater than total DSC supply across every possible state transition.",     status: "PASS", color: "#059669", bg: "#F0FDF4" },
                  { id: "INV_02", title: "Getter Safety",         desc: "All view functions (getHealthFactor, getCollateralValue, etc.) never revert, ensuring liquidators always have data.", status: "PASS", color: "#2563EB", bg: "#EFF6FF" },
                  { id: "INV_03", title: "Oracle Reliability",    desc: "Stale or broken Chainlink feeds trigger safe reverts (DoS) rather than silently using bad pricing data.",           status: "PASS", color: "#7C3AED", bg: "#F5F3FF" },
                ].map((inv, i) => (
                  <TiltCard key={i} intensity={3}>
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="flex flex-col md:flex-row md:items-center gap-3 p-4 md:p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex items-center gap-3 md:w-44 shrink-0">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-lg font-mono" style={{ backgroundColor: inv.bg, color: inv.color }}>{inv.id}</span>
                        <span className="text-[11px] md:text-[12px] font-black text-[#0F172A]">{inv.title}</span>
                      </div>
                      <p className="text-[10px] md:text-[11px] text-[#64748B] leading-relaxed flex-1">{inv.desc}</p>
                      <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
                        <span className="text-[9px] font-black text-[#059669] uppercase tracking-widest">✅ {inv.status}</span>
                      </div>
                    </motion.div>
                  </TiltCard>
                ))}
              </div>
            </div>

            {/* Forge test terminal */}
            <TiltCard intensity={3}>
              <div className="bg-[#0F172A] rounded-2xl overflow-hidden border border-[#1E293B]">
                <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-[#1E293B] border-b border-[#334155]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C940]" />
                  <span className="ml-3 text-[9px] md:text-[10px] text-[#475569] font-mono">forge test — DSC Stablecoin Engine</span>
                </div>
                <div className="p-4 md:p-5 font-mono text-[10px] md:text-[12px] space-y-1.5">
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-[#334155]">$ forge test --match-test invariant -vv</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[#475569]">Compiling... [✓]</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-white">Running invariant tests...</motion.p>
                  <div className="mt-3 space-y-1.5">
                    {[
                      { name: "[PASS] invariant_protocolMustHaveMoreValueThanTotalSupply()", t: "12.4s", runs: "10,000" },
                      { name: "[PASS] invariant_gettersCantRevert()",                         t: "8.1s",  runs: "10,000" },
                    ].map((row, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 + i * 0.15 }}
                        className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3"
                      >
                        <span className="text-[#34D399] text-[9px] md:text-[11px] flex-1 truncate">{row.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[8px] md:text-[9px] font-black px-1.5 py-0.5 rounded bg-[#059669]/15 text-[#34D399]">INVARIANT</span>
                          <span className="text-[#334155] text-[9px]">{row.runs} runs · {row.t}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-4 pt-4 border-t border-[#1E293B]">
                    <p className="text-[#34D399] font-bold text-[10px] md:text-[12px]">✓ All invariants hold · 0 breaks found · 20,000+ total runs</p>
                    <p className="text-[#334155] text-[9px] md:text-[11px] mt-1 font-mono">$ forge test → Unit + Fuzz + Invariant all passing</p>
                  </motion.div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <div className="mx-5 md:mx-8 mb-8 px-4 md:px-5 py-4 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap gap-2">
          {["Solidity","Foundry","Chainlink","ERC20","OpenZeppelin","Stateful Fuzzing","Hub-Spoke"].map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-[#F1F5F9] border border-[#E2E8F0] text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#64748B] rounded-lg">{tag}</span>
          ))}
        </div>
        <p className="text-[9px] md:text-[10px] text-[#CBD5E1] font-medium shrink-0">No frontend · Protocol-only · Educational reference</p>
      </div>
    </div>
  );
}
