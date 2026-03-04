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
  RAFFLE PROTOCOL — Case Study
  Theme: Casino Noir / Velvet Hall
  Palette: Velvet Black #0D0A0B · Crimson #8B1A1A · Gold #D4A843 · Cream #F5EDD4
  Typography: Impact/bold display (large, punchy) + mono labels
  Animation: Rotating VRF particle oracle ring, state machine flow pulses
*/

const FONT_STYLE = `
  .rf-root { font-family: Georgia, 'Times New Roman', serif; }
  .rf-display { font-family: 'Georgia', serif; font-weight: 900; letter-spacing: -0.03em; }
  .rf-mono { font-family: 'Courier New', Courier, monospace; }
  .rf-label { font-family: 'Courier New', Courier, monospace; letter-spacing: 0.14em; text-transform: uppercase; }
`;

// ─── Rotating VRF Oracle Ring Canvas ────────────────────────────
// Looks like a roulette/oracle — spinning ring of particles + pulsing center
function VRFOracleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particle ring — particles orbit around center
    const PARTICLES = Array.from({ length: 120 }, (_, i) => ({
      angle: (i / 120) * Math.PI * 2,
      radius: 80 + Math.random() * 80,
      speed: 0.003 + Math.random() * 0.006,
      size: 0.8 + Math.random() * 1.8,
      alpha: 0.2 + Math.random() * 0.6,
      layer: Math.random() > 0.5 ? 1 : -1, // CW or CCW
    }));

    const OUTER_DOTS = Array.from({ length: 36 }, (_, i) => ({
      angle: (i / 36) * Math.PI * 2,
    }));

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.01;

      const cx = W / 2;
      const cy = H / 2;
      const baseR = Math.min(W, H) * 0.32;

      // ── Outer grid lines radiating from center ──
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2 + t * 0.05;
        const lineA = 0.025 + Math.sin(t * 0.8 + i) * 0.01;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * Math.max(W, H), cy + Math.sin(ang) * Math.max(W, H));
        ctx.strokeStyle = `rgba(212,168,67,${lineA})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── Concentric rings ──
      [0.18, 0.28, 0.38, 0.52].forEach((frac, ri) => {
        const r = Math.min(W, H) * frac;
        const ringA = 0.04 + Math.sin(t * 0.3 + ri) * 0.02;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,168,67,${ringA})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // ── Outer dot ring (roulette numbers) ──
      OUTER_DOTS.forEach((dot, i) => {
        const ang = dot.angle + t * 0.12;
        const r = baseR * 1.62;
        const dotX = cx + Math.cos(ang) * r;
        const dotY = cy + Math.sin(ang) * r;
        const pulse = Math.sin(t * 2 + i * 0.8) * 0.5 + 0.5;
        const isRed = i % 3 === 0;
        ctx.beginPath();
        ctx.arc(dotX, dotY, isRed ? 2.5 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle = isRed
          ? `rgba(180,30,30,${0.3 + pulse * 0.4})`
          : `rgba(212,168,67,${0.15 + pulse * 0.2})`;
        ctx.fill();
      });

      // ── Orbiting particles ──
      PARTICLES.forEach((p) => {
        p.angle += p.speed * p.layer;
        const orbitR = p.radius * (Math.min(W, H) / 700);
        const px = cx + Math.cos(p.angle) * orbitR;
        const py = cy + Math.sin(p.angle) * orbitR;
        const lifeA = p.alpha * (0.6 + Math.sin(t * 1.5 + p.angle) * 0.4);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        const isGold = p.angle % (Math.PI * 2 / 5) < 0.4;
        ctx.fillStyle = isGold
          ? `rgba(212,168,67,${lifeA * 0.9})`
          : `rgba(200,160,80,${lifeA * 0.5})`;
        ctx.fill();
      });

      // ── VRF sweep arm (like a radar/clock hand) ──
      const sweepAng = t * 0.4;
      const sweepLen = baseR * 1.5;
      const sweepGrad = ctx.createLinearGradient(
        cx, cy,
        cx + Math.cos(sweepAng) * sweepLen,
        cy + Math.sin(sweepAng) * sweepLen
      );
      sweepGrad.addColorStop(0, "rgba(212,168,67,0.0)");
      sweepGrad.addColorStop(0.4, "rgba(212,168,67,0.12)");
      sweepGrad.addColorStop(1, "rgba(212,168,67,0.0)");
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAng) * sweepLen, cy + Math.sin(sweepAng) * sweepLen);
      ctx.strokeStyle = sweepGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // ── Comet trail following sweep ──
      for (let trail = 0; trail < 8; trail++) {
        const trailAng = sweepAng - trail * 0.08;
        const trailA = (0.06 - trail * 0.007) * (0.5 + Math.sin(t) * 0.5);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(trailAng) * sweepLen, cy + Math.sin(trailAng) * sweepLen);
        ctx.strokeStyle = `rgba(212,168,67,${trailA})`;
        ctx.lineWidth = 1.5 - trail * 0.15;
        ctx.stroke();
      }

      // ── Center circle: pulsing oracle core ──
      const pulseR = 18 + Math.sin(t * 2) * 5;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR);
      coreGrad.addColorStop(0, "rgba(212,168,67,0.25)");
      coreGrad.addColorStop(0.5, "rgba(180,30,30,0.12)");
      coreGrad.addColorStop(1, "rgba(212,168,67,0.0)");
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();
      // hard core dot
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,168,67,${0.6 + Math.sin(t * 3) * 0.3})`;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

