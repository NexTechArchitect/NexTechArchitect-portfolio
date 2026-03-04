"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { skillsData, type Skill } from "@/data/skills";

// ─── Google Font loader ────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
}

// ─── Color helper — converts #RRGGBB + alpha to rgba() ───────────────────
// Appending hex alpha to a 6-char hex color produces invalid strings like
// "#F59E0B-31". This helper safely converts to rgba() for canvas use.
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${Math.min(1, Math.max(0, alpha))})`;
}
// Shorthand
const hx = hexToRgba;
//  5 Dimensions used: X · Y · Z (depth/scale) · T (time) · F (per-particle frequency)
// ═══════════════════════════════════════════════════════════════════════════

// ── 1. sk-sol  EVM Matrix Rain — layered depth glow + hex strings ──────────
function useEVMMatrix(ref: React.RefObject<HTMLCanvasElement>, color: string, on: boolean) {
  useEffect(() => {
    if (!on) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CHARS = "01ABCDEFabcdef<>=;{}()[];=>0x";
    const COL_W = 14;
    let cols = 0;
    type Drop = { y: number; speed: number; len: number; bright: boolean };
    let drops: Drop[] = [];

    const init = () => {
      cols = Math.floor(c.offsetWidth / COL_W);
      drops = Array.from({ length: cols }, () => ({
        y: Math.random() * -120,
        speed: 0.8 + Math.random() * 2.2,
        len: 6 + Math.floor(Math.random() * 10),   // Z dim — trail length = depth
        bright: Math.random() > 0.7,                // F dim — some cols are brighter
      }));
    };

    let id: number;
    let lastW = 0;
    const draw = () => {
      id = requestAnimationFrame(draw);
      const W = c.offsetWidth, H = c.offsetHeight;
      if (W !== lastW) { c.width = W; c.height = H; init(); lastW = W; }

      // Fade trail
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.fillRect(0, 0, W, H);

      drops.forEach((d, i) => {
        const x = i * COL_W;
        // Draw trail — each char fades with distance from head (Z dim)
        for (let t = 0; t < d.len; t++) {
          const ty = d.y - t * COL_W;
          if (ty < 0 || ty > H) continue;
          const depthFade = 1 - t / d.len;
          const alpha = depthFade * (d.bright ? 0.9 : 0.55);
          const size  = t === 0 ? 13 : 10 + depthFade * 2; // head is bigger

          ctx.font = `${size}px JetBrains Mono, monospace`;

          if (t === 0) {
            // Head: white-ish bright flash
            ctx.fillStyle = `rgba(255,255,255,${d.bright ? 0.95 : 0.7})`;
          } else {
            ctx.fillStyle = hx(color, alpha);
          }
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, ty);
        }

        d.y += d.speed;                              // T dim
        if (d.y - d.len * COL_W > H + 20) {
          d.y = -Math.random() * 80;
          d.speed = 0.8 + Math.random() * 2.2;
          d.len   = 6 + Math.floor(Math.random() * 10);
          d.bright = Math.random() > 0.7;
        }
      });
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [on, color]);
}

// ── 2. sk-foundry  Radar Sweep — glow rings + ripple blips ────────────────
function useRadarScan(ref: React.RefObject<HTMLCanvasElement>, color: string, on: boolean) {
  useEffect(() => {
    if (!on) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let angle = 0;
    const blips = [
      { a: 0.62, r: 0.50, f: 1.3, ripple: 0 },
      { a: 1.92, r: 0.66, f: 2.0, ripple: 0 },
      { a: 3.05, r: 0.38, f: 0.9, ripple: 0 },
      { a: 4.28, r: 0.57, f: 1.7, ripple: 0 },
      { a: 5.18, r: 0.43, f: 2.4, ripple: 0 },
    ];
    let id: number;
    const draw = () => {
      id = requestAnimationFrame(draw);
      const W = c.width = c.offsetWidth; const H = c.height = c.offsetHeight;
      // Dark fade — keep trailing glow
      ctx.fillStyle = "rgba(2,5,16,0.22)"; ctx.fillRect(0,0,W,H);

      const cx = W/2, cy = H/2;
      const maxR = Math.min(W,H) * 0.44;

      // Glow rings (Z dim — each ring = different depth)
      for (let r = 1; r <= 4; r++) {
        const rr = (maxR/4)*r;
        ctx.beginPath(); ctx.arc(cx,cy,rr,0,Math.PI*2);
        // Inner rings slightly brighter
        ctx.strokeStyle = hx(color, r === 1 ? 0.18 : 0.09);
        ctx.lineWidth = r === 1 ? 1.2 : 0.7;
        ctx.stroke();
      }
      // Cross hair
      ctx.strokeStyle = hx(color, 0.08); ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(cx-maxR,cy); ctx.lineTo(cx+maxR,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy-maxR); ctx.lineTo(cx,cy+maxR); ctx.stroke();

      // Sweep — two-layer glow (T dim)
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle);
      // Wide dim trail
      const g1 = (false as boolean)
        ? null
        : (() => {
            const g = ctx.createRadialGradient(0,0,0,0,0,maxR);
            g.addColorStop(0, hx(color,0.35)); g.addColorStop(1, hx(color,0.08));
            return g;
          })();
      ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,maxR,-0.55,0); ctx.closePath();
      ctx.fillStyle = g1 || hx(color,0.18); ctx.fill();
      // Sharp bright edge line
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(maxR,0);
      ctx.strokeStyle = hx(color,0.95); ctx.lineWidth=2; ctx.stroke();
      // Inner glow on the line
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(maxR,0);
      ctx.strokeStyle = hx(color,0.35); ctx.lineWidth=6; ctx.stroke();
      ctx.restore();

      // Blip dots with ripple rings (F dim — each own frequency)
      const T = Date.now()/1000;
      blips.forEach(b => {
        const diff = ((angle - b.a) % (Math.PI*2) + Math.PI*2) % (Math.PI*2);
        const justHit = diff < 0.06;
        if (justHit) b.ripple = 0;
        b.ripple = Math.min(b.ripple + 0.04, 1);

        const fade = diff > Math.PI*2*0.75
          ? (diff - Math.PI*2*0.75)/(Math.PI*2*0.25)
          : 0.15;
        if (fade < 0.01) return;

        const bx = cx + Math.cos(b.a)*maxR*b.r;
        const by = cy + Math.sin(b.a)*maxR*b.r;
        const pulse = 1 + 0.4*Math.sin(T*b.f);   // F dim

        // Ripple ring
        if (b.ripple < 0.95) {
          const ripR = 4 + b.ripple * 18;
          ctx.beginPath(); ctx.arc(bx,by,ripR,0,Math.PI*2);
          ctx.strokeStyle = hx(color,(1-b.ripple)*fade*0.6);
          ctx.lineWidth=1; ctx.stroke();
        }
        // Core dot
        const dotR = Math.max(0.5, 3.5*pulse);
        const dg = ctx.createRadialGradient(bx,by,0,bx,by,dotR*2.5);
        dg.addColorStop(0, hx(color, fade*0.9));
        dg.addColorStop(1, hx(color, 0));
        ctx.beginPath(); ctx.arc(bx,by,dotR*2.5,0,Math.PI*2); ctx.fillStyle=dg; ctx.fill();
        ctx.beginPath(); ctx.arc(bx,by,dotR,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${fade*0.85})`; ctx.fill();
      });
      angle += 0.018;
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [on, color]);
}

