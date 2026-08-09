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

// ─── HIGH-END ENGINEERING ARCHITECTURE INSIGHTS ──────────────────────────────
const LESSONS: Lesson[] = [
  {
    id: "l1",
    num: "01",
    title: "Threat-Modeled Architecture & Flash-Loan Immunity",
    body: "When building the Sentinel DAO, I initially assumed tracking balances via current block.number was sufficient to prevent same-block manipulation. It isn't. Sophisticated attackers can structure a massive flash-loan borrow and a governance proposal within the exact same transaction. The architectural fix was shifting to block.number - 1 for all voting weight snapshots, structurally neutralizing flash-loan governance attacks at the consensus layer. True security isn't about auditing the happy path; it's about mapping every hostile execution vector before writing the first interface.",
    accent: "#2563EB", // Blue
    rgb: "37,99,235",
  },
  {
    id: "l2",
    num: "02",
    title: "O(1) Gas Efficiency & Yul Assembly Optimization",
    body: "Smart contracts face strict block gas limits. In the On-Chain Automation Protocol, a standard loop for iterating and executing automated keeper jobs would eventually trigger out-of-gas reverts as the network scaled. I completely eliminated bounded loops by engineering a highly optimized O(1) swap-and-pop batch queue. By leveraging EVM inline assembly (Yul) for critical state transitions and tightly packing the storage layout, I reduced execution gas overhead by up to 35%. Efficiency isn't a refactor step; it is the foundation of scalable EVM infrastructure.",
    accent: "#059669", // Emerald
    rgb: "5,150,105",
  },
  {
    id: "l3",
    num: "03",
    title: "Stateless On-Chain Compliance for Real-World Assets",
    body: "Regulated assets require strict KYC and OFAC sanction checks. The industry standard is relying on centralized, off-chain API approvals for every transfer, which bottlenecks decentralization. I built a fundamentally different model for the Nexus RWA Protocol: a stateless Compliance Engine that intercepts ERC-20 transfer hooks to evaluate cryptographic identity commitments entirely on-chain in real-time. True Web3 infrastructure must abstract legal complexity into immutable, zero-trust code without relying on slow off-chain servers.",
    accent: "#0891B2", // Cyan
    rgb: "8,145,178",
  },
  {
    id: "l4",
    num: "04",
    title: "Asynchronous Cross-Chain State & Account Abstraction",
    body: "Building the Nexus Perpetuals 50x leverage non-custodial DEX revealed the true complexity of fragmented liquidity. Integrating Chainlink CCIP for cross-chain margin wasn't just about sending messages; it was about strict nonce deduplication. A delayed or replayed message could double-credit a margin account. By implementing local state-locking and custom ERC-4337 smart account paymasters, I ensured cross-chain execution remained gasless and mathematically sound against replay attacks.",
    accent: "#D97706", // Amber
    rgb: "217,119,6",
  },
  {
    id: "l5",
    num: "05",
    title: "Immutable Storage Layouts in UUPS Proxy Patterns",
    body: "When engineering the ERC-5484 Reputation System, I transitioned the scoring engine to an EIP-1822 UUPS Proxy to allow future logic upgrades. This requires absolute precision: one misaligned storage slot in a future V2 implementation will permanently corrupt the entire protocol's state. I now architect every upgradeable contract with strict storage gap arrays and collision-safe layout mappings from day one. Storage layout is a permanent constraint you design around, not a property you check after deployment.",
    accent: "#7C3AED", // Violet
    rgb: "124,58,237",
  },
];

// ─── BACKGROUND PARTICLE FIELD ────────────────────────────────────────────────
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
    const pts: P[] = Array.from({ length: 45 }, () => ({
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
          if (d < 85) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(37,99,235,${(1 - d / 85) * 0.08 * ((pts[i].z + pts[j].z) / 2)})`; // Base blue tint
            ctx.lineWidth = 0.6;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.5 + p.z * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(8,145,178,${0.08 + p.z * 0.2})`;
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
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0, opacity: 0.35,
      }}
    />
  );
}

