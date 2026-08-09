"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

const displayFont = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"] });
const monoFont = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"] });

export default function ContactFooter() {
  return (
    <footer className="relative bg-white border-t border-slate-200 overflow-hidden pt-32 pb-10">
      
      {/* ── AESTHETIC BACKGROUND BLURS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,82,255,0.05) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12">
        
        {/* ── MASSIVE CLOSING STATEMENT ── */}
        <div className="flex flex-col items-center text-center mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 ${monoFont.className}`}
          >
            What's Next?
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className={`text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8 ${displayFont.className}`}
          >
            Building the next <br className="hidden sm:block" />
            generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">DeFi?</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          >
            <Link 
              href="mailto:nextech.amit@gmail.com"
              className={`inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-slate-900 hover:bg-blue-600 text-white rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1 ${monoFont.className}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              nextech.amit@gmail.com
            </Link>
          </motion.div>
        </div>

        {/* ── MINIMAL BOTTOM BAR ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200"
        >
          {/* Copyright */}
          <p className={`text-[10px] sm:text-xs text-slate-400 font-bold tracking-widest uppercase ${monoFont.className}`}>
            © {new Date().getFullYear()} Amit · Smart Contract Engineer
          </p>

          {/* Clean Social Links */}
          <div className={`flex items-center gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 ${monoFont.className}`}>
            <Link href="https://github.com/NexTechArchitect" target="_blank" className="hover:text-slate-900 transition-colors">
              GitHub
            </Link>
            <Link href="https://x.com/itZ_AmiT0" target="_blank" className="hover:text-blue-500 transition-colors">
              Twitter / X
            </Link>
            <Link href="https://t.me/NexTechDev" target="_blank" className="hover:text-cyan-500 transition-colors">
              Telegram
            </Link>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}