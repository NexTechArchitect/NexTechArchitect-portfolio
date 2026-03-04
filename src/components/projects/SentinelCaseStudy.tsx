"use client";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;}
.sf{font-family:'Outfit',system-ui,sans-serif;}
.sm{font-family:'JetBrains Mono','Courier New',monospace;}
@keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
@keyframes floatY2{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-7px) rotate(2deg);}}
.fl1{animation:floatY 6s ease-in-out infinite;}
.fl2{animation:floatY2 9s ease-in-out infinite;}
.fl3{animation:floatY 11s ease-in-out infinite 1.5s;}
.dot-bg{background-image:radial-gradient(circle,rgba(245,158,11,0.10) 1px,transparent 1px);background-size:30px 30px;}
.ss::-webkit-scrollbar{width:3px;height:3px;}
.ss::-webkit-scrollbar-track{background:#080C14;}
.ss::-webkit-scrollbar-thumb{background:rgba(245,158,11,0.35);border-radius:2px;}
`;

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let W = (cv.width = cv.offsetWidth);
    let H = (cv.height = cv.offsetHeight);
    let raf: number, t = 0;
    const mob = W < 768;
    const N = mob ? 55 : 110;
    interface Nd { x:number;y:number;z:number;w:number;vx:number;vy:number;vz:number;tier:number;ph:number; }
    const nodes: Nd[] = Array.from({length:N},()=>{
      const tier=Math.random()>0.92?0:Math.random()>0.72?1:2;
      const r=tier===0?0.18:tier===1?0.52:1.0;
      const theta=Math.random()*Math.PI*2;
      const phi=Math.acos(2*Math.random()-1);
      return{x:r*Math.sin(phi)*Math.cos(theta),y:r*Math.sin(phi)*Math.sin(theta),z:r*Math.cos(phi),
        w:Math.random()*2-1,vx:(Math.random()-0.5)*0.0012,vy:(Math.random()-0.5)*0.0012,
        vz:(Math.random()-0.5)*0.0008,tier,ph:Math.random()*Math.PI*2};
    });
    const onMM=(e:MouseEvent)=>{
      const r=cv.getBoundingClientRect();
      mouse.current.x=(e.clientX-r.left)/r.width;
      mouse.current.y=(e.clientY-r.top)/r.height;
    };
    window.addEventListener("mousemove",onMM);
    const draw=()=>{
      t+=0.007;
      ctx.fillStyle="rgba(8,12,20,0.20)";ctx.fillRect(0,0,W,H);
      const CX=W/2,CY=H/2,S=Math.min(W,H)*(mob?0.40:0.36);
      const rY=t*0.32+(mouse.current.x-0.5)*0.9;
      const rX=Math.sin(t*0.18)*0.22+(mouse.current.y-0.5)*0.5;
      const rW=t*0.11;
      type P={px:number;py:number;d:number;tier:number;ph:number;};
      const proj:P[]=nodes.map(n=>{
        n.x+=n.vx;n.y+=n.vy;n.z+=n.vz;
        const len=Math.sqrt(n.x*n.x+n.y*n.y+n.z*n.z);
        if(len>1.06){n.vx*=-0.97;n.vy*=-0.97;n.vz*=-0.97;}
        const x4=n.x*Math.cos(rW)-n.w*Math.sin(rW);
        const w4=n.x*Math.sin(rW)+n.w*Math.cos(rW);
        const cosY=Math.cos(rY),sinY=Math.sin(rY),cosX=Math.cos(rX),sinX=Math.sin(rX);
        const x1=x4*cosY-n.z*sinY,z1=x4*sinY+n.z*cosY;
        const y1=n.y*cosX-z1*sinX,z2=n.y*sinX+z1*cosX;
        const wi=1+w4*0.14,zp=1/(3.0-z2)*wi;
        return{px:CX+x1*S*zp,py:CY+y1*S*zp,d:zp,tier:n.tier,ph:n.ph};
      });
      proj.sort((a,b)=>a.d-b.d);
      for(let i=0;i<proj.length;i++){
        for(let j=i+1;j<proj.length;j++){
          const a=proj[i],b=proj[j];
          const dx=a.px-b.px,dy=a.py-b.py,d2=dx*dx+dy*dy;
          const thr=mob?5000:8500;
          if(d2<thr){
            const ratio=1-d2/thr,avg=(a.d+b.d)*0.5;
            if(a.tier===0||b.tier===0){ctx.strokeStyle=`rgba(245,158,11,${ratio*avg*0.6})`;ctx.lineWidth=ratio*1.1;}
            else if(a.tier===1&&b.tier===1){ctx.strokeStyle=`rgba(59,130,246,${ratio*avg*0.28})`;ctx.lineWidth=ratio*0.55;}
            else{ctx.strokeStyle=`rgba(71,85,105,${ratio*avg*0.14})`;ctx.lineWidth=ratio*0.35;}
            ctx.beginPath();ctx.moveTo(a.px,a.py);ctx.lineTo(b.px,b.py);ctx.stroke();
          }
        }
      }
      proj.forEach(n=>{
        const pulse=(Math.sin(t*2.1+n.ph)+1)*0.5,alpha=Math.max(0.05,Math.min(1,n.d*0.85));
        if(n.tier===0){
          const r=(2.8+pulse*3.2)*n.d;
          const g=ctx.createRadialGradient(n.px,n.py,0,n.px,n.py,r*3.5);
          g.addColorStop(0,`rgba(253,230,138,${alpha})`);g.addColorStop(0.5,`rgba(245,158,11,${alpha*0.5})`);g.addColorStop(1,"rgba(245,158,11,0)");
          ctx.beginPath();ctx.arc(n.px,n.py,r*3.5,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
          ctx.beginPath();ctx.arc(n.px,n.py,r*0.55,0,Math.PI*2);
          ctx.fillStyle=`rgba(255,255,255,${alpha*0.95})`;ctx.shadowBlur=14;ctx.shadowColor="#F59E0B";ctx.fill();ctx.shadowBlur=0;
        }else if(n.tier===1){
          const r=(1.3+pulse)*n.d;
          ctx.beginPath();ctx.arc(n.px,n.py,r,0,Math.PI*2);
          ctx.fillStyle=`rgba(59,130,246,${alpha*(0.35+pulse*0.45)})`;ctx.shadowBlur=5;ctx.shadowColor="#3B82F6";ctx.fill();ctx.shadowBlur=0;
        }else{
          const r=(0.7+pulse*0.4)*n.d;
          ctx.beginPath();ctx.arc(n.px,n.py,r,0,Math.PI*2);ctx.fillStyle=`rgba(100,116,139,${alpha*0.28})`;ctx.fill();
        }
      });
      const cp=Math.sin(t*1.5)*0.4+0.6;
      [72,52,34].forEach((r,i)=>{
        ctx.beginPath();ctx.arc(CX,CY,r+cp*5,0,Math.PI*2);
        ctx.strokeStyle=`rgba(245,158,11,${[0.06,0.10,0.18][i]})`;ctx.lineWidth=1;ctx.stroke();
      });
      const cg=ctx.createRadialGradient(CX,CY,0,CX,CY,22+cp*8);
      cg.addColorStop(0,"rgba(255,245,200,0.95)");cg.addColorStop(0.4,"rgba(245,158,11,0.55)");cg.addColorStop(1,"rgba(245,158,11,0)");
      ctx.beginPath();ctx.arc(CX,CY,22+cp*8,0,Math.PI*2);ctx.fillStyle=cg;ctx.fill();
      ctx.beginPath();ctx.arc(CX,CY,4.5,0,Math.PI*2);
      ctx.fillStyle="#fff";ctx.shadowBlur=22;ctx.shadowColor="#F59E0B";ctx.fill();ctx.shadowBlur=0;
      raf=requestAnimationFrame(draw);
    };
    draw();
    const onResize=()=>{W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;};
    window.addEventListener("resize",onResize);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",onResize);window.removeEventListener("mousemove",onMM);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full"/>;
}

function WireCube({sz=36,color="#F59E0B"}:{sz?:number;color?:string;}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const ctx=cv.getContext("2d");if(!ctx)return;
    cv.width=sz;cv.height=sz;let raf:number,t=0;
    const verts:Array<[number,number,number]>=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    const prj=(v:[number,number,number],rY:number,rX:number)=>{
      const[ix,iy,iz]=v;
      const x1=ix*Math.cos(rY)-iz*Math.sin(rY),z1=ix*Math.sin(rY)+iz*Math.cos(rY);
      const y1=iy*Math.cos(rX)-z1*Math.sin(rX),z2=iy*Math.sin(rX)+z1*Math.cos(rX);
      const d=4/(4-z2*0.6);
      return{x:sz/2+x1*d*sz*0.22,y:sz/2+y1*d*sz*0.22};
    };
    const draw=()=>{
      t+=0.018;ctx.clearRect(0,0,sz,sz);
      const rY=t,rX=t*0.6;
      ctx.strokeStyle=color;ctx.lineWidth=0.8;ctx.globalAlpha=0.65;
      edges.forEach(([a,b])=>{
        const p1=prj(verts[a],rY,rX),p2=prj(verts[b],rY,rX);
        ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();
      });
      ctx.globalAlpha=1;raf=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(raf);
  },[sz,color]);
  return <canvas ref={ref} width={sz} height={sz} style={{width:sz,height:sz}}/>;
}

function Panel({children,accent="#F59E0B",className="",glow=false}:{children:React.ReactNode;accent?:string;className?:string;glow?:boolean;}) {
  return(
    <div className={`relative overflow-hidden ${className}`} style={{
      background:"linear-gradient(135deg,#0D1420 0%,#0A1018 100%)",
      border:`1px solid ${accent}20`,borderTop:`2px solid ${accent}`,
      boxShadow:glow?`0 0 40px ${accent}10,0 16px 48px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.04)`:`0 8px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.03)`,
    }}>{children}</div>
  );
}

function TiltCard({children,accent="#F59E0B",className=""}:{children:React.ReactNode;accent?:string;className?:string;}) {
  const ref=useRef<HTMLDivElement>(null);
  const mx=useMotionValue(0),my=useMotionValue(0);
  const cfg={stiffness:230,damping:26};
  const rX=useSpring(useTransform(my,[-0.5,0.5],[6,-6]),cfg);
  const rY=useSpring(useTransform(mx,[-0.5,0.5],[-6,6]),cfg);
  const gx=useTransform(mx,[-0.5,0.5],["0%","100%"]);
  const gy=useTransform(my,[-0.5,0.5],["0%","100%"]);
  const onMove=useCallback((e:React.MouseEvent)=>{
    if(!ref.current)return;
    const r=ref.current.getBoundingClientRect();
    mx.set((e.clientX-r.left)/r.width-0.5);my.set((e.clientY-r.top)/r.height-0.5);
  },[mx,my]);
  const onLeave=useCallback(()=>{mx.set(0);my.set(0);},[mx,my]);
  return(
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{rotateX:rX,rotateY:rY,transformStyle:"preserve-3d",perspective:900}}>
      <Panel accent={accent} glow className={`relative ${className}`}>
        <motion.div className="absolute inset-0 pointer-events-none z-0" style={{
          background:useTransform([gx,gy],([a,b])=>`radial-gradient(260px circle at ${a} ${b},${accent}10,transparent 60%)`),
        }}/>
        <div className="relative z-10">{children}</div>
      </Panel>
    </motion.div>
  );
}

function Counter({to,sfx=""}:{to:number;sfx?:string;}) {
  const[n,setN]=useState(0);
  const v=useMotionValue(0),s=useSpring(v,{stiffness:55,damping:18});
  useEffect(()=>{s.on("change",val=>setN(Math.round(val)));setTimeout(()=>v.set(to),350);},[to]);
  return<>{n}{sfx}</>;
}

function TL({t,c="#94a3b8",d=0,pre="›"}:{t:string;c?:string;d?:number;pre?:string;}) {
  return(
    <motion.div initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:d,duration:0.25}}
      className="flex items-start gap-2 sm leading-relaxed" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
      <span className="shrink-0" style={{color:"#F59E0B"}}>{pre}</span>
      <span style={{color:c}}>{t}</span>
    </motion.div>
  );
}

export default function SentinelCaseStudy() {
  const[tab,setTab]=useState<"executive"|"architecture"|"defense"|"engineering">("executive");
  const[mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  const TABS=[
    {id:"executive",    label:"Executive",    n:"01"},
    {id:"architecture", label:"Architecture", n:"02"},
    {id:"defense",      label:"Defense",      n:"03"},
    {id:"engineering",  label:"Engineering",  n:"04"},
  ] as const;

  return(
    <div className="sf w-full overflow-hidden" style={{background:"#080C14",color:"#CBD5E1"}}>
      <style>{CSS}</style>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{minHeight:560,background:"#060A10"}}>
        <div className="absolute inset-0">{mounted&&<HeroCanvas/>}</div>
        <div className="absolute inset-0 dot-bg opacity-25 pointer-events-none"/>
        <div className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(to top,#080C14 0%,#080C1470 40%,transparent 100%)"}}/>
        <div className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(to right,#080C14cc 0%,transparent 55%)"}}/>
        <div className="fl1 absolute top-12 right-[10%] pointer-events-none" style={{width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,rgba(245,158,11,0.22),rgba(180,83,9,0.10),transparent 70%)",border:"1px solid rgba(245,158,11,0.15)"}}/>
        <div className="fl2 absolute bottom-[18%] right-[28%] pointer-events-none" style={{width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,rgba(59,130,246,0.18),rgba(30,64,175,0.08),transparent 70%)",border:"1px solid rgba(59,130,246,0.12)"}}/>
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-12 py-4" style={{borderBottom:"1px solid rgba(245,158,11,0.07)"}}>
          <span className="sm text-[9px] tracking-[0.24em] uppercase" style={{color:"rgba(245,158,11,0.45)"}}>SENTINEL//DAO · GOVERNANCE-OS</span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" style={{animation:"ping 2s cubic-bezier(0,0,0.2,1) infinite"}}/>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"/>
            </span>
            <span className="sm text-[9px] tracking-widest uppercase" style={{color:"#10B981"}}>SEPOLIA LIVE</span>
          </div>
        </div>
        <div className="relative z-10 px-6 sm:px-10 md:px-14 pt-24 pb-14 max-w-6xl mx-auto w-full flex flex-col justify-end" style={{minHeight:560}}>
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.65,ease:[0.16,1,0.3,1]}}>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                {t:"ERC-4337 NATIVE",    c:"#F59E0B",b:"rgba(245,158,11,0.10)"},
                {t:"256 TESTS · 0 FAIL", c:"#10B981",b:"rgba(16,185,129,0.08)"},
                {t:"INSTITUTIONAL GRADE",c:"#3B82F6",b:"rgba(59,130,246,0.08)"},
              ].map(b=>(
                <span key={b.t} className="sm font-semibold tracking-[0.16em] px-3 py-1.5"
                  style={{fontSize:"clamp(8px,1vw,10px)",color:b.c,background:b.b,border:`1px solid ${b.c}35`,borderRadius:4}}>
                  {b.t}
                </span>
              ))}
            </div>
            <h1 className="sf font-black text-white" style={{fontSize:"clamp(2.2rem,6vw,4.8rem)",letterSpacing:"-0.025em",lineHeight:0.93,marginBottom:"0.08em"}}>
              SENTINEL
            </h1>
            <h1 className="sf font-black" style={{
              fontSize:"clamp(2.2rem,6vw,4.8rem)",letterSpacing:"-0.025em",lineHeight:0.93,marginBottom:"1.2rem",
              background:"linear-gradient(90deg,#F59E0B 0%,#FDE68A 55%,#F59E0B 100%)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            }}>
              GOVERNANCE OS.
            </h1>
            <p className="sm leading-relaxed mb-8 max-w-lg"
              style={{fontSize:"clamp(10px,1.2vw,12px)",color:"#64748b",borderLeft:"2px solid rgba(245,158,11,0.4)",paddingLeft:14}}>
              Modular protocol-level governance infrastructure for sovereign on-chain control.
              Account Abstraction · 48H Timelock · RageQuit Minority Protection.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="https://sentinel-dao-brown.vercel.app/" target="_blank"
                className="sf inline-flex items-center gap-2 px-5 py-2.5 text-black font-bold tracking-wider transition-all hover:opacity-90 active:scale-95"
                style={{fontSize:"clamp(10px,1.1vw,12px)",background:"linear-gradient(90deg,#F59E0B,#FDE68A)",borderRadius:6,boxShadow:"0 0 22px rgba(245,158,11,0.25)"}}>
                LAUNCH DASHBOARD →
              </Link>
              <Link href="https://github.com/NexTechArchitect/Web3-FullStack-Sentinal-DAO" target="_blank"
                className="sf inline-flex items-center gap-2 px-5 py-2.5 text-slate-300 font-bold tracking-wider transition-all hover:text-white"
                style={{fontSize:"clamp(10px,1.1vw,12px)",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:6}}>
                SOURCE CODE ↗
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* METRICS */}
      <div style={{background:"#0A0F18",borderTop:"1px solid rgba(245,158,11,0.10)",borderBottom:"1px solid rgba(245,158,11,0.10)"}}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            {v:256,s:"", l:"Foundry Tests",  sub:"Zero Failures",       c:"#10B981"},
            {v:17, s:"+",l:"Core Contracts", sub:"Modular Architecture",c:"#F59E0B"},
            {v:48, s:"H",l:"Timelock Delay", sub:"Flash-Gov Protected", c:"#94a3b8"},
            {v:4,  s:"", l:"Security Layers",sub:"RBAC · Veto · Exit",  c:"#3B82F6"},
          ].map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.07}}
              className="px-6 md:px-10 py-7 relative"
              style={{borderRight:i<3?"1px solid rgba(255,255,255,0.05)":undefined}}>
              <div className="absolute top-4 right-4 opacity-25">{mounted&&<WireCube sz={26} color={s.c}/>}</div>
              <div className="sf font-black mb-1" style={{fontSize:"clamp(1.8rem,3.5vw,2.8rem)",color:s.c,letterSpacing:"-0.02em"}}>
                {mounted?<Counter to={s.v} sfx={s.s}/>:"0"}
              </div>
              <div className="sm font-semibold text-white uppercase tracking-widest mb-0.5" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>{s.l}</div>
              <div className="sm uppercase tracking-wider" style={{fontSize:"clamp(7px,0.8vw,9px)",color:"#334155"}}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="sticky top-0 z-50 ss overflow-x-auto"
        style={{background:"rgba(8,12,20,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="max-w-6xl mx-auto flex">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className="relative flex-shrink-0 flex items-center gap-2 px-5 md:px-8 py-4 sm font-semibold tracking-[0.16em] uppercase transition-colors"
              style={{fontSize:"clamp(8px,0.9vw,10px)",color:tab===t.id?"#F59E0B":"#475569"}}>
              <span className="opacity-30 text-white">{t.n}</span>
              {t.label}
              {tab===t.id&&(
                <motion.div layoutId="s-tab" className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{background:"linear-gradient(90deg,#F59E0B,#FDE68A)",boxShadow:"0 0 10px rgba(245,158,11,0.6)"}}/>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-8 pb-20 relative">
        <div className="fl3 absolute -top-10 right-0 pointer-events-none opacity-30" style={{width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.15),transparent 70%)"}}/>
        <div className="fl1 absolute top-[45%] -left-10 pointer-events-none opacity-15" style={{width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.20),transparent 70%)"}}/>

        <AnimatePresence mode="wait">

          {tab==="executive"&&(
            <motion.div key="exec" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.22}} className="space-y-5 relative z-10">
              <Panel accent="#F59E0B" className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">{mounted&&<WireCube sz={42} color="#F59E0B"/>}</div>
                  <div>
                    <p className="sm tracking-[0.22em] uppercase mb-2" style={{fontSize:"clamp(8px,0.9vw,9px)",color:"rgba(245,158,11,0.55)"}}>// DESIGN PHILOSOPHY</p>
                    <h3 className="sf font-black text-white leading-tight mb-3" style={{fontSize:"clamp(1rem,2vw,1.4rem)"}}>
                      Built to survive the adversarial nature of the dark forest.
                    </h3>
                    <p className="sf text-slate-400 leading-relaxed" style={{fontSize:"clamp(11px,1.2vw,14px)",maxWidth:680}}>
                      Sentinel DAO is not a voting tool — it is <strong className="text-white">critical infrastructure</strong>.
                      Strict separation of Kernel (state) from Plugins (logic), non-custodial Account Abstraction,
                      and mathematical guarantees for minority exit protection. No implicit trust. No single point of failure.
                    </p>
                  </div>
                </div>
              </Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {icon:"🏛️",ac:"#F59E0B",title:"Zero Implicit Trust",    desc:"No contract holds implicit power. Even system admins cannot bypass the TimelockController. Every action is explicit and auditable.",fl:"fl1"},
                  {icon:"⏱️",ac:"#10B981",title:"Deterministic Execution",desc:"All state-changing proposals execute through a 48H Timelock. Flash Governance attacks are architecturally impossible.",fl:"fl2"},
                  {icon:"🔌",ac:"#3B82F6",title:"Governance as an OS",    desc:"Modules are fully pluggable. Voting Strategies, Yield Engines, and AA layers upgrade independently. The Kernel never needs migration.",fl:"fl3"},
                ].map((c,i)=>(
                  <motion.div key={i} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.06+i*0.08}}>
                    <TiltCard accent={c.ac} className="p-6 h-full">
                      <div className={`absolute top-3 right-3 opacity-20 ${c.fl}`}>{mounted&&<WireCube sz={28} color={c.ac}/>}</div>
                      <div className="text-3xl mb-4">{c.icon}</div>
                      <h4 className="sf font-black text-white mb-2" style={{fontSize:"clamp(13px,1.3vw,15px)"}}>{c.title}</h4>
                      <p className="sf text-slate-400 leading-relaxed" style={{fontSize:"clamp(11px,1.1vw,13px)"}}>{c.desc}</p>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab==="architecture"&&(
            <motion.div key="arch" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.22}}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
              {[
                {ac:"#F59E0B",icon:"🧠",domain:"KERNEL",      title:"The Kernel",          desc:"Immutable heart of the protocol. Central registry of all active modules. No external contract touches state without Kernel approval.",files:["DAOCore.sol // Registry","DAOTimelock.sol // Gatekeeper","HybridGovernorDynamic.sol"]},
                {ac:"#10B981",icon:"🏦",domain:"TREASURY",    title:"Autonomous Treasury", desc:"Active capital allocation. Pull-Payment Pattern prevents reentrancy. Aave yield strategies compound idle reserves automatically.",files:["DAOTreasury.sol // Vault","TreasuryYieldStrategy.sol // Aave","QuadraticFunding.sol // Grants"]},
                {ac:"#3B82F6",icon:"⚡",domain:"ABSTRACTION", title:"Account Abstraction", desc:"ERC-4337 native. Deterministic smart accounts via CREATE2. Protocol-funded Paymasters enable fully gasless voting.",files:["DAOAccountFactory.sol","DAOPayMaster.sol // Sponsor","SessionKeyModule.sol"]},
                {ac:"#EF4444",icon:"🛡️",domain:"DEFENSE",    title:"Sentinel Defense",    desc:"Active governance attack mitigation. Veto Council guardians, minority exit RageQuit, and anti-spam deposit requirements.",files:["VetoCouncil.sol // Guardians","RageQuit.sol // Minority Exit","ProposalGuard.sol // Anti-Spam"]},
              ].map((d,i)=>(
                <motion.div key={i} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
                  <TiltCard accent={d.ac} className="p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="sm font-semibold uppercase tracking-widest mb-1" style={{fontSize:"clamp(8px,0.85vw,9px)",color:d.ac}}>{d.domain}</p>
                        <h4 className="sf font-black text-white" style={{fontSize:"clamp(14px,1.5vw,18px)"}}>{d.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="opacity-22 fl2">{mounted&&<WireCube sz={28} color={d.ac}/>}</div>
                        <span className="text-xl opacity-50">{d.icon}</span>
                      </div>
                    </div>
                    <p className="sf text-slate-400 leading-relaxed mb-4" style={{fontSize:"clamp(11px,1.1vw,13px)"}}>{d.desc}</p>
                    <div className="space-y-1.5">
                      {d.files.map((f,j)=>(
                        <div key={j} className="flex items-center gap-2 px-3 py-2 sm"
                          style={{fontSize:"clamp(9px,0.9vw,10px)",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderLeft:`2px solid ${d.ac}`}}>
                          <span style={{color:d.ac}}>›</span>
                          <span className="text-slate-200">{f.split("//")[0].trim()}</span>
                          {f.includes("//")&&<span className="ml-auto text-slate-600">{"//" + f.split("//")[1]}</span>}
                        </div>
                      ))}
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab==="defense"&&(
            <motion.div key="def" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.22}}
              className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
              <div className="lg:col-span-3 space-y-3">
                <p className="sm uppercase tracking-[0.22em] mb-4" style={{fontSize:"clamp(8px,0.9vw,9px)",color:"#334155"}}>// THREAT MITIGATION MATRIX</p>
                {[
                  {threat:"Flash Governance Attack",fix:"TimelockController enforces mandatory 48H delay. No proposal executes instantly regardless of vote magnitude.",sev:"CRITICAL",c:"#F59E0B"},
                  {threat:"51% Governance Capture",  fix:"VetoCouncil multisig of trusted guardians can cancel any malicious proposal before the Timelock window closes.",sev:"CRITICAL",c:"#EF4444"},
                  {threat:"Minority Oppression",      fix:"RageQuit.sol lets dissenting members burn governance tokens to withdraw proportional treasury share before hostile execution.",sev:"HIGH",c:"#3B82F6"},
                  {threat:"Treasury Reentrancy",      fix:"Pull-Payment pattern in DAOTreasury. State updated before external calls. Strict CEI adherence at compiler level.",sev:"HIGH",c:"#10B981"},
                ].map((row,i)=>(
                  <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                    className="flex flex-col md:flex-row md:items-start gap-3 p-4 relative"
                    style={{background:`${row.c}07`,border:`1px solid ${row.c}18`,borderLeft:`3px solid ${row.c}`}}>
                    <div className="absolute top-3 right-3 opacity-15">{mounted&&<WireCube sz={20} color={row.c}/>}</div>
                    <div className="md:w-[36%] shrink-0">
                      <h5 className="sf font-black text-white mb-2" style={{fontSize:"clamp(12px,1.2vw,14px)"}}>{row.threat}</h5>
                      <span className="sm font-bold tracking-widest px-2 py-1"
                        style={{fontSize:"clamp(8px,0.85vw,9px)",color:row.c,background:`${row.c}14`,border:`1px solid ${row.c}32`,borderRadius:3}}>
                        {row.sev}
                      </span>
                    </div>
                    <p className="sf text-slate-300 leading-relaxed flex-1"
                      style={{fontSize:"clamp(11px,1.1vw,13px)",borderLeft:"1px solid rgba(255,255,255,0.06)",paddingLeft:12}}>{row.fix}</p>
                  </motion.div>
                ))}
              </div>
              <div className="lg:col-span-2">
                <TiltCard accent="#EF4444" className="h-full flex flex-col">
                  <div className="px-5 pt-5 pb-3" style={{borderBottom:"1px solid rgba(239,68,68,0.14)"}}>
                    <p className="sm uppercase tracking-widest mb-1" style={{fontSize:"clamp(8px,0.85vw,9px)",color:"#EF4444"}}>// SOLVENCY PROOF</p>
                    <h4 className="sf font-black text-white" style={{fontSize:"clamp(14px,1.5vw,18px)"}}>RageQuit Math</h4>
                    <p className="sf text-slate-400 mt-1" style={{fontSize:"clamp(10px,1.1vw,12px)"}}>Mathematical minority protection.</p>
                  </div>
                  <div className="p-5 flex-1 space-y-3 ss overflow-x-auto">
                    <TL t="// 1. Proportional Share"            c="#475569" d={0.1}/>
                    <TL t="uint256 share ="                     c="#e2e8f0" d={0.2} pre=" "/>
                    <TL t="  (burnAmt * 1e18) / totalSupply;"  c="#F59E0B" d={0.3} pre=" "/>
                    <TL t="// 2. Exit Amount"                   c="#475569" d={0.45}/>
                    <TL t="uint256 exit ="                      c="#e2e8f0" d={0.55} pre=" "/>
                    <TL t="  (treasury * share) / 1e18;"       c="#10B981" d={0.65} pre=" "/>
                    <TL t="// 3. Time Guard"                    c="#475569" d={0.8}/>
                    <TL t="require(block.timestamp"             c="#e2e8f0" d={0.9} pre=" "/>
                    <TL t="  < proposal.execAt);"             c="#EF4444" d={0.95} pre=" "/>
                    <TL t="// 4. Pull Payment"                  c="#475569" d={1.1}/>
                    <TL t="treasury.transfer(msg.sender, exit);" c="#3B82F6" d={1.2} pre=" "/>
                  </div>
                </TiltCard>
              </div>
            </motion.div>
          )}

          {tab==="engineering"&&(
            <motion.div key="eng" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.22}}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
              <TiltCard accent="#94a3b8" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="fl2 opacity-55">{mounted&&<WireCube sz={34} color="#94a3b8"/>}</div>
                  <div>
                    <p className="sm uppercase tracking-widest mb-0.5" style={{fontSize:"clamp(8px,0.85vw,9px)",color:"#475569"}}>// FRONTEND STACK</p>
                    <h4 className="sf font-black text-white" style={{fontSize:"clamp(14px,1.5vw,18px)"}}>Engineering Layer</h4>
                  </div>
                </div>
                <p className="sf text-slate-400 leading-relaxed mb-5" style={{fontSize:"clamp(11px,1.1vw,13px)"}}>
                  Built on <strong className="text-white">Next.js 14 App Router</strong> with modular provider pattern.
                  No backend — all state derived from on-chain reads via Wagmi + Viem.
                </p>
                <div className="space-y-px">
                  {[
                    {l:"Framework", v:"Next.js 14 · TypeScript · App Router"},
                    {l:"Web3 State",v:"Wagmi v2 + Viem + TanStack Query"},
                    {l:"Auth",      v:"RainbowKit · MetaMask · WalletConnect"},
                    {l:"Styling",   v:"Tailwind CSS + Framer Motion"},
                  ].map((row,i)=>(
                    <div key={i} className="flex items-center justify-between px-3 py-2.5"
                      style={{background:i%2===0?"rgba(255,255,255,0.025)":"rgba(255,255,255,0.015)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                      <span className="sm uppercase tracking-widest" style={{fontSize:"clamp(8px,0.85vw,9px)",color:"#475569"}}>{row.l}</span>
                      <span className="sf font-semibold text-white text-right" style={{fontSize:"clamp(10px,1.1vw,12px)"}}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </TiltCard>
              <Panel accent="#10B981" className="overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 px-4 py-3" style={{background:"#040709",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"/>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"/>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"/>
                  </div>
                  <span className="sm tracking-widest ml-3" style={{fontSize:"clamp(8px,0.85vw,9px)",color:"#334155"}}>
                    forge test --match-contract Sentinel -vvv
                  </span>
                </div>
                <div className="bg-[#030709] p-5 flex-1 space-y-2 ss overflow-y-auto" style={{maxHeight:320}}>
                  <TL t="$ forge test --match-contract Sentinel" c="#334155" d={0} pre=""/>
                  <TL t="Compiling 17 contracts..."              c="#94a3b8" d={0.3}/>
                  <TL t="Compiler run successful!"               c="#10B981" d={0.6}/>
                  <div className="h-px my-1" style={{background:"rgba(255,255,255,0.05)"}}/>
                  <TL t="Running 256 tests (Unit · Fuzz · Integration)" c="#e2e8f0" d={0.9}/>
                  <div className="h-1"/>
                  {[
                    {n:"test_DepositERC20_Atomic()",          tp:"UNIT",        d:1.1},
                    {n:"test_TimelockRespectsGovernorDelay()",tp:"INTEGRATION", d:1.2},
                    {n:"test_VetoCouncilCancelsMalicious()",  tp:"UNIT",        d:1.3},
                    {n:"test_RageQuitSolvencyAndExtraction()",tp:"INTEGRATION", d:1.4},
                    {n:"testFuzz_EndToEndSystemChaos(uint256)",tp:"FUZZ",       d:1.5},
                    {n:"testFuzz_VotingStrategiesMath(uint96)",tp:"FUZZ",       d:1.6},
                  ].map((tt,i)=>(
                    <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:tt.d}}
                      className="flex items-center gap-2 sm" style={{fontSize:"clamp(9px,0.9vw,10px)"}}>
                      <span style={{color:"#10B981"}} className="font-bold shrink-0">[PASS]</span>
                      <span className="text-slate-300 truncate">{tt.n}</span>
                      <span className="ml-auto shrink-0"
                        style={{fontSize:"clamp(8px,0.85vw,9px)",color:tt.tp==="FUZZ"?"#F59E0B":tt.tp==="INTEGRATION"?"#3B82F6":"#475569"}}>
                        {tt.tp}
                      </span>
                    </motion.div>
                  ))}
                  <div className="h-px my-1" style={{background:"rgba(255,255,255,0.05)"}}/>
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}}
                    className="sm font-bold" style={{fontSize:"clamp(10px,1.1vw,11px)",color:"#10B981"}}>
                    ✓ 256 passed · 0 failed · 3.84s
                  </motion.div>
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.2}}
                    className="sm" style={{fontSize:"clamp(8px,0.85vw,9px)",color:"#1e293b"}}>
                    Fuzz runs: 256/test · Foundry stable
                  </motion.div>
                </div>
              </Panel>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
