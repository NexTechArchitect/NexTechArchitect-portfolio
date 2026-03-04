"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@400;600;800&family=Inter:wght@400;500;600&display=swap');
  .aa-heading { font-family: 'Outfit', sans-serif; }
  .aa-mono    { font-family: 'JetBrains Mono', monospace; }
  .aa-body    { font-family: 'Inter', sans-serif; }
  .aa-gold-text {
    background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .aa-glass {
    background: rgba(3, 5, 9, 0.7);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(245, 158, 11, 0.12);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 0 15px rgba(245,158,11,0.02);
  }
  .aa-scroll::-webkit-scrollbar { width:4px; height:4px; }
  .aa-scroll::-webkit-scrollbar-track { background: transparent; }
  .aa-scroll::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.3); border-radius:10px; }
`;

function CyberGridCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    let rafId: number, t = 0;
    const isMobile = W < 640;
    const draw = () => {
      rafId = requestAnimationFrame(draw); t += 0.005;
      ctx.clearRect(0, 0, W, H);
      const cx = W/2, cy = isMobile ? H/3 : H/2;
      const rings = isMobile ? 3 : 5;
      for (let i = 1; i <= rings; i++) {
        const radius = (i*(isMobile?40:60)) + Math.sin(t*2+i)*10;
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(245,158,11,${0.05+(0.1/i)})`; ctx.lineWidth=1;
        ctx.setLineDash([5,10]); ctx.stroke(); ctx.setLineDash([]);
      }
      const scanY = (Math.sin(t*1.5)*0.5+0.5)*H;
      const grad = ctx.createLinearGradient(0,scanY-20,0,scanY+20);
      grad.addColorStop(0,"rgba(0,212,255,0)"); grad.addColorStop(0.5,"rgba(0,212,255,0.15)"); grad.addColorStop(1,"rgba(0,212,255,0)");
      ctx.fillStyle=grad; ctx.fillRect(0,scanY-20,W,40);
      const coreR = isMobile?20:30;
      const coreGrad = ctx.createRadialGradient(cx,cy,0,cx,cy,coreR*2);
      coreGrad.addColorStop(0,"rgba(245,158,11,0.3)"); coreGrad.addColorStop(1,"rgba(245,158,11,0)");
      ctx.beginPath(); ctx.arc(cx,cy,coreR*2,0,Math.PI*2); ctx.fillStyle=coreGrad; ctx.fill();
    };
    draw();
    const resize = () => { W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; };
    window.addEventListener("resize",resize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen" />;
}

function ValidationCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    let id: number;
    const isMobile = W < 400;
    const STEPS = [
      { label:"validateUserOp()", color:"#F59E0B", sub:"Signature check" },
      { label:"validatePaymasterUserOp()", color:"#A78BFA", sub:"Gas sponsorship" },
      { label:"handleOps()", color:"#00D4FF", sub:"Execute batch" },
      { label:"execute()", color:"#34D399", sub:"Target call" },
    ];
    const resize = () => { W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; };
    window.addEventListener("resize",resize);
    let signal = 0;
    const draw = () => {
      id=requestAnimationFrame(draw); ctx.clearRect(0,0,W,H);
      signal = (signal+0.015)%1;
      const pad=24, stepH=(H-pad*2)/STEPS.length, lineX=isMobile?24:40;
      ctx.beginPath(); ctx.moveTo(lineX,pad); ctx.lineTo(lineX,H-pad);
      ctx.strokeStyle="rgba(245,158,11,0.2)"; ctx.lineWidth=2; ctx.stroke();
      const sigY=pad+signal*(H-pad*2);
      ctx.beginPath(); ctx.arc(lineX,sigY,4,0,Math.PI*2); ctx.fillStyle="#FCD34D"; ctx.fill();
      STEPS.forEach((step,si) => {
        const sy=pad+si*stepH+stepH*0.5;
        const isActive=Math.abs(signal-(si+0.5)/STEPS.length)<0.15;
        ctx.beginPath(); ctx.arc(lineX,sy,6,0,Math.PI*2);
        ctx.fillStyle=isActive?step.color:"#030509"; ctx.fill();
        ctx.strokeStyle=step.color; ctx.lineWidth=isActive?2:1; ctx.stroke();
        const textX=lineX+16;
        ctx.font=`600 ${isMobile?9:11}px 'JetBrains Mono', monospace`;
        ctx.fillStyle=isActive?step.color:"rgba(255,255,255,0.6)";
        ctx.textAlign="left"; ctx.textBaseline="middle";
        ctx.fillText(step.label,textX,sy-6);
        ctx.font=`400 ${isMobile?8:9}px 'Inter', sans-serif`;
        ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.fillText(step.sub,textX,sy+8);
      });
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={ref} className="w-full h-full min-h-[220px]" />;
}

