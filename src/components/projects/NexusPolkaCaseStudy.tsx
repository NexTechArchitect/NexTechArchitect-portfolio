"use client";

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   NEXUS POLKADOT — Ultimate Dark Web3 Aesthetic
   Theme: Pitch Black (#030305) · Polkadot Pink (#E6007A) · Stark White
   Features: Parachain Orbital Canvas, Live Liquidation Chart Canvas
═══════════════════════════════════════════════════════════════════ */

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');
  
  .p-root { font-family: 'Inter', system-ui, sans-serif; background-color: #030305; color: #EDEDED; }
  .p-display { font-family: 'Space Grotesk', sans-serif; }
  .p-mono { font-family: 'JetBrains Mono', monospace; }
  .p-label { font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 0.15em; }
  
  .hide-scroll::-webkit-scrollbar { display: none; }
  .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  
  .bento-border {
    border: 1px solid rgba(255,255,255,0.08);
    background: linear-gradient(145deg, rgba(20,20,25,0.6) 0%, rgba(10,10,12,0.8) 100%);
    box-shadow: 0 4px 24px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
  }
`;

// ── Animated Counter ──────────────────────────────────────────────
function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let startTime: number;
        const tick = (ts: number) => {
          if (!startTime) startTime = ts;
          const p = Math.min((ts - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setVal(Math.floor(eased * end));
          if (p < 1) requestAnimationFrame(tick);
          else setVal(end);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Custom Canvas 1: Polkadot Relay/Parachain Orbit ───────────────
function ParachainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let id: number, time = 0;
    
    const isMobile = W < 768;
    const cx = W / 2; const cy = H / 2;
    const ringCount = isMobile ? 2 : 3;
    const rings = Array.from({length: ringCount}, (_, i) => (i + 1) * (isMobile ? 60 : 90));

    const draw = () => {
      ctx.clearRect(0, 0, W, H); time += 0.005;
      
      // Draw faint rings
      rings.forEach(r => {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.03)"; ctx.lineWidth = 1; ctx.stroke();
      });

      // Draw Center (Polkadot Hub)
      ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#E6007A"; ctx.fill();
      ctx.shadowBlur = 20; ctx.shadowColor = "#E6007A"; ctx.fill(); ctx.shadowBlur = 0;

      // Draw Orbiting Parachains & CCIP lines
      rings.forEach((r, i) => {
        const angle = time * (1.5 - i * 0.3) + (i * Math.PI / 2);
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;

        // Line to center
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py);
        const grad = ctx.createLinearGradient(cx, cy, px, py);
        grad.addColorStop(0, "rgba(230,0,122,0.4)"); grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();

        // Node
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF"; ctx.fill();

        // Traveling packet (CCIP Message)
        const pTime = (time * 5 + i) % 1; // 0 to 1
        const pktX = cx + Math.cos(angle) * (r * pTime);
        const pktY = cy + Math.sin(angle) * (r * pTime);
        ctx.beginPath(); ctx.arc(pktX, pktY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#00E5FF"; ctx.fill();
      });

      id = requestAnimationFrame(draw);
    };
    draw();
    const handleResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", handleResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none opacity-50" />;
}

// ── Custom Canvas 2: Live Liquidation Engine Math ─────────────────
function LiquidationCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let id: number, time = 0;
    
    const points: number[] = [];
    const maxPoints = 50;
    let currentPrice = 50;

    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);

    const draw = () => {
      const W = c.width, H = c.height; ctx.clearRect(0,0,W,H); time++;
      
      const liqLineY = H * 0.75;

      // Update data every few frames
      if (time % 3 === 0) {
        currentPrice += (Math.random() - 0.45) * 5; // Drift downwards slowly
        if (currentPrice > 80) currentPrice = 80;
        points.push(currentPrice);
        if (points.length > maxPoints) points.shift();
      }

      // Check Liquidation
      let isLiquidated = false;
      const displayPrice = points[points.length - 1] || 50;
      const visualY = H - (displayPrice / 100) * H;
      
      if (visualY > liqLineY) {
        isLiquidated = true;
        // Reset position simulating keeper liquidation
        currentPrice = 90;
      }

      // Draw Grid
      ctx.beginPath();
      for(let x=0; x<W; x+=40) { ctx.moveTo(x,0); ctx.lineTo(x,H); }
      for(let y=0; y<H; y+=40) { ctx.moveTo(0,y); ctx.lineTo(W,y); }
      ctx.strokeStyle = "rgba(255,255,255,0.03)"; ctx.lineWidth = 1; ctx.stroke();

      // Draw Liquidation Threshold
      ctx.beginPath(); ctx.moveTo(0, liqLineY); ctx.lineTo(W, liqLineY);
      ctx.strokeStyle = "rgba(230,0,122,0.4)"; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#E6007A"; ctx.font = "10px 'JetBrains Mono'"; ctx.fillText("LIQUIDATION THRESHOLD", 10, liqLineY - 5);

      // Draw Chart
      if (points.length > 1) {
        ctx.beginPath();
        const step = W / (maxPoints - 1);
        points.forEach((p, i) => {
          const px = i * step;
          const py = H - (p / 100) * H;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2; ctx.stroke();

        // Fill under chart
        ctx.lineTo(W, H); ctx.lineTo(0, H);
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, "rgba(255,255,255,0.1)"); grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad; ctx.fill();
      }

      // Flash Effect on Liquidation
      if (isLiquidated) {
        ctx.fillStyle = "rgba(230,0,122,0.2)"; ctx.fillRect(0,0,W,H);
        ctx.fillStyle = "#FFF"; ctx.font = "bold 14px 'Space Grotesk'";
        ctx.fillText("⚡ KEEPER TRIGGERED", W/2 - 60, H/2);
      }

      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="w-full h-full min-h-[220px] md:min-h-[300px]" />;
}

// ── 3D Tilt Card ──────────────────────────────────────────────────
function TiltCard({ children, className="", intensity=5 }: { children: React.ReactNode; className?: string; intensity?: number }) {
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
      style={{rotateX:srX,rotateY:srY,transformStyle:"preserve-3d",perspective:1000}}
      className={className}>{children}</motion.div>
  );
}

// ── Sleek Address Chip ────────────────────────────────────────────
function TerminalChip({ label, address }: { label: string; address: string; }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const short = address.slice(0, 6) + "…" + address.slice(-4);
  
  return (
    <div className="flex items-center justify-between p-3 bg-[#08080A] border border-[#222] rounded-lg hover:border-[#E6007A]/50 transition-colors group">
      <div className="flex flex-col">
        <span className="text-[9px] text-[#888] p-mono uppercase">{label}</span>
        <span className="text-[11px] text-[#E6007A] p-mono mt-0.5">{short}</span>
      </div>
      <div className="flex gap-1.5">
        <button onClick={copy} className="p-1.5 rounded bg-[#111] text-[#888] hover:text-white transition-colors">
          {copied ? "✓" : "⎘"}
        </button>
        <Link href={`https://blockscout-passet-hub.parity-testnet.parity.io/address/${address}`} target="_blank" className="p-1.5 rounded bg-[#111] text-[#888] hover:text-white transition-colors">
          ↗
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function NexusPolkaCaseStudy() {
  const [tab, setTab] = useState<"overview"|"architecture"|"tests">("overview");
  const TABS = [
    {id:"overview", label:"System Overview"},
    {id:"architecture", label:"Engine & Solvency"},
    {id:"tests", label:"Deployment & Tests"}
  ] as const;

  return (
    <>
      <style>{S}</style>
      <div className="p-root w-full overflow-x-hidden selection:bg-[#E6007A]/30 selection:text-white relative">

        {/* Global Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* ── HERO SECTION ── */}
        <div className="relative w-full border-b border-white/5 overflow-hidden" style={{ minHeight: "clamp(400px, 50vh, 600px)" }}>
          <ParachainCanvas />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030305] pointer-events-none" />

          <div className="relative z-10 px-5 md:px-12 pt-20 pb-12 w-full max-w-7xl mx-auto h-full flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex-1 w-full text-center lg:text-left">
              <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                <span className="p-label px-3 py-1 text-[9px] font-bold border border-[#E6007A]/40 bg-[#E6007A]/10 text-[#E6007A] rounded">🏆 Hackathon '26</span>
                <span className="p-label px-3 py-1 text-[9px] font-bold border border-white/10 bg-white/5 text-[#AAA] rounded">Asset Hub</span>
              </motion.div>
              
              <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}}
                className="p-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-4"
              >
                Nexus <span className="text-[#E6007A]">Perps</span>.
              </motion.h1>
              
              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}
                className="text-sm md:text-base text-[#888] max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                A completely on-chain perpetuals DEX natively deployed on Polkadot Hub Testnet. Featuring <strong className="text-white">50x leverage</strong>, custom PriceKeepers, and CCIP cross-chain execution.
              </motion.p>
              
              {/* FIX: Double Link Tag and added GitHub Button */}
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                <Link href="https://nexus-protocol-v2.vercel.app/" target="_blank"
                  className="p-label inline-flex items-center gap-2 px-8 py-4 text-[10px] font-bold rounded-lg bg-white text-black hover:bg-[#E6007A] hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  Launch App ↗
                </Link>
                <Link href="https://github.com/NexTechArchitect/nexus-polka-perps" target="_blank"
                  className="p-label inline-flex items-center gap-2 px-8 py-4 text-[10px] font-bold rounded-lg border border-[#333] text-[#AAA] hover:text-white hover:border-[#E6007A]/50 transition-all bg-black/20 backdrop-blur-md">
                  GitHub ↗
                </Link>
              </motion.div>
            </div>

            {/* Video Container */}
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay:0.2}}
              className="flex-1 w-full max-w-md lg:max-w-lg bento-border rounded-2xl p-2 relative"
            >
              <div className="absolute -top-3 -right-3 w-20 h-20 bg-[#E6007A]/20 blur-2xl rounded-full" />
              <video src="https://github.com/user-attachments/assets/0aa71e44-42ef-43c6-8a9a-1ffb3fe06fd4" autoPlay loop muted playsInline className="w-full h-auto rounded-xl grayscale-[20%] hover:grayscale-0 transition-all" />
            </motion.div>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="border-b border-white/5 bg-[#050508]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {[
              { v: "420420417", l: "Chain ID", sub: "Polkadot Hub" },
              { v: "6,400+", l: "Mutations", sub: "Zero Reverts" },
              { v: "50x", l: "Leverage", sub: "Iso & Cross" },
              { v: "0", l: "Off-Chain", sub: "Dependencies" },
            ].map((s,i) => (
              <div key={i} className="p-6 md:p-8 flex flex-col justify-center">
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.05}}>
                  <div className="p-display text-2xl md:text-4xl font-bold text-white mb-1 truncate">
                    {s.v.includes('x') || s.v.includes('+') ? s.v : <Counter end={Number(s.v)} duration={1500}/>}
                  </div>
                  <div className="p-label text-[9px] md:text-[10px] text-[#E6007A] font-bold">{s.l}</div>
                  <div className="text-[10px] text-[#666] mt-1">{s.sub}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="sticky top-0 z-30 bg-[#030305]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-12 py-3 flex gap-2 overflow-x-auto hide-scroll">
            {TABS.map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)}
                className="relative p-label px-5 py-3 text-[9px] md:text-[10px] font-bold whitespace-nowrap transition-colors rounded-lg"
                style={{ background: tab===t.id ? "rgba(255,255,255,0.05)" : "transparent", color: tab===t.id ? "#FFF" : "#666" }}>
                {t.label}
                {tab===t.id && <motion.div layoutId="p-tab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#E6007A] shadow-[0_0_10px_rgba(230,0,122,0.5)]" />}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="max-w-7xl mx-auto px-5 md:px-12 py-10 md:py-16 min-h-[50vh]">
          <AnimatePresence mode="wait">
            
            {/* ════ OVERVIEW (BENTO GRID) ════ */}
            {tab==="overview" && (
              <motion.div key="ov" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                
                {/* Big Bento 1 */}
                <TiltCard intensity={2} className="md:col-span-2 bento-border rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="p-label text-[10px] text-[#E6007A]">EVM Track Focus</span>
                    <h3 className="p-display text-2xl md:text-3xl font-bold text-white mt-2 mb-4">Eliminating Off-Chain Trust.</h3>
                    <p className="text-sm text-[#888] leading-relaxed max-w-xl">
                      Traditional DeFi perps rely on custodial matching engines or centralized oracle pushers. Nexus runs 100% on-chain. <strong className="text-[#CCC]">PriceKeepers</strong> auto-sync MockAggregators every 2 minutes directly via the frontend wallet, removing backend dependencies.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                    <div>
                      <p className="p-mono text-xs text-[#EF4444] line-through mb-1">LP Inflation Attack</p>
                      <p className="text-xs text-[#AAA]">MINIMUM_LIQUIDITY permanently burned on genesis.</p>
                    </div>
                    <div>
                      <p className="p-mono text-xs text-[#EF4444] line-through mb-1">Precision Drain</p>
                      <p className="text-xs text-[#AAA]">18-decimal strict normalization enforced.</p>
                    </div>
                  </div>
                </TiltCard>

                {/* Small Bento 1 */}
                <TiltCard intensity={3} className="md:col-span-1 bento-border rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-4 border border-[#10B981]/20">
                    <span className="text-2xl">🌉</span>
                  </div>
                  <h4 className="p-display text-lg font-bold text-white mb-2">CCIP Cross-Chain</h4>
                  <p className="text-xs text-[#888]">Native margin relay with strict per-trader nonce mapping. Replay attacks are structurally impossible.</p>
                </TiltCard>

                {/* Full Width Bento (Architecture Layers) */}
                <TiltCard intensity={1} className="md:col-span-3 bento-border rounded-3xl p-6 md:p-8">
                  <h4 className="p-label text-[10px] text-[#E6007A] mb-6">5 Isolated Layers</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { l: "Interface", d: "Next.js 15, Wagmi v2", c: "border-white/10" },
                      { l: "Trading Engine", d: "PositionManager.sol", c: "border-[#F59E0B]/30" },
                      { l: "Vault Layer", d: "Dual Accounting 1e18", c: "border-[#10B981]/30" },
                      { l: "Oracle Layer", d: "Keeper Auto-Sync", c: "border-[#E6007A]/40" }
                    ].map((layer, i) => (
                      <div key={i} className={`p-4 rounded-xl border bg-black/20 ${layer.c}`}>
                        <div className="p-display text-sm font-bold text-white mb-1">{layer.l}</div>
                        <div className="text-[10px] text-[#888] p-mono">{layer.d}</div>
                      </div>
                    ))}
                  </div>
                </TiltCard>

              </motion.div>
            )}

            {/* ════ ENGINE & SOLVENCY ════ */}
            {tab==="architecture" && (
              <motion.div key="arch" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Canvas Box */}
                <TiltCard intensity={2} className="bento-border rounded-3xl overflow-hidden flex flex-col h-[400px] md:h-[500px]">
                  <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#050508]">
                    <span className="p-label text-[10px] text-[#E6007A]">Liquidation Engine Simulator</span>
                    <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span></span>
                  </div>
                  <div className="flex-1 relative bg-[#010101]">
                    <LiquidationCanvas />
                  </div>
                </TiltCard>

                {/* Math Box */}
                <div className="flex flex-col gap-6">
                  <TiltCard intensity={2} className="bento-border rounded-3xl p-6 md:p-8 flex-1">
                    <h3 className="p-display text-xl font-bold text-white mb-4">PnLCalculator.sol (Pure Math)</h3>
                    <div className="space-y-3 p-mono text-[10px] md:text-xs">
                      <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                        <span className="text-[#888]">positionSize = </span>
                        <span className="text-[#60A5FA]">(collateral × leverage) / 1e18</span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                        <span className="text-[#888]">PnL = </span>
                        <span className="text-[#34D399]">(priceDelta × posSize) / entryPrice</span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                        <span className="text-[#888]">isLiquidatable = </span>
                        <span className="text-[#EF4444]">equity ≤ maintenanceMargin</span>
                      </div>
                    </div>
                  </TiltCard>
                  
                  <TiltCard intensity={2} className="bento-border rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#0A0A0C] to-[#1A0510]">
                    <h3 className="p-display text-lg font-bold text-white mb-2">Isolated vs Cross Margin</h3>
                    <p className="text-xs text-[#AAA] leading-relaxed">
                      By default, positions are isolated. In Cross-Margin mode, the engine dynamically calculates <code className="text-[#E6007A] bg-[#E6007A]/10 px-1 rounded">totalEquity = vaultCollateral + Σ(globalPnL)</code> iterating through all active assets O(1) to prevent cascading liquidations.
                    </p>
                  </TiltCard>
                </div>

              </motion.div>
            )}

            {/* ════ TESTS & DEPLOYMENT ════ */}
            {tab==="tests" && (
              <motion.div key="ts" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Terminal */}
                  <TiltCard intensity={1} className="lg:col-span-2 bento-border rounded-3xl overflow-hidden bg-[#030305]">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-[#08080A]">
                      <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /></div>
                      <span className="ml-3 p-mono text-[10px] text-[#666]">forge test -vvv --match-contract NexusPolka</span>
                    </div>
                    <div className="p-6 p-mono text-[11px] text-[#AAA] leading-loose overflow-x-auto whitespace-nowrap">
                      <p className="text-white">Compiling 14 files... [✓]</p>
                      <br/>
                      <p className="text-[#10B981]">[PASS] invariant_VaultIsSolvent() <span className="text-[#666] text-[9px] border border-[#333] px-1 ml-2 rounded">INVARIANT</span></p>
                      <p className="text-[#10B981]">[PASS] invariant_InternalAccountingConsistent() <span className="text-[#666] text-[9px] border border-[#333] px-1 ml-2 rounded">INVARIANT</span></p>
                      <p className="text-[#10B981]">[PASS] testFuzz_LiquidationMath(uint256) <span className="text-[#666] text-[9px] border border-[#333] px-1 ml-2 rounded">FUZZ</span></p>
                      <p className="text-[#10B981]">[PASS] test_CrossChainPipelineE2E() <span className="text-[#666] text-[9px] border border-[#333] px-1 ml-2 rounded">INTEGRATION</span></p>
                      <p className="text-[#555]">... 91 more tests ...</p>
                      <br/>
                      <p className="text-[#10B981] font-bold">Test result: ok. 95 passed; 0 failed.</p>
                      <p className="text-[#555]">Fuzz: 256 runs/test · Invariant: 6,400 state mutations</p>
                    </div>
                  </TiltCard>

                  {/* Contracts Addresses */}
                  <div className="flex flex-col gap-4">
                    <h3 className="p-label text-[10px] text-[#E6007A] pl-2">Deployed on Asset Hub</h3>
                    <TerminalChip label="PositionManager" address="0xd16150d0B2a04ECb1Aa09f840556347D5251fB53" />
                    <TerminalChip label="PerpsVault" address="0x9495fE47049a7aFe8180E9e8Aee743D533c67173" />
                    <TerminalChip label="LiquidationEngine" address="0x01721d6502547faFD3049BE60b1485B12407f58B" />
                    <TerminalChip label="PriceKeeper" address="0x481EC593F7bD9aB4219a0d0A185C16F2687871C2" />
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </>
  );
}