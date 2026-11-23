"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Github,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import ShaderCanvas from "@/components/ui/ShaderCanvas";

interface ContactFooterProps {
  onOpenResume: () => void;
}

const EMAIL = "nextech.amit@gmail.com";

export default function ContactFooter({ onOpenResume }: ContactFooterProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(EMAIL);
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer
      id="contact"
      className="relative bg-[#F8FAFC] border-t border-slate-200/80 overflow-hidden pt-24 sm:pt-32 pb-12 scroll-mt-20"
    >
      {/* Cohesive WebGL2 GLSL Optical Shader */}
      <ShaderCanvas variant="footer" className="opacity-90" />

      <div
        aria-hidden="true"
        className="absolute inset-0 architectural-grid pointer-events-none z-[1]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Main Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl glass-surface-strong shadow-[0_24px_60px_rgba(15,23,42,0.08)] p-8 sm:p-12 lg:p-16 mb-14"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-mono-tabular font-semibold text-[#0052FF] mb-4">
              04. Protocol Engineering & Audits
            </p>
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0B1220] leading-[1.04] mb-5 text-balance">
              Architect Your Next{" "}
              <span className="text-optical-gradient">On-Chain Protocol.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-9 max-w-2xl">
              Available for senior smart contract architecture, DeFi protocol
              development, Foundry invariant test suites, and full-stack Web3
              launches.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0B1220] hover:bg-[#0052FF] text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Start a Conversation</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#0052FF]/40 text-sm font-mono-tabular text-slate-700 hover:text-[#0052FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>Copied {EMAIL}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    <span>{EMAIL}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenResume}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/80 border border-slate-200 hover:border-slate-300 text-sm font-semibold text-slate-700 hover:text-[#0B1220] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>View Resume</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quiet Footer Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 text-xs font-mono-tabular text-slate-500">
          <p>
            © {new Date().getFullYear()} Amit Kumar · NexTechArchitect
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://github.com/NexTechArchitect"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#0B1220] transition-colors"
            >
              <Github className="w-3.5 h-3.5" aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/amit-kumar-811a11277"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#0052FF] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://x.com/itZ_AmiT0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#0B1220] transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" aria-hidden="true" />
              <span>X / Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}