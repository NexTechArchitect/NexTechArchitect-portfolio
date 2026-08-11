"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

const displayFont = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"] });
const monoFont = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"] });

// ─── CINEMATIC LIGHT 3D ORB CANVAS (ORANGE / PINK / CYAN) ─────────────────────
function CinematicLightCanvas() {
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

    // Premium Color Palette: Warm Orange/Pink vs Cool Cyan
    const palettes = [
      { light: "#FFB888", dark: "#FF7300" }, // Vibrant Orange
      { light: "#FFA8D2", dark: "#FF147A" }, // Pinkish
      { light: "#A8F0FF", dark: "#00B7FF" }, // Cyan
    ];

    const orbs = Array.from({ length: 35 }, () => {
      const palette = palettes[Math.floor(Math.random() * palettes.length)];
      return {
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 1000,
        z: Math.random() * 800 + 100,
        baseRadius: Math.random() * 60 + 30,
        colorLight: palette.light,
        colorDark: palette.dark,
        offset: Math.random() * Math.PI * 2,
      };
    });

    const render = () => {
      // Very soft, transparent white background fade
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fillRect(0, 0, width, height);
      
      time += 0.008; // Slower, more elegant movement

      const cx = width * 0.5;
      const cy = height * 0.5;
      const fov = 500;

      const projected = orbs
        .map((orb) => {
          // Floating wave math
          const floatY = orb.y + Math.sin(time * 1.5 + orb.offset) * 100;
          const floatX = orb.x + Math.cos(time * 1.2 + orb.offset) * 80;

          const scale = fov / (fov + orb.z);
          const px = cx + floatX * scale;
          const py = cy + floatY * scale;
          const pr = orb.baseRadius * scale;

          return { ...orb, px, py, pr, scale };
        })
        .sort((a, b) => b.z - a.z); // Depth sorting (Painters algorithm)

      projected.forEach((p) => {
        if (p.pr < 0) return;

        // Soft drop shadow/glow for the 3D effect
        ctx.beginPath();
        ctx.arc(p.px, p.py + p.pr * 0.3, p.pr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${0.03 * p.scale})`;
        ctx.fill();

        // 3D Glassy Radial Gradient
        const grad = ctx.createRadialGradient(
          p.px - p.pr * 0.3, p.py - p.pr * 0.3, p.pr * 0.1,
          p.px, p.py, p.pr
        );
        grad.addColorStop(0, "#FFFFFF"); // Bright highlight
        grad.addColorStop(0.4, p.colorLight);
        grad.addColorStop(1, p.colorDark);

        ctx.beginPath();
        ctx.arc(p.px, p.py, p.pr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        // Global Alpha for soft overlapping glass effect
        ctx.globalAlpha = 0.6; 
        ctx.fill();
        ctx.globalAlpha = 1.0;
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

// ─── MAIN FOOTER COMPONENT ───────────────────────────────────────────────
export default function ContactFooter() {
  return (
    <footer className="relative bg-[#FAFCFF] border-t border-slate-200 overflow-hidden pt-32 pb-10">
      
      {/* ── CINEMATIC BACKGROUND ── */}
      <CinematicLightCanvas />
      
      {/* Soft Overlays to blend text beautifully */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-white/40 to-white/90" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12">
        
        {/* ── HEADER & CTA SECTION ── */}
        <div className="flex flex-col items-center text-center mb-28">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-full shadow-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-600 ${monoFont.className}`}>
              Available For Protocol Development
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className={`text-5xl sm:text-7xl md:text-[85px] font-black text-slate-900 tracking-tighter leading-[1.05] mb-10 ${displayFont.className}`}
          >
            Engineer the <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-500 to-cyan-500 drop-shadow-sm">
              Impossible.
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          >
            <Link 
              href="mailto:nextech.amit@gmail.com"
              className={`group relative inline-flex items-center gap-3 px-8 py-5 sm:px-12 sm:py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(255,115,0,0.3)] hover:shadow-[0_20px_50px_-10px_rgba(6,182,212,0.4)] hover:-translate-y-1 ${monoFont.className}`}
            >
              Start A Conversation
              <svg className="w-5 h-5 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200/80"
        >
          {/* Branding */}
          <p className={`text-[10px] sm:text-xs text-slate-500 font-bold tracking-widest uppercase ${monoFont.className}`}>
            © {new Date().getFullYear()} Amit Kumar <span className="mx-3 opacity-40">/</span> Protocol Architect
          </p>

          {/* Social Links */}
          <div className={`flex flex-wrap justify-center items-center gap-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 ${monoFont.className}`}>
            <Link href="https://github.com/NexTechArchitect" target="_blank" className="hover:text-slate-900 transition-colors duration-300">
              GitHub
            </Link>
            <Link href="https://www.linkedin.com/in/nextech-amit/" target="_blank" className="hover:text-[#0A66C2] transition-colors duration-300">
              LinkedIn
            </Link>
            <Link href="https://x.com/itZ_AmiT0" target="_blank" className="hover:text-slate-900 transition-colors duration-300">
              Twitter
            </Link>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}