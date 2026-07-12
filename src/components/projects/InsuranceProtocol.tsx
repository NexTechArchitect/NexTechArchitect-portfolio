"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ── 1. PREMIUM AURA BACKGROUND ───────────────────────────────────────────────
function AmbientAura() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#FAFAFA] rounded-b-[40px]">
      <motion.div
        animate={{ x: ["-5%", "10%", "-5%"], y: ["-5%", "15%", "-5%"], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-300/10 blur-[120px]"
      />
      <motion.div
        animate={{ x: ["10%", "-10%", "10%"], y: ["15%", "-5%", "15%"], scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-emerald-300/10 blur-[140px]"
      />
      {/* Crisp Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.25]"
        style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }}
      />
    </div>
  );
}

// ── 2. NEXT-LEVEL CANVAS VISUALIZER (WebGL Alternative) ──────────────────────
function Web3ProtocolCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const nodes = [
      { id: "User", x: 0.15, y: 0.5, color: "#3B82F6" },         // Blue
      { id: "Engine", x: 0.45, y: 0.35, color: "#8B5CF6" },      // Indigo
      { id: "Vault", x: 0.75, y: 0.5, color: "#10B981" },        // Emerald
      { id: "Aave", x: 0.9, y: 0.75, color: "#F59E0B" },         // Amber
      { id: "DAO", x: 0.45, y: 0.75, color: "#64748B" }          // Slate
    ];

    const links = [
      { from: 0, to: 1, flow: true }, // User -> Engine
      { from: 1, to: 2, flow: true }, // Engine -> Vault
      { from: 2, to: 3, flow: true }, // Vault -> Aave
      { from: 4, to: 2, flow: false } // DAO -> Vault (Governance, no capital flow)
    ];

    const draw = () => {
      time += 0.01;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      links.forEach(link => {
        const n1 = nodes[link.from];
        const n2 = nodes[link.to];
        const x1 = n1.x * w, y1 = n1.y * h;
        const x2 = n2.x * w, y2 = n2.y * h;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();

        if (link.flow) {
          const t = (time * 1.5 + link.from) % 1;
          const px = x1 + (x2 - x1) * t;
          const py = y1 + (y2 - y1) * t;
          
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = n1.color;
          ctx.shadowColor = n1.color;
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0; 
        }
      });

      nodes.forEach(node => {
        const nx = node.x * w;
        const ny = node.y * h;
        const pulse = Math.sin(time * 2 + node.x * 10) * 4;

        ctx.beginPath();
        ctx.arc(nx, ny, 16 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}33`; 
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, 8, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#475569";
        ctx.textAlign = "center";
        ctx.fillText(node.id.toUpperCase(), nx, ny - 25);
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-[250px] sm:h-[350px] relative bg-white/40 border border-white/80 rounded-3xl shadow-[inset_0_2px_20px_rgba(255,255,255,0.9)] overflow-hidden">
      <div className="absolute top-4 left-5 z-10">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100/50 px-2 py-1 rounded-md">Live Protocol Trace</span>
      </div>
      <canvas ref={canvasRef} className="block w-full h-full relative z-0" />
    </div>
  );
}

// ── 3. ADDRESS CHIP COMPONENT ────────────────────────────────────────────────
function AddressChip({ label, address }: { label: string; address: string; }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const short = address.slice(0, 6) + "…" + address.slice(-4);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 bg-white/60 backdrop-blur-md border border-white rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all group">
      <div className="flex flex-col mb-2 sm:mb-0">
        <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold">{label}</span>
        <span className="text-[12px] sm:text-[14px] text-slate-800 font-mono mt-0.5 font-bold group-hover:text-blue-600 transition-colors">{short}</span>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button onClick={copy} className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors text-[9px] font-bold uppercase tracking-widest">
          {copied ? "Copied" : "Copy"}
        </button>
        <Link href={`https://basescan.org/address/${address}`} target="_blank" className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors text-[9px] font-bold uppercase tracking-widest text-center">
          Basescan ↗
        </Link>
      </div>
    </div>
  );
}

// ── 4. MAIN COMPONENT ───────────────────────────────────────────────────────
export default function SentinelCaseStudy() {
  const [tab, setTab] = useState<"architecture" | "contracts" | "security" | "deployment">("architecture");

  const TABS = [
    { id: "architecture", label: "Architecture" },
    { id: "contracts",    label: "Contracts"    },
    { id: "security",     label: "Security Audit" },
    { id: "deployment",   label: "Base Mainnet" },
  ] as const;

  return (
    // FIX 1: Removed min-h-screen to let it hug the content height inside the modal
    <div className="relative w-full flex flex-col bg-[#FAFAFA] font-sans selection:bg-blue-200 rounded-b-[40px] overflow-hidden">
      <AmbientAura />

      {/* ══ HERO SECTION ══ */}
      <section className="relative z-10 w-full px-5 sm:px-10 pt-16 sm:pt-24 pb-8 sm:pb-12 flex flex-col items-center justify-center text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-2 mb-6">
          <span className="px-3 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border border-blue-200/60 bg-blue-50/50 text-blue-700 rounded-lg backdrop-blur-md">
            🛡️ DeFi Insurance
          </span>
          <span className="px-3 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border border-emerald-200/60 bg-emerald-50/50 text-emerald-700 rounded-lg backdrop-blur-md">
            🔵 Base Mainnet
          </span>
          <span className="px-3 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border border-indigo-200/60 bg-indigo-50/50 text-indigo-700 rounded-lg backdrop-blur-md">
            ERC-4626 Vault
          </span>
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] mb-5" style={{ fontFamily: "'Georgia', serif" }}>
          Sentinel Insurance <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500">Infrastructure.</span>
        </motion.h1>
        
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-[13px] sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium mb-8 px-2">
          A modular, security-first DeFi insurance protocol built on Base L2. Token-weighted DAO adjudication, automated yield via Aave V3, and soulbound policy NFTs.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-3 justify-center w-full px-4 sm:px-0">
          <Link href="https://sentinel-insurance-protocol.vercel.app/" target="_blank"
            className="w-full sm:w-auto px-8 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-xl bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg transition-all text-center">
            Launch App ↗
          </Link>
          <Link href="https://github.com/NexTechArchitect/Sentinel-Insurance-Protocol" target="_blank"
            className="w-full sm:w-auto px-8 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-xl border border-slate-300 text-slate-700 bg-white/50 backdrop-blur-md hover:bg-white hover:text-slate-900 transition-all text-center">
            Source Code
          </Link>
        </motion.div>
      </section>

      {/* ══ CLEAN TABS ══ */}
      <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-2xl border-y border-slate-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-4 sm:gap-8 overflow-x-auto hide-scroll items-center h-14 sm:h-16">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`shrink-0 relative px-2 py-4 text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-colors ${
                tab === t.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
              {tab === t.id && <motion.div layoutId="sentinel-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-t-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* ══ CONTENT AREA ══ */}
      {/* FIX 2: Removed flex-1 and adjusted pb-20 to pb-12 so it doesn't stretch artificially */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <AnimatePresence mode="wait">

          {/* ─ ARCHITECTURE ─ */}
          {tab === "architecture" && (
            <motion.div key="arch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">
              
              <div className="p-6 sm:p-10 bg-white/40 backdrop-blur-3xl border border-white/80 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-8 leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                  Solving Idle Capital & Centralization.
                </h2>
                
                {/* Visualizer Injection */}
                <Web3ProtocolCanvas />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
                  {[
                    { icon: "📈", t: "Capital Efficiency", d: "CoveragePool implements ERC-4626, routing idle USDC collateral natively into Aave V3 for continuous APY." },
                    { icon: "🛡️", t: "Flash-Loan Resistant", d: "ClaimsGovernor enforces historical checkpoint tracking (block.number - 1) to neutralize voting attacks." },
                    { icon: "🖼️", t: "Dynamic NFTs", d: "Active policies are minted as ERC-721 receipts with fully on-chain SVG art reflecting real-time states." }
                  ].map((item, i) => (
                    <div key={i} className="p-5 bg-white/60 border border-white rounded-2xl shadow-sm">
                      <span className="text-3xl mb-3 block drop-shadow-sm">{item.icon}</span>
                      <h4 className="text-[11px] font-black text-slate-900 mb-2 uppercase tracking-widest">{item.t}</h4>
                      <p className="text-[12px] text-slate-600 leading-relaxed font-medium">{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─ CONTRACTS ─ */}
          {tab === "contracts" && (
            <motion.div key="con" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { c: "text-blue-600", domain: "ROUTING & ISSUANCE", title: "PolicyEngine.sol", desc: "Central hub for policy origination. Validates risk thresholds via RiskRegistry, locks premiums, and triggers PolicyNFT minting." },
                  { c: "text-emerald-600", domain: "CAPITAL VAULT (4626)", title: "CoveragePool.sol", desc: "Ensures capital efficiency by sweeping surplus USDC into Aave V3 lending pools to accrue yield for Liquidity Providers." },
                  { c: "text-indigo-600", domain: "DAO ADJUDICATION", title: "ClaimsGovernor.sol", desc: "Handles the entire lifecycle of an insurance claim. Features strict block-snapshot queries to neutralize flash-loan attacks." },
                  { c: "text-rose-600", domain: "EMERGENCY SAFEGUARD", title: "VetoCouncil.sol", desc: "Multi-signature threshold contract acting as a final fail-safe mechanism to void maliciously approved claims." },
                ].map((item, i) => (
                  <div key={i} className="p-6 sm:p-8 bg-white/40 backdrop-blur-3xl border border-white/80 rounded-[28px] shadow-sm hover:bg-white/60 transition-colors">
                    <h3 className={`${item.c} text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-3`}>{item.domain}</h3>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Georgia', serif" }}>{item.title}</h2>
                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
            </motion.div>
          )}

          {/* ─ SECURITY ─ */}
          {tab === "security" && (
            <motion.div key="sec" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="p-6 sm:p-10 bg-white/40 backdrop-blur-3xl border border-white/80 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-200/50 pb-8">
                  <div>
                    <h3 className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">Slither Static Analysis</h3>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Audit Profile.</h2>
                  </div>
                  <span className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                    ✅ Production Cleared
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {[
                    { n: "0", l: "High Risk", c: "text-slate-300" },
                    { n: "2", l: "Medium (False Pos)", c: "text-amber-500" },
                    { n: "11", l: "Low (ERC Std)", c: "text-blue-500" },
                    { n: "16", l: "Info (NatSpec)", c: "text-emerald-500" },
                  ].map((s, i) => (
                    <div key={i} className="p-5 bg-white/80 rounded-2xl border border-slate-100 text-center shadow-sm">
                      <p className={`text-4xl font-black mb-2 ${s.c}`}>{s.n}</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.l}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3">Implemented Mitigations</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/60 rounded-xl border border-white text-[12px] text-slate-700 font-medium shadow-sm">
                      <strong className="text-blue-600">Flash-Loan Immunity:</strong> `getPastVotes(addr, block.number - 1)` ensures voting power cannot be manipulated in a single block.
                    </div>
                    <div className="p-4 bg-white/60 rounded-xl border border-white text-[12px] text-slate-700 font-medium shadow-sm">
                      <strong className="text-blue-600">CEI Pattern & Guards:</strong> Strict Checks-Effects-Interactions and `ReentrancyGuard` on all capital-touching functions.
                    </div>
                    <div className="p-4 bg-white/60 rounded-xl border border-white text-[12px] text-slate-700 font-medium shadow-sm">
                      <strong className="text-blue-600">Share Inflation Protected:</strong> `_decimalsOffset = 6` implemented in CoveragePool to prevent ERC-4626 donation attacks.
                    </div>
                    <div className="p-4 bg-white/60 rounded-xl border border-white text-[12px] text-slate-700 font-medium shadow-sm">
                      <strong className="text-blue-600">Immutable Roles:</strong> One-time role initialization. Zero post-deploy admin key rotation attack surface.
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ─ DEPLOYMENT ─ */}
          {tab === "deployment" && (
            <motion.div key="dep" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="p-6 sm:p-8 bg-white/40 backdrop-blur-3xl border border-white/80 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-blue-600 text-[10px] font-black uppercase tracking-widest ml-1 mb-4">Core Engines (Base)</h3>
                  <div className="space-y-3">
                    <AddressChip label="PolicyEngine" address="0xEF80cd6370D4619D2f71BD4000a4757357Be5564" />
                    <AddressChip label="CoveragePool" address="0x374d949c7A575212d423Ecc0e765a59664d7C3eD" />
                    <AddressChip label="RiskRegistry" address="0x049C2eC773cDa5F3a19F9cc7C67D3331C21853DB" />
                    <AddressChip label="PolicyNFT"    address="0x02A9E50D9EB6fec67c419C5ddb3ffd894DD01C00" />
                  </div>
                </div>
                
                <div className="p-6 sm:p-8 bg-white/40 backdrop-blur-3xl border border-white/80 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-emerald-600 text-[10px] font-black uppercase tracking-widest ml-1 mb-4">Governance (Base)</h3>
                  <div className="space-y-3">
                    <AddressChip label="ClaimsGovernor" address="0xB7939f8b41C932595cf358842BC63AFE221D2Ba3" />
                    <AddressChip label="ShieldToken"    address="0xafE2B560ad1743DA67BdA1850aF47CdB2280a2d1" />
                    <AddressChip label="VetoCouncil"    address="0x896627825AEAc934e4CAec4cb00EC8B90a5292B0" />
                    <AddressChip label="PayoutExecutor" address="0x897a76eC710DC780E4627532A0e863F2672d50A7" />
                  </div>
                </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}