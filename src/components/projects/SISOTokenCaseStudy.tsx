"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  useAnimationFrame,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/*
  SISO TOKEN — Forge Terminal v3
  NEW CONCEPT: Full-width "forge furnace" with molten metal aesthetic
  Split layout: Left = live terminal feed | Right = rotating 3D token coin
  Tabs replaced with vertical side-nav on desktop, bottom drawer on mobile
  Color: #080B12 obsidian · #FF4500 molten · #FFA500 amber · #1E3A5F steel-blue
  Font: Bebas Neue (display) · JetBrains Mono (code)
*/

function FontLoader() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
}

// ── Molten Lava Canvas ────────────────────────────────────────────
// Completely different from pipeline concept — molten blobs + heat distortion
function MoltenCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let W = (c.width = c.offsetWidth);
    let H = (c.height = c.offsetHeight);
    let raf: number, t = 0;

    // metaball-style lava blobs
    const blobs = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * W,
      y: H * 0.6 + Math.random() * H * 0.4,
      r: 40 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.15,
      phase: (i / 8) * Math.PI * 2,
    }));

    // rising embers
    const embers = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: H + Math.random() * 100,
      spd: 0.3 + Math.random() * 0.8,
      sz: 0.5 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 0.4,
      life: Math.random(),
    }));

    const draw = () => {
      t += 0.008;
      ctx.fillStyle = "rgba(8,11,18,0.18)";
      ctx.fillRect(0, 0, W, H);

      // draw blobs
      blobs.forEach((b) => {
        b.x += b.vx + Math.sin(t + b.phase) * 0.2;
        b.y += b.vy + Math.cos(t * 0.7 + b.phase) * 0.15;
        if (b.x < -b.r) b.x = W + b.r;
        if (b.x > W + b.r) b.x = -b.r;
        if (b.y < H * 0.4) b.vy += 0.01;
        if (b.y > H + b.r) b.y = H * 0.5;

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(255,120,0,0.18)`);
        g.addColorStop(0.5, `rgba(255,69,0,0.08)`);
        g.addColorStop(1, `rgba(255,69,0,0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // embers rising
      embers.forEach((e) => {
        e.y -= e.spd;
        e.x += e.drift;
        e.life -= 0.003;
        if (e.y < -10 || e.life <= 0) {
          e.y = H + 10;
          e.x = Math.random() * W;
          e.life = 0.6 + Math.random() * 0.4;
        }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.sz * e.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${Math.floor(100 + e.life * 100)},0,${e.life * 0.6})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#FF4500";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "screen", opacity: 0.65 }} />;
}

// ── 3D Spinning Token Coin ────────────────────────────────────────
function TokenCoin() {
  const [rot, setRot] = useState(0);
  useEffect(() => {
    let raf: number;
    const animate = () => {
      setRot(r => r + 0.8);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const face = rot % 360 < 180;
  const squeeze = Math.abs(Math.cos((rot * Math.PI) / 180));

  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      {/* glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 140, height: 140, background: "radial-gradient(circle, rgba(255,69,0,0.25) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* coin body */}
      <div
        style={{
          width: 110,
          height: 110,
          transform: `scaleX(${squeeze})`,
          borderRadius: "50%",
          background: face
            ? "radial-gradient(circle at 35% 35%, #FFA500, #FF6B00, #CC3300)"
            : "radial-gradient(circle at 65% 65%, #8B2500, #CC3300, #FF6B00)",
          boxShadow: `0 0 30px rgba(255,69,0,0.6), inset 0 2px 4px rgba(255,200,0,0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.1s",
        }}
      >
        <span
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "2rem",
            color: "rgba(255,220,100,0.9)",
            textShadow: "0 0 10px rgba(255,150,0,0.8)",
            transform: `scaleX(${1 / Math.max(squeeze, 0.05)})`,
            display: "block",
          }}
        >
          {face ? "S" : "₿"}
        </span>
      </div>
      {/* rim highlight */}
      <div
        className="absolute rounded-full border-2 border-[#FF8C00]/30 pointer-events-none"
        style={{ width: 110, height: 110, transform: `scaleX(${squeeze})` }}
      />
    </div>
  );
}

// ── Live Terminal Feed ────────────────────────────────────────────
const TERMINAL_LINES = [
  { text: "$ forge build --sizes", color: "#FFA500", delay: 0 },
  { text: "  Compiling SisoToken.sol...", color: "#64748b", delay: 600 },
  { text: "  ✓ Build successful", color: "#22c55e", delay: 1200 },
  { text: "$ forge test -vvv", color: "#FFA500", delay: 2000 },
  { text: "  Running 12 tests...", color: "#64748b", delay: 2600 },
  { text: "  ✓ testMintOnlyOwner", color: "#22c55e", delay: 3000 },
  { text: "  ✓ testBurnReducesSupply", color: "#22c55e", delay: 3400 },
  { text: "  ✓ testPauseBlocksTransfer", color: "#22c55e", delay: 3800 },
  { text: "  All tests passed.", color: "#22c55e", delay: 4200 },
  { text: "$ make deploy --network sepolia", color: "#FFA500", delay: 5000 },
  { text: "  Deploying SisoToken...", color: "#64748b", delay: 5600 },
  { text: "  ✓ 0xc8C711...d44AAb", color: "#60a5fa", delay: 6200 },
  { text: "  Gas used: 1,234,567", color: "#94a3b8", delay: 6800 },
];

function TerminalFeed() {
  const [visibleCount, setVisibleCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(0);
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleCount(i + 1);
      }, line.delay);
    });
    // restart loop
    const total = 7000;
    const id = setInterval(() => {
      setVisibleCount(0);
      TERMINAL_LINES.forEach((line, i) => {
        setTimeout(() => setVisibleCount(i + 1), line.delay);
      });
    }, total + 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount]);

  return (
    <div
      ref={scrollRef}
      className="bg-[#050709] rounded-xl border border-white/08 p-4 overflow-y-auto"
      style={{ height: 200, fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}
    >
      <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-white/06">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        <span className="ml-2 text-[9px] text-slate-600">forge — SISO-Token-ERC20</span>
      </div>
      {TERMINAL_LINES.slice(0, visibleCount).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          style={{ color: line.color }}
          className="leading-relaxed"
        >
          {line.text}
          {i === visibleCount - 1 && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1.5 h-3 bg-[#FFA500] ml-0.5 align-middle"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ── Tilt Card ─────────────────────────────────────────────────────
function ForgeCard({
  children, className = "", intensity = 7, accent = "#FF4500",
}: {
  children: React.ReactNode; className?: string; intensity?: number; accent?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const cfg = { stiffness: 160, damping: 22 };
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), cfg);
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), cfg);
  const sX = useTransform(mx, [-0.5, 0.5], ["110%", "-110%"]);
  const sY = useTransform(my, [-0.5, 0.5], ["110%", "-110%"]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d", perspective: 900 }}
      className={`relative rounded-2xl overflow-hidden border border-white/07 bg-[#0D1017]/90 ${className}`}>
      <motion.div className="absolute inset-0 z-20 pointer-events-none opacity-[0.09] mix-blend-overlay"
        style={{
          background: `linear-gradient(112deg, transparent 20%, ${accent}dd 28%, ${accent}99 50%, transparent 56%)`,
          backgroundSize: "220% 220%",
          backgroundPositionX: sX,
          backgroundPositionY: sY,
        }} />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

// ── Supply Gauge ──────────────────────────────────────────────────
function SupplyGauge() {
  const MAX = 1_000_000_000;
  const [supply, setSupply] = useState(MAX);
  const pct = (supply / MAX) * 100;

  useEffect(() => {
    const id = setInterval(() => {
      setSupply(s => Math.max(s - Math.floor(Math.random() * 600 + 100), 0));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          Circulating Supply
        </span>
        <div className="flex items-center gap-1.5">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-[#FF4500]"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }} />
          <span className="text-[9px] text-[#FF8A65]" style={{ fontFamily: "JetBrains Mono, monospace" }}>LIVE</span>
        </div>
      </div>
      <motion.p
        key={supply}
        initial={{ y: -3, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl font-black text-white tabular-nums"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {supply.toLocaleString()}
      </motion.p>
      {/* gauge bar */}
      <div className="h-1.5 bg-white/06 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #FF4500, #FFA500)",
            boxShadow: "0 0 8px rgba(255,69,0,0.6)",
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-[9px] text-slate-600 text-right" style={{ fontFamily: "JetBrains Mono, monospace" }}>
        {pct.toFixed(4)}% of 1B
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════
export default function SISOTokenCaseStudy() {
  const [tab, setTab] = useState<"specs" | "rbac" | "devops">("specs");

  const TABS = [
    { id: "specs", label: "Tokenomics", icon: "📊" },
    { id: "rbac", label: "Access Control", icon: "🛡️" },
    { id: "devops", label: "CI/CD Pipeline", icon: "🤖" },
  ] as const;

  return (
    <div className="w-full bg-[#080B12] text-slate-300 overflow-hidden"
      style={{ fontFamily: "JetBrains Mono, monospace" }}>
      <FontLoader />

      {/* ═══ HERO — split layout ═══ */}
      <div className="relative w-full min-h-[520px] sm:min-h-[460px] border-b border-[#FF4500]/20 overflow-hidden">
        {/* molten canvas behind */}
        <MoltenCanvas />
        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B12]/70 via-transparent to-[#080B12] pointer-events-none" />
        {/* horizontal scan line on top */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,69,0,0.4), transparent)" }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 px-5 sm:px-8 md:px-14 pt-14 pb-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-8">

          {/* LEFT: text */}
          <motion.div className="flex-1 max-w-lg"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>

            {/* Category label */}
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px flex-1 max-w-[32px] bg-[#FF4500]/50" />
              <span className="text-[9px] text-[#FF8A65] font-bold uppercase tracking-[0.25em]">
                ERC-20 · Deflationary · RBAC
              </span>
            </div>

            {/* Giant title */}
            <h1 className="leading-none mb-5 text-white"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}>
              <span className="block text-[3.8rem] sm:text-[5rem] md:text-[6.5rem] tracking-wide"
                style={{ textShadow: "0 0 60px rgba(255,69,0,0.3)" }}>
                SISO
              </span>
              <span className="block text-[2rem] sm:text-[2.8rem] md:text-[3.5rem] tracking-widest"
                style={{
                  backgroundImage: "linear-gradient(90deg, #FF8A65, #FF4500, #CC2200)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                TOKEN STANDARD
              </span>
            </h1>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-7 max-w-sm border-l-2 border-[#FF4500]/50 pl-3">
              Production-grade ERC-20 with strict RBAC, deflationary burn mechanics,
              and emergency circuit breakers to protect TVL.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <Link href="https://sepolia.etherscan.io/address/0xc8C711CDf3fD162b00F3447C6963C52aF3d44AAb" target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #FF4500, #CC2200)",
                  color: "#fff",
                  boxShadow: "0 0 18px rgba(255,69,0,0.35)",
                }}>
                Etherscan ↗
              </Link>
              <Link href="https://github.com/NexTechArchitect/SISO-Token-ERC20" target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white transition-all active:scale-95"
                style={{ background: "#11151C", border: "1px solid rgba(255,255,255,0.1)" }}>
                GitHub ↗
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: spinning coin + supply */}
          <motion.div className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 16 }}>
            <TokenCoin />
            <ForgeCard intensity={14} accent="#FF4500" className="w-56 p-4">
              <SupplyGauge />
            </ForgeCard>
          </motion.div>
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div className="sticky top-0 z-30 bg-[#080B12]/92 backdrop-blur-xl border-b border-white/06">
        <div className="px-5 sm:px-8 md:px-14 flex overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className="relative flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors"
              style={{ color: tab === t.id ? "#FF8A65" : "#475569" }}>
              <span className="text-sm">{t.icon}</span>
              {t.label}
              {tab === t.id && (
                <motion.div layoutId="siso3-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF4500]"
                  style={{ boxShadow: "0 0 10px rgba(255,69,0,0.6)" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="px-5 sm:px-8 md:px-14 py-8 pb-16 space-y-5"
        style={{ background: "radial-gradient(ellipse 60% 40% at 10% 80%, rgba(255,69,0,0.05) 0%, transparent 60%)" }}>
        <AnimatePresence mode="wait">

          {/* ── TOKENOMICS ── */}
          {tab === "specs" && (
            <motion.div key="specs"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }} className="space-y-5">

              {/* Top row: big stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Token", value: "$SISO", sub: "Symbol", c: "#FF8A65" },
                  { label: "Supply", value: "1B", sub: "Total Minted", c: "#FF4500" },
                  { label: "Decimals", value: "18", sub: "Wei Precision", c: "#3B82F6" },
                  { label: "Network", value: "Sepolia", sub: "Ethereum", c: "#F59E0B" },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-[#0D1017] border border-white/06 rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at 50% 100%, ${s.c}10 0%, transparent 70%)` }} />
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="font-black mb-0.5" style={{ color: s.c, fontFamily: "Bebas Neue, sans-serif", fontSize: "1.8rem", letterSpacing: "0.05em" }}>{s.value}</p>
                    <p className="text-[9px] text-slate-500">{s.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* Bottom row: terminal + features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ForgeCard accent="#FFA500" intensity={6} className="p-5">
                  <p className="text-[9px] text-[#FF8A65] uppercase tracking-widest font-bold mb-3">
                    Live CI/CD Terminal
                  </p>
                  <TerminalFeed />
                </ForgeCard>

                <div className="flex flex-col gap-3">
                  {[
                    {
                      icon: "🔥",
                      title: "Deflationary Burn",
                      body: "burn(amount) permanently destroys tokens from treasury. Admin-only. Reduces total supply, increasing per-token scarcity over time.",
                      c: "#FF4500",
                    },
                    {
                      icon: "⚡",
                      title: "DeFi Compliant",
                      body: "Full approve + transferFrom workflows. Compatible with Uniswap, Aave, and all ERC-20 DeFi protocols from day one.",
                      c: "#3B82F6",
                    },
                    {
                      icon: "🛡️",
                      title: "Emergency Pause",
                      body: "Pausable circuit breaker freezes all state-changing actions during security incidents. Only view functions remain accessible.",
                      c: "#EF4444",
                    },
                  ].map((f, i) => (
                    <div key={i} className="relative rounded-2xl overflow-hidden border border-white/07 bg-[#0D1017]/90 p-4"
                      style={{ borderLeft: `3px solid ${f.c}` }}>
                      <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0">{f.icon}</span>
                        <div>
                          <h4 className="text-[11px] font-black text-white uppercase tracking-wide mb-1"
                            style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "0.1em", fontSize: "0.85rem" }}>
                            {f.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">{f.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ACCESS CONTROL ── */}
          {tab === "rbac" && (
            <motion.div key="rbac"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }} className="space-y-5">

              {/* Matrix */}
              <ForgeCard accent="#FF4500" intensity={4} className="overflow-hidden">
                <div className="px-5 sm:px-7 py-4 border-b border-white/06 flex items-center justify-between">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-widest"
                    style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1rem", letterSpacing: "0.15em" }}>
                    Permission Matrix
                  </h3>
                  <span className="text-[9px] text-[#FF4500] font-bold uppercase tracking-widest">RBAC</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px]">
                    <thead className="bg-[#070A10]">
                      <tr>
                        {["Function", "Public", "Owner", "Impact"].map((h, i) => (
                          <th key={i} className={`px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-left ${i === 0 ? "text-slate-500" : i === 2 ? "text-[#FF4500] text-center" : i === 1 ? "text-white text-center" : "text-slate-500"} ${i > 0 ? "border-l border-white/04" : ""} ${i === 3 ? "hidden sm:table-cell" : ""}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/04">
                      {[
                        { fn: "transfer", u: true, o: true, impact: "Core token movement", c: "#fff" },
                        { fn: "approve", u: true, o: true, impact: "DeFi allowance grant", c: "#fff" },
                        { fn: "burn", u: false, o: true, impact: "💥 Destroys supply", c: "#FF4500" },
                        { fn: "mint", u: false, o: true, impact: "⚠️ Inflates supply", c: "#FF4500" },
                        { fn: "pause", u: false, o: true, impact: "🚨 Halts all transfers", c: "#EF4444" },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <code className="text-[11px] px-2 py-0.5 rounded font-bold"
                              style={{ color: row.c, background: `${row.c}14`, border: `1px solid ${row.c}25` }}>
                              {row.fn}
                            </code>
                          </td>
                          <td className="px-5 py-3.5 text-center text-base border-l border-white/04">
                            {row.u ? "✅" : "❌"}
                          </td>
                          <td className="px-5 py-3.5 text-center text-base border-l border-white/04 bg-[#FF4500]/04">
                            ✅
                          </td>
                          <td className="px-5 py-3.5 text-[10px] text-slate-400 border-l border-white/04 hidden sm:table-cell">
                            {row.impact}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ForgeCard>

              {/* Circuit breaker visualizer */}
              <ForgeCard accent="#EF4444" intensity={5} className="p-5 sm:p-7 border-t-2 border-t-red-500 relative overflow-hidden">
                <motion.div
                  className="absolute left-0 right-0 h-px pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.35), transparent)" }}
                  animate={{ top: ["-5%", "110%"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative z-10">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-1"
                    style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1rem", letterSpacing: "0.15em" }}>
                    Circuit Breaker · Pausable Flow
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-6">
                    whenNotPaused modifier guards every state-changing function
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                    {/* Box 1 */}
                    <div className="w-full sm:w-32 bg-[#070A10] border border-white/08 rounded-xl p-3.5 text-center flex-shrink-0">
                      <p className="text-2xl mb-1">👤</p>
                      <p className="text-[10px] font-black text-white">User Call</p>
                      <code className="text-[9px] text-blue-400">transfer()</code>
                    </div>

                    <AnimatedArrow />

                    {/* Box 2 */}
                    <div className="w-full sm:w-44 bg-[#0A1628] border border-blue-500/25 rounded-xl p-3.5 text-center flex-shrink-0"
                      style={{ boxShadow: "0 0 14px rgba(59,130,246,0.08)" }}>
                      <code className="text-[10px] text-blue-400">whenNotPaused</code>
                      <p className="text-[10px] font-black text-white mt-1">Modifier Check</p>
                    </div>

                    <AnimatedArrow />

                    {/* Two outcomes */}
                    <div className="flex flex-row sm:flex-col gap-2.5 flex-1 w-full sm:w-auto">
                      <div className="flex-1 flex items-center gap-2 bg-emerald-500/08 border border-emerald-500/22 rounded-xl px-3.5 py-3">
                        <motion.div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                          animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
                        <div>
                          <p className="text-[10px] font-black text-emerald-400">ACTIVE</p>
                          <p className="text-[9px] text-slate-500">Execute transfer</p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center gap-2 bg-red-500/08 border border-red-500/22 rounded-xl px-3.5 py-3">
                        <motion.div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"
                          animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.8 }} />
                        <div>
                          <p className="text-[10px] font-black text-red-400">PAUSED</p>
                          <p className="text-[9px] text-slate-500">Revert tx</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ForgeCard>
            </motion.div>
          )}

          {/* ── CI/CD ── */}
          {tab === "devops" && (
            <motion.div key="devops"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }} className="space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Why scripts */}
                <ForgeCard accent="#3B82F6" intensity={7} className="p-5 sm:p-6">
                  <h3 className="mb-3 uppercase text-white"
                    style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.1rem", letterSpacing: "0.15em" }}>
                    🤖 Foundry Script Automation
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                    Manual console deploys leak private keys and are non-reproducible.
                    This repo's Foundry scripts manage the entire token lifecycle programmatically —
                    ready to plug into <span className="text-blue-400 font-bold">GitHub Actions CI/CD</span> for
                    automated cross-chain deployments.
                  </p>
                  <div className="bg-[#050709] rounded-xl border border-white/06 px-3 py-2.5 flex items-center gap-2 text-[10px]">
                    <span className="text-[#FF4500]">$</span>
                    <span className="text-blue-400">make</span>
                    <span className="text-white">deploy ARGS="--network sepolia"</span>
                  </div>
                </ForgeCard>

                {/* File tree */}
                <div className="bg-[#050709] border border-white/07 rounded-2xl overflow-hidden">
                  <div className="bg-[#0D1017] border-b border-white/05 px-4 py-3 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {["#FF5F56", "#FFBD2E", "#27C93F"].map((c, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-600">SISO-Token-ERC20/</span>
                  </div>
                  <div className="p-4 sm:p-5 text-[11px] leading-[1.9] overflow-x-auto">
                    <p><span className="text-blue-400 font-bold">src/</span></p>
                    <p className="pl-4 text-slate-300">└─ <span className="text-white font-bold">SisoToken.sol</span> <span className="text-slate-600">// ERC20 + Ownable + Pausable</span></p>
                    <p className="mt-2"><span className="text-blue-400 font-bold">script/</span></p>
                    <p className="pl-4 text-slate-300">├─ <span className="text-amber-400">DeploySisoToken.s.sol</span> <span className="text-slate-600">// CI/CD deploy</span></p>
                    <p className="pl-4 text-slate-300">├─ <span className="text-amber-400">MintSisoToken.s.sol</span> <span className="text-slate-600">// admin mint</span></p>
                    <p className="pl-4 text-slate-300">├─ <span className="text-[#FF4500]">BurnSisoToken.s.sol</span> <span className="text-slate-600">// 🔥 deflation</span></p>
                    <p className="pl-4 text-slate-300">└─ <span className="text-red-400">PauseSisoToken.s.sol</span> <span className="text-slate-600">// emergency halt</span></p>
                    <p className="mt-2"><span className="text-blue-400 font-bold">test/</span></p>
                    <p className="pl-4 text-slate-300">└─ <span className="text-emerald-400">SisoToken.t.sol</span> <span className="text-slate-600">// invariant + fuzz</span></p>
                  </div>
                </div>
              </div>

              {/* Make commands */}
              <ForgeCard accent="#F59E0B" intensity={4} className="p-5 sm:p-6 border-t-2 border-t-amber-500">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-5">
                  Makefile Automation Commands
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { cmd: "make build", desc: "Compile + generate ABI artifacts", c: "#3B82F6" },
                    { cmd: "make test", desc: "Full Unit + Integration suite", c: "#10B981" },
                    { cmd: "make snapshot", desc: "Gas usage report + optimizer", c: "#F59E0B" },
                    { cmd: "make anvil", desc: "Local EVM node for rapid debug", c: "#A78BFA" },
                  ].map((item, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-3 bg-[#070A10] border border-white/05 px-4 py-3 rounded-xl">
                      <span className="text-[#FF4500] font-bold flex-shrink-0">$</span>
                      <div>
                        <p className="text-[11px] font-bold mb-0.5" style={{ color: item.c }}>{item.cmd}</p>
                        <p className="text-[10px] text-slate-500">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ForgeCard>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Animated Arrow helper ─────────────────────────────────────────
function AnimatedArrow() {
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <div className="hidden sm:flex items-center gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.span key={i} className="text-slate-700 text-sm leading-none"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22 }}>
            ─
          </motion.span>
        ))}
        <span className="text-slate-700">▶</span>
      </div>
      <div className="sm:hidden flex flex-col items-center gap-0.5">
        {[0, 1].map((i) => (
          <motion.span key={i} className="text-slate-700 text-sm leading-none"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}>
            │
          </motion.span>
        ))}
        <span className="text-slate-700 text-xs">▼</span>
      </div>
    </div>
  );
}
