"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/*
  CUTECAT NFT — Vaporwave Holographic Gallery v3
  Palette: #0A011E deep-void · #FF007F hot-pink · #00E5FF cyber-cyan
  Fonts:   Syne (display) · JetBrains Mono (code)
  Sheen:   low-opacity smooth glide — NOT aggressive
*/

// ── Font Loader ───────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
}

// ── Animated SVG Cat ─────────────────────────────────────────────
function CatSVG() {
  const [blink, setBlink] = useState(false);
  const [tailIdx, setTailIdx] = useState(0);
  const [pawLift, setPawLift] = useState(false);

  useEffect(() => {
    const bi = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 130);
    }, 3000 + Math.random() * 1500);
    const ti = setInterval(() => setTailIdx((p) => (p + 1) % 4), 550);
    const pi = setInterval(() => setPawLift((p) => !p), 1800);
    return () => { clearInterval(bi); clearInterval(ti); clearInterval(pi); };
  }, []);

  const tailRots = [-20, -8, 8, 20];

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: 130, height: 150 }}>
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 115, height: 115, background: "radial-gradient(circle, rgba(0,229,255,0.14) 0%, transparent 68%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg width="130" height="150" viewBox="0 0 130 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path d="M65 122 Q88 130 96 118 Q103 107 97 96"
          stroke="#FF007F" strokeWidth="5" strokeLinecap="round" fill="none"
          animate={{ rotate: tailRots[tailIdx] }}
          style={{ originX: "65px", originY: "122px" }}
          transition={{ type: "spring", stiffness: 160, damping: 14 }}
        />
        <ellipse cx="65" cy="106" rx="32" ry="30" fill="#120230" stroke="#00E5FF" strokeWidth="1.4" />
        <ellipse cx="65" cy="112" rx="14" ry="15" fill="#1E0A45" opacity="0.65" />
        <ellipse cx="65" cy="68" rx="30" ry="28" fill="#120230" stroke="#00E5FF" strokeWidth="1.4" />
        <polygon points="37,50 28,24 52,44" fill="#120230" stroke="#00E5FF" strokeWidth="1.4" strokeLinejoin="round" />
        <polygon points="40,48 33,29 50,43" fill="#FF007F" opacity="0.45" />
        <polygon points="93,50 102,24 78,44" fill="#120230" stroke="#00E5FF" strokeWidth="1.4" strokeLinejoin="round" />
        <polygon points="90,48 97,29 80,43" fill="#FF007F" opacity="0.45" />
        {blink ? (
          <>
            <line x1="52" y1="67" x2="61" y2="67" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="69" y1="67" x2="78" y2="67" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="56" cy="67" rx="6.5" ry="7.5" fill="#0A011E" stroke="#00E5FF" strokeWidth="1.4" />
            <ellipse cx="56" cy="67" rx="3.8" ry="4.5" fill="#00E5FF" opacity="0.88" />
            <circle cx="57.8" cy="65" r="1.3" fill="white" opacity="0.85" />
            <ellipse cx="74" cy="67" rx="6.5" ry="7.5" fill="#0A011E" stroke="#00E5FF" strokeWidth="1.4" />
            <ellipse cx="74" cy="67" rx="3.8" ry="4.5" fill="#00E5FF" opacity="0.88" />
            <circle cx="75.8" cy="65" r="1.3" fill="white" opacity="0.85" />
          </>
        )}
        <polygon points="65,75 61,79 69,79" fill="#FF007F" opacity="0.9" />
        <path d="M61 79 Q65 84 69 79" stroke="#FF007F" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <line x1="32" y1="73" x2="57" y2="76" stroke="#A78BFA" strokeWidth="0.7" opacity="0.6" />
        <line x1="30" y1="79" x2="57" y2="79" stroke="#A78BFA" strokeWidth="0.7" opacity="0.6" />
        <line x1="98" y1="73" x2="73" y2="76" stroke="#A78BFA" strokeWidth="0.7" opacity="0.6" />
        <line x1="100" y1="79" x2="73" y2="79" stroke="#A78BFA" strokeWidth="0.7" opacity="0.6" />
        <motion.ellipse cx="48" cy="136" rx="8" ry="5" fill="#120230" stroke="#00E5FF" strokeWidth="1"
          animate={{ cy: pawLift ? 131 : 136 }}
          transition={{ type: "spring", stiffness: 140, damping: 12 }}
        />
        <motion.ellipse cx="82" cy="136" rx="8" ry="5" fill="#120230" stroke="#00E5FF" strokeWidth="1"
          animate={{ cy: !pawLift ? 131 : 136 }}
          transition={{ type: "spring", stiffness: 140, damping: 12 }}
        />
        <rect x="48" y="118" width="34" height="13" rx="6.5" fill="#FF007F" opacity="0.12" stroke="#FF007F" strokeWidth="0.9" />
        <text x="65" y="127.5" textAnchor="middle" fill="#FF007F" fontSize="7" fontFamily="JetBrains Mono, monospace" fontWeight="700">#001</text>
      </svg>
    </div>
  );
}

