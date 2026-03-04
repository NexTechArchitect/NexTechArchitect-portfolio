"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   ERC-4337 ACCOUNT ABSTRACTION — VAULT REACTOR THEME
   Palette: Void Black (#04000A), Electric Gold (#F59E0B), Neon Cyan (#00D4FF)
   Vibe: High-security nuclear vault, UserOps as charged particles
═══════════════════════════════════════════════════════════════════ */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap');
  .aa-heading  { font-family: 'Syne', sans-serif; }
  .aa-mono     { font-family: 'JetBrains Mono', monospace; }
  .aa-body     { font-family: 'DM Sans', sans-serif; }
  .aa-gold-text {
    background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .aa-cyan-text {
    background: linear-gradient(135deg, #67E8F9 0%, #00D4FF 60%, #0EA5E9 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .aa-glass {
    background: rgba(8, 4, 18, 0.65);
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(245, 158, 11, 0.18);
    box-shadow: 0 8px 32px rgba(0,0,0,0.6), inset 0 0 24px rgba(245,158,11,0.04);
  }
  .aa-scroll::-webkit-scrollbar { width:5px; height:5px; }
  .aa-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.4); border-radius:8px; }
  .aa-scroll::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.25); border-radius:8px; }
`;


// ── Color helper ──────────────────────────────────────────────────────────
function hx(hex: string, alpha: number): string {
  const h = hex.replace("#","");
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},${Math.min(1,Math.max(0,alpha))})`;
}
// ═══════════════════════════════════════════════════════════════════
//  5D ENTRYPOINT REACTOR CANVAS
//  Dims: X·Y (space) + Z (depth/scale) + T (time orbit) + F (per-particle frequency)
//  Visual: EntryPoint at core, UserOp particles orbit, validate, execute
// ═══════════════════════════════════════════════════════════════════
function EntryPointReactorCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = c.offsetWidth;
    let H = c.height = c.offsetHeight;
    let rafId: number, t = 0;
    const isMobile = W < 640;

    // UserOp particles — each has orbit radius, angle, speed (F dim), depth (Z dim)
    type UOp = {
      angle: number; orbitR: number; speed: number;
      phase: number; freq: number; z: number;
      label: string; color: string; size: number; trail: {x:number;y:number}[];
    };
    const LABELS = ["UserOp","validateUserOp","handleOps","Paymaster","Bundler","SessionKey","ECDSA","EntryPoint","ERC-4337"];
    const COLORS = ["#F59E0B","#00D4FF","#A78BFA","#34D399","#F472B6","#FCD34D","#60A5FA","#FB923C","#00D4FF"];

    const ops: UOp[] = Array.from({ length: isMobile ? 7 : 14 }, (_, i) => ({
      angle:  (i / (isMobile ? 7 : 14)) * Math.PI * 2,
      orbitR: (isMobile ? 55 : 80) + (i % 3) * (isMobile ? 28 : 42),   // Z dim — orbit depth
      speed:  0.004 + (i % 5) * 0.003,                                   // F dim — unique speed
      phase:  (i / 14) * Math.PI * 2,
      freq:   0.6 + i * 0.18,
      z:      0.5 + (i % 3) * 0.25,                                      // Z dim — depth scale
      label:  LABELS[i % LABELS.length],
      color:  COLORS[i % COLORS.length],
      size:   2 + i % 3,
      trail:  [],
    }));

    // Ring pulse events
    type Ring = { r: number; maxR: number; alpha: number; color: string };
    const rings: Ring[] = [];
    let nextRing = 60;

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      t++;
      W = c.width = c.offsetWidth; H = c.height = c.offsetHeight;
      ctx.fillStyle = "rgba(4,0,10,0.18)"; ctx.fillRect(0,0,W,H);

      const cx = W/2, cy = H/2;

      // Orbit rings (Z dim — depth layers)
      [1,2,3].forEach((layer, li) => {
        const r = (isMobile ? 55 : 80) + li * (isMobile ? 28 : 42);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(245,158,11,${0.06 + li*0.02})`; ctx.lineWidth=0.7; ctx.stroke();
      });

      // Pulse rings (T dim)
      if (--nextRing <= 0) {
        rings.push({ r: 10, maxR: isMobile?90:140, alpha: 0.5, color: Math.random()>0.5?"#F59E0B":"#00D4FF" });
        nextRing = 40 + Math.floor(Math.random()*40);
      }
      rings.forEach((ring, ri) => {
        ring.r += 1.8; ring.alpha *= 0.96;
        ctx.beginPath(); ctx.arc(cx, cy, ring.r, 0, Math.PI*2);
        ctx.strokeStyle = hx(ring.color, ring.alpha*0.784);
        ctx.lineWidth = 1.5; ctx.stroke();
      });
      for (let i = rings.length-1; i >= 0; i--) { if (rings[i].r > rings[i].maxR) rings.splice(i,1); }

      // Orbiting UserOp particles
      ops.forEach(op => {
        op.angle += op.speed;                                             // T dim

        // 5th dim: vertical oscillation at unique frequency
        const vOsc = Math.sin(t * 0.02 * op.freq + op.phase) * (isMobile?10:16);
        const px = cx + Math.cos(op.angle) * op.orbitR;
        const py = cy + Math.sin(op.angle) * op.orbitR * 0.38 + vOsc;  // Z dim ellipse

        // Trail (T+Z dims)
        op.trail.push({x:px, y:py});
        if (op.trail.length > 18) op.trail.shift();
        for (let ti=1; ti<op.trail.length; ti++) {
          const ta = (ti/op.trail.length);
          ctx.beginPath();
          ctx.moveTo(op.trail[ti-1].x, op.trail[ti-1].y);
          ctx.lineTo(op.trail[ti].x, op.trail[ti].y);
          ctx.strokeStyle = hx(op.color, ta*0.4);
          ctx.lineWidth = op.size * ta * 0.8; ctx.stroke();
        }

        // Glow
        const glowR = Math.max(1, (op.size+2)*op.z*3.5);
        const grad = ctx.createRadialGradient(px,py,0,px,py,glowR);
        grad.addColorStop(0, op.color+"cc"); grad.addColorStop(1, op.color+"00");
        ctx.beginPath(); ctx.arc(px,py,glowR,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();

        // Core dot
        ctx.beginPath(); ctx.arc(px, py, Math.max(0.5, op.size*op.z), 0, Math.PI*2);
        ctx.fillStyle = op.color; ctx.fill();

        // Label (visible on desktop, or on hover simulation)
        if (!isMobile) {
          const pulse = 0.5 + 0.5*Math.sin(t*0.04*op.freq + op.phase);
          ctx.font = `500 10px JetBrains Mono, monospace`;
          ctx.fillStyle = hx(op.color, pulse*0.667);
          ctx.textAlign = "center";
          ctx.fillText(op.label, px, py - op.size*op.z - 7);
        }
      });

      // EntryPoint core — pulsing reactor
      const coreR = (isMobile ? 26 : 34) + Math.sin(t*0.05)*3;
      const corePulse = 0.7 + 0.3*Math.sin(t*0.07);

      // Outer glow
      const cg = ctx.createRadialGradient(cx,cy,0,cx,cy,coreR*3.5);
      cg.addColorStop(0, `rgba(245,158,11,${0.35*corePulse})`);
      cg.addColorStop(0.4, `rgba(245,158,11,${0.12*corePulse})`);
      cg.addColorStop(1, "rgba(245,158,11,0)");
      ctx.beginPath(); ctx.arc(cx,cy,coreR*3.5,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill();

      // Core ring
      ctx.beginPath(); ctx.arc(cx,cy,coreR,0,Math.PI*2);
      ctx.strokeStyle = `rgba(245,158,11,${0.8*corePulse})`; ctx.lineWidth=2; ctx.stroke();

      // Inner fill
      const icg = ctx.createRadialGradient(cx,cy,0,cx,cy,coreR);
      icg.addColorStop(0, `rgba(253,211,77,${0.6*corePulse})`);
      icg.addColorStop(0.5, `rgba(245,158,11,${0.4*corePulse})`);
      icg.addColorStop(1, `rgba(217,119,6,0.15)`);
      ctx.beginPath(); ctx.arc(cx,cy,coreR,0,Math.PI*2); ctx.fillStyle=icg; ctx.fill();

      // Label
      ctx.font = `600 ${isMobile?9:11}px JetBrains Mono, monospace`;
      ctx.fillStyle = `rgba(4,0,10,${0.9*corePulse})`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("EntryPoint", cx, cy);
      ctx.textBaseline = "alphabetic";
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.92 }} />
  );
}

// ═══════════════════════════════════════════════════════════════════
//  4D USEROP FLOW CANVAS — horizontal pipeline with live packets
// ═══════════════════════════════════════════════════════════════════
function UserOpFlowCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    let id: number, t = 0;
    const isMobile = W < 500;

    const STAGES = isMobile
      ? ["User","Bundler","EntryPoint","SmartAcct"]
      : ["User / Client","Alt Mempool","Bundler","EntryPoint","SmartAccount","Target"];
    const stageColors = ["#F59E0B","#A78BFA","#00D4FF","#F59E0B","#34D399","#F472B6"];

    type Packet = { x: number; stage: number; speed: number; alpha: number; color: string; freq: number };
    const packets: Packet[] = [];
    let spawnT = 0;

    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    window.addEventListener("resize", resize);

    const draw = () => {
      id = requestAnimationFrame(draw); t++;
      ctx.fillStyle = "rgba(4,0,10,0.22)"; ctx.fillRect(0,0,W,H);

      const pad = isMobile ? 24 : 48;
      const trackY = H * 0.5;
      const stageW = (W - pad*2) / (STAGES.length - 1);

      // Track line
      ctx.beginPath(); ctx.moveTo(pad, trackY); ctx.lineTo(W-pad, trackY);
      ctx.strokeStyle = "rgba(245,158,11,0.12)"; ctx.lineWidth=1.5; ctx.stroke();

      // Stage nodes
      STAGES.forEach((label, si) => {
        const sx = pad + si * stageW;
        const pulse = 1 + 0.2*Math.sin(t*0.05 + si*0.8);
        const r = isMobile ? 10 : 14;

        // Glow
        const gg = ctx.createRadialGradient(sx,trackY,0,sx,trackY,r*3*pulse);
        gg.addColorStop(0, stageColors[si]+"44"); gg.addColorStop(1, stageColors[si]+"00");
        ctx.beginPath(); ctx.arc(sx,trackY,r*3*pulse,0,Math.PI*2); ctx.fillStyle=gg; ctx.fill();

        // Node
        ctx.beginPath(); ctx.arc(sx,trackY,r,0,Math.PI*2);
        ctx.fillStyle = `rgba(4,0,10,0.9)`; ctx.fill();
        ctx.strokeStyle = stageColors[si]; ctx.lineWidth=1.8; ctx.stroke();

        // Label
        ctx.font = `500 ${isMobile?8:9}px JetBrains Mono, monospace`;
        ctx.fillStyle = stageColors[si] + "cc";
        ctx.textAlign = "center";
        ctx.fillText(label, sx, trackY + (si%2===0 ? -(r+8) : (r+18)));
      });

      // Spawn packets (T dim)
      if (--spawnT <= 0) {
        packets.push({ x: pad, stage: 0, speed: 0.8 + Math.random()*0.8, alpha: 1,
          color: stageColors[Math.floor(Math.random()*stageColors.length)], freq: 0.8+Math.random()*1.4 });
        spawnT = 28 + Math.floor(Math.random()*20);
      }

      // Draw + move packets
      packets.forEach(p => {
        p.x += p.speed;
        const targetX = W - pad;
        const progFrac = (p.x - pad) / (targetX - pad);
        const stageIdx = Math.min(STAGES.length-1, Math.floor(progFrac * STAGES.length));

        // Vertical bounce at each stage (F dim — each packet own freq)
        const bounce = Math.sin(t*0.18*p.freq + p.x*0.05)*5;
        const py = trackY + bounce;

        // Glow
        const pg = ctx.createRadialGradient(p.x,py,0,p.x,py,7);
        pg.addColorStop(0, p.color+"ee"); pg.addColorStop(1, p.color+"00");
        ctx.beginPath(); ctx.arc(p.x,py,7,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();

        ctx.beginPath(); ctx.arc(p.x,py,3.5,0,Math.PI*2); ctx.fillStyle=p.color; ctx.fill();
      });

      for (let i=packets.length-1;i>=0;i--) { if (packets[i].x > W-pad+20) packets.splice(i,1); }
    };

    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="w-full h-full min-h-[180px]" />;
}

// ═══════════════════════════════════════════════════════════════════
//  VALIDATION STACK CANVAS — CEI-style vertical signal flow
// ═══════════════════════════════════════════════════════════════════
function ValidationCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    let id: number, t = 0;
    const isMobile = W < 400;

    const STEPS = [
      { label: "validateUserOp()", color: "#F59E0B", sub: "Signature check" },
      { label: "validatePaymasterUserOp()", color: "#A78BFA", sub: "Gas sponsorship" },
      { label: "handleOps()", color: "#00D4FF", sub: "Execute batch" },
      { label: "execute()", color: "#34D399", sub: "Target call" },
    ];

    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    window.addEventListener("resize", resize);

    let signal = 0; // animated signal traveling down

    const draw = () => {
      id = requestAnimationFrame(draw); t++;
      ctx.fillStyle = "rgba(4,0,10,0.25)"; ctx.fillRect(0,0,W,H);

      signal = (signal + 0.012) % 1;

      const pad = 24;
      const stepH = (H - pad*2) / STEPS.length;
      const lineX = isMobile ? 32 : 48;

      // Vertical rail
      ctx.beginPath(); ctx.moveTo(lineX, pad); ctx.lineTo(lineX, H-pad);
      ctx.strokeStyle = "rgba(245,158,11,0.12)"; ctx.lineWidth=2; ctx.stroke();

      // Signal dot traveling down the rail (T dim)
      const sigY = pad + signal*(H-pad*2);
      const sg = ctx.createRadialGradient(lineX,sigY,0,lineX,sigY,12);
      sg.addColorStop(0,"rgba(245,158,11,0.9)"); sg.addColorStop(1,"rgba(245,158,11,0)");
      ctx.beginPath(); ctx.arc(lineX,sigY,12,0,Math.PI*2); ctx.fillStyle=sg; ctx.fill();
      ctx.beginPath(); ctx.arc(lineX,sigY,4,0,Math.PI*2); ctx.fillStyle="#FCD34D"; ctx.fill();

      STEPS.forEach((step, si) => {
        const sy = pad + si*stepH + stepH*0.5;
        const isActive = Math.abs(signal - (si+0.5)/STEPS.length) < 0.12;
        const pulse = isActive ? (1 + 0.3*Math.sin(t*0.15)) : 0.6;

        // Node on rail
        ctx.beginPath(); ctx.arc(lineX, sy, 8, 0, Math.PI*2);
        ctx.fillStyle = isActive ? step.color : "rgba(4,0,10,0.8)"; ctx.fill();
        ctx.strokeStyle = hx(step.color, pulse*0.863);
        ctx.lineWidth=1.8; ctx.stroke();

        // Horizontal connector
        const connW = isActive ? W-lineX-pad : (W-lineX-pad)*0.45;
        const connAlpha = isActive ? 0.7 : 0.18;
        ctx.beginPath(); ctx.moveTo(lineX+10, sy); ctx.lineTo(lineX+connW, sy);
        ctx.strokeStyle = hx(step.color, connAlpha);
        ctx.lineWidth = isActive ? 2 : 1; ctx.stroke();

        // Label card background
        if (isActive) {
          ctx.fillStyle = step.color + "18";
          ctx.beginPath();
          ctx.roundRect(lineX+14, sy-18, W-lineX-pad-14, 36, 8);
          ctx.fill();
        }

        // Text
        const textX = lineX + 22;
        ctx.font = `600 ${isMobile?9:11}px JetBrains Mono, monospace`;
        ctx.fillStyle = isActive ? step.color : step.color + "88";
        ctx.textAlign = "left"; ctx.textBaseline="middle";
        ctx.fillText(step.label, textX, sy - 5);

        ctx.font = `400 ${isMobile?8:9}px DM Sans, sans-serif`;
        ctx.fillStyle = isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)";
        ctx.fillText(step.sub, textX, sy + 9);
        ctx.textBaseline="alphabetic";
      });
    };

    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="w-full h-full min-h-[240px]" />;
}

// ═══════════════════════════════════════════════════════════════════
//  TILT CARD
// ═══════════════════════════════════════════════════════════════════
function VaultCard({ children, className="", glow="rgba(245,158,11,0.08)" }: { children: React.ReactNode; className?: string; glow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const rX = useSpring(useTransform(y,[-0.5,0.5],[5,-5]),{stiffness:220,damping:26});
  const rY = useSpring(useTransform(x,[-0.5,0.5],[-5,5]),{stiffness:220,damping:26});
  const shX = useTransform(x,[-0.5,0.5],["0%","100%"]);
  const shY = useTransform(y,[-0.5,0.5],["0%","100%"]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    x.set((e.clientX-r.left)/r.width-0.5);
    y.set((e.clientY-r.top)/r.height-0.5);
  },[x,y]);
  const onLeave = useCallback(()=>{ x.set(0); y.set(0); },[x,y]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX:rX, rotateY:rY, transformStyle:"preserve-3d", perspective:1200 }}
      className={`relative rounded-3xl overflow-hidden aa-glass transition-colors duration-300 hover:border-[#F59E0B]/40 ${className}`}
    >
      <motion.div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: useTransform(()=>`radial-gradient(500px circle at ${shX.get()} ${shY.get()}, ${glow}, transparent 55%)`) }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function AACoreCaseStudy() {
  const [tab, setTab] = useState<"arch" | "flow" | "session">("arch");

  const TABS = [
    { id:"arch",    label:"Architecture" },
    { id:"flow",    label:"Transaction Flow" },
    { id:"session", label:"Session Keys" },
  ] as const;

  return (
    <div className="w-full bg-[#04000A] text-slate-300 aa-body overflow-hidden selection:bg-[#F59E0B]/30 selection:text-[#FCD34D]">
      <style>{CSS}</style>

      {/* ══════════════════════════════════════
          HERO — Reactor Canvas + Title
      ══════════════════════════════════════ */}
      <div className="relative w-full min-h-[52vh] md:min-h-[62vh] flex flex-col justify-end border-b border-[#F59E0B]/20 overflow-hidden">

        <EntryPointReactorCanvas />

        {/* Readability gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04000A] via-[#04000A]/65 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04000A] via-[#04000A]/30 to-transparent pointer-events-none" />

        <div className="relative z-10 px-6 md:px-16 pt-28 pb-14 w-full max-w-7xl mx-auto">
          <motion.div initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:"easeOut" }}>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1.5 bg-[#F59E0B]/15 border border-[#F59E0B]/50 text-[#FCD34D] text-[10px] font-bold uppercase tracking-[0.2em] rounded shadow-[0_0_15px_rgba(245,158,11,0.25)] aa-mono">
                ERC-4337
              </span>
              <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] rounded backdrop-blur-md aa-mono">
                No Hard Fork Required
              </span>
              <span className="px-3 py-1.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-[10px] font-bold uppercase tracking-[0.2em] rounded aa-mono">
                Foundry
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-[76px] font-black tracking-tight leading-[1.04] text-white mb-6 aa-heading">
              Account <br className="hidden md:block" />
              <span className="aa-gold-text">Abstraction.</span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base aa-body font-medium max-w-2xl leading-relaxed mb-8 border-l-2 border-[#F59E0B] pl-4 md:pl-6 bg-gradient-to-r from-[#F59E0B]/08 to-transparent py-2">
              From-scratch ERC-4337 implementation — bypassing high-level SDKs to expose raw{" "}
              <strong className="text-white">UserOperation packing</strong>, EntryPoint validation,
              and Paymaster gas sponsorship mechanics directly in Solidity and Foundry.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="https://github.com/NexTechArchitect/ERC4337-Account-Abstraction-Foundry" target="_blank"
                className="group relative px-8 py-4 bg-[#F59E0B] text-[#04000A] font-black text-[11px] uppercase tracking-[0.2em] rounded-xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] aa-mono"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Inspect Source <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>

          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          METRICS BAR
      ══════════════════════════════════════ */}
      <div className="border-b border-white/5 bg-[#020008]">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-[#F59E0B]/15">
          {[
            { value:"4337", prefix:"ERC-", label:"Standard",     sub:"No consensus change",   color:"text-[#FCD34D]" },
            { value:"0.7",  prefix:"v",    label:"EntryPoint",    sub:"Latest spec",           color:"text-white" },
            { value:"3",    suffix:"x",    label:"Core Modules",  sub:"Account·Paymaster·Keys",color:"text-[#00D4FF]" },
            { value:"0",    suffix:"gas",  label:"User Friction", sub:"Gasless onboarding",    color:"text-[#34D399]" },
          ].map((s,i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3+i*0.1 }}
              className="px-0 md:px-8 text-center md:text-left first:pl-0">
              <h3 className={`text-3xl md:text-5xl font-black mb-2 ${s.color} aa-heading`}>
                {s.prefix}{s.value}{s.suffix}
              </h3>
              <p className="text-white font-bold text-[10px] uppercase tracking-widest mb-1 aa-mono">{s.label}</p>
              <p className="text-slate-500 text-[9px] uppercase tracking-wider aa-mono">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          STICKY TABS
      ══════════════════════════════════════ */}
      <div className="sticky top-0 z-50 bg-[#04000A]/92 backdrop-blur-xl border-b border-[#F59E0B]/18">
        <div className="max-w-7xl mx-auto px-4 md:px-16 flex overflow-x-auto aa-scroll">
          {TABS.map((tb, i) => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className={`relative flex-shrink-0 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors aa-mono ${
                tab === tb.id ? "text-[#F59E0B]" : "text-slate-500 hover:text-white"
              }`}
            >
              <span className="opacity-30 mr-2">0{i+1}</span>{tb.label}
              {tab === tb.id && (
                <motion.div layoutId="aa-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F59E0B]"
                  style={{ boxShadow:"0 0 12px rgba(245,158,11,0.8)" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          CONTENT
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-20 min-h-[60vh]">
        <AnimatePresence mode="wait">

          {/* ─── TAB 1: Architecture ─── */}
          {tab === "arch" && (
            <motion.div key="arch" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-18 }}
              className="space-y-7">

              {/* EOA vs Smart Account comparison */}
              <VaultCard className="p-7 md:p-10">
                <h3 className="text-base font-black uppercase tracking-widest text-[#FCD34D] mb-7 text-center aa-mono">
                  EOA vs Smart Account
                </h3>
                <div className="overflow-x-auto aa-scroll">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left py-3 pr-6 text-slate-500 font-bold uppercase tracking-wider text-[10px] aa-mono">Feature</th>
                        <th className="text-left py-3 pr-6 text-slate-400 font-bold uppercase tracking-wider text-[10px] aa-mono">Traditional EOA</th>
                        <th className="text-left py-3 text-[#F59E0B] font-bold uppercase tracking-wider text-[10px] aa-mono">Smart Account (AA)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        ["Control",       "Single Private Key",      "Arbitrary Logic (Multi-sig, Social Recovery)"],
                        ["Gas Payment",   "ETH only",                "ETH, ERC-20, or Sponsored (Gasless)"],
                        ["Security",      "Seed Phrase Risk",        "Session Keys, Spending Limits"],
                        ["Upgradability", "Impossible",              "Possible (via Proxies)"],
                      ].map(([feat, eoa, aa], i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 pr-6 text-slate-400 font-semibold text-xs aa-mono">{feat}</td>
                          <td className="py-4 pr-6 text-slate-500 text-xs aa-body">{eoa}</td>
                          <td className="py-4 text-[#34D399] text-xs font-semibold aa-body">{aa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </VaultCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {/* SmartAccount.sol */}
                <VaultCard className="p-7 flex flex-col" glow="rgba(245,158,11,0.10)">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-black text-white aa-heading">Smart Account Core</h3>
                    <span className="text-2xl opacity-40">🔐</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 aa-body">
                    Implements <code className="text-[#FCD34D] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded text-[10px] aa-mono">IAccount</code> interface.
                    Handles nonce management, ECDSA signature validation, and execution — all in Solidity without SDK wrappers.
                  </p>
                  <div className="bg-[#020008] border border-[#F59E0B]/15 rounded-xl p-5 aa-mono text-xs space-y-2.5 mt-auto">
                    {[
                      ["Nonce Mgmt",   "Prevents replay attacks"],
                      ["Sig Validate", "Verifies owner / session key"],
                      ["Execute",      "Calls target if valid"],
                    ].map(([k,v]) => (
                      <div key={k} className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                        <span className="text-[#F59E0B] font-semibold w-28 flex-shrink-0">{k}:</span>
                        <span className="text-slate-300">{v}</span>
                      </div>
                    ))}
                  </div>
                </VaultCard>

                {/* Paymaster */}
                <VaultCard className="p-7 flex flex-col" glow="rgba(167,139,250,0.10)">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-black text-white aa-heading">Gas Sponsorship</h3>
                    <span className="text-2xl opacity-40">⛽</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 aa-body">
                    <code className="text-[#A78BFA] bg-[#A78BFA]/10 px-1.5 py-0.5 rounded text-[10px] aa-mono">SimplePaymaster.sol</code> deposits ETH into the EntryPoint.
                    Gas deducted from Paymaster, not the Smart Account — enabling true gasless UX.
                  </p>
                  <div className="bg-[#020008] border border-[#A78BFA]/15 rounded-xl p-5 aa-mono text-xs space-y-2.5 mt-auto">
                    {[
                      ["Decoupling",  "Sender ≠ Gas payer"],
                      ["ERC-20 Gas", "Pay fees in any token"],
                      ["Gasless",    "Pure Web2 onboarding"],
                    ].map(([k,v]) => (
                      <div key={k} className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                        <span className="text-[#A78BFA] font-semibold w-28 flex-shrink-0">{k}:</span>
                        <span className="text-slate-300">{v}</span>
                      </div>
                    ))}
                  </div>
                </VaultCard>
              </div>

              {/* Alt Mempool explanation */}
              <VaultCard className="p-7 md:p-10" glow="rgba(0,212,255,0.07)">
                <h3 className="text-base font-black uppercase tracking-widest text-[#00D4FF] mb-6 aa-mono">Why ERC-4337?</h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { icon:"🔀", title:"Alternative Mempool", desc:"UserOps go to a separate mempool — no Ethereum consensus change required." },
                    { icon:"📦", title:"Bundlers", desc:"Special nodes bundle UserOps into standard Ethereum txs and submit via handleOps()." },
                    { icon:"🎯", title:"EntryPoint Singleton", desc:"One contract coordinates all validation and execution across every Smart Account." },
                  ].map((item,i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <h4 className="text-white font-bold text-sm aa-heading">{item.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed aa-body">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </VaultCard>

            </motion.div>
          )}

          {/* ─── TAB 2: Transaction Flow ─── */}
          {tab === "flow" && (
            <motion.div key="flow" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-18 }}
              className="space-y-7">

              {/* Live UserOp pipeline */}
              <VaultCard className="p-0 overflow-hidden" glow="rgba(0,212,255,0.08)">
                <div className="px-7 pt-6 pb-3 border-b border-white/5 flex items-center justify-between bg-[#020008]">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest aa-mono">Live UserOp Pipeline</h3>
                  <span className="bg-[#00D4FF]/15 text-[#00D4FF] text-[9px] px-2.5 py-1 rounded font-bold uppercase tracking-wider animate-pulse aa-mono">Simulating</span>
                </div>
                <div className="bg-[#04000A] px-4 py-6">
                  <UserOpFlowCanvas />
                </div>
                <div className="px-7 pb-6 pt-2 bg-[#020008] border-t border-white/5 aa-mono text-[10px]">
                  <p className="text-slate-500 mb-1">{"// ERC-4337 standard lifecycle"}</p>
                  <p className="text-slate-400">Sign <span className="text-[#F59E0B]">UserOp</span> → Alt Mempool → Bundler → <span className="text-[#00D4FF]">EntryPoint.handleOps()</span> → Execute</p>
                </div>
              </VaultCard>

              {/* Validation signal canvas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <VaultCard className="p-0 overflow-hidden" glow="rgba(245,158,11,0.08)">
                  <div className="px-6 pt-5 pb-3 border-b border-white/5 bg-[#020008]">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest aa-mono">Validation Signal</h3>
                  </div>
                  <div className="bg-[#04000A] p-4">
                    <ValidationCanvas />
                  </div>
                </VaultCard>

                {/* Step breakdown */}
                <VaultCard className="p-7" glow="rgba(52,211,153,0.07)">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 aa-mono">Flow Breakdown</h3>
                  <div className="space-y-4">
                    {[
                      { n:"01", title:"UserOperation Signed",    desc:"User signs the packed UserOp with their private key or session key.",       color:"#F59E0B" },
                      { n:"02", title:"Bundler Aggregation",     desc:"Bundler picks up UserOps from alt mempool, simulates locally, calls handleOps.", color:"#A78BFA" },
                      { n:"03", title:"EntryPoint Validation",   desc:"Calls validateUserOp on Smart Account and validatePaymasterUserOp if Paymaster set.", color:"#00D4FF" },
                      { n:"04", title:"Smart Account Execution", desc:"If both validations pass, EntryPoint calls execute() on the Smart Account.", color:"#34D399" },
                    ].map((s,i) => (
                      <motion.div key={i}
                        initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.09 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-[#020008] border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <span className="text-2xl font-black flex-shrink-0 mt-0.5 aa-heading" style={{ color:s.color+"55" }}>
                          {s.n}
                        </span>
                        <div>
                          <h4 className="font-bold text-white text-sm mb-1 aa-heading">{s.title}</h4>
                          <p className="text-slate-400 text-xs leading-relaxed aa-body">{s.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </VaultCard>
              </div>

            </motion.div>
          )}

          {/* ─── TAB 3: Session Keys ─── */}
          {tab === "session" && (
            <motion.div key="session" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-18 }}
              className="space-y-7">

              <VaultCard className="p-7 md:p-10" glow="rgba(244,114,182,0.08)">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl">🔑</span>
                  <div>
                    <h3 className="text-xl font-black text-white aa-heading">Session Key Manager</h3>
                    <p className="text-[#F472B6] text-[10px] font-bold uppercase tracking-widest aa-mono">SessionKeyManager.sol</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-2xl aa-body">
                  Session keys allow users to generate a <strong className="text-white">temporary key with restricted permissions</strong> — e.g.
                  <em className="text-[#FCD34D]"> "Can only interact with Uniswap for the next 2 hours."</em> This removes constant wallet pop-ups
                  while maintaining cryptographic security.
                </p>

                <div className="grid sm:grid-cols-3 gap-5 mb-8">
                  {[
                    { title:"Time-Bound",      desc:"Session expires after a set duration — no manual revocation needed.",          color:"#F472B6" },
                    { title:"Scope-Limited",   desc:"Key can only call whitelisted contracts or functions.",                        color:"#FCD34D" },
                    { title:"Delegated Auth",  desc:"Owner can authorize without exposing their primary private key.",              color:"#A78BFA" },
                  ].map((item,i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#020008] border border-white/5 hover:border-white/10 transition-colors">
                      <h4 className="font-bold text-sm mb-2 aa-heading" style={{ color:item.color }}>{item.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed aa-body">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Script table from README */}
                <div className="overflow-x-auto aa-scroll">
                  <table className="w-full text-xs min-w-[400px]">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left py-3 pr-8 text-slate-500 uppercase tracking-wider aa-mono">Script</th>
                        <th className="text-left py-3 text-slate-500 uppercase tracking-wider aa-mono">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { cmd:"make deploy",   desc:"Deploys contracts and runs the full UserOp flow." },
                        { cmd:"make fix",      desc:"Retries the transaction using existing contracts (Saves Gas)." },
                        { cmd:"make balance",  desc:"Checks the wallet balance." },
                        { cmd:"forge test",    desc:"Runs all Foundry tests." },
                        { cmd:"EnableSessionKey.s.sol", desc:"Registers a session key with time + scope limits." },
                        { cmd:"SendUserOp.s.sol",       desc:"Constructs and transmits a packed UserOperation." },
                      ].map((r,i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 pr-8">
                            <code className="text-[#F59E0B] bg-[#F59E0B]/08 px-2 py-0.5 rounded aa-mono">{r.cmd}</code>
                          </td>
                          <td className="py-3 text-slate-400 aa-body">{r.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </VaultCard>

              {/* Disclaimer */}
              <div className="border-l-4 border-l-amber-500 bg-amber-500/5 p-6 rounded-r-2xl">
                <h4 className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-2 aa-mono">Disclaimer</h4>
                <p className="text-slate-300 text-sm leading-relaxed aa-body">
                  This repo is for <strong className="text-white">educational purposes and protocol exploration</strong>.
                  Core ERC-4337 features are implemented but the code has not been formally audited.
                  Do not deploy to production without a thorough security review.
                </p>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
