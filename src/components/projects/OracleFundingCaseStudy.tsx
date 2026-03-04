"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/*
  ORACLE-PEGGED CROWDFUNDING — Financial Terminal v2
  Palette: #020617 void · #3B82F6 chainlink-blue · #10B981 emerald
  Vibe: HFT terminal · decentralized oracle network · precision math
*/

// ── Google Fonts ──────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
}

// ── Oracle Network Canvas ─────────────────────────────────────────
function OracleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    let id: number;
    let t = 0;

    const isMobile = W < 640;
    const count = isMobile ? 18 : 32;

    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      phase: Math.random() * Math.PI * 2,
      size: Math.random() * 2 + 1,
    }));

    interface Packet {
      x: number; y: number; tx: number; ty: number; p: number; spd: number;
    }
    const packets: Packet[] = [];

    const cx = () => W * 0.5;
    const cy = () => H * 0.52;

    const draw = () => {
      t += 0.016;
      ctx.fillStyle = "rgba(2,6,23,0.22)";
      ctx.fillRect(0, 0, W, H);

      const CX = cx(), CY = cy();

      // centre hub
      const pulse = Math.sin(t * 1.8) * 6;
      const hub = ctx.createRadialGradient(CX, CY, 0, CX, CY, 38 + pulse);
      hub.addColorStop(0, "rgba(59,130,246,0.55)");
      hub.addColorStop(1, "rgba(59,130,246,0)");
      ctx.beginPath(); ctx.arc(CX, CY, 38 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = hub; ctx.fill();

      ctx.beginPath(); ctx.arc(CX, CY, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 18; ctx.shadowColor = "#3B82F6";
      ctx.fill(); ctx.shadowBlur = 0;

      // nodes
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        const pulse2 = (Math.sin(t * 1.4 + n.phase) + 1) / 2;

        // soft connection line
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(CX, CY);
        ctx.strokeStyle = `rgba(16,185,129,${0.04 + pulse2 * 0.06})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size + pulse2 * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${0.3 + pulse2 * 0.6})`;
        ctx.shadowBlur = 6; ctx.shadowColor = "#10B981";
        ctx.fill(); ctx.shadowBlur = 0;

        if (Math.random() < 0.004) {
          packets.push({ x: n.x, y: n.y, tx: CX, ty: CY, p: 0, spd: 0.012 + Math.random() * 0.018 });
        }
      });

      // packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const pk = packets[i];
        pk.p += pk.spd;
        const px = pk.x + (pk.tx - pk.x) * pk.p;
        const py = pk.y + (pk.ty - pk.y) * pk.p;
        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#10B981";
        ctx.shadowBlur = 8; ctx.shadowColor = "#10B981";
        ctx.fill(); ctx.shadowBlur = 0;
        if (pk.p >= 1) packets.splice(i, 1);
      }

      id = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-75"
    />
  );
}