// ── IPFS Network Canvas ───────────────────────────────────────────
function IPFSCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    let id: number; let t = 0;
    const isMobile = W < 640;
    const count = isMobile ? 20 : 38;
    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      sz: Math.random() * 1.8 + 0.7, phase: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.fillStyle = "rgba(10,1,30,0.28)"; ctx.fillRect(0, 0, W, H); t += 0.016;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 115) {
            const a = (1 - d / 115) * 0.22;
            const g = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            g.addColorStop(0, `rgba(0,229,255,${a})`); g.addColorStop(1, `rgba(255,0,127,${a})`);
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = g; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const pulse = (Math.sin(t * 1.6 + n.phase) + 1) / 2;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.sz + pulse * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${0.3 + pulse * 0.55})`;
        ctx.shadowBlur = 7; ctx.shadowColor = "#00E5FF"; ctx.fill(); ctx.shadowBlur = 0;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-60" />;
}

// ── 4D Smooth HoloCard ────────────────────────────────────────────
function HoloCard({ children, className = "", intensity = 10, sheenOpacity = 0.1 }: {
  children: React.ReactNode; className?: string; intensity?: number; sheenOpacity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const cfg = { stiffness: 160, damping: 22 };
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), cfg);
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), cfg);
  const sX = useTransform(mx, [-0.5, 0.5], ["110%", "-110%"]);
  const sY = useTransform(my, [-0.5, 0.5], ["110%", "-110%"]);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d", perspective: 900 }}
      className={`relative rounded-2xl overflow-hidden border border-[#FF007F]/20 bg-[#110228]/80 backdrop-blur-xl ${className}`}
    >
      <motion.div className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
        style={{
          opacity: sheenOpacity,
          background: "linear-gradient(112deg, transparent 22%, rgba(0,229,255,0.9) 30%, rgba(255,0,127,0.8) 50%, transparent 56%)",
          backgroundSize: "220% 220%",
          backgroundPositionX: sX,
          backgroundPositionY: sY,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function ScanLines() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 opacity-[0.025]"
      style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)" }}
    />
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-2 py-0.5 bg-[#0A011E] border border-[#00E5FF]/18 rounded text-[#00E5FF] text-[11px]"
      style={{ fontFamily: "JetBrains Mono, monospace" }}>
      {children}
    </code>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════
export default function CuteCatNFTCaseStudy() {
  const [tab, setTab] = useState<"architecture" | "automation">("architecture");
  const TABS = [
    { id: "architecture", label: "Split-Stack Arch" },
    { id: "automation", label: "Foundry Scripts" },
  ] as const;

  return (
    <div className="w-full bg-[#0A011E] text-[#F0EAFF] overflow-hidden" style={{ fontFamily: "Syne, sans-serif" }}>
      <FontLoader />

      {/* ── HERO ── */}
      <div className="relative w-full min-h-[480px] sm:min-h-[430px] border-b border-[#FF007F]/25 overflow-hidden flex flex-col justify-end">
        <ScanLines />
        <IPFSCanvas />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A011E] via-[#0A011E]/40 to-[#0A011E]/55 pointer-events-none" />
        <div className="absolute -top-16 right-[8%] w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#FF007F]/08 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-16 left-[5%] w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#00E5FF]/08 blur-[90px] pointer-events-none" />

        <div className="relative z-10 px-5 sm:px-8 md:px-14 pt-20 pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} className="max-w-xl">
            <div className="flex flex-wrap gap-2 mb-5">
              {["ERC-721", "IPFS Content ID", "Foundry"].map((b, i) => (
                <span key={i} className="px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    background: i === 0 ? "rgba(0,229,255,0.07)" : i === 1 ? "rgba(255,0,127,0.07)" : "rgba(167,139,250,0.07)",
                    color: i === 0 ? "#00E5FF" : i === 1 ? "#FF007F" : "#A78BFA",
                    border: `1px solid ${i === 0 ? "#00E5FF35" : i === 1 ? "#FF007F35" : "#A78BFA35"}`,
                  }}>
                  {b}
                </span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.95] text-white mb-4"
              style={{ textShadow: "0 0 38px rgba(255,0,127,0.2)" }}>
              CuteCat{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #00E5FF, #FF007F)" }}>
                NFT.
              </span>
            </h1>
            <p className="text-[0.75rem] text-[#A78BFA] leading-relaxed mb-7 max-w-md" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              Production-grade ERC-721 · Decentralized asset provenance<br className="hidden sm:block" />
              On-chain ownership ↔ Immutable IPFS metadata
            </p>
            <Link href="https://github.com/NexTechArchitect/FOUNDRY-Basic-and-Mood-Nft" target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 active:scale-95"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                background: "linear-gradient(135deg, #FF007F, #C8005E)",
                boxShadow: "0 0 22px rgba(255,0,127,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}>
              View Source ↗
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.78 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.26, type: "spring", stiffness: 165, damping: 18 }}
            className="self-center sm:self-auto">
            <HoloCard intensity={18} sheenOpacity={0.12} className="w-[170px] sm:w-[195px] p-4 flex flex-col items-center gap-3">
              <div className="w-full bg-[#0A011E] rounded-xl border border-[#00E5FF]/18 flex items-center justify-center py-2 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(0,229,255,0.06) 0%, transparent 68%)" }} />
                <CatSVG />
              </div>
              <div className="w-full">
                <p className="text-[#00E5FF] font-black text-[11px] uppercase tracking-widest mb-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  CuteCat #001
                </p>
                <p className="text-[#A78BFA] text-[9px] break-all leading-relaxed" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  ipfs://QmXyZ1abc...
                </p>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-0 z-20 px-5 sm:px-8 md:px-14 border-b border-[#FF007F]/18 bg-[#0A011E]/90 backdrop-blur-xl">
        <div className="flex overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className="relative flex-shrink-0 px-5 sm:px-7 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors duration-150"
              style={{ fontFamily: "JetBrains Mono, monospace", color: tab === t.id ? "#00E5FF" : "#5B4780" }}>
              {t.label}
              {tab === t.id && (
                <motion.div layoutId="cat-tab-line"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00E5FF]"
                  style={{ boxShadow: "0 0 8px rgba(0,229,255,0.45)" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-5 sm:px-8 md:px-14 py-8 pb-16"
        style={{ background: "radial-gradient(ellipse 80% 50% at 75% 100%, rgba(46,16,101,0.15) 0%, transparent 70%)" }}>
        <AnimatePresence mode="wait">

          {tab === "architecture" && (
            <motion.div key="arch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }} className="space-y-5">

              <div className="bg-[#110228] border border-[#FF007F]/20 p-6 sm:p-10 rounded-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-[#00E5FF]/04 to-transparent pointer-events-none" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#FF007F] mb-8 text-center" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  On-Chain vs Off-Chain Mapping
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 max-w-3xl mx-auto">
                  <HoloCard intensity={8} sheenOpacity={0.09} className="w-full sm:w-60 p-5 text-center border-[#00E5FF]/25">
                    <div className="text-3xl mb-2.5">⛓️</div>
                    <h4 className="text-[#00E5FF] font-black text-sm mb-1.5">On-Chain Layer</h4>
                    <p className="text-[10px] text-[#A78BFA] mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>Ownership &amp; Transfers</p>
                    <div className="bg-[#0A011E] border border-[#00E5FF]/18 p-2.5 rounded-lg text-left">
                      <p className="text-[10px] text-[#00E5FF]" style={{ fontFamily: "JetBrains Mono, monospace" }}>owner: 0xAb5...8f9</p>
                      <p className="text-[10px] text-[#00E5FF]" style={{ fontFamily: "JetBrains Mono, monospace" }}>tokenId: 1</p>
                    </div>
                  </HoloCard>

                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <span className="text-[9px] text-[#FF007F] font-bold" style={{ fontFamily: "JetBrains Mono, monospace" }}>tokenURI()</span>
                    <div className="hidden sm:flex items-center gap-0.5 text-[#FF007F]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.span key={i} animate={{ opacity: [0.15, 1, 0.15] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }} className="text-sm leading-none">─</motion.span>
                      ))}
                      <span className="ml-0.5">▶</span>
                    </div>
                    <div className="sm:hidden flex flex-col items-center gap-0.5">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <motion.span key={i} animate={{ opacity: [0.15, 1, 0.15] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }} className="text-[#FF007F] text-sm leading-none">│</motion.span>
                      ))}
                      <span className="text-[#FF007F]">▼</span>
                    </div>
                  </div>

                  <HoloCard intensity={8} sheenOpacity={0.09} className="w-full sm:w-60 p-5 text-center border-[#FF007F]/25">
                    <div className="text-3xl mb-2.5">🌍</div>
                    <h4 className="text-[#FF007F] font-black text-sm mb-1.5">Off-Chain Layer</h4>
                    <p className="text-[10px] text-[#A78BFA] mb-3" style={{ fontFamily: "JetBrains Mono, monospace" }}>IPFS Network Storage</p>
                    <div className="bg-[#0A011E] border border-[#FF007F]/18 p-2.5 rounded-lg">
                      <p className="text-[10px] text-[#FF007F] break-all" style={{ fontFamily: "JetBrains Mono, monospace" }}>ipfs://QmXyZ1abc...</p>
                    </div>
                  </HoloCard>
                </div>
                <div className="mt-7 bg-[#0A011E] border border-[#A78BFA]/18 border-l-4 border-l-[#00E5FF] p-4 rounded-xl max-w-3xl mx-auto">
                  <p className="text-[11px] text-[#A78BFA] leading-relaxed" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    <span className="text-white font-bold">Note:</span> Assets use cryptographic Content IDs (CID), not centralized HTTP URLs.
                    Even if the pinning service goes offline, the NFT metadata stays immutable and globally retrievable.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Standard", value: "ERC-721", c: "#00E5FF" },
                  { label: "Storage", value: "IPFS / CID", c: "#FF007F" },
                  { label: "Compiler", value: "0.8.20", c: "#A78BFA" },
                  { label: "Framework", value: "Foundry", c: "#F59E0B" },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.07 }}
                    className="bg-[#110228] border border-white/05 rounded-xl p-4 text-center">
                    <p className="text-[9px] text-[#A78BFA] uppercase tracking-widest mb-1.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{s.label}</p>
                    <p className="font-black text-sm" style={{ color: s.c }}>{s.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "automation" && (
            <motion.div key="auto" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }} className="space-y-4">
              <p className="text-[10px] text-[#A78BFA] uppercase tracking-widest font-bold mb-5" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                script/ · Professional Foundry Automations
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { file: "DeployCuteCatNft.s.sol", func: "Deployment", desc: "Deploys logic & configures the initial IPFS Base URI on-chain.", icon: "🚀", c: "#00E5FF" },
                  { file: "MintCuteCatNft.s.sol", func: "Interaction", desc: "Mints a new NFT to a specific target address securely via broadcast.", icon: "🪄", c: "#FF007F" },
                  { file: "FlipMintActive.s.sol", func: "Governance", desc: "Toggles contract state between OPEN / CLOSED to pause minting.", icon: "⚖️", c: "#A78BFA" },
                  { file: "CheckTotalMinted.s.sol", func: "Verification", desc: "Audits the current total supply directly from the blockchain.", icon: "🔍", c: "#34D399" },
                  { file: "WithdrawFunds.s.sol", func: "Security", desc: "Securely drains collected ETH to the owner's cold wallet.", icon: "🛡️", c: "#F59E0B" },
                ].map((script, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                    <HoloCard intensity={6} sheenOpacity={0.09} className="p-5 h-full">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl">{script.icon}</span>
                        <span className="px-2.5 py-0.5 bg-black/40 rounded text-[9px] font-bold uppercase tracking-widest"
                          style={{ fontFamily: "JetBrains Mono, monospace", color: script.c, border: `1px solid ${script.c}30` }}>
                          {script.func}
                        </span>
                      </div>
                      <Code>{script.file}</Code>
                      <p className="mt-2.5 text-[11px] text-[#A78BFA] leading-relaxed" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        {script.desc}
                      </p>
                    </HoloCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
