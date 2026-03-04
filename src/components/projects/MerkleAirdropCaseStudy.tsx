"use client";

import {
  motion, useMotionValue, useTransform, useSpring, AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@400;700;900&display=swap');
  .merkle-font { font-family: 'Manrope', sans-serif; }
  .merkle-serif { font-family: 'Outfit', sans-serif; }
  .merkle-mono { font-family: 'JetBrains Mono', monospace; }
  .glass-card {
    background: rgba(11, 12, 16, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 242, 254, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0, 242, 254, 0.03);
  }
  .quantum-text {
    background: linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .merkle-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
  .merkle-scroll::-webkit-scrollbar-track { background: transparent; }
  .merkle-scroll::-webkit-scrollbar-thumb { background: rgba(0, 242, 254, 0.3); border-radius: 10px; }
`;

function QuantumNetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let rafId: number, time = 0;
    const isMobile = W < 768;
    type Node = { x: number; y: number; z: number; a: number; s: number; pulseOff: number };
    const nodes: Node[] = Array.from({ length: isMobile ? 25 : 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      z: Math.random() * 1.5 + 0.5,
      a: Math.random() * Math.PI * 2,
      s: Math.random() * 0.3 + 0.1,
      pulseOff: Math.random() * Math.PI * 2
    }));
    const draw = () => {
      time += 0.015;
      ctx.fillStyle = "rgba(11, 12, 16, 0.3)";
      ctx.fillRect(0, 0, W, H);
      nodes.forEach((n, i) => {
        n.x += Math.cos(n.a) * n.s * (1/n.z);
        n.y += Math.sin(n.a) * n.s * (1/n.z);
        if(n.x < -50) n.x = W + 50; if(n.x > W + 50) n.x = -50;
        if(n.y < -50) n.y = H + 50; if(n.y > H + 50) n.y = -50;
        const pulse = Math.sin(time * 2 + n.pulseOff) * 0.5 + 0.5;
        const scale = 1 / n.z;
        const alpha = (0.2 + pulse * 0.5) * scale;
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          const maxDist = 120 * scale;
          if (dist < maxDist) {
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(n2.x, n2.y);
            const lineAlpha = (1 - dist / maxDist) * 0.15 * scale;
            const grad = ctx.createLinearGradient(n.x, n.y, n2.x, n2.y);
            grad.addColorStop(0, `rgba(0, 242, 254, ${lineAlpha})`);
            grad.addColorStop(1, `rgba(79, 172, 254, ${lineAlpha})`);
            ctx.strokeStyle = grad; ctx.lineWidth = 0.8 * scale; ctx.stroke();
          }
        }
        ctx.beginPath(); ctx.arc(n.x, n.y, 2 * scale + (pulse * 1.5 * scale), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${alpha})`; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${alpha * 0.2})`; ctx.fill();
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

function MerkleProofCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight, id: number, t = 0;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const levels = [
      [{ x: 0.5, label: "Root Hash", active: true }],
      [{ x: 0.25, label: "H(A+B)", active: true }, { x: 0.75, label: "H(C+D)", active: false }],
      [{ x: 0.12, label: "Leaf A", active: true }, { x: 0.38, label: "Leaf B", active: false }, { x: 0.62, label: "Leaf C", active: false }, { x: 0.88, label: "Leaf D", active: false }],
    ];
    const draw = () => {
      ctx.clearRect(0, 0, W, H); t += 0.03;
      const levelH = H / (levels.length + 1);
      const isMobile = W < 500;
      for (let li = 0; li < levels.length - 1; li++) {
        const lvl = levels[li], nextLvl = levels[li + 1];
        lvl.forEach((node, ni) => {
          [nextLvl[ni * 2], nextLvl[ni * 2 + 1]].filter(Boolean).forEach(child => {
            const isActivePath = node.active && child.active;
            ctx.beginPath(); ctx.moveTo(node.x * W, (li + 1) * levelH); ctx.lineTo(child.x * W, (li + 2) * levelH);
            ctx.strokeStyle = isActivePath ? `rgba(0, 242, 254, ${0.4 + Math.sin(t) * 0.4})` : "rgba(0, 242, 254, 0.1)";
            ctx.lineWidth = isActivePath ? 2 : 1; ctx.stroke();
          });
        });
      }
      levels.forEach((lvl, li) => {
        lvl.forEach(node => {
          const nx = node.x * W, ny = (li + 1) * levelH;
          const r = li === 0 ? (isMobile?15:20) : li === 1 ? (isMobile?12:16) : (isMobile?10:14);
          if (node.active) {
            const pulse = Math.sin(t * 1.5) * 0.5 + 0.5;
            ctx.beginPath(); ctx.arc(nx, ny, r + 4 + pulse * 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 242, 254, ${0.1 + pulse * 0.1})`; ctx.fill();
          }
          ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI * 2);
          ctx.fillStyle = node.active ? "#0F172A" : "#0B0C10"; ctx.fill();
          ctx.strokeStyle = node.active ? "#00F2FE" : "#1E293B"; ctx.lineWidth = node.active ? 2 : 1; ctx.stroke();
          ctx.fillStyle = node.active ? "#E0F2FE" : "#64748B";
          ctx.font = `600 ${isMobile ? 8 : 10}px 'JetBrains Mono'`; ctx.textAlign = "center";
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

function VestingCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight, id: number, t = 0;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    window.addEventListener("resize", resize);
    const PHASES = [
      { pct: 0.0, label: "TGE", color: "#00F2FE" },
      { pct: 0.31, label: "Cliff", color: "#4FACFE" },
      { pct: 0.93, label: "Phase 2", color: "#818CF8" },
      { pct: 1.0, label: "Expiry", color: "#F43F5E" },
    ];
    const draw = () => {
      ctx.clearRect(0, 0, W, H); t += 0.02;
      const isMobile = W < 500;
      const trackY = H * 0.5, pad = isMobile ? 30 : 60, trackW = W - pad * 2;
      const prog = (Math.sin(t * 0.5) * 0.5 + 0.5), fillW = trackW * prog;
      ctx.beginPath(); ctx.roundRect(pad, trackY - 3, trackW, 6, 3);
      ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fill();
      const grad = ctx.createLinearGradient(pad, 0, pad + fillW, 0);
      grad.addColorStop(0, "#00F2FE"); grad.addColorStop(0.5, "#4FACFE"); grad.addColorStop(1, "#F43F5E");
      ctx.beginPath(); ctx.roundRect(pad, trackY - 3, fillW, 6, 3); ctx.fillStyle = grad; ctx.fill();
      PHASES.forEach((ph, i) => {
        const x = pad + trackW * ph.pct, isActive = prog >= ph.pct, pulse = isActive ? Math.sin(t * 2 + i) * 3 : 0;
        if (isActive) { ctx.beginPath(); ctx.arc(x, trackY, 8 + pulse, 0, Math.PI * 2); ctx.fillStyle = `${ph.color}40`; ctx.fill(); }
        ctx.beginPath(); ctx.arc(x, trackY, 5, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? ph.color : "#0B0C10"; ctx.fill();
        ctx.strokeStyle = isActive ? "#FFF" : ph.color; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = isActive ? "#FFF" : "#94A3B8";
        ctx.font = `600 ${isMobile ? 9 : 11}px 'Manrope'`; ctx.textAlign = "center";
        ctx.fillText(ph.label, x, trackY + (i % 2 === 0 ? -15 : 22));
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="w-full h-[120px] md:h-[150px]" />;
}

function InstitutionalCard({ children, className = "", glowColor = "rgba(0,242,254,0.08)" }: { children: React.ReactNode, className?: string, glowColor?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rotX = useTransform(y, [-0.5, 0.5], [3, -3]);
  const rotY = useTransform(x, [-0.5, 0.5], [-3, 3]);
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
      className={`relative rounded-2xl md:rounded-3xl overflow-hidden glass-card transition-colors duration-300 hover:border-[#00F2FE]/30 ${className}`}
    >
      <motion.div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen"
        style={{ background: useTransform(() => `radial-gradient(600px circle at ${shineX.get()} ${shineY.get()}, ${glowColor}, transparent 50%)`) }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

export default function MerkleAirdropCaseStudy() {
  const [activeTab, setActiveTab] = useState<"math" | "architecture" | "timeline">("math");
  const TABS = [
    { id: "math", label: "Merkle Mathematics" },
    { id: "architecture", label: "Hybrid Pipeline" },
    { id: "timeline", label: "Vesting Mechanics" }
  ] as const;

  return (
    <div className="w-full bg-[#0B0C10] text-slate-300 merkle-font overflow-x-hidden selection:bg-[#00F2FE]/30 selection:text-[#E0F2FE]">
      <style>{CSS}</style>

      {/* ── HERO — fixed mobile height, content-driven ── */}
      <div className="relative w-full flex flex-col justify-end border-b border-[#00F2FE]/20"
        style={{ paddingTop: "clamp(48px, 8vw, 120px)" }}>
        
        {/* Canvas — absolute, behind content, capped height */}
        <div className="absolute inset-0 overflow-hidden" style={{ maxHeight: "320px" }}>
          <QuantumNetworkCanvas />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/60 to-transparent pointer-events-none" />

        <div className="relative z-10 px-5 md:px-16 pb-8 md:pb-12 w-full max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-5">
              <span className="px-2 md:px-3 py-1 bg-[#00F2FE]/10 border border-[#00F2FE]/40 text-[#00F2FE] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded shadow-[0_0_10px_rgba(0,242,254,0.2)]">
                EIP-712 Signatures
              </span>
              <span className="px-2 md:px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded backdrop-blur-md">
                O(1) Gas Complexity
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white mb-3 merkle-serif">
              Merkle-712 <br className="hidden md:block" />
              <span className="quantum-text">Airdrop Protocol.</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-base font-medium max-w-2xl leading-relaxed mb-5 md:mb-8 border-l-2 border-[#00F2FE] pl-3 md:pl-5 bg-gradient-to-r from-[#00F2FE]/5 to-transparent py-1.5 md:py-2">
              Solves the "Million User Problem" in token distribution. Combines off-chain Merkle Trees for extreme data compression with on-chain <strong className="text-white">EIP-712 structured signatures</strong> to prevent front-running claim bots.
            </p>
            <Link href="https://github.com/NexTechArchitect/Siso-Merkle-Airdrop" target="_blank"
              className="group relative inline-flex items-center justify-center gap-2 px-5 md:px-8 py-3 md:py-4 bg-[#00F2FE] text-[#0B0C10] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,242,254,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">Inspect Smart Contracts <span className="group-hover:translate-x-1 transition-transform">→</span></span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── METRICS BAR ── */}
      <div className="border-b border-white/5 bg-[#08090C]">
        <div className="max-w-7xl mx-auto px-5 md:px-16 py-5 md:py-8 grid grid-cols-4 gap-x-2 md:gap-4 divide-x divide-white/5">
          {[
            { value: "O(1)", label: "Gas Per Claim", sub: "Log(n) Proof Path", color: "text-[#00F2FE]" },
            { value: "32", suffix: "b", label: "Merkle Root", sub: "1M Users", color: "text-white" },
            { value: "712", prefix: "EIP-", label: "Security", sub: "Anti Front-Run", color: "text-[#4FACFE]" },
            { value: "97", suffix: "d", label: "Vesting", sub: "Phased", color: "text-[#818CF8]" }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="px-2 md:px-6 text-left">
              <h3 className={`text-lg sm:text-2xl md:text-4xl font-black mb-1 ${stat.color} merkle-serif leading-none`}>
                {stat.prefix}{stat.value}{stat.suffix}
              </h3>
              <p className="text-white font-bold text-[7px] md:text-[10px] uppercase tracking-widest mb-0.5 truncate">{stat.label}</p>
              <p className="text-slate-500 text-[6px] md:text-[9px] uppercase tracking-wider truncate hidden sm:block">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-0 z-50 bg-[#0B0C10]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-16 flex overflow-x-auto merkle-scroll gap-1 md:gap-4">
          {TABS.map((t, i) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`relative flex-shrink-0 px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                activeTab === t.id ? "text-[#00F2FE]" : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="opacity-30 mr-1 text-white">0{i + 1}</span> {t.label}
              {activeTab === t.id && (
                <motion.div layoutId="merkle-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00F2FE]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-5 md:px-16 py-6 md:py-16">
        <AnimatePresence mode="wait">
          {activeTab === "math" && (
            <motion.div key="mth" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-5 md:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
                <InstitutionalCard className="p-5 md:p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-3 md:mb-6">
                    <h3 className="text-base md:text-xl font-black text-white merkle-serif">Tree Compression</h3>
                    <span className="text-xl opacity-40">🌳</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-4">
                    Storing 1,000,000 users on-chain is cost-prohibitive. We compress all balances into a single 32-byte Root Hash.
                  </p>
                  <div className="bg-[#08090C] border border-white/5 rounded-lg p-4 merkle-mono text-[9px] md:text-[11px] text-slate-300 space-y-2 shadow-inner flex-1 overflow-x-auto">
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                      <span className="text-[#00F2FE] font-bold w-14">Leaves:</span><span>Keccak256(address, amount)</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                      <span className="text-[#00F2FE] font-bold w-14">Nodes:</span><span>Keccak256(Child_A, Child_B)</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                      <span className="text-[#00F2FE] font-bold w-14">Root:</span><span className="text-white">Final 32-byte Hash</span>
                    </div>
                  </div>
                </InstitutionalCard>
                <InstitutionalCard className="p-0 overflow-hidden flex flex-col">
                  <div className="p-4 md:p-5 border-b border-white/5 flex items-center justify-between bg-[#08090C]">
                    <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">Cryptographic Proof</h3>
                    <span className="bg-[#00F2FE]/10 text-[#00F2FE] text-[8px] px-2 py-1 rounded font-bold uppercase animate-pulse">Live Verifying</span>
                  </div>
                  <div className="bg-[#0B0C10] flex-1 relative min-h-[180px] md:min-h-[250px]"><MerkleProofCanvas /></div>
                  <div className="p-4 border-t border-white/5 bg-[#08090C] merkle-mono text-[9px] md:text-[11px] overflow-x-auto">
                    <p className="text-slate-500 mb-1">{"// Verification Logic"}</p>
                    <p className="text-slate-400">{"if ("}<span className="text-[#00F2FE] font-bold">CalculatedRoot</span> == <span className="text-[#4FACFE] font-bold">StoredRoot</span>{") {"}</p>
                    <p className="text-white pl-3 my-1">=&gt; Valid Claim Allowed</p>
                    <p className="text-slate-400">{"}"}</p>
                  </div>
                </InstitutionalCard>
              </div>
            </motion.div>
          )}

          {activeTab === "architecture" && (
            <motion.div key="arch" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-5 md:space-y-10">
              <InstitutionalCard className="p-5 md:p-10">
                <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-[#00F2FE] mb-5 md:mb-8 text-center">Hybrid Verification Pipeline</h3>
                <div className="flex flex-col gap-4 md:gap-8 max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-6">
                    <div className="w-full md:w-1/3 bg-[#08090C] border border-white/5 p-4 md:p-6 rounded-xl">
                      <h4 className="text-[#00F2FE] font-black mb-1.5 flex items-center gap-2"><span>1</span> Backend Engine</h4>
                      <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">Parses JSON whitelist, hashes address/amount pairs, and builds the Merkle Tree via Node.js scripts.</p>
                    </div>
                    <div className="hidden md:flex flex-col justify-center text-[#00F2FE] font-black text-xl">→</div>
                    <div className="w-full md:w-2/3 bg-[#0B0C10] border border-white/5 p-4 md:p-6 rounded-xl flex flex-col justify-center">
                      <h4 className="text-white text-xs md:text-sm font-bold mb-1">Output Generated</h4>
                      <p className="text-[10px] md:text-xs text-slate-400 mb-2">A single 32-byte Merkle Root is deployed to the Smart Contract.</p>
                      <code className="text-[9px] md:text-[10px] text-[#00F2FE] bg-[#00F2FE]/10 px-2 py-1 rounded w-fit merkle-mono">0x8a3f...d9c2</code>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-6">
                    <div className="w-full md:w-1/3 bg-[#08090C] border border-white/5 p-4 md:p-6 rounded-xl">
                      <h4 className="text-[#4FACFE] font-black mb-1.5 flex items-center gap-2"><span>2</span> EIP-712 Sign</h4>
                      <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">User connects MetaMask and signs Typed Structured Data.</p>
                    </div>
                    <div className="hidden md:flex flex-col justify-center text-[#4FACFE] font-black text-xl">→</div>
                    <div className="w-full md:w-2/3 bg-[#0B0C10] border border-white/5 p-4 md:p-6 rounded-xl">
                      <h4 className="text-white text-xs md:text-sm font-bold mb-3">3. On-Chain Smart Contract</h4>
                      <div className="space-y-2 text-[9px] md:text-[11px] merkle-mono">
                        <div className="flex flex-col sm:flex-row justify-between bg-black/30 p-2 md:p-3 rounded border border-white/5">
                          <span className="text-slate-500 mb-0.5 sm:mb-0">Verify Signature:</span>
                          <span className="text-[#4FACFE]">ECDSA.tryRecover == msg.sender</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between bg-black/30 p-2 md:p-3 rounded border border-white/5">
                          <span className="text-slate-500 mb-0.5 sm:mb-0">Verify Proof:</span>
                          <span className="text-[#00F2FE]">MerkleProof.verify(proof, root)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </InstitutionalCard>
              <div className="bg-[#08090C] border-l-2 border-l-rose-500 p-4 md:p-6 rounded-r-xl max-w-4xl mx-auto border-y border-r border-white/5">
                <h4 className="text-rose-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Why EIP-712 is Critical</h4>
                <p className="text-slate-300 text-[10px] md:text-[13px] leading-relaxed">
                  Without EIP-712, a front-running bot can monitor the mempool, copy a valid Merkle proof, and steal the airdrop. EIP-712 cryptographically binds the proof to the original user's address.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "timeline" && (
            <motion.div key="time" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-5 md:space-y-8">
              <InstitutionalCard className="p-5 md:p-10">
                <div className="text-center max-w-2xl mx-auto mb-5 md:mb-10">
                  <h3 className="text-base md:text-xl font-black text-white mb-2 merkle-serif">Phased Vesting Mechanics</h3>
                  <p className="text-slate-400 text-[10px] md:text-sm leading-relaxed">
                    Immediate 100% unlocks create massive sell pressure. This protocol enforces a staggered release schedule.
                  </p>
                </div>
                <div className="mb-5 md:mb-10 bg-[#08090C] border border-white/5 rounded-xl overflow-hidden p-2 md:p-4">
                  <VestingCanvas />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { day: "Day 0", title: "TGE Starts", desc: "Claim first 50% immediately.", color: "text-[#00F2FE]" },
                    { day: "Day 30", title: "Cliff Starts", desc: "Claims paused to encourage holding.", color: "text-[#4FACFE]" },
                    { day: "Day 90", title: "Cliff Ends", desc: "Remaining 50% unlocked.", color: "text-[#818CF8]" },
                    { day: "Day 97", title: "Expiry", desc: "Claims closed. Unclaimed tokens burned.", color: "text-rose-400" }
                  ].map((phase, i) => (
                    <div key={i} className="p-3 md:p-4 rounded-xl border border-white/5 bg-black/20">
                      <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${phase.color}`}>{phase.day}</span>
                      <h4 className="text-white text-xs md:text-sm font-bold mb-1 mt-1">{phase.title}</h4>
                      <p className="text-[10px] md:text-[11px] text-slate-400">{phase.desc}</p>
                    </div>
                  ))}
                </div>
              </InstitutionalCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="border-t border-[#00F2FE]/10 bg-[#08090C]">
        <div className="max-w-7xl mx-auto px-5 md:px-16 py-8 md:py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="merkle-mono text-[9px] md:text-[10px] text-[#00F2FE]/60 uppercase tracking-widest mb-1">Merkle-712 Airdrop Protocol</p>
            <p className="text-slate-400 text-xs md:text-sm">O(1) gas · EIP-712 · Solidity · Hardhat</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="https://github.com/NexTechArchitect/Siso-Merkle-Airdrop" target="_blank"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#00F2FE]/30 text-[#00F2FE] text-[10px] font-bold uppercase tracking-widest merkle-mono hover:bg-[#00F2FE]/10 transition-all">
              GitHub ↗
            </Link>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00F2FE]/5 border border-[#00F2FE]/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="merkle-mono text-[9px] text-slate-400 uppercase tracking-widest">Deployed</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
