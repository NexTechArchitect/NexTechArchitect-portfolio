"use client";

import {
  motion, useMotionValue, useTransform, useSpring, AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   MERKLE-712 AIRDROP — 5D Aurora Forest Theme (Ultra Premium)
   Palette: Void Black (#020A08), Deep Emerald (#064E3B), Aurora Glow (#10B981)
   Vibe: Cryptographic Forest, Mathematical Elegance, Institutional Scale
═══════════════════════════════════════════════════════════════════ */

const CSS = `
  .merkle-font { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  .merkle-serif { font-family: 'Playfair Display', Georgia, serif; }
  .merkle-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
  
  .glass-card {
    background: rgba(4, 20, 25, 0.6);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(16, 185, 129, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.05);
  }

  .aurora-text {
    background: linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .merkle-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .merkle-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 10px; }
  .merkle-scroll::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
  .merkle-scroll::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.5); }
`;

// ── 5D Aurora & Hexadecimal Particle Canvas ───────────────────────
function AuroraForestCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let rafId: number;
    let time = 0;

    const isMobile = W < 768;

    // Aurora Bands
    const BANDS = [
      { speed: 0.005, amp: 0.15, freq: 1.5, yFrac: 0.3, color: [16, 185, 129], width: 0.25 },
      { speed: 0.008, amp: 0.10, freq: 2.2, yFrac: 0.45, color: [52, 211, 153], width: 0.15 },
      { speed: 0.004, amp: 0.20, freq: 1.1, yFrac: 0.2, color: [5, 150, 105], width: 0.3 },
    ];

    // 3D Hexadecimal Particles
    const chars = "0123456789ABCDEF";
    type Particle = { x: number; y: number; z: number; vy: number; char: string; pulseOff: number };
    const particles: Particle[] = Array.from({ length: isMobile ? 30 : 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 2 + 0.5, // Depth from 0.5 to 2.5
      vy: (Math.random() * 0.5 + 0.2),
      char: chars[Math.floor(Math.random() * chars.length)],
      pulseOff: Math.random() * Math.PI * 2
    }));

    const draw = () => {
      time += 0.01;
      ctx.fillStyle = "rgba(2, 10, 8, 0.4)"; // Deep Void Green trail
      ctx.fillRect(0, 0, W, H);

      // Draw Aurora Curtains
      BANDS.forEach(band => {
        const bandT = time * band.speed * 100;
        const baseY = H * band.yFrac;
        const bandH = H * band.width;
        const strips = isMobile ? Math.ceil(W / 8) : Math.ceil(W / 4);
        const step = isMobile ? 8 : 4;

        for (let x = 0; x < W; x += step) {
          const wave = Math.sin((x / W) * Math.PI * band.freq + bandT) * band.amp * H
                     + Math.sin((x / W) * Math.PI * (band.freq * 1.7) - bandT * 0.5) * band.amp * H * 0.3;
          const cy = baseY + wave;

          const grad = ctx.createLinearGradient(x, cy - bandH, x, cy + bandH);
          const alpha = (0.02 + Math.sin(bandT * 0.5 + x * 0.05) * 0.03) * (isMobile ? 1.5 : 1);
          
          grad.addColorStop(0, `rgba(${band.color.join(",")},0)`);
          grad.addColorStop(0.5, `rgba(${band.color.join(",")},${alpha})`);
          grad.addColorStop(1, `rgba(${band.color.join(",")},0)`);
          
          ctx.fillStyle = grad;
          ctx.fillRect(x, cy - bandH, step, bandH * 2);
        }
      });

      // Draw 3D Falling Hex Hashes
      particles.forEach(p => {
        // Perspective projection
        const scale = 1 / p.z;
        p.y += p.vy * scale;
        
        if (p.y > H + 20) {
          p.y = -20;
          p.x = Math.random() * W;
          p.char = chars[Math.floor(Math.random() * chars.length)];
        }

        const pulse = Math.sin(time * 2 + p.pulseOff) * 0.5 + 0.5;
        const alpha = (0.1 + pulse * 0.6) * scale;
        
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.font = `${Math.max(8, 16 * scale)}px 'JetBrains Mono', monospace`;
        ctx.fillText(p.char, p.x, p.y);

        // Connection lines for close particles
        for (let j = 0; j < particles.length; j++) {
          const p2 = particles[j];
          if (p !== p2) {
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 80 * scale) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - dist / (80 * scale)) * 0.15 * scale})`;
              ctx.lineWidth = 0.5 * scale;
              ctx.stroke();
            }
          }
        }
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();
    const handleResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", handleResize);

    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", handleResize); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen" />;
}

// ── Live Merkle Proof Visualizer ──────────────────────────────────
function MerkleProofCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight, id: number, t = 0;
    
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    window.addEventListener("resize", resize);

    const levels = [
      [{ x: 0.5, label: "Root Hash", active: true }],
      [{ x: 0.25, label: "H(A+B)", active: true }, { x: 0.75, label: "H(C+D)", active: false }],
      [
        { x: 0.12, label: "Leaf A", active: true },
        { x: 0.38, label: "Leaf B", active: false },
        { x: 0.62, label: "Leaf C", active: false },
        { x: 0.88, label: "Leaf D", active: false },
      ],
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.03;
      const levelH = H / (levels.length + 1);
      const isMobile = W < 500;

      // Draw Edges
      for (let li = 0; li < levels.length - 1; li++) {
        const lvl = levels[li];
        const nextLvl = levels[li + 1];
        lvl.forEach((node, ni) => {
          const childL = nextLvl[ni * 2];
          const childR = nextLvl[ni * 2 + 1];
          [childL, childR].filter(Boolean).forEach(child => {
            const isActivePath = node.active && child.active;
            ctx.beginPath();
            ctx.moveTo(node.x * W, (li + 1) * levelH);
            ctx.lineTo(child.x * W, (li + 2) * levelH);
            ctx.strokeStyle = isActivePath 
              ? `rgba(16, 185, 129, ${0.4 + Math.sin(t) * 0.4})` 
              : "rgba(16, 185, 129, 0.1)";
            ctx.lineWidth = isActivePath ? 2 : 1;
            ctx.stroke();
          });
        });
      }

      // Draw Nodes
      levels.forEach((lvl, li) => {
        lvl.forEach(node => {
          const nx = node.x * W;
          const ny = (li + 1) * levelH;
          const r = li === 0 ? (isMobile?15:20) : li === 1 ? (isMobile?12:16) : (isMobile?10:14);
          
          if (node.active) {
            const pulse = Math.sin(t * 1.5) * 0.5 + 0.5;
            ctx.beginPath(); ctx.arc(nx, ny, r + 4 + pulse * 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${0.1 + pulse * 0.1})`; ctx.fill();
          }

          ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI * 2);
          ctx.fillStyle = node.active ? "#064E3B" : "#022C22"; ctx.fill();
          ctx.strokeStyle = node.active ? "#34D399" : "#059669";
          ctx.lineWidth = node.active ? 2 : 1; ctx.stroke();

          ctx.fillStyle = node.active ? "#A7F3D0" : "#6EE7B7";
          ctx.font = `600 ${isMobile ? 8 : 10}px 'JetBrains Mono'`;
          ctx.textAlign = "center";
          ctx.fillText(node.label, nx, ny + (li === 0 ? 4 : 3));
        });
      });

      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="w-full h-full min-h-[220px]" />;
}

