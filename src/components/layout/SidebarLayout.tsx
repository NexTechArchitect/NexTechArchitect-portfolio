"use client";

import React from "react";
import { motion } from "framer-motion";
import CreamyBackground from "../ui/CreamyBackground";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-[#1E293B] font-sans selection:bg-amber-200 selection:text-slate-900">
      <CreamyBackground />

      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto min-h-screen">
        
        {/* ================= LEFT SIDEBAR (FIXED) ================= */}
        <aside className="lg:w-[380px] lg:fixed lg:h-screen p-8 lg:p-12 flex flex-col justify-between border-r border-amber-900/5 backdrop-blur-sm">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Logo / Monogram */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-slate-900 font-black text-xl mb-6 shadow-lg shadow-amber-200/50">
                A
              </div>
              
              <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">
                Protocol Architect
              </h1>
              <p className="text-slate-600 font-medium leading-relaxed">
                Building secure, gas-optimized systems that survive the dark forest.
              </p>
            </motion.div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-4 mt-12">
              {['Projects', 'Education Hub', 'Smart Contracts', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="group flex items-center gap-4 text-slate-500 hover:text-slate-900 font-semibold transition-colors"
                >
                  <span className="w-8 h-[2px] bg-slate-200 group-hover:bg-amber-400 group-hover:w-12 transition-all duration-300" />
                  {item}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Social Links at bottom of sidebar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 mt-12 lg:mt-0"
          >
            <a href="https://github.com/NexTechArchitect" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-amber-600 transition-colors font-bold text-sm">
              GitHub ↗
            </a>
            <a href="#" className="text-slate-500 hover:text-amber-600 transition-colors font-bold text-sm">
              Twitter ↗
            </a>
          </motion.div>
        </aside>

        {/* ================= RIGHT MAIN CONTENT (SCROLLABLE) ================= */}
        {/* On large screens, we offset the main content by the width of the sidebar (380px) */}
        <main className="flex-1 lg:ml-[380px] p-8 lg:p-16 lg:py-24 relative z-10">
          {children}
        </main>

      </div>
    </div>
  );
}