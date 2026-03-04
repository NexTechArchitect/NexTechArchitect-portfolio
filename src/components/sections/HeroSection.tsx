"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// ── Animated Counter ───────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration: 2.2, delay: 1, ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [target]);
  return <span>{display}{suffix}</span>;
}

// ── Glitch Text ────────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function GlitchText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [out, setOut] = useState(() =>
    text.split("").map((c) => (c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)])).join("")
  );
  useEffect(() => {
    let f = 0;
    const total = 22;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        f++;
        setOut(text.split("").map((c, i) => {
          if (c === " ") return " ";
          if (f > (i / text.length) * total * 0.7 + Math.random() * 4) return c;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join(""));
        if (f >= total) { clearInterval(iv); setOut(text); }
      }, 48);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return <>{out}</>;
}

// ── Footer-style 5D Particle Network — hero teal palette, ultra-light ────
function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0;

    function resize() {
      if (!canvas) return;
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    // Hero teal/sage/sky — same as site theme
    const PALETTE: [number,number,number][] = [
      [13, 148, 136],   // teal
      [77, 158, 122],   // sage
      [11, 110, 138],   // sky-teal
    ];

    type P = { x:number;y:number;z:number;t:number;f:number;ox:number;oy:number;col:number };
    const COUNT = 90;
    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random()*1600, y: Math.random()*900,
      z: Math.random(), t: Math.random()*Math.PI*2,
      f: 0.25 + Math.random()*0.55,
      ox: Math.random()*1600, oy: Math.random()*900,
      col: Math.floor(Math.random()*3),
    }));

    let time = 0;

    function draw() {
      if (!canvas||!ctx||W<=0||H<=0) { rafRef.current=requestAnimationFrame(draw); return; }
      ctx.clearRect(0,0,W,H);
      time += 0.004;

      const mx = mouse.current.x, my = mouse.current.y;

      for (const p of pts) {
        const ds = 0.4+p.z*0.6;
        p.x = p.ox + Math.sin(time*p.f+p.t)*26*ds;
        p.y = p.oy + Math.cos(time*p.f*0.7+p.t)*17*ds;
        const dx=p.x-mx, dy=p.y-my, dist=Math.sqrt(dx*dx+dy*dy);
        if (dist<100&&dist>0) { const f=(100-dist)/100*16; p.x+=dx/dist*f; p.y+=dy/dist*f; }
        p.ox += Math.sin(time*0.09+p.t)*0.14*ds;
        p.oy += Math.cos(time*0.07+p.t)*0.10*ds;
        if(p.ox<-60)p.ox=W+30; if(p.ox>W+60)p.ox=-30;
        if(p.oy<-60)p.oy=H+30; if(p.oy>H+60)p.oy=-30;
      }

      // Connections — very faint
      for (let i=0;i<COUNT;i++) for (let j=i+1;j<COUNT;j++) {
        const a=pts[i], b=pts[j];
        const dx=a.x-b.x, dy=a.y-b.y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<105) {
          const alpha=(1-d/105)*0.11*((a.z+b.z)/2);
          const [r,g,bl]=PALETTE[a.col];
          ctx.beginPath();
          ctx.strokeStyle=`rgba(${r},${g},${bl},${alpha})`;
          ctx.lineWidth=0.4+(a.z+b.z)*0.15;
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }

      // Dots — barely visible
      for (const p of pts) {
        const r=0.8+p.z*1.8;
        const alpha=0.12+p.z*0.28; // max ~0.40 — light but visible
        const pulse=1+Math.sin(time*p.f*2+p.t)*0.2;
        const [cr,cg,cb]=PALETTE[p.col];

        const grd=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*4*pulse);
        grd.addColorStop(0,`rgba(${cr},${cg},${cb},${alpha*0.4})`);
        grd.addColorStop(1,`rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath(); ctx.arc(p.x,p.y,r*4*pulse,0,Math.PI*2);
        ctx.fillStyle=grd; ctx.fill();

        ctx.beginPath(); ctx.arc(p.x,p.y,r*pulse,0,Math.PI*2);
        ctx.fillStyle=`rgba(${cr},${cg},${cb},${alpha})`; ctx.fill();
      }

      rafRef.current=requestAnimationFrame(draw);
    }
    draw();

    const onMove = (e: globalThis.MouseEvent) => {
      const r = canvas!.getBoundingClientRect();
      mouse.current = { x: e.clientX-r.left, y: e.clientY-r.top };
    };
    const onLeave = () => { mouse.current = { x:-999, y:-999 }; };
    canvas.parentElement?.addEventListener("mousemove", onMove);
    canvas.parentElement?.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8, zIndex: 0 }}
    />
  );
}

// ── Hero Section ───────────────────────────────────────────────────────────
export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = [
    { label: "In Web3 Since",       value: "2019", isStatic: true },
    { label: "Building Tech Since", value: "2024", isStatic: true },
    { label: "Projects Built",      value: 15, suffix: "+" },
    { label: "Contracts Deployed",  value: 60, suffix: "+" },
  ];

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ 
        background: "linear-gradient(148deg, #dcf0eb 0%, #edf5f2 28%, #e5eff5 58%, #f0ece1 100%)",
        minHeight: "min(100svh, 1000px)",
      }}
    >
      {/* 5D Particle network — footer-style, hero teal palette */}
      <HeroParticles />

      {/* Existing blobs — unchanged */}
      <div className="absolute top-[-10%] right-[-6%] w-[58vw] h-[58vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(80,185,165,0.16) 0%, transparent 62%)", filter: "blur(72px)" }} />
      <div className="absolute bottom-[-12%] left-[-6%] w-[52vw] h-[52vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(195,168,95,0.12) 0%, transparent 62%)", filter: "blur(80px)" }} />
      <div className="absolute top-[38%] right-[12%] w-[38vw] h-[38vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(80,155,205,0.09) 0%, transparent 62%)", filter: "blur(90px)" }} />
      <div className="absolute top-[5%] left-[8%] w-[30vw] h-[30vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(120,205,160,0.08) 0%, transparent 62%)", filter: "blur(65px)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-60"
        style={{ backgroundImage: "radial-gradient(circle, rgba(60,125,115,0.12) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full relative z-10 flex flex-col flex-grow justify-start sm:justify-center pt-24 pb-16 sm:py-24">
        <div className="max-w-3xl w-full">

          <motion.div
            initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-6 sm:mb-10 rounded-full bg-white/75 border border-teal-400/70 backdrop-blur-sm shadow-sm"
          >
            <motion.span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.35, 1] }} transition={{ duration: 2.2, repeat: Infinity }} />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-teal-700 font-semibold uppercase select-none">
              Open to Work · Web3 Engineer · India
            </span>
          </motion.div>

          <div className="mb-4 sm:mb-6">
            <h1 className="leading-[0.9] sm:leading-[0.88] tracking-tight" style={{ fontFamily: "'Georgia', 'Palatino', serif" }}>
              <div className="text-[3.2rem] sm:text-[6.5rem] md:text-[8.5rem] font-black text-gray-950 mb-1 sm:mb-2">
                {mounted ? <GlitchText text="Amit." delay={150} /> : "Amit."}
              </div>
              <div className="text-[1.35rem] sm:text-[2.2rem] md:text-[2.8rem] font-bold whitespace-nowrap"
                style={{ fontFamily: "'Georgia', serif" }}>
                <span className="hero-title-gradient">
                  {mounted ? <GlitchText text="Smart Contract & Web3 Dev" delay={360} /> : "Smart Contract & Web3 Dev"}
                </span>
              </div>
            </h1>
          </div>

          {/* Inline style — avoids framer-motion backgroundClip conflict */}
          <style>{`
            .hero-title-gradient {
              background: linear-gradient(120deg, #0d6e65 0%, #0b6e8a 55%, #1a3a8f 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
          `}</style>

          <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
            className="text-[12px] sm:text-[13px] font-mono tracking-[0.18em] text-slate-400 uppercase mb-7 sm:mb-8">
            Building protocols that survive the dark forest.
          </motion.p>

          <div className="w-full sm:max-w-2xl space-y-3 sm:space-y-4 mb-8 sm:mb-11 relative z-20">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[14px] sm:text-[17.5px] text-slate-700 leading-[1.75]">
              Been in Web3 since 2019, started as a user and got deep into how the tech actually works.
              Since 2024 I&#39;ve been on the building side, writing Solidity contracts that focus on
              getting the logic right, keeping gas low, and not breaking in edge cases.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.84, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[14px] sm:text-[17.5px] text-slate-700 leading-[1.75]">
              Built across{" "}
              <span className="text-gray-900 font-semibold">15+ projects</span>, things like a{" "}
              <span className="text-teal-700 font-semibold">Perpetuals DEX</span>, a{" "}
              <span className="text-teal-700 font-semibold">DAO governance system</span>, stablecoins,
              UUPS proxies, Merkle airdrops, and more. Over{" "}
              <span className="text-gray-900 font-semibold">60 contracts deployed</span> on EVM chains.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[14px] sm:text-[17.5px] text-slate-700 leading-[1.75]">
              Mostly focused on building full-stack DApps right now. The kind that real people can
              actually open and use, not just contract repos sitting on GitHub. Next.js and Wagmi on
              the frontend, solid contracts underneath. Security and clean code aren&#39;t optional.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="grid grid-cols-4 gap-3 sm:gap-8 pt-6 sm:pt-7 border-t border-slate-300">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.25 + i * 0.08 }}
                whileHover={{ y: -3, transition: { duration: 0.16 } }}
                className="group flex flex-col gap-1 cursor-default">
                <div className="text-[1.4rem] sm:text-[2.4rem] font-black leading-none tabular-nums text-gray-900 group-hover:text-teal-700 transition-colors duration-300"
                  style={{ fontFamily: "'Georgia', serif" }}>
                  {mounted && !s.isStatic
                    ? <AnimatedCounter target={s.value as number} suffix={s.suffix} />
                    : <>{s.value}{s.suffix}</>}
                </div>
                <div className="text-[9px] font-mono tracking-[0.2em] text-slate-500 uppercase leading-tight">{s.label}</div>
                <div className="h-[2px] w-0 group-hover:w-7 rounded-full transition-all duration-500"
                  style={{ background: "linear-gradient(90deg, #0d6e65, #0b6e8a)" }} />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