// ── 4-D Tilt Card ────────────────────────────────────────────────
function TiltCard({
  children,
  className = "",
  accent = "#3B82F6",
  intensity = 10,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const cfg = { stiffness: 180, damping: 20 };
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), cfg);
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), cfg);
  const sX = useTransform(mx, [-0.5, 0.5], ["120%", "-120%"]);
  const sY = useTransform(my, [-0.5, 0.5], ["120%", "-120%"]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d", perspective: 900 }}
      className={`relative rounded-2xl overflow-hidden border ${className}`}
    >
      {/* subtle glide sheen — low opacity so not aggressive */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none opacity-[0.12] mix-blend-overlay"
        style={{
          background: `linear-gradient(115deg, transparent 25%, ${accent}cc 32%, ${accent}aa 50%, transparent 56%)`,
          backgroundSize: "200% 200%",
          backgroundPositionX: sX,
          backgroundPositionY: sY,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ── Ticker Tape ───────────────────────────────────────────────────
function TickerTape() {
  const items = [
    "ETH/USD · 3,241.88",
    "MIN CONTRIBUTION · $50.00",
    "ORACLE · Chainlink AggregatorV3",
    "DECIMALS · 1e18 precision",
    "STATUS · CONTRACT LIVE",
    "GAS SAVED · ~4,200 / tx",
    "SOLIDITY · 0.8.20",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-blue-900/30 bg-[#020617]/80 py-2">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-[10px] font-bold text-blue-400/70 tracking-widest"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {item}
            <span className="mx-6 text-blue-900">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════
export default function OracleFundingCaseStudy() {
  const [tab, setTab] = useState<"overview" | "math" | "gas">("overview");

  const TABS = [
    { id: "overview", label: "Infrastructure", num: "01" },
    { id: "math", label: "Precision Math", num: "02" },
    { id: "gas", label: "Gas Eng.", num: "03" },
  ] as const;

  return (
    <div
      className="w-full bg-[#020617] text-slate-300 overflow-hidden"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      <FontLoader />

      {/* ── HERO ── */}
      <div className="relative w-full min-h-[460px] sm:min-h-[420px] flex flex-col justify-end overflow-hidden border-b border-blue-900/30">
        <OracleCanvas />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent pointer-events-none" />

        {/* ambient glows */}
        <div className="absolute top-0 right-[15%] w-72 h-72 bg-blue-600/08 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-[10%] w-64 h-64 bg-emerald-500/08 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 px-5 sm:px-8 md:px-14 pt-20 pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <div className="flex flex-wrap gap-2 mb-5">
              {["Chainlink Data Feeds", "DeFi Infrastructure", "EVM Gas Optimization"].map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    background: i === 0 ? "rgba(59,130,246,0.08)" : i === 1 ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
                    color: i === 0 ? "#3B82F6" : i === 1 ? "#10B981" : "#F59E0B",
                    border: `1px solid ${i === 0 ? "#3B82F640" : i === 1 ? "#10B98140" : "#F59E0B40"}`,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.95] text-white mb-4"
              style={{ textShadow: "0 0 40px rgba(59,130,246,0.2)" }}
            >
              Oracle-Pegged{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #3B82F6, #10B981)" }}
              >
                Crowdfunding.
              </span>
            </h1>

            <p
              className="text-[0.76rem] text-slate-400 leading-relaxed mb-7 border-l-2 border-blue-500 pl-3 max-w-md"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Fund in Crypto · Denominate in Fiat.<br />
              Real-time ETH/USD conversion enforces minimum $50 threshold before accepting any transaction.
            </p>

            <Link
              href="https://github.com/NexTechArchitect/FundMe-Contract"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 active:scale-95"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
                boxShadow: "0 0 22px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              Inspect Source ↗
            </Link>
          </motion.div>

          {/* Live feed card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.28, type: "spring", stiffness: 170, damping: 18 }}
            className="self-center sm:self-auto"
          >
            <TiltCard
              intensity={16}
              accent="#3B82F6"
              className="w-[180px] sm:w-[200px] p-5 bg-[#0B1120]/80 border-blue-500/20"
            >
              <p
                className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mb-3"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                Live Oracle Feed
              </p>
              <div className="space-y-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {[
                  { label: "MIN USD", val: "$50.00", c: "#3B82F6" },
                  { label: "Network", val: "Sepolia", c: "#F59E0B" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500">{row.label}</span>
                    <span className="text-[11px] font-bold" style={{ color: row.c }}>{row.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/05">
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                  <span className="text-[9px] text-emerald-400" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    ORACLE ACTIVE
                  </span>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>

      {/* ── TICKER ── */}
      <TickerTape />

      {/* ── TABS ── */}
      <div
        className="sticky top-0 z-20 px-5 sm:px-8 md:px-14 py-0 border-b border-blue-900/30 bg-[#020617]/90 backdrop-blur-xl"
      >
        <div className="flex overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className="relative flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors duration-150"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: tab === t.id ? "#3B82F6" : "#475569",
              }}
            >
              <span className="opacity-40 text-white">{t.num}</span>
              {t.label}
              {tab === t.id && (
                <motion.div
                  layoutId="oracle-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
                  style={{ boxShadow: "0 0 8px rgba(59,130,246,0.5)" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div
        className="px-5 sm:px-8 md:px-14 py-8 pb-16"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 70% 100%, rgba(37,99,235,0.07) 0%, transparent 70%)",
        }}
      >
        <AnimatePresence mode="wait">

          {/* ── TAB 1: INFRASTRUCTURE ── */}
          {tab === "overview" && (
            <motion.div
              key="ov"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <TiltCard accent="#10B981" intensity={8} className="p-6 bg-[#060F1E]/80 border-emerald-500/15 border-t-2 border-t-emerald-500">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-black text-white">The Volatility Problem</h3>
                    <span className="text-xl">📉</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    "Send 1 ETH" crowdfunding fails when ETH price crashes. This protocol enforces a real USD minimum on every transaction, mitigating market volatility entirely.
                  </p>
                  <div className="bg-[#020617] border border-emerald-500/20 rounded-xl p-3">
                    <p className="text-[10px] text-emerald-400 font-bold mb-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>Core invariant:</p>
                    <p className="text-[10px] text-slate-300" style={{ fontFamily: "JetBrains Mono, monospace" }}>getConversionRate(msg.value) &gt;= MINIMUM_USD</p>
                  </div>
                </TiltCard>

                <TiltCard accent="#EF4444" intensity={8} className="p-6 bg-[#060F1E]/80 border-rose-500/15 border-t-2 border-t-rose-500 relative overflow-hidden">
                  {/* animated scan line */}
                  <motion.div
                    className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent pointer-events-none"
                    animate={{ top: ["-5%", "110%"] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="text-sm font-black text-white">Secure Withdrawal</h3>
                    <span className="text-xl">🛡️</span>
                  </div>
                  <div className="space-y-2 relative z-10" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}>
                    <div className="flex justify-between items-center bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-rose-400">
                      <span>Attacker.withdraw()</span>
                      <span>❌ Revert</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg text-emerald-400">
                      <span>Owner.withdraw()</span>
                      <span>✅ Transfer</span>
                    </div>
                    <p className="text-[10px] text-slate-500 pt-1">// State reset atomically post-withdrawal</p>
                  </div>
                </TiltCard>

              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Min Contribution", value: "$50.00", c: "#10B981" },
                  { label: "Oracle", value: "Chainlink", c: "#3B82F6" },
                  { label: "Compiler", value: "0.8.20", c: "#A78BFA" },
                  { label: "Framework", value: "Foundry", c: "#F59E0B" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.06 }}
                    className="bg-[#060F1E] border border-white/06 rounded-xl p-4 text-center"
                  >
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                      {s.label}
                    </p>
                    <p className="font-black text-sm" style={{ color: s.c }}>{s.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── TAB 2: PRECISION MATH ── */}
          {tab === "math" && (
            <motion.div
              key="math"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <TiltCard accent="#3B82F6" intensity={6} className="p-6 sm:p-10 bg-[#060F1E]/80 border-blue-500/15">
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-8 text-center" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  Dynamic Price Conversion · PriceConverter.sol
                </h3>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 max-w-3xl mx-auto">
                  {[
                    { label: "msg.value", sub: "ETH · 18 dec", bg: "bg-slate-800/50", border: "border-slate-700", c: "#fff" },
                    { label: "×", sub: "", bg: "", border: "", c: "#3B82F6", divider: true },
                    { label: "Oracle Price", sub: "LINK feed · 8 dec", bg: "bg-blue-900/30", border: "border-blue-500/40", c: "#3B82F6" },
                    { label: "=", sub: "", bg: "", border: "", c: "#10B981", divider: true },
                  ].map((item, i) =>
                    item.divider ? (
                      <span key={i} className="text-2xl font-black hidden sm:block" style={{ color: item.c }}>{item.label}</span>
                    ) : (
                      <div key={i} className={`${item.bg} border ${item.border} rounded-2xl p-4 text-center w-full sm:w-32 flex-shrink-0`}
                        style={{ boxShadow: item.c === "#3B82F6" ? "0 0 20px rgba(59,130,246,0.18)" : undefined }}>
                        <p className="font-black text-sm mb-1" style={{ color: item.c, fontFamily: "JetBrains Mono, monospace" }}>{item.label}</p>
                        <p className="text-[9px] text-slate-500" style={{ fontFamily: "JetBrains Mono, monospace" }}>{item.sub}</p>
                      </div>
                    )
                  )}

                  <div className="bg-[#020617] border border-emerald-500/25 rounded-2xl p-5 w-full sm:flex-1"
                    style={{ boxShadow: "0 0 24px rgba(16,185,129,0.08)" }}>
                    <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                      Result · USD Value
                    </p>
                    <div className="space-y-1 text-[11px]" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                      <p className="text-slate-400">uint256 ethPrice = getPrice();</p>
                      <p className="text-emerald-300">(ethPrice * 1e10)</p>
                      <p className="text-emerald-300 pl-2">* ethAmount</p>
                      <p className="text-emerald-300 pl-2">/ 1e18;</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-blue-500/08 border border-blue-500/18 rounded-xl p-4 text-center max-w-2xl mx-auto">
                  <p className="text-[11px] text-blue-200 leading-relaxed" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    <strong className="text-white">Why 1e10?</strong> Chainlink returns 8-decimal fiat pairs.
                    ETH uses 18-decimal Wei. Multiply oracle price by 10^10 to normalize before math — prevents precision loss truncation.
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          )}

          {/* ── TAB 3: GAS ENGINEERING ── */}
          {tab === "gas" && (
            <motion.div
              key="gas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <TiltCard accent="#10B981" intensity={7} className="p-5 bg-[#060F1E]/80 border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <h4 className="text-sm font-black text-white">Bytecode Variables</h4>
                  </div>
                  <div className="space-y-2.5" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}>
                    <div className="bg-[#020617] p-3 rounded-lg border border-white/05">
                      <p className="text-emerald-400 mb-1">constant MINIMUM_USD</p>
                      <p className="text-slate-500 text-[10px]">~2,100 gas saved · no SLOAD · stored in bytecode</p>
                    </div>
                    <div className="bg-[#020617] p-3 rounded-lg border border-white/05">
                      <p className="text-blue-400 mb-1">immutable i_owner</p>
                      <p className="text-slate-500 text-[10px]">~2,100 gas saved per call · set once at deploy</p>
                    </div>
                  </div>
                </TiltCard>

                <TiltCard accent="#EF4444" intensity={7} className="p-5 bg-[#060F1E]/80 border-rose-500/15">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-rose-400 rounded-full" />
                    <h4 className="text-sm font-black text-white">Custom Errors</h4>
                  </div>
                  <div className="bg-[#020617] p-4 rounded-xl border border-rose-500/15" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}>
                    <p className="text-slate-500 line-through mb-2 text-[10px]">require(msg.sender == i_owner, "Not Owner!");</p>
                    <p className="text-emerald-400">if (msg.sender != i_owner) {"{"}</p>
                    <p className="text-rose-400 pl-4">revert FundMe__NotOwner();</p>
                    <p className="text-emerald-400">{"}"}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    No string storage · cheaper reverts · smaller bytecode
                  </p>
                </TiltCard>

              </div>

              <TiltCard accent="#F59E0B" intensity={5} className="p-6 bg-[#060F1E]/80 border-amber-500/15 border-t-2 border-t-amber-500">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  <h4 className="text-sm font-black text-white">Memory Caching · O(N) SLOAD savings</h4>
                </div>
                <p className="text-[11px] text-slate-400 mb-5 max-w-2xl leading-relaxed" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  During withdrawal loop, reading array length from storage every iteration costs O(N) × 2,100 gas.
                  Cache to memory once — saves massively on large funder arrays.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}>
                  <div className="bg-[#020617] p-4 rounded-xl border border-rose-500/18">
                    <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-2">❌ Expensive</p>
                    <p className="text-slate-300">for (uint i=0; i &lt;</p>
                    <p className="text-rose-400 underline pl-2">funders.length</p>
                    <p className="text-slate-300">; i++) {"{"}</p>
                    <p className="text-slate-500 pl-4 text-[10px]">// SLOAD every iteration</p>
                    <p className="text-slate-300">{"}"}</p>
                  </div>
                  <div className="bg-[#020617] p-4 rounded-xl border border-emerald-500/18">
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">✅ Gas Optimized</p>
                    <p className="text-blue-400 font-bold">uint256 len = funders.length;</p>
                    <p className="text-slate-300">for (uint i=0; i &lt;</p>
                    <p className="text-emerald-400 pl-2">len</p>
                    <p className="text-slate-300">; i++) {"{"}</p>
                    <p className="text-slate-500 pl-4 text-[10px]">// MLOAD only</p>
                    <p className="text-slate-300">{"}"}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
