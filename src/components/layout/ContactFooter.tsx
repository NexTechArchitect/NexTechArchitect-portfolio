"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, MouseEvent, useCallback } from "react";
import Link from "next/link";

/* ════════════════════════════════════════════════════════════════
   SENTINEL INSURANCE PROTOCOL — Liquid Metal Edition
   Palette: void-black · electric-cyan · frost-white
   Vibe: institutional dark · cinematic depth · surgical precision
════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --void:#04060e;
  --surface:#080c18;
  --surface2:#0c1120;
  --cyan:#00e5ff;
  --cyan2:#0ea5e9;
  --frost:rgba(255,255,255,0.92);
  --muted:rgba(148,163,184,0.7);
  --border:rgba(255,255,255,0.06);
  --border2:rgba(0,229,255,0.15);
}
.syne{font-family:'Syne',sans-serif;}
.mono{font-family:'JetBrains Mono',monospace;}
html,body{background:var(--void);color:#e2e8f0;overflow-x:hidden;}
.hide-scroll::-webkit-scrollbar{display:none;}
.hide-scroll{-ms-overflow-style:none;scrollbar-width:none;}

.glass{
  background:rgba(8,12,24,0.7);
  backdrop-filter:blur(24px) saturate(160%);
  -webkit-backdrop-filter:blur(24px) saturate(160%);
  border:1px solid var(--border);
}
.glass-cyan{
  background:rgba(8,12,24,0.75);
  backdrop-filter:blur(20px);
  border:1px solid var(--border2);
  box-shadow:0 0 40px rgba(0,229,255,0.04),inset 0 1px 0 rgba(0,229,255,0.08);
}

.gtext{
  background:linear-gradient(120deg,#fff 0%,var(--cyan) 50%,var(--cyan2) 100%);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}
.gtext-sm{
  background:linear-gradient(90deg,var(--cyan) 0%,#fff 100%);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}

@keyframes scanline{
  0%{transform:translateY(-100%);}
  100%{transform:translateY(100vh);}
}
.scanline{
  position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(0,229,255,0.08),transparent);
  animation:scanline 8s linear infinite;
  pointer-events:none;z-index:100;
}

@keyframes flicker{0%,100%{opacity:1;}92%{opacity:1;}93%{opacity:0.85;}94%{opacity:1;}}
.flicker{animation:flicker 7s ease infinite;}

.tab-btn{
  position:relative;
  padding:12px 20px;
  font-size:10px;letter-spacing:0.2em;text-transform:uppercase;
  font-family:'JetBrains Mono',monospace;font-weight:600;
  color:rgba(148,163,184,0.6);
  border:none;background:none;cursor:pointer;
  transition:color 0.2s;white-space:nowrap;
}
.tab-btn:hover{color:rgba(255,255,255,0.8);}
.tab-btn.active{color:#00e5ff;}
.tab-btn::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:var(--cyan);opacity:0;transform:scaleX(0.5);
  transition:opacity 0.2s,transform 0.2s;
}
.tab-btn.active::after{opacity:1;transform:scaleX(1);}

.contract-row{
  display:flex;align-items:center;gap:12px;
  padding:12px 16px;
  border:1px solid var(--border);
  border-radius:8px;
  background:rgba(255,255,255,0.02);
  transition:background 0.2s,border-color 0.2s;
}
.contract-row:hover{background:rgba(0,229,255,0.03);border-color:var(--border2);}

.pill{
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 12px;border-radius:20px;
  font-family:'JetBrains Mono',monospace;
  font-size:9px;font-weight:600;letter-spacing:0.14em;
  text-transform:uppercase;
}

@media(max-width:640px){
  .tab-btn{padding:10px 14px;font-size:9px;}
}
`;

// ── WebGL Canvas — Liquid Metal Shield ──────────────────────────────
function ShieldCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W = (cv.width = cv.offsetWidth * window.devicePixelRatio);
    let H = (cv.height = cv.offsetHeight * window.devicePixelRatio);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const w = cv.offsetWidth, h = cv.offsetHeight;

    let raf: number, t = 0;
    const mouse = { x: w / 2, y: h / 2 };

    // Particles — layered depth
    interface P { x: number; y: number; z: number; vx: number; vy: number; size: number; tier: number; phase: number; }
    const isMob = w < 640;
    const count = isMob ? 60 : 120;
    const particles: P[] = Array.from({ length: count }, () => {
      const tier = Math.random() < 0.08 ? 0 : Math.random() < 0.25 ? 1 : 2;
      return {
        x: Math.random() * w, y: Math.random() * h,
        z: Math.random(),
        vx: (Math.random() - 0.5) * (tier === 0 ? 0.12 : 0.22),
        vy: (Math.random() - 0.5) * (tier === 0 ? 0.08 : 0.18),
        size: tier === 0 ? 2.5 + Math.random() * 2 : tier === 1 ? 1.2 + Math.random() : 0.5 + Math.random() * 0.6,
        tier, phase: Math.random() * Math.PI * 2,
      };
    });

    // Ring system
    const rings = [
      { r: isMob ? 70 : 110, speed: 0.28, tilt: 0.32, color: [0, 229, 255] as [number, number, number], width: 0.8, alpha: 0.18 },
      { r: isMob ? 52 : 82,  speed: -0.42, tilt: 0.65, color: [14, 165, 233] as [number, number, number], width: 0.6, alpha: 0.14 },
      { r: isMob ? 36 : 58,  speed: 0.6,  tilt: 0.88, color: [255, 255, 255] as [number, number, number], width: 0.5, alpha: 0.10 },
    ];

    function project(x: number, y: number, z: number) {
      const fov = isMob ? 260 : 320;
      // Math.max guarantees scale never goes negative
      const s = Math.max(0.01, fov / (fov + z * 60));
      return { x: w / 2 + x * s, y: h / 2 + y * s, s };
    }

    function drawRing(ring: typeof rings[0], spin: number) {
      if (!ctx) return; // FIX: TypeScript null check
      const steps = 80;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const rx = Math.cos(a) * ring.r;
        const ry = Math.sin(a) * ring.r;
        const y3 = ry * Math.cos(ring.tilt);
        const z3 = ry * Math.sin(ring.tilt);
        const x3 = rx * Math.cos(spin) - z3 * Math.sin(spin);
        const zf = rx * Math.sin(spin) + z3 * Math.cos(spin);
        const p = project(x3, y3, zf);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      const [r, g, b] = ring.color;
      // depth-aware glow — closer = brighter
      const mx2 = (mouse.x - w / 2) / (w / 2);
      const my2 = (mouse.y - h / 2) / (h / 2);
      const glowBoost = 1 + Math.abs(mx2) * 0.4 + Math.abs(my2) * 0.2;
      ctx.strokeStyle = `rgba(${r},${g},${b},${ring.alpha * glowBoost})`;
      ctx.lineWidth = ring.width;
      ctx.stroke();
    }

    function drawOrbiter(ring: typeof rings[0], spin: number, progress: number, size: number) {
      if (!ctx) return; // FIX: TypeScript null check
      const a = progress * Math.PI * 2;
      const rx = Math.cos(a) * ring.r;
      const ry = Math.sin(a) * ring.r;
      const y3 = ry * Math.cos(ring.tilt);
      const z3 = ry * Math.sin(ring.tilt);
      const x3 = rx * Math.cos(spin) - z3 * Math.sin(spin);
      const zf = rx * Math.sin(spin) + z3 * Math.cos(spin);
      const p = project(x3, y3, zf);
      const [r, g, b] = ring.color;

      // FIX: Guard against negative radii to prevent IndexSizeError
      const haloRadius = Math.max(0.1, size * 7 * p.s);
      const coreRadius = Math.max(0.1, size * p.s);

      // glow halo
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloRadius);
      grd.addColorStop(0, `rgba(${r},${g},${b},0.55)`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
      ctx.fill();

      // trail
      for (let k = 1; k <= 8; k++) {
        const ta = a - k * 0.14;
        const trx = Math.cos(ta) * ring.r, try_ = Math.sin(ta) * ring.r;
        const ty3 = try_ * Math.cos(ring.tilt), tz3 = try_ * Math.sin(ring.tilt);
        const tx3 = trx * Math.cos(spin) - tz3 * Math.sin(spin);
        const tzf = trx * Math.sin(spin) + tz3 * Math.cos(spin);
        const tp = project(tx3, ty3, tzf);
        
        ctx.beginPath();
        // FIX: Guard against negative radii
        const trailRadius = Math.max(0.1, Math.max(0.2, (size - k * 0.28)) * tp.s);
        ctx.arc(tp.x, tp.y, trailRadius, 0, Math.PI * 2);
        
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.max(0, 0.55 - k * 0.07)})`;
        ctx.fill();
      }
    }

    cv.addEventListener("mousemove", (e) => {
      const rect = cv.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    const draw = () => {
      if (!ctx) return; // FIX: TypeScript null check
      t += 0.008;
      ctx.clearRect(0, 0, w, h);

      // Deep space background gradient
      const bgGrd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      bgGrd.addColorStop(0, "rgba(4,12,28,0.3)");
      bgGrd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, w, h);

      // Mouse-reactive ambient glow at center
      const mx = (mouse.x - w / 2) / (w / 2);
      const my2 = (mouse.y - h / 2) / (h / 2);
      const tiltX = my2 * 0.25;
      const tiltY = mx * 0.25;

      // rings
      rings.forEach((ring, i) => {
        const spin = t * ring.speed + tiltY;
        drawRing({ ...ring, tilt: ring.tilt + tiltX }, spin);
        drawOrbiter(
          { ...ring, tilt: ring.tilt + tiltX },
          spin,
          ((t * (0.15 + i * 0.04)) % 1 + (i * 0.33)) % 1,
          3.5 - i * 0.6
        );
      });

      // Central core
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.8);
      const coreR = Math.max(0.1, 10 + pulse * 4); // FIX: Guard negative radius
      const coreGrd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, coreR * 5);
      coreGrd.addColorStop(0, `rgba(0,229,255,${0.7 * pulse})`);
      coreGrd.addColorStop(0.4, `rgba(0,229,255,${0.2 * pulse})`);
      coreGrd.addColorStop(1, "rgba(0,229,255,0)");
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, coreR * 5, 0, Math.PI * 2);
      ctx.fillStyle = coreGrd;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.8 + 0.2 * pulse})`;
      ctx.fill();

      // Floating particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const pulse2 = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.4 + p.phase));

        if (p.tier === 0) {
          // Bright accent node
          const pRadius = Math.max(0.1, p.size * 5); // FIX: Guard negative radius
          const pRadiusInner = Math.max(0.1, p.size * 0.6); // FIX: Guard negative radius
          
          const grd2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pRadius);
          grd2.addColorStop(0, `rgba(0,229,255,${0.6 * pulse2})`);
          grd2.addColorStop(1, "rgba(0,229,255,0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, pRadius, 0, Math.PI * 2);
          ctx.fillStyle = grd2;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, pRadiusInner, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.9 * pulse2})`;
          ctx.fill();
        } else if (p.tier === 1) {
          const pRadius = Math.max(0.1, p.size);
          ctx.beginPath();
          ctx.arc(p.x, p.y, pRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(14,165,233,${0.35 * pulse2})`;
          ctx.fill();
        } else {
          const pRadius = Math.max(0.1, p.size);
          ctx.beginPath();
          ctx.arc(p.x, p.y, pRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100,116,139,${0.18 * pulse2})`;
          ctx.fill();
        }

        // Connect nearby tier-0/1 nodes
        if (p.tier <= 1) {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            if (q.tier > 1) continue;
            const dx = p.x - q.x, dy = p.y - q.y;
            const d2 = dx * dx + dy * dy;
            const thr = isMob ? 6000 : 10000;
            if (d2 < thr) {
              const alpha = (1 - d2 / thr) * 0.12;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
              ctx.lineWidth = 0.4;
              ctx.stroke();
            }
          }
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      if (!cv || !ctx) return; // FIX: TypeScript null check
      W = cv.width = cv.offsetWidth * window.devicePixelRatio;
      H = cv.height = cv.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={ref} className={`${className} w-full h-full absolute inset-0 pointer-events-none z-0 opacity-50`} />;
}

// ── 3D tilt card ──────────────────────────────────────────────────────────
function TiltCard({
  href, children, delay = 0,
}: { href: string; children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() { x.set(0); y.set(0); }

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX, rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 800,
        textDecoration: "none",
        display: "block",
      }}
    >
      {children}
    </motion.a>
  );
}

const contacts = [
  {
    label: "Email",
    display: "Get in touch",
    sub: "amitthapa181133@gmail.com",
    href: "mailto:amitthapa181133@gmail.com",
    accent: "#0055FF",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    display: "NexTechArchitect",
    sub: "github.com",
    href: "https://github.com/NexTechArchitect",
    accent: "#334155",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    display: "@itZ_AmiT0",
    sub: "x.com",
    href: "https://x.com/itZ_AmiT0",
    accent: "#1e293b",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L2.25 2.25h6.978l4.259 5.631 5.757-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "Telegram",
    display: "NexTechDev",
    sub: "t.me",
    href: "https://t.me/NexTechDev",
    accent: "#0ea5e9",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.94c-.12.56-.46.7-.93.43l-2.56-1.89-1.24 1.19c-.14.13-.25.25-.51.25l.18-2.58 4.65-4.2c.2-.18-.04-.28-.31-.1L7.6 14.47 5.08 13.7c-.55-.17-.56-.55.12-.82l8.92-3.44c.46-.17.86.11.52.82z"/>
      </svg>
    ),
  },
];

export default function ContactFooter() {
  return (
    <footer style={{ background: "#F8F9F6", position: "relative", overflow: "hidden" }}>

      {/* 5D Particle canvas */}
      <ShieldCanvas />

      {/* Aurora blobs — blue, teal, rose — 3 colour mix */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.14, 1], x: [0, 20, 0], y: [0, -14, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-12%", left: "-6%",
            width: "46vw", height: "46vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,85,255,0.05) 0%, transparent 68%)",
            filter: "blur(72px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -16, 0], y: [0, 20, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{
            position: "absolute", top: "10%", right: "-4%",
            width: "38vw", height: "38vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,165,233,0.045) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 12, 0], y: [0, -10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 8 }}
          style={{
            position: "absolute", bottom: "-8%", left: "30%",
            width: "34vw", height: "34vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,63,94,0.03) 0%, transparent 68%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(56px,8vw,96px) clamp(20px,5vw,56px) clamp(32px,4vw,48px)", position: "relative", zIndex: 1 }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "clamp(40px,6vw,64px)", borderTop: "1px solid #e5e4df", paddingTop: "clamp(32px,4vw,52px)" }}
        >
          <p style={{
            fontFamily: "ui-monospace, monospace", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.28em", textTransform: "uppercase" as const,
            color: "#a1a1aa", marginBottom: 18,
          }}>
            Open to work
          </p>

          <h2 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
            fontWeight: 900, letterSpacing: "-0.04em",
            lineHeight: 1.0, color: "#09090B", marginBottom: 16,
          }}>
            Let&apos;s build<br />
            <span className="footer-gradient-text">
              something real.
            </span>
          </h2>

          {/* Inline style for gradient text — avoids framer-motion background/backgroundClip conflict */}
          <style>{`
            .footer-gradient-text {
              background: linear-gradient(110deg, #0055FF 0%, #0ea5e9 55%, #06b6d4 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
          `}</style>

          <p style={{ fontSize: 15, color: "#71717a", lineHeight: 1.7, maxWidth: 420 }}>
            Smart contract engineer, full-stack Web3 dev. If you're building something serious — reach out.
          </p>
        </motion.div>

        {/* Contact cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: "clamp(40px,6vw,64px)",
        }}>
          {contacts.map((c, i) => (
            <TiltCard key={c.label} href={c.href} delay={i * 0.07}>
              <motion.div
                whileHover={{ boxShadow: `0 16px 40px ${c.accent}12, 0 2px 12px rgba(0,0,0,0.04)`, borderColor: c.accent + "30" }}
                transition={{ duration: 0.2 }}
                style={{
                  background: "#fefefe",
                  border: "1px solid #ede9e2",
                  borderRadius: 20,
                  padding: "24px 22px 22px",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                }}
              >
                {/* Accent top flash on hover */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, ${c.accent}, ${c.accent}88)`,
                    transformOrigin: "left",
                    borderRadius: "18px 18px 0 0",
                  }}
                />

                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: c.accent + "10",
                  border: `1px solid ${c.accent}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: c.accent, marginBottom: 14,
                }}>
                  {c.icon}
                </div>

                {/* Label */}
                <p style={{
                  fontFamily: "ui-monospace, monospace", fontSize: 9,
                  fontWeight: 700, textTransform: "uppercase" as const,
                  letterSpacing: "0.2em", color: "#a1a1aa", marginBottom: 4,
                }}>
                  {c.label}
                </p>

                {/* Display name */}
                <p style={{
                  fontFamily: "'Georgia', serif", fontSize: 16,
                  fontWeight: 800, color: "#09090B",
                  letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 2,
                }}>
                  {c.display}
                </p>

                <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, color: "#a1a1aa" }}>
                  {c.sub}
                </p>

                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: "absolute", bottom: 18, right: 18,
                    color: c.accent, fontSize: 16, fontWeight: 700,
                  }}
                >
                  ↗
                </motion.div>
              </motion.div>
            </TiltCard>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            borderTop: "1px solid #e8e6e0", paddingTop: 20,
            display: "flex", flexWrap: "wrap" as const,
            alignItems: "center", justifyContent: "space-between", gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                display: "inline-block", width: 7, height: 7,
                borderRadius: "50%", background: "#22c55e",
                boxShadow: "0 0 0 3px rgba(34,197,94,0.18)",
              }}
            />
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, color: "#a1a1aa", letterSpacing: "0.14em", textTransform: "uppercase" as const }}>
              Available
            </span>
          </div>

          <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, color: "#c4c4bf", letterSpacing: "0.1em" }}>
            © {new Date().getFullYear()} Amit · NexTech Architect
          </p>
        </motion.div>

      </div>
    </footer>
  );
}