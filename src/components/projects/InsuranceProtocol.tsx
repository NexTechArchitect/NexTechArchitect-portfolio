"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// ── TYPES ────────────────────────────────────────────────────────────────────
type Lesson = { heading: string; text: string };
type LessonItem = {
  id: string;
  project: string;
  year: string;
  accent: string;
  rgb: string;
  tagline: string;
  lessons: Lesson[];
};

// ── DATA — real engineering lessons from each project ─────────────────────────
const ITEMS: LessonItem[] = [
  {
    id: "l1",
    project: "Sentinel Insurance Protocol",
    year: "2026",
    accent: "#2563EB",
    rgb: "37,99,235",
    tagline: "Composing on top of Aave taught me how protocol trust actually works.",
    lessons: [
      {
        heading: "Idle capital is a protocol design problem, not a user problem",
        text: "When I first thought about insurance vaults, I assumed capital sitting unused was just the cost of coverage. Integrating ERC-4626 with Aave V3 changed that — idle USDC can earn yield continuously without touching policyholder collateral. The vault isolation means a yield failure cannot cascade into a claims failure. Designing two separate failure domains in one protocol was the hardest architectural decision.",
      },
      {
        heading: "Flash-loan governance attacks are not theoretical",
        text: "I initially used current block balances for voting. Then I ran through the attack: borrow $10M of governance tokens, vote yes on a fraudulent claim, repay — all in one transaction. The fix is one line: getPastVotes(addr, block.number - 1). But understanding why it works required me to actually map out what the EVM can and cannot do within a single block. That mental model stuck.",
      },
      {
        heading: "Slither medium findings are worth reading carefully",
        text: "Two medium findings came back on PolicyEngine.buyPolicy flagged as 'complex code'. My first instinct was to refactor. But the complexity was intentional — risk check, collateral lock, and NFT mint must happen atomically or a front-runner can buy coverage on a protocol right after it's blacklisted. The finding taught me to distinguish between complexity that can be simplified and complexity that encodes a security guarantee.",
      },
    ],
  },
  {
    id: "l2",
    project: "Nexus Perpetuals DEX",
    year: "2026",
    accent: "#7C3AED",
    rgb: "124,58,237",
    tagline: "Building a perpetuals engine forced me to think about protocol solvency as a mathematical property, not a policy.",
    lessons: [
      {
        heading: "ERC-4337 changes the mental model of who pays for what",
        text: "Before building the paymaster, I thought of gas as the user's problem. ERC-4337 separates the signer from the fee payer — the bundler submits on-chain, the paymaster covers fees, and the user just signs a UserOperation. Implementing the verifying paymaster from scratch (not a library wrapper) made me understand exactly what the EntryPoint validates and where the trust boundary actually is.",
      },
      {
        heading: "MINIMUM_LIQUIDITY burn is not just a Uniswap convention",
        text: "On first deposit, if you mint LP shares proportional to assets, an attacker can donate a tiny amount first, then watch subsequent depositors get minted near-zero shares due to rounding. Burning MINIMUM_LIQUIDITY to address(0) permanently anchors the share price baseline. I only understood why this matters after simulating the inflation attack path step by step.",
      },
      {
        heading: "Cross-chain introduces new failure modes that unit tests cannot catch",
        text: "CCIP cross-chain margin looked simple in isolation — send message, receive on the other side. The problem was nonce deduplication. Without it, a replayed CCIP message could add margin twice. Fork tests across two simulated chains was the only way to actually observe this. It changed how I think about testing: unit tests prove correctness, fork tests prove it in the real environment.",
      },
    ],
  },
  {
    id: "l3",
    project: "Sentinel DAO",
    year: "2025",
    accent: "#D97706",
    rgb: "217,119,6",
    tagline: "Governance is harder than the contracts. The threat model is human, not computational.",
    lessons: [
      {
        heading: "A timelock is not a security feature unless minorities can exit",
        text: "48H TimelockController slows down execution. But if a majority passes a proposal that harms token holders, slowing it down does nothing without an exit mechanism. The rage-quit design — burn tokens, receive proportional treasury share before the proposal executes — is what makes the timelock meaningful. I spent more time on the exit math than on the timelock itself.",
      },
      {
        heading: "Treasury yield introduces a new attack surface",
        text: "Routing idle treasury into Aave V3 seemed straightforward. The problem I didn't anticipate: a malicious proposal could drain the Aave position first, then execute the actual attack with the treasury empty. ProposalGuard checks post-execution treasury solvency before any withdrawal is finalized. I added it after mapping out the exact sequence of a treasury-drain attack on a whiteboard.",
      },
      {
        heading: "Gasless voting via ERC-4337 is a participation problem, not a UX problem",
        text: "Low governance participation in DeFi is usually blamed on apathy. But for small holders, gas cost relative to voting power is genuinely irrational. Removing gas via ERC-4337 paymaster changed the participation calculus. It also introduced a new question: if the paymaster covers all votes, can it be drained by spam? Rate-limiting the paymaster per address per epoch was the answer.",
      },
    ],
  },
  {
    id: "l4",
    project: "RST Reputation Protocol",
    year: "2026",
    accent: "#059669",
    rgb: "5,150,105",
    tagline: "On-chain identity is a different design space than on-chain finance.",
    lessons: [
      {
        heading: "Soulbound means the enforcement has to be in the standard, not the application",
        text: "ERC-721 transfer hooks can be overridden. If I had just set a flag to block transfers, a sufficiently motivated caller could find a path around it. ERC-5484 puts the non-transferability in the burn authority model — only the issuer, owner, or both (configurable) can burn, and transfer is removed at the standard level. Learning the difference between enforced-by-application and enforced-by-standard changed how I think about token design.",
      },
      {
        heading: "UUPS proxies require thinking about storage before writing a single line",
        text: "I wrote the V1 scoring logic first, then decided to add upgrades. Moving to UUPS mid-development meant auditing every storage slot for collision risk. The lesson: upgradeable contracts need storage layout designed before implementation, not retrofitted. V2 and V3 used a structured layout from the start with explicit gap arrays for future variables.",
      },
      {
        heading: "Dynamic SVG fully on-chain is a data encoding problem",
        text: "Storing SVG on-chain sounds simple until you hit the 24KB contract size limit. The medal art for five tiers needed to be split, base64-encoded, and assembled in tokenURI. Getting the encoding right so metadata renders correctly on OpenSea without IPFS took more debugging than the scoring logic itself. The payoff: the metadata is permanent, uncensorable, and owned entirely by the contract.",
      },
    ],
  },
];

