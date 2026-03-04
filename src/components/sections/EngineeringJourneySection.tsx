"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// ── 5D Particle Field — light aurora ──────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
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

    type P = { x: number; y: number; z: number; t: number; f: number; ox: number; oy: number };
    const COUNT = 72;
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * 1400, y: Math.random() * 800,
      z: Math.random(), t: Math.random() * Math.PI * 2,
      f: 0.3 + Math.random() * 0.7,
      ox: Math.random() * 1400, oy: Math.random() * 800,
    }));

    let time = 0;

    function draw() {
      if (!canvas || !ctx || W <= 0 || H <= 0) { rafRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);
      time += 0.005;

      const mx = mouse.current.x, my = mouse.current.y;

      for (const p of particles) {
        const ds = 0.4 + p.z * 0.6;
        p.x = p.ox + Math.sin(time * p.f + p.t) * 26 * ds;
        p.y = p.oy + Math.cos(time * p.f * 0.7 + p.t) * 16 * ds;
        // Mouse repel
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) { const f = (100 - dist) / 100 * 18; p.x += dx / dist * f; p.y += dy / dist * f; }
        // Slow origin drift
        p.ox += Math.sin(time * 0.1 + p.t) * 0.15 * ds;
        p.oy += Math.cos(time * 0.08 + p.t) * 0.1 * ds;
        if (p.ox < -60) p.ox = W + 30; if (p.ox > W + 60) p.ox = -30;
        if (p.oy < -60) p.oy = H + 30; if (p.oy > H + 60) p.oy = -30;
      }

      // Connections — two colour palette: blue #0055FF and teal #0ea5e9
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 105) {
            const alpha = (1 - d / 105) * 0.13 * ((a.z + b.z) / 2);
            // Blend: deep particles blue, shallow teal
            const t = (a.z + b.z) / 2;
            const r = Math.round(0 + t * 14), g = Math.round(85 + t * 80), bl = Math.round(255);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
            ctx.lineWidth = 0.5 + t * 0.6;
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of particles) {
        const r = 1.0 + p.z * 2.2;
        const alpha = 0.18 + p.z * 0.42;
        const pulse = 1 + Math.sin(time * p.f * 2 + p.t) * 0.25;
        // Two-colour: blue vs teal based on Z + F
        const useTeal = (p.z + p.f) % 2 > 1;
        const col = useTeal ? `rgba(14,165,233,${alpha})` : `rgba(0,85,255,${alpha})`;
        const glowCol = useTeal ? `rgba(14,165,233,` : `rgba(0,85,255,`;

        // Glow halo
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5 * pulse);
        grd.addColorStop(0, glowCol + `${alpha * 0.35})`);
        grd.addColorStop(1, glowCol + `0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, r * 5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();

        // Core
        ctx.beginPath(); ctx.arc(p.x, p.y, r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = col; ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    const parent = canvas.parentElement;
    function onMove(e: globalThis.MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onLeave() { mouse.current = { x: -999, y: -999 }; }
    parent?.addEventListener("mousemove", onMove);
    parent?.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      parent?.removeEventListener("mousemove", onMove);
      parent?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0, opacity: 0.55,
    }} />
  );
}

type JourneyContent = { heading: string; text: string };
type JourneyItem = {
  id: string; role: string; company: string; year: string;
  description: string; tech: string[]; accent: string;
  content: JourneyContent[];
};

function JourneyModal({ item, onClose }: { item: JourneyItem; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-6"
      style={{ background: "rgba(9,9,11,0.5)", backdropFilter: "blur(10px)" }}
    >
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 32, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px]"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.18)", borderTop: `3px solid ${item.accent}` }}
      >
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-8 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="p-7 sm:p-9">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span
                className="text-[9px] font-black uppercase tracking-[0.22em] px-2.5 py-1 rounded-full inline-block mb-3"
                style={{ color: item.accent, background: item.accent + "12", fontFamily: "ui-monospace, monospace" }}
              >
                {item.year}
              </span>
              <h2 className="text-2xl sm:text-[1.75rem] font-black tracking-tight text-gray-950 leading-tight"
                style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}>
                {item.role}
              </h2>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-1">{item.company}</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 flex items-center justify-center text-xs transition-colors flex-shrink-0 mt-1">
              ✕
            </button>
          </div>

          <div className="rounded-xl p-5 mb-6 border-l-[3px]"
            style={{ borderColor: item.accent, background: item.accent + "06" }}>
            <p className="text-[13.5px] leading-relaxed text-gray-700">{item.description}</p>
          </div>

          <p className="text-[9px] font-black uppercase tracking-[0.26em] text-gray-400 mb-4"
            style={{ fontFamily: "ui-monospace, monospace" }}>
            What I Learned
          </p>

          <div className="space-y-4 mb-7">
            {item.content.map((block, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + idx * 0.06 }}
                className="flex gap-3">
                <div className="w-[3px] rounded-full flex-shrink-0 mt-1"
                  style={{ background: item.accent + "60", alignSelf: "stretch", minHeight: 8 }} />
                <div>
                  <p className="text-[12.5px] font-bold text-gray-900 mb-0.5"
                    style={{ fontFamily: "'Georgia', serif" }}>
                    {block.heading}
                  </p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{block.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-5 border-t border-gray-100">
            {item.tech.map((t, idx) => (
              <span key={idx}
                className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                style={{ color: item.accent, background: item.accent + "10", border: `1px solid ${item.accent}20`, fontFamily: "ui-monospace, monospace" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EngineeringJourneySection({
  data = [],
  openModal,
}: {
  data?: any[];
  openModal?: (item: any, type: "skill" | "project") => void;
}) {
  const displayData = Array.isArray(data) && data.length > 0 ? data : [];
  const [activeItem, setActiveItem] = useState<JourneyItem | null>(null);

  if (displayData.length === 0) return null;

  return (
    <section style={{ background: "#FDFCF8", position: "relative", overflow: "hidden" }}>

      {/* 5D particle canvas */}
      <ParticleField />

      {/* Aurora blobs — blue + teal two-colour */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.14, 1], x: [0, 22, 0], y: [0, -14, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-10%", left: "-5%",
            width: "48vw", height: "48vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,85,255,0.065) 0%, transparent 68%)",
            filter: "blur(64px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -18, 0], y: [0, 16, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          style={{
            position: "absolute", bottom: "-8%", right: "-4%",
            width: "40vw", height: "40vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,165,233,0.065) 0%, transparent 68%)",
            filter: "blur(72px)",
          }}
        />
      </div>
      {/* Exact same container as Education: maxWidth 1200, same clamp padding */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(32px,4vw,56px) clamp(20px,5vw,56px)", position: "relative", zIndex: 1 }}>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ borderTop: "1px solid #ede9e2", paddingTop: "clamp(28px,4vw,48px)", marginBottom: "clamp(28px,4vw,44px)" }}
        >
          <h2
            style={{
              fontFamily: "'Georgia', 'Playfair Display', serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#09090B",
              marginBottom: 10,
            }}
          >
            Engineering{" "}
            <span style={{
              background: "linear-gradient(120deg, #0055FF, #059669)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Work.
            </span>
          </h2>
          <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.65, maxWidth: 400 }}>
            Everything built solo. Click any phase to see what went into it.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {displayData.map((job: JourneyItem, i: number) => (
            <motion.div
              key={job.id || i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.998 }}
                onClick={() => setActiveItem(job)}
                transition={{ duration: 0.18 }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "#ffffff",
                  border: "1px solid #ede9e2",
                  borderRadius: 16,
                  padding: "clamp(18px,2.5vw,28px)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                }}
              >
                {/* Left accent on hover */}
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  whileHover={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: 3, background: job.accent,
                    transformOrigin: "top", borderRadius: "16px 0 0 16px",
                  }}
                />

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Year + company */}
                    <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 800, textTransform: "uppercase" as const,
                        letterSpacing: "0.22em", padding: "3px 10px", borderRadius: 20,
                        color: job.accent, background: job.accent + "12",
                        fontFamily: "ui-monospace, monospace",
                      }}>
                        {job.year}
                      </span>
                      <span style={{ fontSize: 10, color: "#a1a1aa", fontFamily: "ui-monospace, monospace" }}>
                        {job.company}
                      </span>
                    </div>

                    {/* Role */}
                    <h3 style={{
                      fontFamily: "'Georgia', 'Playfair Display', serif",
                      fontSize: "clamp(1.1rem,2vw,1.3rem)",
                      fontWeight: 800,
                      color: "#09090B",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                      marginBottom: 8,
                    }}>
                      {job.role}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.7, maxWidth: 560, marginBottom: 14 }}>
                      {job.description}
                    </p>

                    {/* Tech tags */}
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                      {(job.tech || []).map((t: string) => (
                        <span key={t} style={{
                          fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const,
                          letterSpacing: "0.14em", padding: "4px 10px", borderRadius: 6,
                          color: job.accent, background: job.accent + "0e",
                          border: `1px solid ${job.accent}22`,
                          fontFamily: "ui-monospace, monospace",
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      flexShrink: 0, width: 32, height: 32,
                      borderRadius: "50%", border: `1px solid ${job.accent}35`,
                      color: job.accent, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 14, marginTop: 2,
                    }}
                  >
                    →
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeItem && (
          <JourneyModal item={activeItem} onClose={() => setActiveItem(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
