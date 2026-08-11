"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bricolage_Grotesque, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

const displayFont = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });
const monoFont = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"] });

// ─── CINEMATIC 3D "CARTOON" WEBGL-STYLE CANVAS ────────────────────────────────
function Cinematic3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let animationFrame: number;
    let time = 0;

    // Tighter spread — no more orbs forcing layout height on mobile
    const orbs = Array.from({ length: 40 }, () => ({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 1600,
      z: Math.random() * 600 + 100,
      baseRadius: Math.random() * 50 + 20,
      colorLight: Math.random() > 0.5 ? "#60A5FA" : "#34D399",
      colorDark: Math.random() > 0.5 ? "#2563EB" : "#059669",
      offset: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.01 + 0.005
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.012;

      const isDesktop = width > 1024;
      const cx = isDesktop ? width * 0.70 : width * 0.5;
      const cy = height * 0.5;
      const fov = 400;

      const projected = orbs.map(orb => {
        const floatY = orb.y + Math.sin(time + orb.offset) * 60;
        const floatX = orb.x + Math.cos(time * 0.8 + orb.offset) * 40;

        const scale = fov / (fov + orb.z);
        const px = cx + floatX * scale;
        const py = cy + floatY * scale;
        const pr = orb.baseRadius * scale;

        return { ...orb, px, py, pr, scale };
      }).sort((a, b) => b.z - a.z);

      projected.forEach(p => {
        if (p.pr < 0) return;

        ctx.beginPath();
        ctx.arc(p.px, p.py + p.pr * 0.5, p.pr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${0.04 * p.scale})`;
        ctx.fill();

        const grad = ctx.createRadialGradient(
          p.px - p.pr * 0.3, p.py - p.pr * 0.3, p.pr * 0.1,
          p.px, p.py, p.pr
        );
        grad.addColorStop(0, "#FFFFFF");
        grad.addColorStop(0.3, p.colorLight);
        grad.addColorStop(1, p.colorDark);

        ctx.beginPath();
        ctx.arc(p.px, p.py, p.pr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-multiply z-0"
    />
  );
}

// ─── SOCIAL ICONS ─────────────────────────────────────────────────────────────
const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/NexTechArchitect",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nextech-amit/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com/itZ_AmiT0",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:nextech.amit@gmail.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7 10-7" />
      </svg>
    ),
  },
];

// ─── MAIN HERO SECTION ────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section className={`relative bg-[#F8FAFC] overflow-hidden ${bodyFont.className}`}>
      <Cinematic3DCanvas />

      {/* Aesthetic Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-cyan-400/10 blur-[100px] pointer-events-none z-0" />

      {/* Responsive Padding */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 pt-[100px] md:pt-[140px] lg:pt-[180px] pb-12 md:pb-20">

        <div className="flex flex-col items-start text-left max-w-[850px]">

          {/* Status Badge with Name & Pulsing Dot */}
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-white border-2 border-slate-200 rounded-full shadow-sm mb-6 sm:mb-8"
          >
            {/* Pulsing Dot */}
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-500"></span>
            </span>
            
            {/* Name and Title */}
            <span className={`text-[10px] sm:text-xs font-black text-slate-800 tracking-widest uppercase ${monoFont.className}`}>
              Amit Kumar <span className="text-[#0052FF] mx-1.5 sm:mx-2">|</span> Protocol Architect
            </span>
          </motion.div>

          {/* Name / Title */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h1 className={`text-[42px] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[80px] font-black text-slate-900 tracking-tight lg:leading-[1.02] mb-6 ${displayFont.className}`}>
              Engineering Trustless <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                DeFi Infrastructure.
              </span>
            </h1>
          </motion.div>

          {/* Senior Level Copywriting */}
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-lg text-slate-600 leading-relaxed mb-8 sm:mb-10 font-medium bg-white/40 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/60 shadow-sm"
          >
            I architect and secure production grade decentralized economic systems. Operating at the intersection of EVM mechanics and protocol security, I have engineered over 70 verified smart contracts across Base Mainnet and various Ethereum ecosystems. My core domains encompass institutional real world asset tokenization, high performance perpetual exchanges, and resilient governance primitives.
            <br /><br />
            Security is my fundamental architectural baseline. I focus strictly on robust system design, stateful invariant fuzzing, and maximum gas efficiency using Yul assembly. I build fault tolerant infrastructure designed to protect liquidity and ensure absolute mathematical solvency under extreme market conditions.
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10 sm:mb-12"
          >
            <a
              href="https://github.com/NexTechArchitect"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 bg-[#0052FF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold uppercase tracking-widest px-10 py-4 sm:py-5 rounded-2xl shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1 transition-all ${monoFont.className}`}
            >
              View GitHub ↗
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <span className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1 sm:mr-2 ${monoFont.className}`}>Connect:</span>
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#0052FF] bg-white border-2 border-slate-100 hover:border-blue-100 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-sm ${monoFont.className}`}
              >
                {l.icon}
                {l.label}
              </a>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}