// ── PARTICLE FIELD ────────────────────────────────────────────────────────────
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
    const COUNT = 50;
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * 1400, y: Math.random() * 900,
      z: Math.random(), t: Math.random() * Math.PI * 2,
      f: 0.3 + Math.random() * 0.6,
      ox: Math.random() * 1400, oy: Math.random() * 900,
    }));

    let time = 0;
    const draw = () => {
      if (W <= 0 || H <= 0) { rafRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);
      time += 0.003;

      for (const p of particles) {
        const ds = 0.4 + p.z * 0.6;
        p.x = p.ox + Math.sin(time * p.f + p.t) * 20 * ds;
        p.y = p.oy + Math.cos(time * p.f * 0.7 + p.t) * 13 * ds;
        p.ox += Math.sin(time * 0.08 + p.t) * 0.1 * ds;
        p.oy += Math.cos(time * 0.06 + p.t) * 0.07 * ds;
        if (p.ox < -50) p.ox = W + 20;
        if (p.ox > W + 50) p.ox = -20;
        if (p.oy < -50) p.oy = H + 20;
        if (p.oy > H + 50) p.oy = -20;
      }

      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100,120,200,${(1 - d / 90) * 0.07 * ((a.z + b.z) / 2)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const radius = 0.6 + p.z * 1.6;
        const alpha = 0.08 + p.z * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80,100,220,${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0, opacity: 0.35,
    }} />
  );
}