// ─── INDIVIDUAL EXPERIENCE/LESSON CARD ────────────────────────────────────────
function LessonCard({ lesson, index }: { lesson: Lesson; index: number }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
    >
      <motion.button
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.98 }}
        className="w-full text-left rounded-3xl bg-white/80 backdrop-blur-md relative overflow-hidden transition-all duration-300 group"
        style={{
          border: `2px solid ${hov || open ? `rgba(${lesson.rgb},0.3)` : "rgba(226,232,240,0.8)"}`,
          boxShadow: open
            ? `0 20px 40px -10px rgba(${lesson.rgb},0.15)`
            : hov
            ? `0 10px 30px -10px rgba(${lesson.rgb},0.1)`
            : "0 4px 10px rgba(0,0,0,0.02)",
        }}
      >
        {/* Animated Accent Line */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl"
          animate={{ opacity: hov || open ? 1 : 0.4, scaleY: hov || open ? 1 : 0.4 }}
          style={{ background: lesson.accent, transformOrigin: "center" }}
          transition={{ duration: 0.3, ease: "circOut" }}
        />

        <div className="p-6 sm:p-8 pl-8 sm:pl-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0">
              <span
                className="font-black select-none leading-none block mb-3 md:mb-4 transition-colors duration-300"
                style={{
                  color: hov || open ? `rgba(${lesson.rgb},0.15)` : `rgba(148,163,184,0.15)`,
                  fontSize: "3rem",
                  fontFamily: "monospace",
                }}
              >
                {lesson.num}
              </span>
              <h3
                className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-snug transition-colors duration-300"
                style={{ color: hov || open ? lesson.accent : undefined }}
              >
                {lesson.title}
              </h3>
            </div>

            {/* Toggle Icon */}
            <motion.div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 mt-2 sm:mt-0 text-sm font-black shadow-sm"
              animate={{
                borderColor: hov || open ? lesson.accent : "rgba(226,232,240,1)",
                color: hov || open ? lesson.accent : "rgba(148,163,184,1)",
                rotate: open ? 90 : 0,
                backgroundColor: hov || open ? `rgba(${lesson.rgb},0.05)` : "#ffffff"
              }}
              transition={{ duration: 0.3, type: "spring" }}
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
                transition={{ duration: 0.4, type: "spring", bounce: 0.15 }}
                className="overflow-hidden"
              >
                <p className="text-sm sm:text-base text-slate-600 leading-[1.8] mt-6 pt-6 border-t-2 border-slate-100 font-medium">
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EngineeringJourneySection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#F8FAFC", borderTop: "1px solid #e2e8f0" }}
      id="experience"
    >
      <ParticleField />

      {/* Aesthetic Blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-14 sm:mb-20 text-center sm:text-left"
        >
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-blue-600 font-bold uppercase mb-4 sm:mb-5">
            Protocol Architecture
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Engineering Insights &{" "}
            <br className="hidden sm:block" />
            <span
              style={{
                background: "linear-gradient(100deg, #0052FF 0%, #0891B2 55%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              System Design.
            </span>
          </h2>
          <p className="text-sm sm:text-lg text-slate-500 max-w-2xl leading-relaxed mx-auto sm:mx-0 font-medium">
            Architecting 70+ verified smart contracts across multi-contract DeFi protocols taught me that real-world engineering is about mitigating edge cases before they hit the mainnet.
          </p>
        </motion.div>

        <div className="space-y-4 sm:space-y-6">
          {LESSONS.map((lesson, i) => (
            <LessonCard key={lesson.id} lesson={lesson} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="font-mono text-[10px] text-slate-400 text-center mt-20 tracking-[0.2em] uppercase font-bold"
        >
          Deployed across Base Mainnet & EVM Networks
        </motion.p>
      </div>
    </section>
  );
}