// ── 3. sk-defi  DeFi Math Curves ──────────────────────────────────────────
function useDefiMath(ref: React.RefObject<HTMLCanvasElement>, color: string, on: boolean) {
  useEffect(() => {
    if (!on) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let id: number;
    const draw = () => {
      id = requestAnimationFrame(draw);
      const W = c.width = c.offsetWidth; const H = c.height = c.offsetHeight;
      ctx.fillStyle = "rgba(248,250,248,0.90)"; ctx.fillRect(0,0,W,H);
      const T = Date.now()/1000;
      // soft grid
      ctx.strokeStyle = hx(color,0.094); ctx.lineWidth=0.7;
      for (let x=0;x<W;x+=46){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for (let y=0;y<H;y+=46){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // 5 interfering wave curves — F dim (each has own frequency) + T + Z (amplitude)
      for (let ci=0; ci<5; ci++) {
        const freq = 0.38 + ci*0.32;    // F dim
        const amp  = 28 + ci*11;        // Z dim (vertical displacement)
        const phase = (ci/5)*Math.PI*2;
        ctx.beginPath();
        for (let x=0; x<=W; x+=3) {
          const t = x/W;
          const y = H*0.5
            + amp * Math.sin(t*Math.PI*3*freq + T*freq + phase)
            + amp*0.38 * Math.sin(t*Math.PI*5*freq - T*0.65 + phase); // interference (5th dim)
          x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.strokeStyle = hx(color,(0.10+ci*0.055));
        ctx.lineWidth = 0.8 + ci*0.28; ctx.stroke();
      }
      // floating math symbols — Z dim (depth via size)
      const glyphs = ["∑","∫","Δ","∞","≥","√","∂","≈"];
      glyphs.forEach((g,i) => {
        const sz = 11 + i*2.2;
        const x  = W*(0.08 + i*0.115);
        const y  = H*0.28 + Math.sin(T*0.38 + i)*H*0.10;
        ctx.font = `${sz}px Georgia, serif`;
        ctx.fillStyle = hx(color,(0.07+i*0.013));
        ctx.fillText(g, x, y);
      });
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [on, color]);
}

// ── 4. sk-sec  Laser Tripwire Grid ────────────────────────────────────────
function useLaserTripwire(ref: React.RefObject<HTMLCanvasElement>, color: string, on: boolean) {
  useEffect(() => {
    if (!on) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let laserY = 0; let id: number;
    draw();
    function draw() {
      id = requestAnimationFrame(draw);
      const W = c.width = c.offsetWidth; const H = c.height = c.offsetHeight;
      ctx.fillStyle = "#000"; ctx.fillRect(0,0,W,H);
      // perspective grid — Z dim
      const vp = { x:W/2, y:H*0.4 };
      for (let i=-14; i<=14; i++) {
        ctx.beginPath(); ctx.moveTo(vp.x + i*52, H); ctx.lineTo(vp.x, vp.y);
        ctx.strokeStyle = hx(color,0.133); ctx.lineWidth=0.7; ctx.stroke();
      }
      for (let j=0; j<9; j++) {
        const t = j/9;
        const y2 = vp.y + (H-vp.y)*t;
        const hw = W*0.5*t;
        ctx.beginPath(); ctx.moveTo(vp.x-hw,y2); ctx.lineTo(vp.x+hw,y2);
        ctx.strokeStyle = hx(color,(0.03+t*0.18));
        ctx.lineWidth=0.7; ctx.stroke();
      }
      // laser beam — T dim
      if (H > 0) laserY = (laserY + 1.6) % H;
      if (!isFinite(laserY) || H <= 0) return;
      const lg = ctx.createLinearGradient(0,laserY-14,0,laserY+14);
      lg.addColorStop(0,hx(color,0.000)); lg.addColorStop(0.5,hx(color,0.933)); lg.addColorStop(1,hx(color,0.000));
      ctx.fillStyle=lg; ctx.fillRect(0,laserY-14,W,28);
      // intersection sparks — F dim (each spark has own flicker frequency)
      const T = Date.now();
      for (let i=-14; i<=14; i++) {
        const t = laserY/H;
        const x = W/2 + i*52*t;
        if (x<0||x>W) continue;
        const flicker = Math.sin(T/55 + i*1.7); // F dim
        if (flicker > 0.35) {
          ctx.beginPath(); ctx.arc(x, laserY, 2+flicker*2.5, 0, Math.PI*2);
          ctx.fillStyle = hx(color,1.000); ctx.fill();
        }
      }
    }
    return () => cancelAnimationFrame(id);
  }, [on, color]);
}

// ── 5. sk-chainlink  Neural Network Nodes ─────────────────────────────────
function useNeuralNet(ref: React.RefObject<HTMLCanvasElement>, color: string, on: boolean) {
  useEffect(() => {
    if (!on) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const N = 20;
    const nodes = Array.from({ length: N }, () => ({
      x: (Math.random()*0.82+0.09) * (c.offsetWidth||300),
      y: (Math.random()*0.82+0.09) * (c.offsetHeight||200),
      vx: (Math.random()-0.5)*0.42,
      vy: (Math.random()-0.5)*0.42,
      r: 2+Math.random()*3,
      phase: Math.random()*Math.PI*2,  // F dim
      freq:  0.7+Math.random()*1.6,
    }));
    let id: number;
    const draw = () => {
      id = requestAnimationFrame(draw);
      const W = c.width = c.offsetWidth; const H = c.height = c.offsetHeight;
      ctx.fillStyle = "rgba(1,8,22,0.17)"; ctx.fillRect(0,0,W,H);
      const T = Date.now()/1000;
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x<18||n.x>W-18) n.vx*=-1;
        if (n.y<18||n.y>H-18) n.vy*=-1;
      });
      // connections
      for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if (d<115) {
          const pulse = 0.45 + 0.55 * Math.abs(Math.sin(T*1.8 + i*0.5)); // T dim
          ctx.strokeStyle = hx(color,(1-d/115)*pulse*0.667);
          ctx.lineWidth=0.75;
          ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke();
        }
      }
      // nodes
      nodes.forEach(n => {
        const pulse = 1 + 0.32*Math.sin(T*n.freq + n.phase); // F + T dims
        const gr = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*4.5*pulse);
        gr.addColorStop(0,hx(color,0.600)); gr.addColorStop(1,hx(color,0.000));
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r*4.5*pulse,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r*pulse,0,Math.PI*2); ctx.fillStyle=hx(color,0.933); ctx.fill();
      });
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [on, color]);
}

// ── 6. sk-aa  Vault Reactor ────────────────────────────────────────────────
function useVaultReactor(ref: React.RefObject<HTMLCanvasElement>, color: string, on: boolean) {
  useEffect(() => {
    if (!on) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const P = 26;
    const parts = Array.from({ length: P }, (_,i) => ({
      angle:  (i/P)*Math.PI*2,
      orbitR: 0.22 + (i%3)*0.09,
      freq:   0.5 + (i%6)*0.28,  // F dim
      phase:  (i/P)*Math.PI*2,
      size:   2 + i%4,
    }));
    let id: number;
    const draw = () => {
      id = requestAnimationFrame(draw);
      const W = c.width = c.offsetWidth; const H = c.height = c.offsetHeight;
      ctx.fillStyle = "rgba(10,2,18,0.15)"; ctx.fillRect(0,0,W,H);
      const T = Date.now()/1000;
      const cx=W/2, cy=H/2, base=Math.min(W,H)*0.40;
      // dim grid
      ctx.strokeStyle=hx(color,0.027); ctx.lineWidth=0.8;
      for(let x=0;x<W;x+=38){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=38){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // core pulse — T dim
      const cr = 16+5*Math.sin(T*1.6);
      const cg = ctx.createRadialGradient(cx,cy,0,cx,cy,cr*3.5);
      cg.addColorStop(0,hx(color,0.533)); cg.addColorStop(0.45,hx(color,0.200)); cg.addColorStop(1,hx(color,0.000));
      ctx.beginPath(); ctx.arc(cx,cy,cr*3.5,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill();
      // particles — F + Z + T dims
      parts.forEach(p => {
        const a  = p.angle + T*(0.38 + p.freq*0.18);
        const r  = base * p.orbitR;
        const zS = 0.55 + 0.45*Math.sin(T*p.freq + p.phase); // Z dim
        const px = cx + Math.cos(a)*r;
        const py = cy + Math.sin(a)*r*zS;
        const depth = (zS-0.55)/0.45;
        const alpha = 0.35 + depth*0.65;
        const sz = Math.max(0.5, p.size*(0.55+depth*0.85));
        const glowR = Math.max(1, sz*3.5);
        const pg = ctx.createRadialGradient(px,py,0,px,py,glowR);
        pg.addColorStop(0, hx(color,(alpha)*0.784));
        pg.addColorStop(1, hx(color,0.000));
        ctx.beginPath(); ctx.arc(px,py,glowR,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();
        ctx.beginPath(); ctx.arc(px,py,sz,0,Math.PI*2);
        ctx.fillStyle=hx(color,alpha); ctx.fill();
      });
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [on, color]);
}

// ── 7. sk-ts  Merkle Tree ─────────────────────────────────────────────────
function useMerkleTree(ref: React.RefObject<HTMLCanvasElement>, color: string, on: boolean) {
  useEffect(() => {
    if (!on) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const LEVELS = 4;
    type MN = { x:number; y:number; lv:number; idx:number; phase:number; freq:number };
    let nodes: MN[] = [];
    let lastW = 0;
    const build = (W:number, H:number) => {
      nodes = [];
      for (let l=0;l<LEVELS;l++) {
        const cnt = Math.pow(2,l);
        for (let i=0;i<cnt;i++) {
          nodes.push({ x:W*(0.12+0.76*(i+0.5)/cnt), y:H*0.10+(H*0.78)*(l/(LEVELS-1)),
            lv:l, idx:i, phase:(l*1.3+i*0.7)*Math.PI, freq:0.55+(l+i)*0.28 });
        }
      }
      lastW=W;
    };
    let id: number;
    const draw = () => {
      id = requestAnimationFrame(draw);
      const W=c.width=c.offsetWidth; const H=c.height=c.offsetHeight;
      if (Math.abs(lastW-W)>20) build(W,H);
      ctx.fillStyle="rgba(1,8,25,0.17)"; ctx.fillRect(0,0,W,H);
      const T=Date.now()/1000;
      // edges
      for (let l=0;l<LEVELS-1;l++) {
        const parents  = nodes.filter(n=>n.lv===l);
        const children = nodes.filter(n=>n.lv===l+1);
        parents.forEach((p,pi)=>{
          [children[pi*2], children[pi*2+1]].forEach(ch=>{
            if (!ch) return;
            const pulse = 0.38+0.62*Math.abs(Math.sin(T*p.freq+p.phase)); // T+F dims
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(ch.x,ch.y);
            ctx.strokeStyle=hx(color,(pulse)*0.353);
            ctx.lineWidth=1+(LEVELS-1-l)*0.35; ctx.stroke();
            // data packet travelling (T dim)
            const tf = (T*0.55+l*0.45)%1;
            const px2=p.x+(ch.x-p.x)*tf, py2=p.y+(ch.y-p.y)*tf;
            ctx.beginPath(); ctx.arc(px2,py2,2.8,0,Math.PI*2);
            ctx.fillStyle=hx(color,0.800); ctx.fill();
          });
        });
      }
      // nodes — Z dim (depth via level)
      nodes.forEach(n=>{
        const pulse = 1+0.28*Math.sin(T*n.freq+n.phase); // F+T dims
        const depth = 1-n.lv/LEVELS;                      // Z dim
        const r = (5+depth*7)*pulse;
        const gr = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r*2.8);
        gr.addColorStop(0,hx(color,(0.45+depth*0.55)*0.784));
        gr.addColorStop(1,hx(color,0.000));
        ctx.beginPath(); ctx.arc(n.x,n.y,r*2.8,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x,n.y,r*0.65,0,Math.PI*2); ctx.fillStyle=hx(color,0.933); ctx.fill();
      });
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [on, color]);
}

// ── 8. sk-next  Blockchain Mempool Flow — tx packets on lanes ─────────────
function useDataStream(ref: React.RefObject<HTMLCanvasElement>, color: string, on: boolean) {
  useEffect(() => {
    if (!on) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;

    const LANES = 7;
    type Packet = { x: number; w: number; speed: number; alpha: number; freq: number; confirmed: boolean };
    const lanes: { y: number; packets: Packet[] }[] = [];

    const init = () => {
      lanes.length = 0;
      const H = c.offsetHeight || 200;
      for (let i = 0; i < LANES; i++) {
        const packets: Packet[] = [];
        // Seed some initial packets
        for (let j = 0; j < 3; j++) {
          packets.push({
            x: Math.random() * (c.offsetWidth || 300),
            w: 18 + Math.random() * 38,
            speed: 0.6 + Math.random() * 1.8,
            alpha: 0.4 + Math.random() * 0.55,
            freq: 0.6 + Math.random() * 1.8, // F dim — glow pulse freq
            confirmed: Math.random() > 0.4,
          });
        }
        lanes.push({ y: (H / LANES) * (i + 0.5), packets });
      }
    };

    let id: number;
    let lastH = 0;
    const draw = () => {
      id = requestAnimationFrame(draw);
      const W = c.width = c.offsetWidth; const H = c.height = c.offsetHeight;
      if (Math.abs(H - lastH) > 20) { init(); lastH = H; }
      ctx.fillStyle = "rgba(10,14,30,0.18)"; ctx.fillRect(0,0,W,H);
      const T = Date.now()/1000;

      // Ambient glow centre
      const ag = ctx.createRadialGradient(W*0.5,H*0.5,0,W*0.5,H*0.5,W*0.5);
      ag.addColorStop(0, hx(color,0.09)); ag.addColorStop(1, hx(color,0.0));
      ctx.fillStyle=ag; ctx.fillRect(0,0,W,H);

      lanes.forEach((lane, li) => {
        // Spawn new packets randomly
        if (Math.random() < 0.018) {
          lane.packets.push({
            x: -50,
            w: 18 + Math.random() * 38,
            speed: 0.6 + Math.random() * 1.8,
            alpha: 0.4 + Math.random() * 0.55,
            freq: 0.6 + Math.random() * 1.8,
            confirmed: Math.random() > 0.4,
          });
        }

        // Lane track line
        ctx.beginPath(); ctx.moveTo(0, lane.y); ctx.lineTo(W, lane.y);
        ctx.strokeStyle = hx(color, 0.06); ctx.lineWidth=0.6; ctx.stroke();

        lane.packets = lane.packets.filter(p => p.x < W + 80);
        lane.packets.forEach(p => {
          p.x += p.speed; // T dim

          const glowPulse = 1 + 0.3*Math.sin(T*p.freq + li); // F dim
          const h = 8 + li%3 * 2; // Z dim — lane depth = height
          const r2 = h/2;
          const y0 = lane.y - h/2;

          // Glow halo
          const glow = Math.max(1, p.w * glowPulse * 0.5);
          const gg = ctx.createRadialGradient(p.x, lane.y, 0, p.x, lane.y, glow+6);
          gg.addColorStop(0, hx(color, p.alpha * glowPulse * 0.4));
          gg.addColorStop(1, hx(color, 0));
          ctx.fillStyle = gg;
          ctx.fillRect(p.x - glow - 6, lane.y - glow - 6, (glow+6)*2, (glow+6)*2);

          // Packet body — rounded rect
          ctx.beginPath();
          ctx.roundRect
            ? ctx.roundRect(p.x - p.w/2, y0, p.w, h, r2)
            : (() => {
                ctx.moveTo(p.x - p.w/2 + r2, y0);
                ctx.lineTo(p.x + p.w/2 - r2, y0);
                ctx.arcTo(p.x+p.w/2,y0,p.x+p.w/2,y0+r2,r2);
                ctx.lineTo(p.x+p.w/2,y0+h-r2);
                ctx.arcTo(p.x+p.w/2,y0+h,p.x+p.w/2-r2,y0+h,r2);
                ctx.lineTo(p.x-p.w/2+r2,y0+h);
                ctx.arcTo(p.x-p.w/2,y0+h,p.x-p.w/2,y0+h-r2,r2);
                ctx.lineTo(p.x-p.w/2,y0+r2);
                ctx.arcTo(p.x-p.w/2,y0,p.x-p.w/2+r2,y0,r2);
                ctx.closePath();
              })();

          if (p.confirmed) {
            ctx.fillStyle = hx(color, p.alpha * glowPulse * 0.85);
            ctx.fill();
            ctx.strokeStyle = hx(color, 0.9); ctx.lineWidth=0.8; ctx.stroke();
          } else {
            // Pending — outline only, dimmer
            ctx.strokeStyle = hx(color, p.alpha * 0.5); ctx.lineWidth=0.7; ctx.stroke();
          }
        });
      });
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [on, color]);
}

// ─── Animation map ────────────────────────────────────────────────────────
type AnimHook = (ref: React.RefObject<HTMLCanvasElement>, color: string, on: boolean) => void;
const ANIM_MAP: Record<string, AnimHook> = {
  "sk-sol":      useEVMMatrix,
  "sk-foundry":  useRadarScan,
  "sk-defi":     useDefiMath,
  "sk-sec":      useLaserTripwire,
  "sk-chainlink":useNeuralNet,
  "sk-aa":       useVaultReactor,
  "sk-ts":       useMerkleTree,
  "sk-next":     useDataStream,
};

// ─── Canvas component (calls the hook for this skill) ─────────────────────
function SkillCanvas({ id, color, on, className }: { id:string; color:string; on:boolean; className?:string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hook = ANIM_MAP[id] ?? useVaultReactor;
  hook(ref as React.RefObject<HTMLCanvasElement>, color, on);
  return <canvas ref={ref} className={className} style={{ width:"100%", height:"100%", display:"block" }} />;
}

// ═══════════════════════════════════════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════════════════════════════════════
const isLightTheme = (id: string) => id === "sk-defi";

function SkillModal({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  const light = isLightTheme(skill.id);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-5"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className={`absolute inset-0 backdrop-blur-2xl ${light ? "bg-white/65" : "bg-black/82"}`} />

      <motion.div
        initial={{ y: 55, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 35, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className={`relative w-full sm:max-w-4xl max-h-[93vh] sm:max-h-[88vh] overflow-y-auto
          rounded-t-[28px] sm:rounded-[28px]
          ${light ? "bg-[#f8faf8] border border-gray-200" : "bg-[#080808] border border-white/8"}`}
        style={{ boxShadow: light
          ? `0 40px 80px rgba(0,0,0,0.12), 0 0 0 1px ${skill.tagColor}18`
          : `0 40px 80px rgba(0,0,0,0.92), 0 0 0 1px ${skill.tagColor}22` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Canvas header */}
        <div className="relative h-48 sm:h-60 overflow-hidden rounded-t-[28px]">
          <SkillCanvas id={skill.id} color={skill.tagColor} on={true} className="absolute inset-0" />
          <div className="absolute inset-0" style={{
            background: light
              ? "linear-gradient(to bottom, transparent 25%, #f8faf8 100%)"
              : "linear-gradient(to bottom, transparent 25%, #080808 100%)"
          }} />
          {/* close */}
          <button onClick={onClose}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold transition-all
              ${light ? "bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-100" : "bg-white/8 border-white/12 text-white/80 hover:bg-white/16"}`}>
            ✕
          </button>
          {/* tag pill */}
          <div className="absolute bottom-5 left-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-1.5 rounded-full"
              style={{ color: skill.tagColor, background: skill.tagColor+"20", border: `1px solid ${skill.tagColor}35`, backdropFilter:"blur(8px)" }}>
              {skill.tag}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-8 sm:px-10 sm:pb-10 -mt-2">
          {/* headline */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2"
            style={{ color: skill.tagColor, fontFamily:"JetBrains Mono, monospace" }}>
            {skill.headline}
          </p>
          <h2 className={`text-3xl sm:text-5xl font-black tracking-tighter leading-tight mb-6
            ${light ? "text-gray-900" : "text-white"}`}
            style={{ fontFamily:"Syne, sans-serif" }}>
            {skill.icon} {skill.name}
          </h2>

          {/* description */}
          <motion.p
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
            className={`text-base sm:text-lg leading-relaxed mb-8 border-l-[3px] pl-5
              ${light ? "text-gray-600" : "text-gray-300"}`}
            style={{ borderColor: skill.tagColor }}>
            {skill.description}
          </motion.p>

          {/* why */}
          <motion.div
            initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.14 }}
            className={`rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden
              ${light ? "bg-white border border-gray-100 shadow-sm" : "bg-white/4 border border-white/8"}`}>
            <div className="absolute top-0 left-0 h-0.5 w-20" style={{ background: skill.tagColor }} />
            <p className={`text-[10px] font-bold uppercase tracking-[0.22em] mb-3 ${light?"text-gray-400":"text-gray-500"}`}>
              Architectural Importance
            </p>
            <p className={`text-sm sm:text-base leading-relaxed ${light?"text-gray-800":"text-gray-200"}`}>
              {skill.why}
            </p>
          </motion.div>

          {/* capabilities */}
          <p className={`text-[10px] font-bold uppercase tracking-[0.22em] mb-4 ${light?"text-gray-400":"text-gray-500"}`}>
            Strategic Implementation
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {skill.capabilities.map((cap, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.20+i*0.09 }}
                className={`rounded-xl p-5 sm:p-6 relative overflow-hidden group border transition-colors duration-200
                  ${light ? "bg-white border-gray-100 hover:border-gray-200 shadow-sm" : "bg-white/3 border-white/6 hover:bg-white/6"}`}>
                <div className="absolute top-0 left-0 w-full h-px opacity-60"
                  style={{ background: `linear-gradient(90deg, ${skill.tagColor}, transparent)` }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top right, ${skill.tagColor}, transparent 70%)` }} />
                <h4 className={`text-base sm:text-lg font-black mb-2 relative z-10 ${light?"text-gray-900":"text-white"}`}
                  style={{ fontFamily:"Syne, sans-serif" }}>
                  {cap.title}
                </h4>
                <p className={`text-sm leading-relaxed relative z-10 ${light?"text-gray-500":"text-gray-400"}`}>
                  {cap.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  SKILL CARD
// ═══════════════════════════════════════════════════════════════════════════
function SkillCard({ skill, index, onOpen }: { skill:Skill; index:number; onOpen:(s:Skill)=>void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0), my = useMotionValue(0);
  const cfg = { stiffness: 280, damping: 28 };
  const rotX = useSpring(useTransform(my,[-0.5,0.5],[6,-6]), cfg);
  const rotY = useSpring(useTransform(mx,[-0.5,0.5],[-6,6]), cfg);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    mx.set((e.clientX-r.left)/r.width-0.5);
    my.set((e.clientY-r.top)/r.height-0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); setHovered(false); }, [mx, my]);

  return (
    <motion.div
      initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.08 }}
      transition={{ delay:index*0.055, duration:0.5, ease:[0.16,1,0.3,1] }}
      style={{ perspective:1000 }} className="h-full"
    >
      <motion.div
        ref={ref}
        style={{ rotateX:rotX, rotateY:rotY, transformStyle:"preserve-3d" }}
        onMouseMove={onMove} onMouseEnter={()=>setHovered(true)} onMouseLeave={onLeave}
        onClick={()=>onOpen(skill)} whileTap={{ scale:0.97 }}
        className="h-full cursor-pointer"
      >
        <div
          className="relative h-full overflow-hidden select-none flex flex-col"
          style={{
            borderRadius: 24,
            border: `1px solid ${hovered ? skill.tagColor+"55" : "#e8e8e4"}`,
            background: "#ffffff",
            boxShadow: hovered
              ? `0 22px 45px rgba(0,0,0,0.09), 0 0 0 1px ${skill.tagColor}22`
              : "0 2px 10px rgba(0,0,0,0.05)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          {/* Canvas preview */}
          <div className="relative overflow-hidden flex-shrink-0" style={{ height:120, borderRadius:"24px 24px 0 0" }}>
            <SkillCanvas id={skill.id} color={skill.tagColor} on={hovered} className="absolute inset-0" />
            <motion.div className="absolute inset-0 bg-black"
              animate={{ opacity: hovered ? 0.05 : 0.48 }} transition={{ duration:0.32 }} />
            <div className="absolute bottom-0 left-0 right-0 h-10"
              style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }} />
            {/* tag badge */}
            <div className="absolute top-2.5 left-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                style={{ color:skill.tagColor, background:skill.tagColor+"22",
                  border:`1px solid ${skill.tagColor}38`, backdropFilter:"blur(6px)" }}>
                {skill.tag}
              </span>
            </div>
          </div>

          {/* Card body */}
          <div className="flex flex-col flex-1 px-5 pt-3 pb-5">
            <div className="flex items-start gap-2.5 mb-auto">
              <motion.span className="text-3xl flex-shrink-0 mt-0.5"
                animate={{ scale: hovered ? 1.10 : 1 }} transition={{ duration:0.22 }}>
                {skill.icon}
              </motion.span>
              <h3 className="font-black text-lg sm:text-xl leading-tight mt-1 text-gray-900"
                style={{ fontFamily:"Syne, sans-serif" }}>
                {skill.name}
              </h3>
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
                View Details
              </span>
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                animate={{
                  x: hovered ? 3 : 0,
                  background: hovered ? skill.tagColor : "#f3f4f6",
                  color: hovered ? "#fff" : "#9ca3af",
                }}
                transition={{ duration:0.2 }}
              >
                →
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════
export default function ClickableSkillsGrid({
  data,
  openModal,
}: {
  data?: any[];
  openModal?: (skill: any, type: "skill" | "project") => void;
}) {
  const skills = (data && data.length > 0 ? data : skillsData) as Skill[];
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const primary   = skills.filter(s => s.tier === "primary");
  const secondary = skills.filter(s => s.tier === "secondary");

  const handleOpen = useCallback((skill: Skill) => {
    if (openModal) openModal(skill, "skill");
    else setActiveSkill(skill);
  }, [openModal]);

  return (
    <>
      <FontLoader />
      <section className="py-20 sm:py-32 px-4 sm:px-6 overflow-hidden bg-[#F8F9F6]">

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.55 }}
          className="mb-14 sm:mb-20 max-w-7xl mx-auto"
        >
          <h2 className="text-5xl sm:text-6xl md:text-[5rem] font-black text-[#0a0a0a] tracking-tighter mb-5 leading-none"
            style={{ fontFamily:"Syne, sans-serif" }}>
            Technical{" "}
            <span style={{
              fontFamily:"Syne, sans-serif",
              background:"linear-gradient(120deg,#0055FF,#059669)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              backgroundClip:"text",
            }}>
              Skills.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl leading-relaxed"
            style={{ fontFamily:"DM Sans, sans-serif" }}>
            My engineering stack for building secure, scalable Web3 protocols.{" "}
            <strong className="text-gray-800 font-semibold"></strong>
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          {/* Primary */}
          <div>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-2 h-2 rounded-sm bg-[#0055FF]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#0055FF]"
                style={{ fontFamily:"JetBrains Mono, monospace" }}>
                Core Skills — Protocol & Execution
              </p>
              <div className="h-px flex-1 bg-[#0055FF]/15" />
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {primary.map((s,i) => <SkillCard key={s.id} skill={s} index={i} onOpen={handleOpen} />)}
            </div>
          </div>

          {/* Secondary */}
          <div>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-2 h-2 rounded-sm bg-[#7C3AED]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#7C3AED]"
                style={{ fontFamily:"JetBrains Mono, monospace" }}>
                Tooling — Integrations & Frontend
              </p>
              <div className="h-px flex-1 bg-[#7C3AED]/15" />
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {secondary.map((s,i) => <SkillCard key={s.id} skill={s} index={i+4} onOpen={handleOpen} />)}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeSkill && <SkillModal skill={activeSkill} onClose={() => setActiveSkill(null)} />}
      </AnimatePresence>
    </>
  );
}
