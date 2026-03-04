"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { educationData } from "@/data/education";
import { useState, useEffect } from "react";

// ─── THEME COLORS (Creamy Aurora) ──────────────────────────────────────────
const COLORS = {
  bg: "#FCFAF7",
  teal: "#2DD4BF",
  indigo: "#6366F1",
  coral: "#FB7185",
  slate: "#1E293B",
};

export default function DynamicEducationPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  // Slug compatibility fix: Ensuring slug matches the data
  const slug = params?.slug as string;
  const topic = educationData.find((t) => t.slug === slug);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!topic) {
    return (
      <div className="h-screen flex items-center justify-center font-black text-3xl italic bg-[#FCFAF7]">
        Topic Not Found // 404
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden pt-32 pb-40" style={{ backgroundColor: COLORS.bg, color: COLORS.slate }}>
      
      {/* 1. AURORA BACKGROUND BLOBS */}
      <AuroraBlobs />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* 2. NAVIGATION & BRANDING */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-between items-center mb-16"
        >
          <button 
            onClick={() => router.push("/education")}
            className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
          >
            <span className="group-hover:-translate-x-2 transition-transform">←</span> Hub
          </button>
          <div className="font-black italic text-lg tracking-tighter">
            AMIT <span className="text-slate-300">//</span> @NexTechArchitect
          </div>
        </motion.div>

        {/* 3. HERO ARTICLE HEADER */}
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                {topic.tag}
              </span>
              <span className="text-xs font-bold text-slate-400 italic">
                {topic.readTime} Deep Dive
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-500">
                {topic.title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-slate-500 leading-relaxed max-w-2xl">
              {topic.description}
            </p>
          </motion.div>
        </header>

        {/* 4. MAIN ARTICLE CONTENT */}
        <section className="space-y-24">
          {topic.content.map((section: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group"
            >
              <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                <span className="w-8 h-px bg-slate-200 group-hover:w-16 group-hover:bg-indigo-400 transition-all" />
                {section.heading}
              </h2>

              <p className="text-lg text-slate-600 leading-[1.8] font-medium mb-12">
                {section.text}
              </p>

              {/* INTERACTIVE IMAGE/DIAGRAM SECTION */}
              <div className="relative rounded-[40px] overflow-hidden bg-white border border-slate-200 p-8 shadow-2xl shadow-slate-200/50 hover:shadow-indigo-500/10 transition-all">
                <div className="absolute top-4 right-8 text-[10px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 group-hover:text-indigo-600 transition-all">
                  Technical Architecture
                </div>
                
                {/* Visual Placeholder for Diagrams */}
                <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
                  <div className="prose prose-slate mb-8">
                    <span className="text-slate-400 italic text-sm">{section.imageTag}</span>
                  </div>
                  
                  {/* CSS-Generated Animated Logic Gate Visual */}
                  <div className="w-full max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-8" />
                  <div className="flex gap-4 justify-center">
                    {[1, 2, 3].map((dot) => (
                      <motion.div 
                        key={dot}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: dot * 0.3 }}
                        className="w-3 h-3 rounded-full bg-indigo-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* 5. CODE SHOWCASE (Animated) */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-10 rounded-[48px] bg-slate-900 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-indigo-500 to-coral-400" />
          <div className="flex justify-between items-center mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Invariant // Solidity</span>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          
          <code className="block font-mono text-sm md:text-base leading-relaxed text-indigo-300">
            <span className="text-slate-500">// Check for protocol integrity</span> <br />
            function <span className="text-white font-bold">validateUserOp</span>(UserOperation calldata op) {'{'} <br />
            <span className="pl-4 text-emerald-400">uint256 validation = _verifySignature(op);</span> <br />
            <span className="pl-4 text-emerald-400">if (validation != 0) revert SignatureFailed();</span> <br />
            <span className="pl-4 text-indigo-400">_payGasFees(op.requiredPreFund);</span> <br />
            {'}'}
          </code>
        </motion.section>

        {/* 6. AESTHETIC FOOTER CTA */}
        <footer className="mt-40 text-center">
          <h3 className="text-4xl font-black italic tracking-tighter mb-8">Continue Exploration</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/education" className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20">
              Next Topic →
            </Link>
            <Link href="/" className="px-8 py-4 border-2 border-slate-200 font-black rounded-2xl hover:bg-slate-50 transition-all">
              Home Page
            </Link>
          </div>
        </footer>

      </div>

      <style jsx global>{`
        ::selection { background: #FB7185; color: white; }
        .prose [Image] { display: block; margin: 2rem auto; border-radius: 1rem; }
      `}</style>
    </main>
  );
}

// ─── BACKGROUND ANIMATION ──────────────────────────────────────────────────

function AuroraBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div 
        animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] bg-[#6366F1]/5" 
      />
      <motion.div 
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] bg-[#2DD4BF]/8" 
      />
      <motion.div 
        animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-[30%] left-[20%] w-[30vw] h-[30vw] rounded-full blur-[100px] bg-[#FB7185]/5" 
      />
    </div>
  );
}