// ─── State machine pulse canvas ──────────────────────────────────
function StateMachineCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.018;

      const states = [
        { label: "OPEN",        color: [40, 160, 80],   x: W * 0.15 },
        { label: "CALCULATING", color: [200, 60, 60],   x: W * 0.5  },
        { label: "SETTLED",     color: [212, 168, 67],  x: W * 0.85 },
      ];

      const cy = H / 2;
      const r = Math.min(H * 0.28, 32);

      // Draw connecting lines
      states.forEach((s, i) => {
        if (i < states.length - 1) {
          const nx = states[i + 1].x;
          // Animated packet traveling along wire
          const progress = ((t * 0.3 + i * 0.5) % 1);
          const px = s.x + (nx - s.x) * progress;
          const lineAlpha = 0.12;

          ctx.beginPath();
          ctx.moveTo(s.x + r, cy);
          ctx.lineTo(nx - r, cy);
          ctx.strokeStyle = `rgba(212,168,67,${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // animated packet
          ctx.beginPath();
          ctx.arc(px, cy, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,168,67,${0.5 + Math.sin(t * 3 + i) * 0.3})`;
          ctx.fill();

          // packet glow
          ctx.beginPath();
          ctx.arc(px, cy, 7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,168,67,0.06)`;
          ctx.fill();
        }
      });

      // Draw state circles
      states.forEach((s, i) => {
        const pulse = Math.sin(t * 1.8 + i * 2) * 0.5 + 0.5;
        const glowR = r + 8 + pulse * 10;

        // Glow
        const gGrad = ctx.createRadialGradient(s.x, cy, r, s.x, cy, glowR);
        gGrad.addColorStop(0, `rgba(${s.color.join(",")},${0.08 + pulse * 0.08})`);
        gGrad.addColorStop(1, `rgba(${s.color.join(",")},0)`);
        ctx.beginPath();
        ctx.arc(s.x, cy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = gGrad;
        ctx.fill();

        // Border ring
        ctx.beginPath();
        ctx.arc(s.x, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${s.color.join(",")},${0.35 + pulse * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Fill
        const fGrad = ctx.createRadialGradient(s.x, cy - r * 0.3, 0, s.x, cy, r);
        fGrad.addColorStop(0, `rgba(${s.color.join(",")},${0.18 + pulse * 0.08})`);
        fGrad.addColorStop(1, `rgba(${s.color.join(",")},0.04)`);
        ctx.beginPath();
        ctx.arc(s.x, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = fGrad;
        ctx.fill();

        // Label
        ctx.fillStyle = `rgba(${s.color.join(",")},${0.7 + pulse * 0.25})`;
        ctx.font = "700 9px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText(s.label, s.x, cy + 3.5);
      });
      ctx.textAlign = "left";

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="w-full" style={{ height: 100 }} />;
}

// ─── 3D Tilt Card ───────────────────────────────────────────────
function TiltCard({
  children,
  className = "",
  style,
  intensity = 7,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rX = useTransform(my, [-0.5, 0.5], [intensity, -intensity]);
  const rY = useTransform(mx, [-0.5, 0.5], [-intensity, intensity]);
  const srX = useSpring(rX, { stiffness: 200, damping: 22 });
  const srY = useSpring(rY, { stiffness: 200, damping: 22 });
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
      style={{ rotateX: srX, rotateY: srY, transformStyle: "preserve-3d", perspective: 1200, ...style }}
      className={className}
    >{children}</motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export default function RaffleCaseStudy() {
  const [tab, setTab] = useState<"overview" | "statemachine" | "security">("overview");

  const TABS = [
    { id: "overview",     label: "Protocol Overview" },
    { id: "statemachine", label: "State Machine" },
    { id: "security",     label: "Security" },
  ] as const;

  return (
    <>
      <style>{FONT_STYLE}</style>
      <div className="rf-root w-full overflow-hidden" style={{ background: "#0D0A0B", color: "#F5EDD4" }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ minHeight: 380, background: "#0D0A0B" }}>
          <VRFOracleCanvas />

          {/* Heavy dark fade so text is readable */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(to bottom, rgba(13,10,11,0.7) 0%, rgba(13,10,11,0.3) 20%, rgba(13,10,11,0.0) 45%, rgba(13,10,11,0.6) 65%, rgba(13,10,11,0.98) 100%)"
          }} />
          {/* Left side fade so hero text is clearly readable */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(to right, rgba(13,10,11,0.92) 0%, rgba(13,10,11,0.6) 45%, rgba(13,10,11,0.0) 75%)"
          }} />

          {/* Decorative diamond corners */}
          {[
            "absolute top-3 left-3",
            "absolute top-3 right-3",
          ].map((pos, i) => (
            <div key={i} className={`${pos} w-5 h-5 pointer-events-none`} style={{ opacity: 0.35 }}>
              <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: "#D4A843" }} />
              <div className="absolute top-0 left-0 w-[1px] h-full" style={{ background: "#D4A843" }} />
            </div>
          ))}

          <div className="relative z-10 px-5 sm:px-8 md:px-12 pt-12 pb-9">
            {/* Tags */}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-5">
              {["Chainlink VRF", "Automation Keepers", "Foundry", "CEI Pattern"].map((tag, i) => (
                <span key={i} className="rf-label px-2.5 py-1 text-[9px] font-bold border rounded"
                  style={{ borderColor: "rgba(212,168,67,0.3)", color: "#D4A843", background: "rgba(212,168,67,0.06)", fontSize: 9 }}>
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}>
              <div className="rf-label mb-2" style={{ fontSize: 9, color: "#4A2E2E" }}>
                Case Study · Decentralized Gaming Protocol
              </div>
              {/* BIG readable title */}
              <h1 className="rf-display" style={{
                fontSize: "clamp(32px, 8vw, 62px)",
                lineHeight: 1.02,
                color: "#F5EDD4",
                marginBottom: 6,
              }}>
                Provably Fair.
              </h1>
              <h2 className="rf-display" style={{
                fontSize: "clamp(26px, 6vw, 50px)",
                lineHeight: 1.02,
                color: "#D4A843",
                marginBottom: 14,
              }}>
                Fully Autonomous.
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#7A6040", maxWidth: 480 }}>
                A decentralized gaming protocol that eliminates trust entirely.
                Cryptographic randomness via Chainlink VRF. Automated execution
                via Chainlink Keepers. Zero admin intervention.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="flex flex-wrap gap-3 mt-7">
              <Link href="https://github.com/NexTechArchitect/Raffle-Lottery-Foundry" target="_blank"
                className="rf-label inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold rounded transition-all"
                style={{ background: "#D4A843", color: "#0D0A0B", boxShadow: "0 4px 28px rgba(212,168,67,0.22)", fontSize: 10 }}>
                View Smart Contracts ↗
              </Link>
              <Link href="https://chain.link/vrf" target="_blank"
                className="rf-label inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold rounded border transition-all"
                style={{ borderColor: "rgba(212,168,67,0.22)", color: "#6A4A2A", fontSize: 10 }}>
                Chainlink VRF ↗
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── STAT STRIP ───────────────────────────────────── */}
        <div className="border-y" style={{ borderColor: "rgba(212,168,67,0.1)" }}>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { v: "VRF v2",       sub: "Randomness Source",   note: "Cryptographic proof on-chain" },
              { v: "Atomic",       sub: "State Transitions",   note: "No sniping or front-run" },
              { v: "Zero Admin",   sub: "Intervention Needed", note: "Self-sustaining protocol" },
              { v: "TDD",          sub: "Testing Approach",    note: "Fuzz + unit + invariant" },
            ].map((s, i) => (
              <TiltCard key={i} intensity={4}
                className="p-5 md:p-6 cursor-default border-r border-b md:border-b-0 last:border-r-0"
                style={{ borderColor: "rgba(212,168,67,0.08)" }}>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                  <div style={{ fontSize: "clamp(18px,3.5vw,28px)", fontWeight: 900, color: "#D4A843", lineHeight: 1, marginBottom: 4 }}>
                    {s.v}
                  </div>
                  <div className="rf-label" style={{ fontSize: 8, color: "#4A3020", marginBottom: 2 }}>{s.sub}</div>
                  <div style={{ fontSize: 10, color: "#2E1E14" }}>{s.note}</div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ── TABS ─────────────────────────────────────────── */}
        <div className="px-5 sm:px-8 md:px-12 pt-6">
          <div className="flex gap-1 p-1 rounded-lg w-fit border"
            style={{ background: "rgba(255,255,255,0.015)", borderColor: "rgba(212,168,67,0.1)" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="rf-label px-4 md:px-5 py-2 text-[9px] font-bold rounded transition-all"
                style={{
                  fontSize: 9,
                  background: tab === t.id ? "rgba(212,168,67,0.1)" : "transparent",
                  color:      tab === t.id ? "#D4A843" : "#3A2010",
                  border:     tab === t.id ? "1px solid rgba(212,168,67,0.25)" : "1px solid transparent",
                }}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="w-full mt-4" style={{ height: 1, background: "linear-gradient(to right, rgba(212,168,67,0.2), transparent)" }} />
        </div>

        {/* ── TAB PANELS ───────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <motion.div key="ov"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="px-5 sm:px-8 md:px-12 py-7 space-y-5">

              {/* 3 feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: "⏱",
                    title: "Time-Based Automation",
                    body: "Chainlink Keepers call performUpkeep automatically — no human triggers, no manual intervention ever needed.",
                    code: "performUpkeep()",
                    accent: [40, 160, 80],
                  },
                  {
                    icon: "🎲",
                    title: "Verifiable Randomness",
                    body: "Chainlink VRF v2 delivers cryptographic proof verified on-chain — provably tamper-proof winner selection.",
                    code: "fulfillRandomWords()",
                    accent: [212, 168, 67],
                  },
                  {
                    icon: "🔒",
                    title: "State Locking",
                    body: "Strict finite state machine locks to CALCULATING during generation — prevents entries, sniping, and front-runs.",
                    code: "RaffleState.CALCULATING",
                    accent: [200, 60, 60],
                  },
                ].map((card, i) => (
                  <TiltCard key={i} intensity={6} className="p-5 rounded-xl border relative overflow-hidden"
                    style={{
                      background: "#131013",
                      borderColor: `rgba(${card.accent.join(",")},0.16)`,
                    }}>
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                      style={{ background: `radial-gradient(circle at top right, rgba(${card.accent.join(",")},0.07), transparent 70%)` }} />
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4"
                      style={{ background: `rgba(${card.accent.join(",")},0.1)`, border: `1px solid rgba(${card.accent.join(",")},0.2)` }}>
                      {card.icon}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F5EDD4", marginBottom: 8, lineHeight: 1.3 }}>{card.title}</h3>
                    <p style={{ fontSize: 12, lineHeight: 1.65, color: "#6A5040", marginBottom: 10 }}>{card.body}</p>
                    <code className="rf-mono px-2 py-1 rounded" style={{ fontSize: 9, background: `rgba(${card.accent.join(",")},0.08)`, color: `rgba(${card.accent.join(",")},0.85)` }}>
                      {card.code}
                    </code>
                  </TiltCard>
                ))}
              </div>

              {/* Architecture summary */}
              <div className="p-5 rounded-xl border" style={{ background: "#131013", borderColor: "rgba(212,168,67,0.12)" }}>
                <div className="rf-label mb-3" style={{ fontSize: 8, color: "#4A3020" }}>// System Design Principles</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { k: "Immutable", v: "Rules codified on-chain, no admin can alter them" },
                    { k: "Autonomous", v: "Chainlink Automation triggers draws by time interval" },
                    { k: "Provably Fair", v: "VRF cryptographic proof verified before any fulfillment" },
                    { k: "Reentrant-Safe", v: "CEI pattern ensures state updated before ETH transfer" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#D4A843" }} />
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#C4A060" }}>{item.k}</span>
                        <span style={{ fontSize: 12, color: "#4A3020" }}> — {item.v}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE MACHINE */}
          {tab === "statemachine" && (
            <motion.div key="sm"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="px-5 sm:px-8 md:px-12 py-7 space-y-5">

              {/* Canvas state machine visualization */}
              <div className="rounded-xl border overflow-hidden" style={{ background: "#131013", borderColor: "rgba(212,168,67,0.1)" }}>
                <div className="px-5 pt-5 pb-2">
                  <div className="rf-label mb-1" style={{ fontSize: 8, color: "#4A3020" }}>Live State Machine — Lifecycle Visualization</div>
                </div>
                <StateMachineCanvas />
                {/* State labels below */}
                <div className="grid grid-cols-3 border-t" style={{ borderColor: "rgba(212,168,67,0.07)" }}>
                  {[
                    { label: "OPEN",        color: "#28A050", desc: "Accepting players" },
                    { label: "CALCULATING", color: "#C83C3C", desc: "VRF request in flight" },
                    { label: "SETTLED",     color: "#D4A843", desc: "Winner paid out" },
                  ].map((s, i) => (
                    <div key={i} className="px-4 py-3 border-r last:border-r-0" style={{ borderColor: "rgba(212,168,67,0.07)" }}>
                      <div className="rf-label mb-1" style={{ fontSize: 8, color: s.color }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: "#3A2010" }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifecycle steps */}
              <div className="space-y-3">
                {[
                  { n: "01", title: "Player Entry",     color: [40, 160, 80],  desc: "Users call enterRaffle() with the exact ETH entrance fee. Address is pushed to the players array." },
                  { n: "02", title: "Upkeep Check",     color: [212, 168, 67], desc: "Chainlink Automation calls checkUpkeep() off-chain every block. Returns true when time interval has elapsed and players exist." },
                  { n: "03", title: "State Lock",        color: [200, 60, 60],  desc: "performUpkeep() sets state to CALCULATING, blocking all new entries. Requests random words from VRF Coordinator." },
                  { n: "04", title: "VRF Fulfillment",   color: [212, 168, 67], desc: "Chainlink node returns cryptographic random words with on-chain proof. fulfillRandomWords() is called by the Coordinator." },
                  { n: "05", title: "Winner Settlement", color: [40, 160, 80],  desc: "Winner selected via modulo math. ETH transferred atomically. State resets to OPEN. Players array cleared." },
                ].map((step, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex gap-4 p-4 rounded-xl border"
                    style={{ background: "#131013", borderColor: `rgba(${step.color.join(",")},0.12)` }}>
                    <div className="rf-mono flex-shrink-0 w-7 h-7 rounded flex items-center justify-center text-[10px] font-black"
                      style={{ background: `rgba(${step.color.join(",")},0.1)`, color: `rgba(${step.color.join(",")},0.8)`, fontSize: 10 }}>
                      {step.n}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#C4A060", marginBottom: 3 }}>{step.title}</div>
                      <p style={{ fontSize: 12, lineHeight: 1.65, color: "#5A4030" }}>{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <motion.div key="sec"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="px-5 sm:px-8 md:px-12 py-7 space-y-5">

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "CEI Pattern Enforced",
                    accent: [212, 168, 67],
                    icon: "🛡",
                    body: "Checks-Effects-Interactions strictly followed during payout. State is set to OPEN before the ETH transfer, neutralizing any reentrancy vector entirely.",
                    tag: "Reentrancy Safe",
                  },
                  {
                    title: "Custom Errors",
                    accent: [40, 160, 80],
                    icon: "⚡",
                    body: "Uses Solidity custom errors instead of revert strings. Saves significant deployment and execution gas while providing precise, parseable debugging.",
                    tag: "Gas Optimized",
                  },
                  {
                    title: "Atomic Transitions",
                    accent: [200, 60, 60],
                    icon: "🔐",
                    body: "The contract locks to CALCULATING immediately upon requesting randomness. No entry sniping, no front-running, no race conditions possible.",
                    tag: "Front-Run Proof",
                  },
                  {
                    title: "VRF Direct Funding",
                    accent: [212, 168, 67],
                    icon: "🎲",
                    body: "Uses Chainlink VRF Direct Funding mode. Proof verified on-chain by the VRF Coordinator before fulfillment is ever called. Tamper-proof by construction.",
                    tag: "Verifiable",
                  },
                ].map((card, i) => (
                  <TiltCard key={i} intensity={5} className="p-5 rounded-xl border"
                    style={{ background: "#131013", borderColor: `rgba(${card.accent.join(",")},0.14)` }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: `rgba(${card.accent.join(",")},0.1)`, border: `1px solid rgba(${card.accent.join(",")},0.18)` }}>
                        {card.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#F5EDD4", lineHeight: 1.3 }}>{card.title}</div>
                        <div className="rf-label mt-0.5" style={{ fontSize: 7, color: `rgba(${card.accent.join(",")},0.7)` }}>{card.tag}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, lineHeight: 1.68, color: "#5A4030" }}>{card.body}</p>
                  </TiltCard>
                ))}
              </div>

              {/* Test strategy */}
              <div className="p-5 rounded-xl border" style={{ background: "#131013", borderColor: "rgba(212,168,67,0.1)" }}>
                <div className="rf-label mb-4" style={{ fontSize: 8, color: "#4A3020" }}>// Testing Strategy — TDD with Foundry</div>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    { t: "Unit Tests",        d: "Validate entrance fees, state transitions, array recording" },
                    { t: "Mock Simulation",   d: "VRFCoordinatorV2Mock simulates randomness on Anvil" },
                    { t: "Fuzz Testing",      d: "Random input generation for edge cases and 0-fee inputs" },
                    { t: "Invariant Analysis",d: "contract balance == players × fee at all OPEN state times" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#D4A843" }} />
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#C4A060" }}>{item.t}</span>
                        <br />
                        <span style={{ fontSize: 11, color: "#4A3020" }}>{item.d}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module table */}
              <TiltCard intensity={2} className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(212,168,67,0.1)" }}>
                <div style={{ background: "#131013" }}>
                  <div className="grid grid-cols-2 border-b px-5 py-3" style={{ borderColor: "rgba(212,168,67,0.08)" }}>
                    {["Module", "Responsibility"].map((h, i) => (
                      <span key={i} className="rf-label" style={{ fontSize: 8, color: i === 0 ? "#4A3020" : "#D4A843" }}>{h}</span>
                    ))}
                  </div>
                  {[
                    { m: "Raffle.sol",       r: "Player arrays, entrance fees, state machine, atomic payouts" },
                    { m: "HelperConfig",     r: "Abstracts Sepolia vs. Anvil — auto-switches mock vs. live VRF" },
                    { m: "Interactions.s",  r: "Creates VRF subscriptions, funds consumers programmatically" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-2 px-5 py-3 border-b hover:bg-white/[0.015] transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                      <code className="rf-mono" style={{ fontSize: 11, color: "#C4A060" }}>{row.m}</code>
                      <span style={{ fontSize: 11, color: "#4A3020" }}>{row.r}</span>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FOOTER ───────────────────────────────────────── */}
        <div className="border-t px-5 sm:px-8 md:px-12 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
          style={{ borderColor: "rgba(212,168,67,0.07)" }}>
          <div className="rf-label" style={{ fontSize: 8, color: "#2A1810" }}>Built with Foundry · Chainlink VRF v2 · Automation</div>
          <Link href="https://github.com/NexTechArchitect/Raffle-Lottery-Foundry" target="_blank"
            className="rf-label transition-colors" style={{ fontSize: 8, color: "#3A2010" }}>
            github.com/NexTechArchitect ↗
          </Link>
        </div>
      </div>
    </>
  );
}