// ── MODAL ────────────────────────────────────────────────────────────────────
function LessonModal({ item, onClose }: { item: LessonItem; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-6"
      style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(18px)" }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-t-[24px] sm:rounded-[20px]"
        style={{ borderTop: `3px solid ${item.accent}`, boxShadow: "0 40px 80px rgba(0,0,0,0.15)" }}
      >
        {/* Drag pill mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-8 h-1 rounded-full bg-zinc-200" />
        </div>

        <div className="p-7 sm:p-9 pb-12">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="font-mono text-[9px] font-black tracking-[0.25em] uppercase mb-2 block" style={{ color: item.accent }}>{item.year}</span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-tight mb-2">{item.project}</h2>
              <p className="text-[13px] text-zinc-400 leading-relaxed italic">{item.tagline}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-700 flex-shrink-0 text-sm transition-colors" style={{ background: "rgba(0,0,0,0.04)" }}>✕</button>
          </div>

          <div className="space-y-5">
            {item.lessons.map((lesson, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.07 }}
                className="py-4 px-1"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
              >
                <p className="text-[13px] font-bold text-zinc-900 mb-2 leading-snug">{lesson.heading}</p>
                <p className="text-[13px] text-zinc-500 leading-[1.85]">{lesson.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── LESSON ROW ────────────────────────────────────────────────────────────────
function LessonRow({ item, index, onClick }: { item: LessonItem; index: number; onClick: () => void }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.997 }}
        className="w-full text-left rounded-2xl bg-white relative overflow-hidden"
        style={{
          border: `1px solid ${hov ? `rgba(${item.rgb},0.2)` : "rgba(0,0,0,0.06)"}`,
          boxShadow: hov ? `0 8px 32px rgba(${item.rgb},0.09)` : "0 2px 8px rgba(0,0,0,0.03)",
          transition: "border-color 0.25s, box-shadow 0.25s",
        }}
      >
        {/* Left accent */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
          animate={{ opacity: hov ? 1 : 0, scaleY: hov ? 1 : 0.3 }}
          style={{ background: item.accent, transformOrigin: "center" }}
          transition={{ duration: 0.22 }}
        />

        <div className="p-5 sm:p-6 pl-6 sm:pl-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="font-mono text-[9px] font-black tracking-[0.22em] uppercase px-2.5 py-1 rounded-full"
                  style={{ color: item.accent, background: `rgba(${item.rgb},0.08)` }}>
                  {item.year}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight mb-1.5 transition-colors duration-200"
                style={{ color: hov ? item.accent : undefined }}>
                {item.project}
              </h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed italic mb-4 max-w-lg">{item.tagline}</p>

              {/* Preview of first lesson heading */}
              <div className="flex items-start gap-2">
                <span className="w-[5px] h-[5px] rounded-full mt-[5px] flex-shrink-0" style={{ background: item.accent, opacity: 0.5 }} />
                <span className="text-[12px] text-zinc-400 font-medium leading-snug">{item.lessons[0].heading}</span>
              </div>
              <p className="text-[10px] text-zinc-300 font-mono pl-[17px] mt-1.5">+{item.lessons.length - 1} more</p>
            </div>

            <motion.div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-colors duration-200"
              animate={{
                borderColor: hov ? item.accent : "rgba(0,0,0,0.1)",
                color: hov ? item.accent : "rgba(0,0,0,0.2)",
                x: hov ? 3 : 0,
              }}
            >
              →
            </motion.div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function EngineeringJourneySection() {
  const [active, setActive] = useState<LessonItem | null>(null);

  return (
    <section className="relative overflow-hidden" style={{ background: "#FDFCF8", borderTop: "1px solid #ede9e2" }}>
      <ParticleField />

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-8%] right-[-5%] w-[40vw] h-[40vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12 sm:mb-16">
          <span className="font-mono text-[9px] text-zinc-300 tracking-[0.32em] uppercase mb-4 block">Lessons</span>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight mb-4">
            What building{" "}
            <span style={{
              background: "linear-gradient(100deg, #2563EB 0%, #7C3AED 50%, #059669 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              taught me.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
            Not what I built. What I actually learned from building it.
          </p>
        </motion.div>

        <div className="space-y-4">
          {ITEMS.map((item, i) => (
            <LessonRow key={item.id} item={item} index={i} onClick={() => setActive(item)} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="font-mono text-[9px] text-zinc-200 text-center mt-14 tracking-[0.22em] uppercase"
        >
          Every lesson came from a mistake first
        </motion.p>
      </div>

      <AnimatePresence>
        {active && <LessonModal item={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}