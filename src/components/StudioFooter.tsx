"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useAgent } from "@/context/AgentContext";

interface StudioFooterProps {
  onOpenResume: () => void;
}

const CONTACT_EMAIL = "nextech.amit@gmail.com";

export default function StudioFooter({ onOpenResume }: StudioFooterProps) {
  const { openAgent } = useAgent();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <footer
      id="contact"
      className="relative -mt-[2px] bg-[#0A0604] text-[#FAF6F0] silk-grain-dark pt-12 sm:pt-18 pb-14 overflow-hidden scroll-mt-20"
    >
      {/* Warm burnt-orange & copper atmospheric illumination nestled smoothly inside obsidian canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-[820px] h-[240px] rounded-full opacity-45"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.2) 0%, rgba(200, 90, 23, 0.08) 45%, rgba(10, 6, 4, 0) 74%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 w-[780px] h-[340px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.26) 0%, rgba(200, 90, 23, 0.1) 42%, rgba(10, 6, 4, 0) 74%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end pb-12">
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold text-[#FAF6F0] text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.02] tracking-[-0.035em]"
              style={{ textWrap: "balance" }}
            >
              Let&apos;s Architect Your Next{" "}
              <span className="text-[#E85D04]">Protocol.</span>
            </motion.h2>
            <motion.p
              data-testid="section-subtitle-footer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 max-w-2xl text-left text-[16px] sm:text-[17.5px] leading-[1.65] font-normal text-[#D9CEC2]"
            >
              Available for remote Smart Contract Engineer roles, DeFi protocol
              architecture, Foundry invariant hardening, and full-stack EVM
              system engineering.
            </motion.p>
          </div>

          <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-4">
            {/* One-Click Copyable Email Pill (Zero Straight Divider Line) */}
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy email address nextech.amit@gmail.com"
              className="inline-flex items-center gap-2.5 max-w-full min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full bg-[#160F0B] border border-[#FAF6F0]/16 hover:border-[#E85D04] text-[#FAF6F0] text-xs sm:text-sm font-mono-tabular transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
            >
              <span className="truncate">{CONTACT_EMAIL}</span>
              <span aria-hidden="true" className="text-[#FAF6F0]/25">
                ·
              </span>
              <span className="inline-flex items-center gap-1 shrink-0 text-xs font-sans font-semibold text-[#E85D04]">
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </span>
            </button>

            {/* Primary Contact Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-[#E85D04] hover:bg-[#D14F00] text-[#FAF6F0] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shadow-[0_14px_32px_-14px_rgba(232,93,4,0.65)]"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Send Email</span>
              </a>

              <button
                type="button"
                onClick={onOpenResume}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-3 rounded-full bg-[#FAF6F0] hover:bg-[#F5EFE6] text-[#140E0B] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                <FileText
                  className="w-3.5 h-3.5 text-[#E85D04]"
                  aria-hidden="true"
                />
                <span>Resume</span>
              </button>

              <button
                type="button"
                onClick={openAgent}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-3 rounded-full bg-[#160F0B] border border-[#FAF6F0]/16 hover:border-[#E85D04] text-[#FAF6F0] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                <MessageSquare
                  className="w-3.5 h-3.5 text-[#E85D04]"
                  aria-hidden="true"
                />
                <span>Ask Amit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Tonal Identity & Verified Links Bar (Zero Straight Divider Line) */}
        <div className="rounded-3xl bg-[#130C08]/85 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium text-[#B8A89B]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-display font-bold text-[#FAF6F0] text-sm tracking-[-0.02em]">
              NexTechArchitect
            </span>
            <span aria-hidden="true" className="text-[#FAF6F0]/25">
              ·
            </span>
            <span>
              Amit Kumar · Smart Contract Engineer &amp; DeFi Protocol Architect
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://github.com/NexTechArchitect"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/amit-kumar-811a11277"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href="https://x.com/itZ_AmiT0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors"
            >
              <span>X (Twitter)</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
