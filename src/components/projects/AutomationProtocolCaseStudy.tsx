"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bricolage_Grotesque, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

const displayFont = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });
const monoFont = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"] });

// ─── HIGH-END 3D WEBGL-STYLE CANVAS ──────────────────────────────────────────
function Premium3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let animationFrame: number;
    let time = 0;

    // 3D Engine Constants
    const nodes: { x: number; y: number; z: number; size: number }[] = [];
    const numNodes = 25; // Keep it clean
    const fov = 300;

    // Generate random nodes in a sphere
    for (let i = 0; i < numNodes; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 60 + Math.random() * 40;
      nodes.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        size: Math.random() * 2 + 1.5,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.003;

      const centerX = width / 2;
      const centerY = height / 2;

      // Project and rotate nodes
      const projected = nodes.map((node) => {
        // Rotate around Y and X axis
        const cosY = Math.cos(time);
        const sinY = Math.sin(time);
        const cosX = Math.cos(time * 0.5);
        const sinX = Math.sin(time * 0.5);

        // Y Rotation
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // X Rotation
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        // 3D to 2D Projection
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        return { x: projX, y: projY, z: z2, scale, size: node.size };
      });

      // Sort by Z for proper depth rendering
      projected.sort((a, b) => b.z - a.z);

      // Draw Connections (Web3 Network Vibe)
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.15; // Light subtle lines
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`; // Tailwind sky-500
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      projected.forEach((p) => {
        const alpha = Math.max(0.1, (fov - p.z) / (fov * 1.5));
        
        // Outer Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.scale * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${alpha * 0.3})`; // Cyan glow
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 165, 233, ${alpha + 0.2})`; // Sky blue core
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-multiply"
    />
  );
}

// ─── ADDRESS CHIP ─────────────────────────────────────────────────────────────
function AddressChip({ label, address, tag }: { label: string; address: string; tag: string }) {
  const [copied, setCopied] = useState(false);
  const short = address.slice(0, 8) + "…" + address.slice(-6);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all gap-4">
      <div>
        <div className={`text-sm font-bold text-slate-800 ${displayFont.className}`}>{label}</div>
        <div className={`text-[10px] text-slate-500 uppercase tracking-widest mt-1 ${monoFont.className}`}>{tag}</div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <code className={`px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 flex-1 sm:flex-none text-center ${monoFont.className}`}>
          {short}
        </code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className={`px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${monoFont.className}`}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function OnChainAutomationCaseStudy() {
  const [activeTab, setActiveTab] = useState<"architecture" | "contracts">("architecture");

  return (
    <div className={`w-full bg-[#F8FAFC] text-slate-900 rounded-b-[40px] overflow-hidden ${bodyFont.className}`}>
      
      {/* ── HERO SECTION ── */}
      <div className="relative w-full min-h-[400px] flex flex-col justify-center border-b border-slate-200 bg-white overflow-hidden">
        {/* 3D Canvas Background */}
        <Premium3DCanvas />
        
        {/* Gradients to blend canvas */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="relative z-10 px-6 md:px-16 pt-20 pb-12 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className={`px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 ${monoFont.className}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Base Mainnet
            </span>
            <span className={`px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-lg ${monoFont.className}`}>
              Keeper Network
            </span>
          </div>

          <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1] ${displayFont.className}`}>
            OnChain <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Automation</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-2xl leading-relaxed mb-8 font-medium">
            A decentralized, permissionless keeper network. Bonded operators watch your smart contracts around the clock and execute transactions securely via a fault-isolated engine. No centralized cron-bots.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="https://on-chain-automation-protocol.vercel.app/" target="_blank"
              className={`px-8 py-3.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 text-center ${monoFont.className}`}>
              Launch Protocol ↗
            </Link>
            <Link href="https://github.com/NexTechArchitect/OnChain-Automation-Protocol" target="_blank"
              className={`px-8 py-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all text-center ${monoFont.className}`}>
              View Source Code
            </Link>
          </div>
        </div>
      </div>

      {/* ── KEY METRICS ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-16 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-slate-100">
          {[
            { v: "O(1)", l: "Queue Design" },
            { v: "Zero", l: "Engine Balance" },
            { v: "3-Day", l: "Unbond Delay" },
            { v: "100%", l: "Slither Passed" },
          ].map((s, i) => (
            <div key={i} className="px-4 text-center md:text-left">
              <p className={`text-[10px] text-slate-400 uppercase tracking-widest mb-1 ${monoFont.className}`}>{s.l}</p>
              <p className={`text-2xl font-black text-slate-800 ${displayFont.className}`}>{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-16 flex gap-8 overflow-x-auto hide-scrollbar">
          {[
            { id: "architecture", label: "Core Architecture" },
            { id: "contracts", label: "Deployed Contracts" },
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`relative py-5 text-[11px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${monoFont.className} ${
                activeTab === t.id ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
              {activeTab === t.id && (
                <motion.div layoutId="light-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-10 pb-16">
        <AnimatePresence mode="wait">

          {/* ════ TAB 1: ARCHITECTURE ════ */}
          {activeTab === "architecture" && (
            <motion.div key="arch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { icon: "🔐", title: "KeeperRegistry", desc: "Manages operator identities, ETH bonds, and slashing. Auto-jails malicious operators.", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: "📋", title: "JobManager", desc: "Stores execution intents. Uses a highly optimized O(1) swap-and-pop array to process jobs.", color: "text-amber-600", bg: "bg-amber-50" },
                  { icon: "⚡", title: "ExecutionEngine", desc: "Stateless router. Wraps every target call in a try/catch boundary. Holds zero ETH.", color: "text-cyan-600", bg: "bg-cyan-50" },
                ].map((card, i) => (
                  <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center text-xl mb-4`}>{card.icon}</div>
                    <h3 className={`text-lg font-bold text-slate-800 mb-2 ${displayFont.className}`}>{card.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{card.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm mt-6">
                <h3 className={`text-sm font-black uppercase tracking-widest text-slate-800 mb-6 ${monoFont.className}`}>Execution Flow</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { n: "1", title: "Offchain Simulation", desc: "Keeper calls checkUpkeep() locally via eth_call for zero gas. Returns boolean." },
                    { n: "2", title: "Onchain Validation", desc: "Engine checks keeper bond, basefee ceilings, and job readiness." },
                    { n: "3", title: "Isolated Execution", desc: "Target runs inside try/catch. A reverting job cannot crash the batch queue." },
                    { n: "4", title: "Atomic Settlement", desc: "Timestamps update, rewards are split, and reputation increases in a single commit." },
                  ].map((step) => (
                    <div key={step.n} className="flex gap-4 items-start">
                      <div className={`w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0 text-xs ${monoFont.className}`}>
                        {step.n}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold text-slate-800 mb-1 ${displayFont.className}`}>{step.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* ════ TAB 2: CONTRACTS ════ */}
          {activeTab === "contracts" && (
            <motion.div key="con" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm">
                <h3 className={`text-sm font-black uppercase tracking-widest text-slate-800 mb-6 ${monoFont.className}`}>Base Mainnet Deployments</h3>
                <div className="flex flex-col gap-3">
                  <AddressChip label="KeeperRegistry.sol" address="0xcEa37b9CCA6170d43BF133CCfdeaD9CB2A4D61D3" tag="Operator Bonds & Slashing" />
                  <AddressChip label="JobManager.sol" address="0xBAa2B4c250DD6da358e23244C2fa85dA1927718C" tag="O(1) Queue & Escrow" />
                  <AddressChip label="ExecutionEngine.sol" address="0x388665c32F9F17E0d5cfEE3Eabe1880A3AEd80e9" tag="Stateless Router" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-6xl">🔒</div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className={`text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2 ${monoFont.className}`}>Security Profile</h3>
                    <h2 className={`text-2xl font-black text-white mb-2 ${displayFont.className}`}>0 Critical / 0 High Risk</h2>
                    <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                      Architecture audited via Slither Static Analysis. Features strict CEI patterns, 3-day unbonding lockups to prevent flash-exit attacks, and mathematically clamped reputation scores to prevent integer overflow gaming.
                    </p>
                  </div>
                  <div className={`px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-widest text-center ${monoFont.className}`}>
                    Ready for Production
                  </div>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}