// ── Animated Vesting Timeline ────────────────────────────────────
function VestingCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight, id: number, t = 0;
    
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    window.addEventListener("resize", resize);

    const PHASES = [
      { pct: 0.0,  label: "TGE", color: "#10B981" },
      { pct: 0.31, label: "Cliff", color: "#F59E0B" },
      { pct: 0.93, label: "Phase 2", color: "#3B82F6" },
      { pct: 1.0,  label: "Expiry", color: "#EF4444" },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H); t += 0.02;
      const isMobile = W < 500;
      const trackY = H * 0.5;
      const pad = isMobile ? 30 : 60;
      const trackW = W - pad * 2;
      
      const prog = (Math.sin(t * 0.5) * 0.5 + 0.5);
      const fillW = trackW * prog;

      // Base Track
      ctx.beginPath(); ctx.roundRect(pad, trackY - 3, trackW, 6, 3);
      ctx.fillStyle = "rgba(16,185,129,0.1)"; ctx.fill();

      // Active Fill
      const grad = ctx.createLinearGradient(pad, 0, pad + fillW, 0);
      grad.addColorStop(0, "#10B981"); grad.addColorStop(0.3, "#F59E0B");
      grad.addColorStop(0.9, "#3B82F6"); grad.addColorStop(1, "#EF4444");
      ctx.beginPath(); ctx.roundRect(pad, trackY - 3, fillW, 6, 3);
      ctx.fillStyle = grad; ctx.fill();

      // Nodes
      PHASES.forEach((ph, i) => {
        const x = pad + trackW * ph.pct;
        const isActive = prog >= ph.pct;
        const pulse = isActive ? Math.sin(t * 2 + i) * 3 : 0;

        if (isActive) {
          ctx.beginPath(); ctx.arc(x, trackY, 8 + pulse, 0, Math.PI * 2);
          ctx.fillStyle = `${ph.color}40`; ctx.fill();
        }

        ctx.beginPath(); ctx.arc(x, trackY, 5, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? ph.color : "#064E3B"; ctx.fill();
        ctx.strokeStyle = isActive ? "#FFF" : ph.color; ctx.lineWidth = 1.5; ctx.stroke();

        ctx.fillStyle = isActive ? "#FFF" : "#A7F3D0";
        ctx.font = `600 ${isMobile ? 9 : 11}px 'Inter'`;
        ctx.textAlign = "center";
        ctx.fillText(ph.label, x, trackY + (i % 2 === 0 ? -15 : 22));
      });

      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="w-full h-[120px] md:h-[150px]" />;
}

