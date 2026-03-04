"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, MouseEvent } from "react";

// ── 5D Particle Field ─────────────────────────────────────────────────────
// X, Y = position | Z = depth/size | T = time phase | F = frequency/speed
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;

    function resize() {
      if (!canvas) return;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    // 3 colours: blue #0055FF, teal #0ea5e9, rose-pink #f43f5e
    const PALETTE: [number,number,number][] = [[0,85,255],[14,165,233],[244,63,94]];
    type P = { x:number;y:number;z:number;t:number;f:number;ox:number;oy:number;col:number };
    const COUNT = 52;
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random()*1400, y: Math.random()*700,
      z: Math.random(), t: Math.random()*Math.PI*2,
      f: 0.3+Math.random()*0.7,
      ox: Math.random()*1400, oy: Math.random()*700,
      col: Math.floor(Math.random()*3),
    }));

    let time = 0;

    function draw() {
      if (!canvas||!ctx||W<=0||H<=0) { rafRef.current=requestAnimationFrame(draw); return; }
      ctx.clearRect(0,0,W,H);
      time += 0.005;
      const mx=mouse.current.x, my=mouse.current.y;

      for (const p of particles) {
        const ds=0.4+p.z*0.6;
        p.x=p.ox+Math.sin(time*p.f+p.t)*26*ds;
        p.y=p.oy+Math.cos(time*p.f*0.7+p.t)*17*ds;
        const dx=p.x-mx,dy=p.y-my,dist=Math.sqrt(dx*dx+dy*dy);
        if (dist<110&&dist>0){const f=(110-dist)/110*20;p.x+=dx/dist*f;p.y+=dy/dist*f;}
        p.ox+=Math.sin(time*0.11+p.t)*0.16*ds;
        p.oy+=Math.cos(time*0.08+p.t)*0.11*ds;
        if(p.ox<-80)p.ox=W+40;if(p.ox>W+80)p.ox=-40;
        if(p.oy<-80)p.oy=H+40;if(p.oy>H+80)p.oy=-40;
      }

      // Connections
      for (let i=0;i<COUNT;i++) for (let j=i+1;j<COUNT;j++) {
        const a=particles[i],b=particles[j];
        const dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
        if (d<108) {
          const alpha=(1-d/108)*0.07*((a.z+b.z)/2);
          const [r,g,bl]=PALETTE[a.col];
          ctx.beginPath();
          ctx.strokeStyle=`rgba(${r},${g},${bl},${alpha})`;
          ctx.lineWidth=0.5+(a.z+b.z)*0.28;
          ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }

      // Dots + glow
      for (const p of particles) {
        const r=1.1+p.z*2.2, alpha=0.08+p.z*0.22;
        const pulse=1+Math.sin(time*p.f*2+p.t)*0.26;
        const [cr,cg,cb]=PALETTE[p.col];

        const grd=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*5*pulse);
        grd.addColorStop(0,`rgba(${cr},${cg},${cb},${alpha*0.35})`);
        grd.addColorStop(1,`rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();ctx.arc(p.x,p.y,r*5*pulse,0,Math.PI*2);
        ctx.fillStyle=grd;ctx.fill();

        ctx.beginPath();ctx.arc(p.x,p.y,r*pulse,0,Math.PI*2);
        ctx.fillStyle=`rgba(${cr},${cg},${cb},${alpha})`;ctx.fill();
      }

      rafRef.current=requestAnimationFrame(draw);
    }

    draw();

    const el = canvas.parentElement;
    function onMove(e: globalThis.MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    el?.addEventListener("mousemove", onMove);
    const onLeave = () => { mouse.current = { x: -999, y: -999 }; };
    el?.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      el?.removeEventListener("mousemove", onMove);
      el?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
        opacity: 0.5,
      }}
    />
  );
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
    display: "NexTechArchitect",
    sub: "t.me",
    href: "https://t.me/NexTechArchitect",
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
      <ParticleField />

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
