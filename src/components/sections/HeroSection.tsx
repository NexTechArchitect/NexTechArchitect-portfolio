"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useRef, MouseEvent } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&";

function GlitchText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [out, setOut] = useState(() =>
    text.split("").map((c) => (c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)])).join("")
  );
  useEffect(() => {
    let f = 0;
    const total = 20;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        f++;
        setOut(
          text.split("").map((c, i) => {
            if (c === " ") return " ";
            if (f > (i / text.length) * total * 0.7 + Math.random() * 4) return c;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("")
        );
        if (f >= total) { clearInterval(iv); setOut(text); }
      }, 45);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return <>{out}</>;
}

function ContactOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    function project(x: number, y: number, z: number) {
      const fov = 300, scale = fov / (fov + z);
      return { x: cx + x * scale, y: cy + y * scale, scale };
    }

    function drawRing(radius: number, tilt: number, spin: number, alpha: number, color: string) {
      const steps = 90;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const rx = Math.cos(a) * radius, ry = Math.sin(a) * radius;
        const y3 = ry * Math.cos(tilt), z3 = ry * Math.sin(tilt);
        const x3 = rx * Math.cos(spin) - z3 * Math.sin(spin);
        const zf = rx * Math.sin(spin) + z3 * Math.cos(spin);
        const p = project(x3, y3, zf);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = color; ctx.globalAlpha = alpha;
      ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
    }

    function drawOrbiter(radius: number, tilt: number, spin: number, progress: number, size: number, color: string) {
      const a = progress * Math.PI * 2;
      const rx = Math.cos(a) * radius, ry = Math.sin(a) * radius;
      const y3 = ry * Math.cos(tilt), z3 = ry * Math.sin(tilt);
      const x3 = rx * Math.cos(spin) - z3 * Math.sin(spin);
      const zf = rx * Math.sin(spin) + z3 * Math.cos(spin);
      const p = project(x3, y3, zf);
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 6);
      grd.addColorStop(0, color.replace("1)", "0.5)"));
      grd.addColorStop(1, color.replace("1)", "0)"));
      ctx.beginPath(); ctx.arc(p.x, p.y, size * 6, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, size * p.scale * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
      for (let k = 1; k <= 7; k++) {
        const ta = a - k * 0.16;
        const trx = Math.cos(ta) * radius, trY = Math.sin(ta) * radius;
        const ty3 = trY * Math.cos(tilt), tz3 = trY * Math.sin(tilt);
        const tx3 = trx * Math.cos(spin) - tz3 * Math.sin(spin);
        const tzf = trx * Math.sin(spin) + tz3 * Math.cos(spin);
        const tp = project(tx3, ty3, tzf);
        ctx.beginPath(); ctx.arc(tp.x, tp.y, (size - k * 0.28) * tp.scale, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0, 0.5 - k * 0.07);
        ctx.fill(); ctx.globalAlpha = 1;
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      const t = (tRef.current += 0.009);
      const mx = (mouseRef.current.x - 0.5) * 0.3;
      const my = (mouseRef.current.y - 0.5) * 0.3;
      drawRing(110, Math.PI * 0.22 + my, t * 0.5,  0.13, "rgba(13,148,136,1)");
      drawRing(82,  Math.PI * 0.55 + mx, -t * 0.35, 0.11, "rgba(14,116,144,1)");
      drawRing(58,  Math.PI * 0.78 + my * 0.5, t * 0.68, 0.09, "rgba(100,116,139,1)");
      drawOrbiter(110, Math.PI * 0.22 + my, t * 0.5,  (t * 0.17) % 1,       3.5, "rgba(13,148,136,1)");
      drawOrbiter(82,  Math.PI * 0.55 + mx, -t * 0.35,(t * 0.24 + 0.5) % 1, 2.8, "rgba(14,116,144,1)");
      drawOrbiter(58,  Math.PI * 0.78 + my * 0.5, t * 0.68,(t * 0.31 + 0.3) % 1, 2.2, "rgba(100,116,139,1)");
      const core = 0.5 + 0.5 * Math.sin(t * 1.5);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
      g.addColorStop(0, `rgba(13,148,136,${0.4 * core})`);
      g.addColorStop(1, "rgba(13,148,136,0)");
      ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(13,148,136,${0.7 + 0.3 * core})`; ctx.fill();
      rafRef.current = requestAnimationFrame(frame);
    }
    frame();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const wrapRef = useRef<HTMLDivElement>(null);
  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }
  function handleMouseLeave() { mouseRef.current = { x: 0.5, y: 0.5 }; }

  const contacts = [
    {
      label: "Email", value: "nextech.amit@gmail.com",
      href: "mailto:nextech.amit@gmail.com",
      color: "text-teal-700", border: "border-teal-200 hover:border-teal-400", bg: "hover:bg-teal-50",
      icon: (<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-teal-600"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>),
    },
    {
      label: "GitHub", value: "NexTechArchitect",
      href: "https://github.com/NexTechArchitect",
      color: "text-slate-700", border: "border-slate-200 hover:border-slate-400", bg: "hover:bg-slate-50",
      icon: (<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" className="text-slate-600"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>),
    },
    {
      label: "Twitter", value: "@itZ_AmiT0",
      href: "https://x.com/itZ_AmiT0",
      color: "text-sky-700", border: "border-sky-200 hover:border-sky-400", bg: "hover:bg-sky-50",
      icon: (<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" className="text-sky-600"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>),
    },
    {
      label: "Telegram", value: "NexTechDev",
      href: "https://t.me/NexTechDev",
      color: "text-cyan-700", border: "border-cyan-200 hover:border-cyan-400", bg: "hover:bg-cyan-50",
      icon: (<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" className="text-cyan-600"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>),
    },
  ];

  return (
    <div ref={wrapRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      className="relative w-[320px] h-[320px] sm:w-[340px] sm:h-[340px] flex items-center justify-center">
      <canvas ref={canvasRef} width={340} height={340} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
        {contacts.map((c, i) => (
          <motion.a
            key={c.label} href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.04, y: -1 }}
            className={`pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border ${c.border} shadow-sm transition-all duration-200 ${c.bg} group`}
            style={{ zIndex: 10 }}
          >
            <span className="flex-shrink-0">{c.icon}</span>
            <span className={`text-[10px] font-mono font-semibold tracking-wider uppercase ${c.color}`}>{c.label}</span>
            <span className="text-[11px] font-mono text-slate-500 max-w-[130px] truncate">{c.value}</span>
            <span className={`text-[10px] ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${c.color}`}>up-right arrow</span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const corePillars = [
    { label: "MEV Resistant",  value: "Airdrop Design",  accent: "#0f766e" },
    { label: "Oracle Guarded", value: "All Price Feeds", accent: "#0369a1" },
    { label: "Live Migration", value: "V1 to V3 UUPS",  accent: "#0891b2" },
    { label: "Flash-Loan Safe",value: "Governance",      accent: "#059669" },
    { label: "Perps DEX",      value: "50x Gasless",     accent: "#D97706" },
  ];

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(148deg, #dcf0eb 0%, #edf5f2 28%, #e5eff5 58%, #f0ece1 100%)",
        minHeight: "min(100svh, 1000px)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{ backgroundImage: "radial-gradient(circle, #0f766e 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full relative z-10 flex flex-col lg:flex-row flex-grow justify-start sm:justify-center items-center gap-12 lg:gap-8 pt-24 pb-16 sm:py-24">

        {/* LEFT */}
        <div className="w-full lg:w-[58%] flex flex-col">

          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-6 sm:mb-10 rounded-full bg-white/50 border border-teal-400/40 backdrop-blur-md shadow-sm w-max"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-teal-800 font-bold uppercase select-none">
              Open to full-time remote
            </span>
          </motion.div>

          {/* Name + Title */}
          <div className="mb-4 sm:mb-6">
            <h1 className="leading-[0.9] sm:leading-[0.88] tracking-tight" style={{ fontFamily: "'Georgia', 'Palatino', serif" }}>
              <div className="text-[3.2rem] sm:text-[6.5rem] md:text-[8.5rem] font-black text-slate-900 mb-1 sm:mb-2 relative z-20">
                {mounted ? <GlitchText text="Amit." delay={150} /> : "Amit."}
              </div>
              <div className="text-[1.35rem] sm:text-[2.2rem] md:text-[2.8rem] font-bold whitespace-nowrap relative z-20" style={{ fontFamily: "'Georgia', serif" }}>
                <span className="hero-title-gradient">
                  {mounted ? <GlitchText text="Smart Contract Engineer" delay={360} /> : "Smart Contract Engineer"}
                </span>
              </div>
            </h1>
          </div>

          <style>{`
            .hero-title-gradient {
              background: linear-gradient(120deg, #0f766e 0%, #0369a1 55%, #0891b2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
          `}</style>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-[12px] sm:text-[13px] font-mono tracking-[0.18em] text-slate-500 uppercase mb-7 sm:mb-8 font-semibold relative z-20"
          >
            Building infrastructure that survives the dark forest.
          </motion.p>

          {/* Summary paragraphs */}
          <div className="w-full space-y-4 sm:space-y-5 mb-8 sm:mb-11 relative z-20 pr-0 lg:pr-8">
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[14px] sm:text-[16px] text-slate-700 leading-[1.85] font-medium"
            >
              I am a self-taught Solidity engineer who has spent the last two years doing one thing: building real DeFi protocols and shipping them. Not tutorials, not toy contracts. Ten production systems on Base Mainnet and EVM testnets, with full Foundry test suites and Slither audits on every one.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.84, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[14px] sm:text-[16px] text-slate-700 leading-[1.85] font-medium"
            >
              The work covers the hard parts of DeFi: a perpetual DEX with gasless 50x leverage using ERC-4337, flash-loan resistant DAO governance, an ERC-4626 insurance vault running on Aave V3, cross-chain margin settlement via Chainlink CCIP, and an on-chain reputation system with soulbound tokens. Each protocol was designed for production security, not just functionality.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[14px] sm:text-[16px] text-slate-700 leading-[1.85] font-medium"
            >
              Security is not a final checklist. CEI patterns, oracle staleness guards, reentrancy protection, and flash-loan resistance are decisions made at the architecture stage. The result: zero high-severity findings across 40+ verified contracts. I am looking for a team where that standard is the baseline, not a bonus.
            </motion.p>
          </div>

          {/* Pillars */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 pt-6 sm:pt-7 border-t border-slate-300/50 relative z-20 w-full"
          >
            {corePillars.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.25 + i * 0.07 }}
                whileHover={{ y: -3, transition: { duration: 0.16 } }}
                className="group flex flex-col gap-1.5 cursor-default"
              >
                <div
                  className="text-[1rem] sm:text-[1.15rem] font-bold leading-tight text-slate-800 transition-colors duration-300"
                  style={{ fontFamily: "'Georgia', serif", color: undefined }}
                  onMouseEnter={e => (e.currentTarget.style.color = s.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = "")}
                >
                  {s.value}
                </div>
                <div className="text-[8px] sm:text-[9px] font-mono tracking-[0.18em] text-slate-400 uppercase leading-tight font-bold">
                  {s.label}
                </div>
                <div
                  className="h-[2px] w-0 group-hover:w-6 rounded-full transition-all duration-500 mt-1"
                  style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[42%] flex justify-center lg:justify-end mt-4 lg:mt-0 relative z-30">
          <ContactOrb />
        </div>

      </div>
    </section>
  );
}