// ── Ultra-Premium Tilt Card ──────────────────────────────────────
function InstitutionalCard({ children, className = "", glowColor = "rgba(16,185,129,0.05)" }: { children: React.ReactNode, className?: string, glowColor?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rotX = useTransform(y, [-0.5, 0.5], [4, -4]);
  const rotY = useTransform(x, [-0.5, 0.5], [-4, 4]);
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
      className={`relative rounded-3xl overflow-hidden glass-card transition-colors duration-300 hover:border-[#10B981]/40 ${className}`}
    >
      <motion.div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen"
        style={{ background: useTransform(() => `radial-gradient(600px circle at ${shineX.get()} ${shineY.get()}, ${glowColor}, transparent 50%)`) }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN MERKLE AIRDROP CASE STUDY
// ─────────────────────────────────────────────────────────────────
export default function MerkleAirdropCaseStudy() {
  const [activeTab, setActiveTab] = useState<"math" | "architecture" | "timeline">("math");

  const TABS = [
    { id: "math",         label: "Merkle Mathematics" },
    { id: "architecture", label: "Hybrid Pipeline" },
    { id: "timeline",     label: "Vesting Mechanics" }
  ] as const;

  return (
    <div className="w-full bg-[#020A08] text-slate-300 merkle-font overflow-hidden selection:bg-[#10B981]/30 selection:text-[#A7F3D0]">
      <style>{CSS}</style>

      {/* ── HERO SECTION ── */}
      <div className="relative w-full min-h-[50vh] md:min-h-[60vh] flex flex-col justify-end border-b border-[#10B981]/20">
        
        {/* 5D Background Canvas */}
        <AuroraForestCanvas />

        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020A08] via-[#020A08]/70 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020A08] via-[#020A08]/40 to-transparent pointer-events-none" />

        <div className="relative z-10 px-6 md:px-16 pt-32 pb-16 w-full max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1.5 bg-[#064E3B] border border-[#10B981]/50 text-[#34D399] text-[10px] font-bold uppercase tracking-[0.2em] rounded shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                EIP-712 Signatures
              </span>
              <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] rounded backdrop-blur-md">
                O(1) Gas Complexity
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.05] text-white mb-6">
              Merkle-712 <br className="hidden md:block" />
              <span className="aurora-text">Airdrop Protocol.</span>
            </h1>

            <p className="text-slate-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed mb-10 border-l-2 border-[#10B981] pl-4 md:pl-6 bg-gradient-to-r from-[#10B981]/10 to-transparent py-2">
              Solves the "Million User Problem" in token distribution. Combines off-chain Merkle Trees for extreme data compression with on-chain <strong className="text-white">EIP-712 structured signatures</strong> to prevent front-running claim bots.
            </p>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <Link href="https://github.com/NexTechArchitect/Siso-Merkle-Airdrop" target="_blank"
                className="group relative px-8 py-4 bg-[#10B981] text-[#020A08] font-black text-[11px] md:text-xs uppercase tracking-[0.2em] rounded overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Inspect Smart Contracts <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>

          </motion.div>
        </div>
      </div>

      {/* ── METRICS BAR ── */}
      <div className="border-b border-white/5 bg-[#010605]">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#10B981]/20">
          {[
            { value: "O(1)", label: "Gas Per Claim", sub: "Log(n) Proof Path", color: "text-[#34D399]" },
            { value: "32", suffix: "b", label: "Merkle Root", sub: "1M Users Compressed", color: "text-white" },
            { value: "712", prefix: "EIP-", label: "Security Std", sub: "Anti Front-Run", color: "text-blue-400" },
            { value: "97", suffix: "d", label: "Vesting Cycle", sub: "Phased Economy", color: "text-amber-400" }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="pt-6 md:pt-0 px-2 md:px-6 text-center md:text-left">
              <h3 className={`text-3xl md:text-5xl font-black mb-2 ${stat.color} drop-shadow-lg merkle-serif`}>
                {stat.prefix}{stat.value}{stat.suffix}
              </h3>
              <p className="text-white font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-slate-500 text-[9px] md:text-[10px] uppercase tracking-wider">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div className="sticky top-0 z-50 bg-[#020A08]/90 backdrop-blur-xl border-b border-[#10B981]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-16 flex overflow-x-auto merkle-scroll">
          {TABS.map((t, i) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`relative flex-shrink-0 px-6 py-5 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                activeTab === t.id ? "text-[#10B981]" : "text-slate-500 hover:text-white"
              }`}
            >
              <span className="opacity-40 mr-2 text-white">0{i + 1}</span> {t.label}
              {activeTab === t.id && (
                <motion.div layoutId="merkle-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-20 min-h-[60vh]">
        <AnimatePresence mode="wait">
          
          {/* ════ TAB 1: MATH ════ */}
          {activeTab === "math" && (
            <motion.div key="mth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Tree Structure */}
                <InstitutionalCard className="p-8 flex flex-col" glowColor="rgba(16,185,129,0.1)">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-white">Tree Compression</h3>
                    <span className="text-3xl opacity-50">🌳</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    Storing 1,000,000 users on-chain is cost-prohibitive. We compress all balances into a single 32-byte Root Hash.
                  </p>
                  <div className="bg-[#010605] border border-[#064E3B] rounded-xl p-5 merkle-mono text-xs text-slate-300 space-y-3 shadow-inner flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="text-[#10B981] font-bold w-16">Leaves:</span> 
                      <span>Keccak256(address, amount)</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="text-[#10B981] font-bold w-16">Nodes:</span> 
                      <span>Keccak256(Child_A, Child_B)</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="text-[#10B981] font-bold w-16">Root:</span> 
                      <span className="text-white">Final 32-byte Hash</span>
                    </div>
                  </div>
                </InstitutionalCard>

                {/* Proof Visualizer */}
                <InstitutionalCard className="p-0 overflow-hidden flex flex-col" glowColor="rgba(52,211,153,0.08)">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#04120E]">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Cryptographic Proof</h3>
                    <span className="bg-[#10B981]/20 text-[#10B981] text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider animate-pulse">Live Verifying</span>
                  </div>
                  <div className="bg-[#020A08] flex-1 relative">
                    <MerkleProofCanvas />
                  </div>
                  <div className="p-6 border-t border-white/5 bg-[#04120E] merkle-mono text-[10px] md:text-xs">
                     <p className="text-slate-500 mb-2">{"// Verification Logic"}</p>
                     <p className="text-slate-400">{"if ("}<span className="text-[#34D399] font-bold">CalculatedRoot</span> == <span className="text-[#10B981] font-bold">StoredRoot</span>{") {"}</p>
                     <p className="text-white pl-4 my-1">=&gt; Valid Claim Allowed</p>
                     <p className="text-slate-400">{"}"}</p>
                  </div>
                </InstitutionalCard>

              </div>
            </motion.div>
          )}

          {/* ════ TAB 2: ARCHITECTURE FLOW ════ */}
          {activeTab === "architecture" && (
            <motion.div key="arch" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              
              <InstitutionalCard className="p-8 md:p-12" glowColor="rgba(59,130,246,0.08)">
                <h3 className="text-lg font-black uppercase tracking-widest text-[#34D399] mb-10 text-center">Hybrid Verification Pipeline</h3>
                
                <div className="flex flex-col gap-10 max-w-4xl mx-auto">
                  
                  {/* Backend */}
                  <div className="flex flex-col md:flex-row items-stretch gap-6 relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-20 bg-emerald-500 rounded-full hidden md:block" />
                    <div className="w-full md:w-1/3 bg-[#010605] border border-emerald-500/30 p-6 rounded-2xl shadow-lg">
                      <h4 className="text-emerald-400 font-black mb-2 flex items-center gap-2"><span className="text-xl">1</span> Backend Engine</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Parses JSON whitelist, hashes address/amount pairs, and builds the Merkle Tree via Node.js scripts.</p>
                    </div>
                    <div className="hidden md:flex flex-col justify-center text-emerald-500 font-black text-2xl">→</div>
                    <div className="w-full md:w-2/3 bg-[#04120E] border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
                      <h4 className="text-white font-bold mb-2">Output Generated</h4>
                      <p className="text-xs text-slate-400 mb-2">A single 32-byte Merkle Root is deployed to the Smart Contract. User proofs are stored in a database/IPFS.</p>
                      <code className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded w-fit">0x8a3f...d9c2</code>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent w-full" />

                  {/* Frontend/Blockchain */}
                  <div className="flex flex-col md:flex-row items-stretch gap-6 relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-20 bg-blue-500 rounded-full hidden md:block" />
                    <div className="w-full md:w-1/3 bg-[#010605] border border-blue-500/30 p-6 rounded-2xl shadow-lg">
                      <h4 className="text-blue-400 font-black mb-2 flex items-center gap-2"><span className="text-xl">2</span> EIP-712 Sign</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">User connects MetaMask and signs Typed Structured Data. This binds the claim request to their specific wallet and chain ID.</p>
                    </div>
                    <div className="hidden md:flex flex-col justify-center text-blue-500 font-black text-2xl">→</div>
                    <div className="w-full md:w-2/3 bg-[#04120E] border border-white/10 p-6 rounded-2xl">
                      <h4 className="text-white font-bold mb-4">3. On-Chain Smart Contract</h4>
                      <div className="space-y-3 text-xs merkle-mono">
                        <div className="flex flex-col sm:flex-row justify-between bg-black/50 p-3 rounded border border-white/5">
                          <span className="text-slate-500 mb-1 sm:mb-0">Verify Signature:</span>
                          <span className="text-blue-400">ECDSA.tryRecover == msg.sender</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between bg-black/50 p-3 rounded border border-white/5">
                          <span className="text-slate-500 mb-1 sm:mb-0">Verify Proof:</span>
                          <span className="text-emerald-400">MerkleProof.verify(proof, root)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </InstitutionalCard>

              {/* Explainer */}
              <div className="bg-[#010605] border-l-4 border-l-rose-500 p-6 rounded-r-2xl max-w-4xl mx-auto shadow-lg">
                <h4 className="text-rose-400 font-bold text-sm uppercase tracking-widest mb-2">Why EIP-712 is Critical</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Without EIP-712, a front-running bot can monitor the mempool, copy a user's valid Merkle proof, replace the <code className="text-rose-400 bg-rose-500/10 px-1 rounded">msg.sender</code>, and execute the transaction with higher gas to steal the airdrop. EIP-712 cryptographically binds the proof to the original user's address.
                </p>
              </div>

            </motion.div>
          )}

          {/* ════ TAB 3: TIMELINE ════ */}
          {activeTab === "timeline" && (
            <motion.div key="time" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              
              <InstitutionalCard className="p-8 md:p-12">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <h3 className="text-xl font-black text-white mb-3">Phased Vesting Mechanics</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Immediate 100% unlocks create massive sell pressure, crashing the token economy. This protocol enforces a staggered release schedule with a holding cliff.
                  </p>
                </div>

                <div className="mb-10 bg-[#010605] border border-white/5 rounded-2xl overflow-hidden p-4">
                  <VestingCanvas />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { day: "Day 0", title: "TGE Starts", desc: "Claim first 50% immediately.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { day: "Day 30", title: "Cliff Starts", desc: "Claims paused to encourage holding.", color: "text-amber-400", bg: "bg-amber-500/10" },
                    { day: "Day 90", title: "Cliff Ends", desc: "Remaining 50% unlocked.", color: "text-blue-400", bg: "bg-blue-500/10" },
                    { day: "Day 97", title: "Expiry", desc: "Claims closed. Unclaimed tokens burned.", color: "text-rose-400", bg: "bg-rose-500/10" }
                  ].map((phase, i) => (
                    <div key={i} className={`p-5 rounded-xl border border-white/5 ${phase.bg}`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${phase.color}`}>{phase.day}</span>
                        <span className="text-xl opacity-50">⏳</span>
                      </div>
                      <h4 className="text-white font-bold mb-2">{phase.title}</h4>
                      <p className="text-xs text-slate-400">{phase.desc}</p>
                    </div>
                  ))}
                </div>
              </InstitutionalCard>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
