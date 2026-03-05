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

/* ═══════════════════════════════════════════════════════════════
   CUTECAT NFT — Vaporwave / Cyber-Neon Mobile Optimized
   Palette: Deep Void (#0A011E), Hot Pink (#FF007F), Cyber Cyan (#00E5FF)
   Fixes: TypeScript prop errors fixed, Mobile Height, Fast Canvas
═══════════════════════════════════════════════════════════════ */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
  
  .cat-root { font-family: 'Syne', sans-serif; }
  .cat-mono { font-family: 'JetBrains Mono', monospace; }
  
  .cat-glass {
    background: rgba(17, 2, 40, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 0, 127, 0.15);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 0 15px rgba(255,0,127,0.03);
  }

  .cat-text-gradient {
    background: linear-gradient(90deg, #00E5FF, #FF007F);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cat-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
  .cat-scroll::-webkit-scrollbar-track { background: transparent; }
  .cat-scroll::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.3); border-radius: 10px; }
`;

// ── Lightweight IPFS Nodes Canvas ─────────────────────────────────
function IPFSCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    let id: number; let t = 0;
    
    const isMobile = W < 640;
    const count = isMobile ? 25 : 45; 
    
    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      sz: Math.random() * 1.5 + 0.5, phase: Math.random() * Math.PI * 2,
    }));
    
    const draw = () => {
      ctx.clearRect(0, 0, W, H); t += 0.02;
      
      // Draw Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          const maxD = isMobile ? 80 : 120;
          if (d < maxD) {
            const a = (1 - d / maxD) * 0.2;
            const g = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            g.addColorStop(0, `rgba(0,229,255,${a})`); 
            g.addColorStop(1, `rgba(255,0,127,${a})`);
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = g; ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }
      
      // Draw Nodes
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const pulse = (Math.sin(t + n.phase) + 1) / 2;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.sz + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${0.4 + pulse * 0.4})`;
        ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-50" />;
}

