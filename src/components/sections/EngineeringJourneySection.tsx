"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

type Lesson = {
  id: string;
  num: string;
  title: string;
  body: string;
  accent: string;
  rgb: string;
};

const LESSONS: Lesson[] = [
  {
    id: "l1",
    num: "01",
    title: "Security is a design decision, not a checklist.",
    body: "Early on I treated security as something you bolt on after the logic works. Run Slither, patch the warnings, ship it. That changed when I built flash-loan resistant governance. The attack was not in any line of code I had written. It was in the architecture itself: if you use current block balances for voting weight, an attacker can borrow a billion tokens, pass a proposal, and repay the loan in a single transaction. The fix is one line. But you only write that line if you modeled the attack before you wrote the first function. I now treat threat modeling as the first step of design, not a review at the end.",
    accent: "#2563EB",
    rgb: "37,99,235",
  },
  {
    id: "l2",
    num: "02",
    title: "Composability means inheriting someone else's failure modes.",
    body: "Integrating Aave V3 into the insurance vault looked clean until I had to think through what happens when Aave pauses a reserve mid-claim. Or when a price feed goes stale during a high-volatility window. Or when a liquidation cascade drops collateral value faster than the oracle updates. None of those are my bugs. But they become my protocol's problem the moment I compose on top of Aave. I started reading every integration contract the way I read my own code: not just the happy path, but every revert path, and what my contract's state looks like after each one.",
    accent: "#0891B2",
    rgb: "8,145,178",
  },
  {
    id: "l3",
    num: "03",
    title: "Unit tests prove your assumptions. Fork tests prove reality.",
    body: "I had 95 unit tests passing on Nexus perpetuals cross-chain margin and still shipped a nonce deduplication bug. A replayed CCIP message could add margin twice to the same position. The bug was invisible in unit tests because I was mocking the cross-chain layer. It only appeared when I ran a fork test with two live-state chains and real message passing. That was the moment I understood the difference between testing your model of the system and testing the actual system. Fork tests are not optional on anything that touches an external protocol.",
    accent: "#D97706",
    rgb: "217,119,6",
  },
  {
    id: "l4",
    num: "04",
    title: "Storage layout is architecture. Design it first.",
    body: "I built the RST reputation scoring logic first, then decided mid-way to make it UUPS upgradeable. That meant stopping and auditing every storage slot for collision risk with the proxy's layout, then restructuring the contract to be upgrade-safe. It cost more time than writing the original logic. The lesson was blunt: if a contract will ever be upgraded, the storage layout is the first decision you make, not something you retrofit. V2 and V3 used explicit storage gap arrays from the first line. A constraint that is understood at the start costs nothing. The same constraint discovered after deployment is either a migration or a redeployment.",
    accent: "#059669",
    rgb: "5,150,105",
  },
];

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; z: number; t: number; f: number; ox: number; oy: number };
    const pts: P[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * 1400, y: Math.random() * 900,
      z: Math.random(), t: Math.random() * Math.PI * 2,
      f: 0.3 + Math.random() * 0.5,
      ox: Math.random() * 1400, oy: Math.random() * 900,
    }));

    let time = 0;
    const draw = () => {
      if (W <= 0 || H <= 0) { rafRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);
      time += 0.0025;
      for (const p of pts) {
        const ds = 0.4 + p.z * 0.6;
        p.x = p.ox + Math.sin(time * p.f + p.t) * 18 * ds;
        p.y = p.oy + Math.cos(time * p.f * 0.7 + p.t) * 12 * ds;
        p.ox += Math.sin(time * 0.08 + p.t) * 0.08 * ds;
        p.oy += Math.cos(time * 0.06 + p.t) * 0.055 * ds;
        if (p.ox < -50) p.ox = W + 20;
        if (p.ox > W + 50) p.ox = -20;
        if (p.oy < -50) p.oy = H + 20;
        if (p.oy > H + 50) p.oy = -20;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(8,145,178,${(1 - d / 80) * 0.05 * ((pts[i].z + pts[j].z) / 2)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.5 + p.z * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(8,145,178,${0.06 + p.z * 0.18})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.28 }}
    />
  );
}

function LessonCard({ lesson, index }: { lesson: Lesson; index: number }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.999 }}
        className="w-full text-left rounded-2xl bg-white relative overflow-hidden"
        style={{
          border: `1px solid ${hov || open ? `rgba(${lesson.rgb},0.2)` : "rgba(0,0,0,0.06)"}`,
          boxShadow: open
            ? `0 14px 40px rgba(${lesson.rgb},0.1)`
            : hov
            ? `0 6px 24px rgba(${lesson.rgb},0.07)`
            : "0 2px 8px rgba(0,0,0,0.03)",
          transition: "border-color 0.25s, box-shadow 0.25s",
        }}
      >
        {/* Left accent bar */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
          animate={{ opacity: hov || open ? 1 : 0, scaleY: hov || open ? 1 : 0.2 }}
          style={{ background: lesson.accent, transformOrigin: "center" }}
          transition={{ duration: 0.2 }}
        />

        <div className="p-5 sm:p-7 pl-6 sm:pl-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span
                className="font-black select-none leading-none block mb-3"
                style={{ color: `rgba(${lesson.rgb},0.09)`, fontSize: "2.6rem", fontFamily: "monospace" }}
              >
                {lesson.num}
              </span>
              <h3
                className="text-base sm:text-lg font-black text-zinc-900 tracking-tight leading-snug transition-colors duration-200"
                style={{ color: hov || open ? lesson.accent : undefined }}
              >
                {lesson.title}
              </h3>
            </div>

            <motion.div
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border mt-1 text-xs font-bold"
              animate={{
                borderColor: hov || open ? lesson.accent : "rgba(0,0,0,0.1)",
                color: hov || open ? lesson.accent : "rgba(0,0,0,0.2)",
                rotate: open ? 90 : 0,
              }}
              transition={{ duration: 0.22 }}
            >
              {">"}
            </motion.div>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="text-[13px] sm:text-[14px] text-zinc-500 leading-[1.95] mt-5 pt-5 border-t border-zinc-100 font-medium">
                  {lesson.body}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </motion.div>
  );
}

export default function EngineeringJourneySection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#FDFCF8", borderTop: "1px solid #ede9e2" }}>
      <ParticleField />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], x: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-8%] w-[45vw] h-[45vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(8,145,178,0.05) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1], x: [0, -14, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(5,150,105,0.04) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 py-20 sm:py-28">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight mb-4" style={{ fontFamily: "'Georgia', serif" }}>
            What building{" "}
            <span style={{
              background: "linear-gradient(100deg, #2563EB 0%, #0891B2 55%, #059669 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              taught me.
            </span>
          </h2>
         
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {LESSONS.map((lesson, i) => (
            <LessonCard key={lesson.id} lesson={lesson} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="font-mono text-[9px] text-zinc-300 text-center mt-14 tracking-[0.22em] uppercase"
        >
          Every lesson came from a mistake first
        </motion.p>
      </div>
    </section>
  );
}