function VaultCard({ children, className="", glow="rgba(245,158,11,0.05)" }: { children: React.ReactNode; className?: string; glow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const rX = useSpring(useTransform(y,[-0.5,0.5],[3,-3]),{stiffness:200,damping:25});
  const rY = useSpring(useTransform(x,[-0.5,0.5],[-3,3]),{stiffness:200,damping:25});
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r=ref.current?.getBoundingClientRect(); if(!r) return;
    x.set((e.clientX-r.left)/r.width-0.5); y.set((e.clientY-r.top)/r.height-0.5);
  },[x,y]);
  const onLeave = useCallback(()=>{ x.set(0); y.set(0); },[x,y]);
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{rotateX:rX,rotateY:rY,transformStyle:"preserve-3d",perspective:1200}}
      className={`relative rounded-2xl md:rounded-3xl overflow-hidden aa-glass transition-colors duration-300 hover:border-[#F59E0B]/30 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

export default function AACoreCaseStudy() {
  const [tab, setTab] = useState<"arch"|"flow"|"session">("arch");
  const TABS = [
    { id:"arch", label:"Architecture" },
    { id:"flow", label:"Transaction Flow" },
    { id:"session", label:"Session Keys" },
  ] as const;

  return (
    <div className="w-full bg-[#030509] text-slate-300 aa-body overflow-x-hidden selection:bg-[#F59E0B]/30 selection:text-[#FCD34D]">
      <style>{CSS}</style>

      {/* ── HERO — content-driven, no giant canvas gap ── */}
      <div className="relative w-full flex flex-col justify-end border-b border-[#F59E0B]/20"
        style={{ paddingTop: "clamp(48px, 8vw, 120px)" }}>

        {/* Canvas capped so it doesn't eat mobile screen */}
        <div className="absolute inset-0 overflow-hidden" style={{ maxHeight: "280px" }}>
          <CyberGridCanvas />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030509] via-[#030509]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 px-5 md:px-16 pb-8 md:pb-12 w-full max-w-7xl mx-auto">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, ease:"easeOut" }}>
            <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-5">
              <span className="px-2 md:px-3 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/40 text-[#FCD34D] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded aa-mono">ERC-4337</span>
              <span className="px-2 md:px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded aa-mono">Foundry</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white mb-3 aa-heading">
              Account <br className="hidden md:block" />
              <span className="aa-gold-text">Abstraction.</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-base font-medium max-w-2xl leading-relaxed mb-5 md:mb-8 border-l-2 border-[#F59E0B] pl-3 md:pl-5 bg-gradient-to-r from-[#F59E0B]/5 to-transparent py-1.5">
              From-scratch ERC-4337 implementation — bypassing high-level SDKs to expose raw <strong className="text-white">UserOperation packing</strong>, EntryPoint validation, and Paymaster mechanics.
            </p>
            <Link href="https://github.com/NexTechArchitect/ERC4337-Account-Abstraction-Foundry" target="_blank"
              className="group relative inline-flex items-center justify-center gap-2 px-5 md:px-8 py-3 md:py-4 bg-[#F59E0B] text-[#030509] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] aa-mono"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">Inspect Source <span className="group-hover:translate-x-1 transition-transform">→</span></span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── METRICS BAR ── */}
      <div className="border-b border-white/5 bg-[#05070B]">
        <div className="max-w-7xl mx-auto px-5 md:px-16 py-5 md:py-8 grid grid-cols-4 gap-x-2 md:gap-4 divide-x divide-white/5">
          {[
            { value:"4337", prefix:"ERC-", label:"Standard", sub:"No consensus change", color:"text-[#FCD34D]" },
            { value:"0.7", prefix:"v", label:"EntryPoint", sub:"Latest spec", color:"text-white" },
            { value:"3", suffix:"x", label:"Modules", sub:"Account·PM·Keys", color:"text-[#00D4FF]" },
            { value:"0", suffix:" gas", label:"Friction", sub:"Gasless UX", color:"text-[#34D399]" },
          ].map((s,i) => (
            <motion.div key={i} initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3+i*0.1 }} className="px-2 md:px-6 text-left">
              <h3 className={`text-lg sm:text-2xl md:text-4xl font-black mb-1 ${s.color} aa-heading leading-none`}>{s.prefix}{s.value}{s.suffix}</h3>
              <p className="text-white font-bold text-[7px] md:text-[10px] uppercase tracking-widest mb-0.5 aa-mono truncate">{s.label}</p>
              <p className="text-slate-500 text-[6px] md:text-[9px] uppercase tracking-wider aa-mono truncate hidden sm:block">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-0 z-50 bg-[#030509]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-16 flex overflow-x-auto aa-scroll gap-1 md:gap-4">
          {TABS.map((t,i) => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`relative flex-shrink-0 px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.15em] transition-colors aa-mono ${tab===t.id?"text-[#F59E0B]":"text-slate-400 hover:text-white"}`}
            >
              <span className="opacity-30 mr-1 text-white">0{i+1}</span> {t.label}
              {tab===t.id && <motion.div layoutId="aa-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F59E0B]" />}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-5 md:px-16 py-6 md:py-16">
        <AnimatePresence mode="wait">

          {tab==="arch" && (
            <motion.div key="arch" initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-15 }} className="space-y-5 md:space-y-8">
              <VaultCard className="p-5 md:p-8">
                <h3 className="text-base md:text-xl font-black uppercase tracking-widest text-[#FCD34D] mb-4 text-center aa-heading">EOA vs Smart Account</h3>
                <div className="overflow-x-auto aa-scroll">
                  <table className="w-full text-xs md:text-sm min-w-[450px]">
                    <thead className="bg-[#05070B] border-b border-white/10">
                      <tr>
                        <th className="text-left py-3 px-4 text-slate-400 font-bold uppercase tracking-wider text-[9px] aa-mono">Feature</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-bold uppercase tracking-wider text-[9px] aa-mono">Traditional EOA</th>
                        <th className="text-left py-3 px-4 text-[#F59E0B] font-bold uppercase tracking-wider text-[9px] aa-mono">Smart Account (AA)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        ["Control","Single Private Key","Arbitrary Logic (Multi-sig)"],
                        ["Gas Payment","ETH only","ETH, ERC-20, Sponsored"],
                        ["Security","Seed Phrase Risk","Session Keys, Spend Limits"],
                        ["Upgradability","Impossible","Possible (via Proxies)"],
                      ].map(([feat,eoa,aa],i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 text-slate-300 font-semibold text-[10px] md:text-xs aa-mono">{feat}</td>
                          <td className="py-3 px-4 text-slate-500 text-[11px] md:text-xs">{eoa}</td>
                          <td className="py-3 px-4 text-[#34D399] text-[11px] md:text-xs font-semibold">{aa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </VaultCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <VaultCard className="p-5 md:p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-black text-white aa-heading">Smart Account Core</h3>
                    <span className="text-xl opacity-40">🔐</span>
                  </div>
                  <p className="text-[11px] md:text-sm text-slate-400 leading-relaxed mb-4">
                    Implements <code className="text-[#FCD34D] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded text-[9px] aa-mono">IAccount</code> interface. Handles nonce management, ECDSA signature validation, and execution directly in Solidity.
                  </p>
                  <div className="bg-[#05070B] border border-white/5 rounded-lg p-4 aa-mono text-[9px] md:text-[11px] space-y-2 mt-auto">
                    <div className="flex justify-between"><span className="text-[#F59E0B]">Nonce Mgmt:</span><span className="text-slate-300">Anti-replay</span></div>
                    <div className="flex justify-between"><span className="text-[#F59E0B]">Sig Validate:</span><span className="text-slate-300">Owner check</span></div>
                  </div>
                </VaultCard>
                <VaultCard className="p-5 md:p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-black text-white aa-heading">Gas Sponsorship</h3>
                    <span className="text-xl opacity-40">⛽</span>
                  </div>
                  <p className="text-[11px] md:text-sm text-slate-400 leading-relaxed mb-4">
                    <code className="text-[#00D4FF] bg-[#00D4FF]/10 px-1.5 py-0.5 rounded text-[9px] aa-mono">SimplePaymaster.sol</code> deposits ETH into EntryPoint. Gas deducted from Paymaster — enabling gasless UX.
                  </p>
                  <div className="bg-[#05070B] border border-white/5 rounded-lg p-4 aa-mono text-[9px] md:text-[11px] space-y-2 mt-auto">
                    <div className="flex justify-between"><span className="text-[#00D4FF]">Decoupling:</span><span className="text-slate-300">Sender ≠ Payer</span></div>
                    <div className="flex justify-between"><span className="text-[#00D4FF]">Gasless:</span><span className="text-slate-300">Web2 UX</span></div>
                  </div>
                </VaultCard>
              </div>
            </motion.div>
          )}

          {tab==="flow" && (
            <motion.div key="flow" initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-15 }} className="space-y-5 md:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
                <VaultCard className="p-0 overflow-hidden flex flex-col">
                  <div className="px-4 md:px-6 pt-4 pb-3 border-b border-white/5 bg-[#05070B]">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest aa-mono">Validation Signal</h3>
                  </div>
                  <div className="bg-[#030509] p-4 flex-1 relative min-h-[200px]"><ValidationCanvas /></div>
                </VaultCard>
                <VaultCard className="p-5 md:p-8">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 aa-mono">Flow Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { n:"01", title:"UserOp Signed", desc:"User signs packed UserOp.", color:"text-[#F59E0B]" },
                      { n:"02", title:"Bundler Aggreg.", desc:"Bundler calls handleOps().", color:"text-[#A78BFA]" },
                      { n:"03", title:"EP Validation", desc:"Validates Account & Paymaster.", color:"text-[#00D4FF]" },
                      { n:"04", title:"Execution", desc:"Target logic is executed.", color:"text-[#34D399]" },
                    ].map((s,i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                        <span className={`text-sm font-black ${s.color} aa-heading`}>{s.n}</span>
                        <div>
                          <h4 className="font-bold text-white text-[11px] mb-0.5">{s.title}</h4>
                          <p className="text-slate-400 text-[10px]">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </VaultCard>
              </div>
            </motion.div>
          )}

          {tab==="session" && (
            <motion.div key="session" initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-15 }} className="space-y-5 md:space-y-8">
              <VaultCard className="p-5 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🔑</span>
                  <div>
                    <h3 className="text-base font-black text-white aa-heading">Session Key Manager</h3>
                    <p className="text-[#F472B6] text-[9px] font-bold uppercase tracking-widest aa-mono">SessionKeyManager.sol</p>
                  </div>
                </div>
                <p className="text-slate-300 text-[11px] md:text-sm leading-relaxed mb-5">
                  Session keys generate a <strong className="text-white">temporary key with restricted permissions</strong> (e.g., "Only interact with Uniswap for 2 hours"). Removes constant wallet pop-ups while maintaining security.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { title:"Time-Bound", desc:"Auto-expires.", color:"text-[#F472B6]" },
                    { title:"Scope-Limited", desc:"Whitelisted target only.", color:"text-[#FCD34D]" },
                    { title:"Delegated", desc:"Primary key stays safe.", color:"text-[#A78BFA]" },
                  ].map((item,i) => (
                    <div key={i} className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/5">
                      <h4 className={`font-bold text-[11px] mb-1 aa-heading ${item.color}`}>{item.title}</h4>
                      <p className="text-slate-400 text-[10px] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#05070B] border-l-2 border-l-amber-500 p-4 rounded-r-xl border-y border-r border-white/5">
                  <h4 className="text-amber-400 font-bold text-[10px] uppercase tracking-widest mb-1.5 aa-mono">Disclaimer</h4>
                  <p className="text-slate-400 text-[9px] md:text-xs leading-relaxed">
                    This repo is for educational purposes. Core ERC-4337 features are implemented but not formally audited.
                  </p>
                </div>
              </VaultCard>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="border-t border-[#F59E0B]/15 bg-[#05070B]">
        <div className="max-w-7xl mx-auto px-5 md:px-16 py-8 md:py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="aa-mono text-[9px] md:text-[10px] text-[#F59E0B]/60 uppercase tracking-widest mb-1">ERC-4337 Account Abstraction</p>
            <p className="text-slate-500 text-xs md:text-sm">EntryPoint v0.7 · Paymaster · Session Keys · Foundry</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="https://github.com/NexTechArchitect/ERC4337-Account-Abstraction-Foundry" target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#F59E0B]/30 text-[#F59E0B] text-[10px] font-bold uppercase tracking-widest aa-mono hover:bg-[#F59E0B]/10 transition-all">
              GitHub ↗
            </Link>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="aa-mono text-[9px] text-slate-400 uppercase tracking-widest">Educational</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