// ── Ultra-Premium Tilt Card (TS Errors Fixed) ─────────────────────
function HoloCard({ 
  children, 
  className = "", 
  glowColor = "rgba(0,229,255,0.08)",
  intensity = 5,       // Re-added to fix TS Error
  sheenOpacity = 0.1   // Re-added to fix TS Error
}: { 
  children: React.ReactNode; 
  className?: string; 
  glowColor?: string;
  intensity?: number;
  sheenOpacity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rotX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rotY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);
  const shineX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  
  const sRX = useSpring(rotX, { stiffness: 200, damping: 25 });
  const sRY = useSpring(rotY, { stiffness: 200, damping: 25 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }, [x, y]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: sRX, rotateY: sRY, transformStyle: "preserve-3d", perspective: 1200 }}
      className={`relative rounded-2xl md:rounded-3xl overflow-hidden cat-glass transition-colors duration-300 hover:border-[#00E5FF]/30 ${className}`}
    >
      <motion.div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen"
        style={{ 
          opacity: sheenOpacity > 0.1 ? sheenOpacity : 1, // Fallback to prevent unused variable warning
          background: useTransform(() => `radial-gradient(400px circle at ${shineX.get()} ${shineY.get()}, ${glowColor}, transparent 50%)`) 
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

// ── Animated SVG Cat ─────────────────────────────────────────────
function CatSVG() {
  const [blink, setBlink] = useState(false);
  const [tailIdx, setTailIdx] = useState(0);
  const [pawLift, setPawLift] = useState(false);

  useEffect(() => {
    const bi = setInterval(() => {
      setBlink(true); setTimeout(() => setBlink(false), 130);
    }, 3000 + Math.random() * 1500);
    const ti = setInterval(() => setTailIdx((p) => (p + 1) % 4), 550);
    const pi = setInterval(() => setPawLift((p) => !p), 1800);
    return () => { clearInterval(bi); clearInterval(ti); clearInterval(pi); };
  }, []);

  const tailRots = [-20, -8, 8, 20];

  return (
    <div className="relative flex items-center justify-center select-none w-[110px] h-[130px] md:w-[130px] md:h-[150px]">
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: "90%", height: "80%", background: "radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 68%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg width="100%" height="100%" viewBox="0 0 130 150" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CuteCatNFTCaseStudy() {
  const [tab, setTab] = useState<"architecture" | "automation">("architecture");
  const TABS = [
    { id: "architecture", label: "IPFS Architecture" },
    { id: "automation", label: "Script Automation" },
  ] as const;

  return (
    <div className="w-full bg-[#0A011E] text-[#F0EAFF] overflow-x-hidden cat-root selection:bg-[#FF007F]/30 selection:text-[#00E5FF]">
      <style>{CSS}</style>

      {/* ── HERO SECTION ── */}
      <div className="relative w-full min-h-[35vh] md:min-h-[50vh] border-b border-[#FF007F]/20 flex flex-col justify-end pt-12 md:pt-0">
        
        <IPFSCanvas />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A011E] via-[#0A011E]/60 to-transparent pointer-events-none" />
        <div className="absolute -top-16 right-[8%] w-48 h-48 md:w-80 md:h-80 rounded-full bg-[#FF007F]/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 left-[5%] w-48 h-48 md:w-80 md:h-80 rounded-full bg-[#00E5FF]/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 px-5 md:px-16 pt-16 md:pt-32 pb-8 md:pb-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-xl">
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4 md:mb-5">
              <span className="px-2 md:px-3 py-1 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] rounded cat-mono">
                ERC-721
              </span>
              <span className="px-2 md:px-3 py-1 bg-[#FF007F]/10 border border-[#FF007F]/30 text-[#FF007F] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] rounded cat-mono">
                IPFS
              </span>
            </div>

            {/* Mobile optimized heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.0] text-white mb-3 md:mb-4">
              CuteCat <br className="hidden md:block" />
              <span className="cat-text-gradient">NFT Protocol.</span>
            </h1>

            <p className="text-[#A78BFA] text-xs md:text-sm font-medium leading-relaxed mb-6 md:mb-8 border-l-2 border-[#00E5FF] pl-3 md:pl-4 cat-mono">
              Production-grade ERC-721 implementation demonstrating decentralized asset provenance. Bridging on-chain ownership with immutable IPFS metadata.
            </p>

            <Link href="https://github.com/NexTechArchitect/ERC721-Advanced-IPFS-NFT" target="_blank"
              className="inline-flex items-center justify-center gap-2 px-5 md:px-6 py-3 md:py-4 bg-gradient-to-r from-[#FF007F] to-[#C8005E] text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(255,0,127,0.3)] transition-transform hover:scale-105 w-full sm:w-auto cat-mono"
            >
              View Source ↗
            </Link>
          </motion.div>

          {/* Floating Cat Card */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="self-center md:self-auto w-full max-w-[200px] md:max-w-none md:w-auto">
            <HoloCard intensity={15} sheenOpacity={0.12} className="p-3 md:p-5 flex flex-col items-center gap-2 md:gap-3">
              <div className="w-full bg-[#0A011E] rounded-xl border border-[#00E5FF]/20 flex items-center justify-center py-2 relative overflow-hidden">
                <CatSVG />
              </div>
              <div className="w-full text-center md:text-left">
                <p className="text-[#00E5FF] font-black text-[10px] md:text-[11px] uppercase tracking-widest mb-0.5 cat-mono">CuteCat #001</p>
                <p className="text-[#A78BFA] text-[8px] md:text-[9px] cat-mono">ipfs://QmXyZ1abc...</p>
              </div>
            </HoloCard>
          </motion.div>

        </div>
      </div>

      {/* ── METRICS BAR ── */}
      <div className="border-b border-[#FF007F]/20 bg-[#080118]">
        <div className="max-w-7xl mx-auto px-5 md:px-16 py-6 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 divide-x divide-[#FF007F]/20">
          {[
            { v: "ERC-721", l: "Standard", c: "#00E5FF" },
            { v: "IPFS / CID", l: "Storage", c: "#FF007F" },
            { v: "0.8.20", l: "Compiler", c: "#A78BFA" },
            { v: "Foundry", l: "Framework", c: "#F59E0B" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="px-2 md:px-6 text-center md:text-left">
              <p className="text-[8px] md:text-[9px] text-[#A78BFA] uppercase tracking-widest mb-1 cat-mono">{s.l}</p>
              <p className="font-black text-base md:text-xl truncate" style={{ color: s.c }}>{s.v}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── NAVIGATION TABS (TS Error Fixed) ── */}
      <div className="sticky top-0 z-50 bg-[#0A011E]/90 backdrop-blur-xl border-b border-[#FF007F]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-16 flex overflow-x-auto cat-scroll gap-2 md:gap-4">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as "architecture" | "automation")}
              className={`relative flex-shrink-0 px-4 md:px-6 py-4 text-[9px] md:text-[11px] font-bold uppercase tracking-widest transition-colors cat-mono ${
                tab === t.id ? "text-[#00E5FF]" : "text-[#5B4780]"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <motion.div layoutId="cat-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="max-w-7xl mx-auto px-5 md:px-16 py-8 md:py-16 min-h-[50vh]">
        <AnimatePresence mode="wait">

          {/* ════ TAB 1: ARCHITECTURE ════ */}
          {tab === "architecture" && (
            <motion.div key="arch" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
              
              <HoloCard className="p-5 md:p-10 border-[#FF007F]/20" glowColor="rgba(255,0,127,0.05)">
                <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-[#FF007F] mb-6 md:mb-10 text-center cat-mono">
                  On-Chain vs Off-Chain Mapping
                </h3>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 max-w-4xl mx-auto">
                  
                  {/* On-Chain */}
                  <div className="bg-[#110228] border border-[#00E5FF]/30 p-5 rounded-2xl w-full md:w-64 text-center">
                    <div className="text-3xl md:text-4xl mb-3">⛓️</div>
                    <h4 className="text-[#00E5FF] font-black text-sm md:text-base mb-1">On-Chain Layer</h4>
                    <p className="text-[9px] md:text-[10px] text-[#A78BFA] mb-4 cat-mono">Ownership & Transfers</p>
                    <div className="bg-[#0A011E] border border-[#00E5FF]/20 p-3 rounded-lg text-left cat-mono">
                      <p className="text-[10px] md:text-xs text-[#00E5FF] mb-1">owner: 0xAb5...8f9</p>
                      <p className="text-[10px] md:text-xs text-[#00E5FF]">tokenId: 1</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <span className="text-[9px] md:text-[11px] text-[#FF007F] font-bold cat-mono">tokenURI()</span>
                    <div className="hidden md:block text-[#FF007F] tracking-[0.2em]">──────▶</div>
                    <div className="md:hidden text-[#FF007F] flex flex-col items-center leading-none">
                      <span>│</span><span>│</span><span>▼</span>
                    </div>
                  </div>

                  {/* Off-Chain */}
                  <div className="bg-[#110228] border border-[#FF007F]/30 p-5 rounded-2xl w-full md:w-64 text-center">
                    <div className="text-3xl md:text-4xl mb-3">🌍</div>
                    <h4 className="text-[#FF007F] font-black text-sm md:text-base mb-1">Off-Chain Layer</h4>
                    <p className="text-[9px] md:text-[10px] text-[#A78BFA] mb-4 cat-mono">IPFS Network Storage</p>
                    <div className="bg-[#0A011E] border border-[#FF007F]/20 p-3 rounded-lg cat-mono">
                      <p className="text-[10px] md:text-xs text-[#FF007F] break-all">ipfs://QmXyZ1abc...</p>
                    </div>
                  </div>

                </div>

                <div className="mt-8 md:mt-10 bg-[#0A011E] border-l-4 border-l-[#00E5FF] p-4 md:p-5 rounded-r-xl border-y border-r border-[#00E5FF]/20">
                  <p className="text-[10px] md:text-xs text-[#A78BFA] leading-relaxed cat-mono">
                    <span className="text-white font-bold">Engineering Note:</span> The visual asset relies on cryptographic hashes (CID), not centralized HTTP URLs. This ensures that even if the website or pinning service goes offline, the NFT remains immutable and verifiable globally.
                  </p>
                </div>
              </HoloCard>

            </motion.div>
          )}

          {/* ════ TAB 2: AUTOMATION ════ */}
          {tab === "automation" && (
            <motion.div key="auto" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
              
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-sm md:text-lg font-black text-white cat-mono">Professional Foundry Automations</h3>
                <p className="text-[10px] md:text-xs text-[#A78BFA] mt-1 cat-mono">Replacing manual console interactions with robust scripts.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {[
                  { file: "DeployCuteCatNft.s.sol", func: "Deployment", desc: "Deploys logic & configures the initial IPFS Base URI on-chain.", icon: "🚀", c: "#00E5FF" },
                  { file: "MintCuteCatNft.s.sol", func: "Interaction", desc: "Mints a new NFT to a specific target address securely via broadcast.", icon: "🪄", c: "#FF007F" },
                  { file: "FlipMintActive.s.sol", func: "Governance", desc: "Toggles contract state between OPEN / CLOSED to pause minting.", icon: "⚖️", c: "#A78BFA" },
                  { file: "CheckTotalMinted.s.sol", func: "Verification", desc: "Audits the current total supply directly from the blockchain.", icon: "🔍", c: "#34D399" },
                  { file: "WithdrawFunds.s.sol", func: "Security", desc: "Securely drains collected ETH to the owner's cold wallet.", icon: "🛡️", c: "#F59E0B" },
                ].map((script, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <HoloCard intensity={5} className="p-5 h-full border-white/5" glowColor={`${script.c}15`}>
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <span className="text-2xl md:text-3xl">{script.icon}</span>
                        <span className="px-2 py-1 bg-black/50 rounded text-[8px] md:text-[9px] font-bold uppercase tracking-widest cat-mono"
                          style={{ color: script.c, border: `1px solid ${script.c}40` }}>
                          {script.func}
                        </span>
                      </div>
                      <code className="px-2 py-1 bg-[#0A011E] border border-[#00E5FF]/20 rounded text-[#00E5FF] text-[9px] md:text-[11px] cat-mono inline-block mb-2 md:mb-3">
                        {script.file}
                      </code>
                      <p className="text-[10px] md:text-[11px] text-[#A78BFA] leading-relaxed">
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