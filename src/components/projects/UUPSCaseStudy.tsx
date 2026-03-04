"use client";

import {
  motion, useMotionValue, useTransform, useSpring, AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   UUPS UPGRADEABLE PROTOCOL — Warm Ivory Memory Core
   Aesthetic: Low-Level Hardware, Memory Slots, Bronze & Cream
   Update: Lightweight Memory Grid Animation, 100% Mobile Optimized
═══════════════════════════════════════════════════════════════════ */

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

  .u-root { font-family: 'Inter', system-ui, sans-serif; }
  .u-serif { font-family: 'Playfair Display', Georgia, serif; }
  .u-mono { font-family: 'JetBrains Mono', 'Courier New', Courier, monospace; }
  .u-label { font-family: 'JetBrains Mono', 'Courier New', Courier, monospace; text-transform: uppercase; letter-spacing: 0.15em; }
  
  .hide-scroll::-webkit-scrollbar { display: none; }
  .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
`;

// ── Lightweight Memory Grid Canvas ───────────────────────────────
function MemoryGridCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let id: number, time = 0;
    
    const isMobile = W < 768;
    const spacing = isMobile ? 30 : 45;

    // Moving data packets
    type Packet = { x: number; y: number; speed: number; delay: number; vertical: boolean };
    const packets: Packet[] = Array.from({ length: isMobile ? 15 : 30 }, () => ({
      x: Math.floor(Math.random() * (W / spacing)) * spacing,
      y: Math.floor(Math.random() * (H / spacing)) * spacing,
      speed: (Math.random() * 1.5 + 0.5) * (Math.random() > 0.5 ? 1 : -1),
      delay: Math.random() * 100,
      vertical: Math.random() > 0.5
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      time++;

      // Draw Grid Base
      ctx.beginPath();
      for (let x = 0; x <= W; x += spacing) {
        ctx.moveTo(x, 0); ctx.lineTo(x, H);
      }
      for (let y = 0; y <= H; y += spacing) {
        ctx.moveTo(0, y); ctx.lineTo(W, y);
      }
      ctx.strokeStyle = "rgba(184,115,51,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Grid Intersections
      ctx.fillStyle = "rgba(184,115,51,0.15)";
      for (let x = 0; x <= W; x += spacing) {
        for (let y = 0; y <= H; y += spacing) {
          ctx.fillRect(x - 1, y - 1, 3, 3);
        }
      }

      // Draw Packets (representing contract state reading)
      packets.forEach(p => {
        if (time > p.delay) {
          if (p.vertical) {
            p.y += p.speed;
            if (p.y > H + 20) p.y = -20;
            if (p.y < -20) p.y = H + 20;
          } else {
            p.x += p.speed;
            if (p.x > W + 20) p.x = -20;
            if (p.x < -20) p.x = W + 20;
          }

          // Packet Trail
          const grad = ctx.createLinearGradient(
            p.vertical ? p.x : p.x - (p.speed * 20),
            p.vertical ? p.y - (p.speed * 20) : p.y,
            p.x, p.y
          );
          grad.addColorStop(0, "rgba(184,115,51,0)");
          grad.addColorStop(1, "rgba(184,115,51,0.6)");
          
          ctx.beginPath();
          if (p.vertical) {
            ctx.moveTo(p.x, p.y - (p.speed * 20)); ctx.lineTo(p.x, p.y);
          } else {
            ctx.moveTo(p.x - (p.speed * 20), p.y); ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Packet Head
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(210,130,50,0.9)";
          ctx.fill();
        }
      });

      id = requestAnimationFrame(draw);
    };

    draw();
    const handleResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", handleResize); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── Storage Slot Visualizer Canvas (Optimized) ───────────────────────
function SlotCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let id: number, t = 0;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    
    const SLOTS = [
      { n:"feeRate",    type:"uint256", kind:"data" },
      { n:"owner",      type:"address", kind:"data" },
      { n:"paused",     type:"bool",    kind:"data" },
      { n:"version",    type:"uint8",   kind:"special" },
      { n:"configHash", type:"bytes32", kind:"special" },
      { n:"__gap[0]",   type:"uint256", kind:"gap" },
      { n:"__gap[1]",   type:"uint256", kind:"gap" },
      { n:"...",        type:"...",     kind:"gap" },
      { n:"__gap[49]",  type:"uint256", kind:"gap" },
    ];
    
    const draw = () => {
      const W = c.width, H = c.height;
      ctx.clearRect(0,0,W,H); t+=0.022;
      const isMobile = W < 400;
      
      const sh = isMobile ? 24 : 28; // Slot height
      const sg = isMobile ? 4 : 6;   // Gap
      const pad = isMobile ? 10 : 16;
      
      const count = Math.min(SLOTS.length, Math.floor((H-pad*2)/(sh+sg)));
      
      for (let i=0;i<count;i++) {
        const sl=SLOTS[i], y=pad+i*(sh+sg), pulse=Math.sin(i*0.8+t)*0.5+0.5;
        const isGap=sl.kind==="gap", isSpec=sl.kind==="special";
        
        ctx.beginPath(); ctx.roundRect(pad,y,W-pad*2,sh,6);
        ctx.fillStyle=isGap?`rgba(184,115,51,${0.07+pulse*0.05})`:isSpec?`rgba(184,115,51,${0.09+pulse*0.06})`:`rgba(28,26,23,${0.04+pulse*0.02})`;
        ctx.fill();
        ctx.strokeStyle=isGap?`rgba(184,115,51,${0.28+pulse*0.14})`:isSpec?`rgba(184,115,51,0.38)`:`rgba(28,26,23,0.09)`;
        ctx.lineWidth=isGap||isSpec?1:0.5; ctx.stroke();
        
        const bw=isGap?(W-pad*2)*0.2:(W-pad*2)*(0.28+pulse*0.52);
        ctx.beginPath(); ctx.roundRect(pad,y,bw,sh,6);
        ctx.fillStyle=isGap?"rgba(184,115,51,0.09)":"rgba(28,26,23,0.04)"; ctx.fill();
        
        const fontSize = isMobile ? 9 : 10;
        const textY = y + (sh / 2) + 3;

        ctx.fillStyle=isSpec?"rgba(120,60,15,0.9)":isGap?"rgba(140,80,20,0.6)":"rgba(28,26,23,0.5)";
        ctx.font=`${isGap||isSpec?"700":"500"} ${fontSize}px 'JetBrains Mono', monospace`;
        ctx.fillText(`[${String(i).padStart(2,"0")}]`,pad+6, textY);
        
        ctx.fillStyle=isGap?"rgba(130,70,15,0.65)":isSpec?"rgba(120,60,15,0.7)":"rgba(28,26,23,0.6)";
        ctx.font=`${isGap?"600":"500"} ${fontSize}px 'JetBrains Mono', monospace`; 
        ctx.fillText(sl.n, pad+ (isMobile ? 35 : 45), textY);
        
        ctx.fillStyle="rgba(28,26,23,0.35)"; ctx.font=`400 ${fontSize-1}px 'JetBrains Mono', monospace`;
        ctx.textAlign="right"; ctx.fillText(sl.type,W-pad-6, textY); ctx.textAlign="left";
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="w-full h-full min-h-[300px]" />;
}

// ── Responsive Tilt Card ─────────────────────────────────────────
function TiltCard({ children, className="", style, intensity=5 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; intensity?: number; }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rX = useTransform(my,[-0.5,0.5],[intensity,-intensity]);
  const rY = useTransform(mx,[-0.5,0.5],[-intensity,intensity]);
  const srX = useSpring(rX,{stiffness:200,damping:25});
  const srY = useSpring(rY,{stiffness:200,damping:25});
  
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return; const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX-r.left)/r.width-0.5); my.set((e.clientY-r.top)/r.height-0.5);
  },[mx,my]);
  const onLeave = useCallback(()=>{ mx.set(0); my.set(0); },[mx,my]);
  
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{rotateX:srX,rotateY:srY,transformStyle:"preserve-3d",perspective:1000,...style}}
      className={className}>{children}</motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function UUPSCaseStudy() {
  const [tab, setTab] = useState<"overview"|"architecture"|"storage">("overview");
  const TABS = [
    {id:"overview",label:"Concept Overview"},
    {id:"architecture",label:"Upgrade Lifecycle"},
    {id:"storage",label:"Storage Safety"},
  ] as const;

  return (
    <>
      <style>{S}</style>
      <div className="u-root w-full overflow-x-hidden bg-[#FAF7F0] text-[#1C1A17] selection:bg-[#B87333]/20 selection:text-[#5A3018]">

        {/* ── HERO HEADER ── */}
        <div className="relative w-full min-h-[35vh] md:min-h-[45vh] bg-[#FAF7F0] overflow-hidden border-b border-[#B87333]/20 flex flex-col justify-end pt-12 md:pt-0">
          
          <MemoryGridCanvas />
          
          <div className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(to right,rgba(250,247,240,0.95) 0%,rgba(250,247,240,0.7) 50%,rgba(250,247,240,0.1) 100%)"}}/>
          <div className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(to bottom,rgba(250,247,240,0) 40%,rgba(250,247,240,1) 100%)"}}/>
          
          <div className="relative z-10 px-5 md:px-12 pt-16 md:pt-24 pb-8 md:pb-12 w-full max-w-7xl mx-auto">
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex flex-wrap gap-2 mb-4 md:mb-6">
              {["EIP-1822 UUPS", "EIP-1967 Slots", "DelegateCall", "Foundry"].map((tag,i) => (
                <span key={i} className="u-label px-2 md:px-3 py-1 text-[8px] md:text-[10px] font-bold border rounded bg-white/50 backdrop-blur-sm"
                  style={{borderColor:"rgba(184,115,51,0.3)", color:"#7A3A12"}}>{tag}</span>
              ))}
            </motion.div>
            
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
              <div className="u-label mb-2 md:mb-3 text-[9px] md:text-[10px] font-bold text-[#A08060]">Smart Contract Architecture</div>
              <h1 className="u-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] text-[#1C1A17] mb-4 md:mb-6">
                Mutable <br className="hidden md:block" />
                <span className="text-[#B87333]">Infrastructure.</span>
              </h1>
              <p className="text-xs md:text-base leading-relaxed text-[#6B5030] max-w-2xl font-medium border-l-2 border-[#B87333] pl-3 md:pl-5">
                A production-ready implementation of the Universal Upgradeable Proxy Standard. Designed from scratch to demonstrate storage layout safety, atomic state migrations, and gas-efficient delegation patterns.
              </p>
            </motion.div>
            
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap gap-4 mt-6 md:mt-8">
              <Link href="https://github.com/NexTechArchitect/uups-protocol-config" target="_blank"
                className="u-label inline-flex items-center justify-center gap-2 px-5 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold rounded-lg transition-all hover:bg-[#965A20] w-full sm:w-auto"
                style={{background:"#B87333",color:"#FAF7F0",boxShadow:"0 8px 20px rgba(184,115,51,0.25)"}}>
                View Repository ↗
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="border-b bg-white" style={{borderColor:"rgba(184,115,51,0.15)"}}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 divide-x divide-[#B87333]/10 py-6 md:py-0">
            {[
              { v: "V1 → V3", sub: "Atomic Lifecycle", note: "Three upgrade stages" },
              { v: "EIP-1967", sub: "Slot Standard", note: "Collision-proof storage" },
              { v: "50", sub: "__gap Slots", note: "Future-proofed layout" },
              { v: "0 Admin", sub: "Gas Overhead", note: "vs. Transparent Proxy" },
            ].map((s,i) => (
              <div key={i} className="px-4 md:p-8 text-left">
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.05}}>
                  <div className="u-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#B87333] mb-1 md:mb-2 leading-none">{s.v}</div>
                  <div className="u-label text-[8px] md:text-[10px] text-[#7A3A12] font-bold mb-0.5 md:mb-1">{s.sub}</div>
                  <div className="text-[8px] md:text-[10px] text-[#A08060]">{s.note}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="sticky top-0 z-30 bg-[#FAF7F0]/90 backdrop-blur-md border-b" style={{borderColor:"rgba(184,115,51,0.15)"}}>
          <div className="max-w-7xl mx-auto px-4 md:px-12 pt-2 md:pt-4 pb-0 flex overflow-x-auto hide-scroll gap-1 md:gap-4">
            {TABS.map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)}
                className="relative u-label px-3 md:px-4 py-3 md:py-4 text-[9px] md:text-[10px] font-bold whitespace-nowrap transition-colors"
                style={{color:tab===t.id?"#B87333":"#A08060"}}>
                {t.label}
                {tab===t.id && (
                  <motion.div layoutId="uups-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B87333]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="max-w-7xl mx-auto px-5 md:px-12 py-8 md:py-16 min-h-[50vh]">
          <AnimatePresence mode="wait">
            
            {/* ════ TAB 1: OVERVIEW ════ */}
            {tab==="overview" && (
              <motion.div key="ov" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-6 md:space-y-8">
                
                <TiltCard intensity={2} className="rounded-xl md:rounded-2xl overflow-hidden border shadow-sm bg-white" style={{borderColor:"rgba(184,115,51,0.15)"}}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                      <thead style={{background:"#FDF9F3", borderBottom:"1px solid rgba(184,115,51,0.1)"}}>
                        <tr>
                          {["Feature", "Standard Contract", "UUPS Proxy Standard"].map((h,i) => (
                            <th key={i} className="u-label px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[10px]" style={{color:i===2?"#7A3A12":"#A08060", fontWeight:800}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#B87333]/10">
                        {[
                          { f: "Logic", e: "Immutable forever", a: "Swappable via upgradeTo()" },
                          { f: "State", e: "Bound to code address", a: "Persists in Proxy Address" },
                          { f: "Gas Cost", e: "Lower (Direct)", a: "Minimal (DelegateCall)" },
                          { f: "Bug Fixes", e: "Must redeploy", a: "Possible (Upgrade impl)" },
                          { f: "Admin Check", e: "N/A", a: "Secure via _authorizeUpgrade" },
                        ].map((row,i) => (
                          <tr key={i} className="hover:bg-[#FAF7F0]/50 transition-colors">
                            <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-[#1C1A17] whitespace-nowrap">{row.f}</td>
                            <td className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-sm text-[#A08060]">{row.e}</td>
                            <td className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-sm text-[#7A3A12] font-semibold">{row.a}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TiltCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <TiltCard intensity={3} className="p-5 md:p-8 rounded-xl md:rounded-2xl border bg-white shadow-sm" style={{borderColor:"rgba(184,115,51,0.15)"}}>
                    <div className="u-label mb-2 md:mb-3 text-[9px] md:text-[10px] font-bold" style={{color:"#B09070"}}>// Why UUPS</div>
                    <h3 className="text-base md:text-lg font-bold text-[#1C1A17] mb-2 md:mb-3">Eliminating Admin Checks</h3>
                    <p className="text-xs md:text-sm leading-relaxed text-[#6B5030]">
                      Transparent Proxies run an admin check on every user call, costing unconditional gas. 
                      UUPS moves the upgrade function (<code className="u-mono bg-[#FAF7F0] px-1.5 py-0.5 rounded text-[#7A3A12] border border-[#B87333]/20">upgradeToAndCall</code>) 
                      into the implementation contract itself, meaning zero overhead on standard user transactions.
                    </p>
                  </TiltCard>
                  
                  <TiltCard intensity={3} className="p-5 md:p-8 rounded-xl md:rounded-2xl border bg-white shadow-sm" style={{borderColor:"rgba(184,115,51,0.15)"}}>
                    <div className="u-label mb-3 md:mb-4 text-[9px] md:text-[10px] font-bold" style={{color:"#B09070"}}>// Repository Scope</div>
                    <div className="space-y-3 md:space-y-4">
                      {[
                        { title: "V1 Genesis", desc: "Initial deployment with Basic Fee logic." },
                        { title: "Pure Logic Upgrade (V2)", desc: "Adding Pausable functionality securely." },
                        { title: "Stateful Migration (V3)", desc: "Upgrading complex storage structs atomically." }
                      ].map((item,i) => (
                        <div key={i} className="flex items-start gap-3 md:gap-4">
                          <span className="u-mono w-5 h-5 md:w-6 md:h-6 shrink-0 rounded flex items-center justify-center font-bold text-[10px] md:text-xs" style={{background:"rgba(184,115,51,0.1)", color:"#7A3A12"}}>{i+1}</span>
                          <div>
                            <h4 className="text-xs md:text-sm font-bold text-[#1C1A17]">{item.title}</h4>
                            <p className="text-[10px] md:text-xs text-[#A08060] mt-0.5 md:mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TiltCard>
                </div>
              </motion.div>
            )}

            {/* ════ TAB 2: ARCHITECTURE ════ */}
            {tab==="architecture" && (
              <motion.div key="arch" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-6 md:space-y-8">
                
                <h3 className="u-label text-[10px] md:text-xs font-bold text-[#A08060] mb-4 md:mb-6 text-center md:text-left">The DelegateCall Flow</h3>
                
                <div className="rounded-xl md:rounded-3xl border p-5 md:p-12 bg-white shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-12" style={{borderColor:"rgba(184,115,51,0.15)"}}>
                  
                  {/* User -> Proxy */}
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
                    <TiltCard intensity={5} className="rounded-lg md:rounded-xl border p-4 md:p-6 text-center w-full md:w-32 shadow-sm shrink-0" style={{background:"#FDF9F3",borderColor:"rgba(28,26,23,0.1)"}}>
                      <div className="text-3xl md:text-4xl mb-2 md:mb-3">👤</div>
                      <div className="u-label text-[9px] md:text-[10px] font-bold text-[#A08060]">User</div>
                    </TiltCard>

                    <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-2">
                       <div className="w-1 h-6 md:w-16 md:h-1 bg-gradient-to-b md:bg-gradient-to-r from-[#B87333]/20 to-[#B87333]/70 rounded-full" />
                       <span className="u-mono px-2 md:px-3 py-1 rounded bg-[#B87333]/10 text-[9px] md:text-[10px] font-bold text-[#7A3A12]">call()</span>
                       <div className="w-1 h-6 md:w-16 md:h-1 bg-gradient-to-b md:bg-gradient-to-r from-[#B87333]/70 to-[#B87333]/20 rounded-full" />
                    </div>

                    <TiltCard intensity={5} className="rounded-lg md:rounded-xl border p-5 md:p-8 w-full md:w-56 shrink-0 relative overflow-hidden"
                      style={{background:"linear-gradient(135deg,#FFF8EC,#FAF7F0)",borderColor:"rgba(184,115,51,0.4)",boxShadow:"0 10px 30px rgba(184,115,51,0.1)"}}>
                      <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-[#B87333]/10 rounded-full blur-[20px] pointer-events-none" />
                      <div className="u-label text-[10px] md:text-xs font-bold text-[#B87333] mb-1 md:mb-2">ERC-1967 Proxy</div>
                      <div className="border-b border-[#B87333]/20 pb-2 md:pb-3 mb-2 md:mb-3 text-[10px] md:text-xs text-[#A08060] font-medium">Permanent State</div>
                      <div className="u-mono text-[9px] md:text-[10px] text-[#A08060] space-y-1">
                        <p>Slot: 0x3608...</p>
                        <p>Impl: 0xABCD...</p>
                      </div>
                    </TiltCard>
                  </div>

                  {/* Proxy -> Implementation */}
                  <div className="flex flex-col lg:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-1.5 md:gap-2">
                       <div className="w-1 h-6 lg:w-16 lg:h-1 bg-gradient-to-b lg:bg-gradient-to-r from-[#1C1A17]/10 to-[#1C1A17]/40 rounded-full" />
                       <span className="u-mono px-2 md:px-3 py-1 rounded bg-black/5 text-[9px] md:text-[10px] font-bold text-[#5A5040]">delegatecall()</span>
                       <div className="w-1 h-6 lg:w-16 lg:h-1 bg-gradient-to-b lg:bg-gradient-to-r from-[#1C1A17]/40 to-[#1C1A17]/10 rounded-full" />
                    </div>

                    <div className="flex flex-col gap-2 md:gap-3 w-full lg:w-64">
                      {[
                        { v: "V1", name: "ConfigV1.sol", desc: "Genesis", active: false, done: true },
                        { v: "V2", name: "ConfigV2.sol", desc: "+ Pausable", active: false, done: true },
                        { v: "V3", name: "ConfigV3.sol", desc: "+ Migration", active: true, done: false },
                      ].map((im, i) => (
                        <div key={i} className="rounded-lg md:rounded-xl border p-3 md:p-4 flex items-center gap-3 md:gap-4 transition-all relative"
                          style={{
                            background: im.active ? "linear-gradient(135deg,#FFF8EC,#FAF7F0)" : "#FAFAFA",
                            borderColor: im.active ? "rgba(184,115,51,0.4)" : "rgba(28,26,23,0.08)",
                            opacity: im.done ? 0.6 : 1,
                            boxShadow: im.active ? "0 4px 15px rgba(184,115,51,0.1)" : "none"
                          }}>
                          {im.active && (
                            <span className="absolute -left-1 md:-left-2 top-1/2 -translate-y-1/2 flex h-3 w-3 md:h-4 md:w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B87333] opacity-60"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-[#B87333] border border-white"></span>
                            </span>
                          )}
                          <span className="u-mono text-xs md:text-sm font-bold" style={{color: im.active ? "#B87333" : "#C0A880"}}>{im.v}</span>
                          <div className="flex-1">
                            <div className="u-mono text-[10px] md:text-xs font-bold" style={{color: im.active ? "#5A3018" : "#A08060"}}>{im.name}</div>
                            <div className="text-[9px] md:text-[10px] text-[#A08060] mt-0.5">{im.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* ════ TAB 3: STORAGE SAFETY ════ */}
            {tab==="storage" && (
              <motion.div key="stg" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-6 md:space-y-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {/* Left: Canvas */}
                  <TiltCard intensity={2} className="rounded-xl md:rounded-2xl border overflow-hidden bg-white shadow-sm flex flex-col" style={{borderColor:"rgba(184,115,51,0.15)"}}>
                    <div className="px-4 md:px-6 py-3 md:py-4 border-b flex items-center justify-between bg-[#FDF9F3]" style={{borderColor:"rgba(184,115,51,0.1)"}}>
                      <span className="u-label text-[10px] md:text-xs font-bold text-[#A08060]">Storage Layout Visualizer</span>
                      <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span></span>
                    </div>
                    <div className="flex-1 min-h-[250px] md:min-h-[350px] relative">
                      <SlotCanvas />
                    </div>
                  </TiltCard>

                  {/* Right: Explanations */}
                  <div className="flex flex-col gap-4 md:gap-6">
                    <TiltCard intensity={3} className="p-5 md:p-6 rounded-xl md:rounded-2xl border bg-white shadow-sm" style={{borderColor:"rgba(220,38,38,0.15)"}}>
                      <div className="u-label mb-2 md:mb-3 text-[9px] md:text-[10px] font-bold text-[#DC2626]">⚠ Storage Collision — DANGER</div>
                      <p className="text-xs md:text-sm leading-relaxed text-[#7F1D1D] mb-3 md:mb-4">
                        Inserting a variable before existing ones shifts every subsequent slot. This silently corrupts the entire protocol state because the Proxy reads old data with the new layout.
                      </p>
                      <div className="rounded-lg md:rounded-xl p-3 md:p-4 u-mono text-[9px] md:text-xs bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] overflow-x-auto">
                        {`// V1: Slot[0] = feeRate\n// V2: uint256 newVar; \n// ← CORRUPTS EVERYTHING`}
                      </div>
                    </TiltCard>

                    <TiltCard intensity={3} className="p-5 md:p-6 rounded-xl md:rounded-2xl border bg-white shadow-sm" style={{borderColor:"rgba(184,115,51,0.2)"}}>
                      <div className="u-label mb-2 md:mb-3 text-[9px] md:text-[10px] font-bold text-[#B87333]">✓ __gap Variable — SAFE</div>
                      <p className="text-xs md:text-sm leading-relaxed text-[#6B5030] mb-3 md:mb-4">
                        We reserve 50 storage slots at the end of each base contract. Future parent upgrades consume from this gap, ensuring child contract variables never shift their slot positions.
                      </p>
                      <div className="rounded-lg md:rounded-xl p-3 md:p-4 u-mono text-[9px] md:text-xs bg-[#FDF9F3] border border-[#FDE68A] text-[#92400E] overflow-x-auto">
                        {`uint256[50] private __gap;\n// Shields child layout`}
                      </div>
                    </TiltCard>
                  </div>
                </div>

                <div className="bg-white border border-[#B87333]/20 p-5 md:p-8 rounded-xl md:rounded-2xl text-center max-w-4xl mx-auto shadow-sm">
                   <h4 className="u-mono text-sm md:text-lg font-bold text-[#7A3A12] mb-2 md:mb-3">_authorizeUpgrade()</h4>
                   <p className="text-xs md:text-sm text-[#6B5030] leading-relaxed">
                     In UUPS, the logic contract <strong className="text-[#1C1A17]">MUST</strong> contain this function. If you deploy an upgrade that forgets to include it, the Proxy becomes permanently locked and can never be upgraded again. It serves as the sole gatekeeper of the protocol's lifecycle.
                   </p>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}