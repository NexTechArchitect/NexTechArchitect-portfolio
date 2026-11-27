"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Mail,
  MessageSquare,
} from "lucide-react";
import { SectionRevealStage } from "@/components/SectionCurves";
import { useAgent } from "@/context/AgentContext";

interface StudioFooterProps {
  onOpenResume: () => void;
}

const CONTACT_EMAIL = "nextech.amit@gmail.com";

function MagneticWrap({
  children,
  strength = 0.18,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 320, damping: 22, mass: 0.45 });
  const y = useSpring(rawY, { stiffness: 320, damping: 22, mass: 0.45 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
      rawX.set(Math.max(-6, Math.min(6, dx)));
      rawY.set(Math.max(-5, Math.min(5, dy)));
    },
    [prefersReducedMotion, rawX, rawY, strength]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={prefersReducedMotion ? undefined : { x, y }}
      className={`inline-flex will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function StudioFooter({ onOpenResume }: StudioFooterProps) {
  const prefersReducedMotion = useReducedMotion();
  const { openAgent } = useAgent();
  const [copied, setCopied] = useState(false);

  const footerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const emberRiseY = useTransform(scrollYProgress, [0, 1], [36, -6]);
  const emberOpacity = useTransform(scrollYProgress, [0, 1], [0.24, 0.56]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleBarSpecular = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    },
    []
  );

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative -mt-[2px] bg-[#0A0604] text-[#FAF6F0] silk-grain-dark pt-6 sm:pt-10 pb-16 sm:pb-20 overflow-hidden scroll-mt-24"
    >
      {/* Scroll-linked rising sunrise ember illumination nestled smoothly inside Midnight Obsidian */}
      <motion.div
        aria-hidden="true"
        style={
          prefersReducedMotion
            ? undefined
            : { y: emberRiseY, opacity: emberOpacity }
        }
        className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 w-[880px] h-[260px] rounded-full will-change-transform"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 107, 26, 0.28) 0%, rgba(217, 119, 54, 0.12) 45%, rgba(10, 6, 4, 0) 74%)",
          }}
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 w-[780px] h-[340px] rounded-full opacity-40 ambient-silk-drift-reverse"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.26) 0%, rgba(200, 90, 23, 0.1) 42%, rgba(10, 6, 4, 0) 74%)",
        }}
      />

      {/* Cinema Video-Style Small-to-Large Zoom Expand Stage (completes cleanly at document end) */}
      <SectionRevealStage
        maxRadius={48}
        minRadius={0}
        scrollEndOffset="end 1"
        innerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end pb-10">
          <div className="lg:col-span-7">
            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0.25, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] text-[#FAF6F0]"
              style={{ textWrap: "balance" }}
            >
              Let&apos;s Architect Your{" "}
              <span className="text-[#FF5E0E]">Next Protocol.</span>
            </motion.h2>
            <motion.p
              data-testid="section-subtitle-footer"
              initial={prefersReducedMotion ? false : { opacity: 0.3, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{
                duration: 0.52,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 text-[17px] sm:text-[19px] leading-relaxed text-[#DDD2C7] max-w-2xl"
            >
              Available for remote Smart Contract Engineer roles, DeFi protocol
              architecture, Foundry invariant hardening, and full-stack EVM
              system engineering.
            </motion.p>
          </div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0.35, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{
              duration: 0.52,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-5 flex flex-col items-start lg:items-end gap-4"
          >
            {/* One-Click Copyable Email Pill with Magnetic Hover Physics */}
            <MagneticWrap strength={0.14} className="max-w-full">
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy email address nextech.amit@gmail.com"
                className="inline-flex items-center gap-2.5 max-w-full min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full bg-[#160F0B] hover:bg-[#1F150F] active:scale-[0.98] text-[#FAF6F0] text-xs sm:text-sm font-mono-tabular shadow-[inset_0_1px_0_rgba(250,246,240,0.12),0_12px_28px_-16px_rgba(0,0,0,0.8)] transition-[background-color,transform] duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
              >
                <span className="truncate">{CONTACT_EMAIL}</span>
                <span aria-hidden="true" className="text-[#FAF6F0]/25">
                  ·
                </span>
                <span className="inline-flex items-center gap-1 shrink-0 text-xs font-sans font-semibold text-[#FF6B1A]">
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
            </MagneticWrap>

            {/* Primary Contact Actions with Refined Magnetic Hover Physics */}
            <div className="flex flex-wrap items-center gap-2.5">
              <MagneticWrap>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-[#E85D04] hover:bg-[#D14F00] active:scale-[0.98] text-[#FAF6F0] text-xs sm:text-sm font-semibold transition-[background-color,transform,box-shadow] duration-150 whitespace-nowrap shadow-[0_14px_32px_-14px_rgba(232,93,4,0.65)] hover:shadow-[0_18px_38px_-12px_rgba(255,107,26,0.82)]"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Send Email</span>
                </a>
              </MagneticWrap>

              <MagneticWrap>
                <button
                  type="button"
                  onClick={onOpenResume}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-3 rounded-full bg-[#FAF6F0] hover:bg-[#F5EFE6] active:scale-[0.98] text-[#16100C] text-xs sm:text-sm font-semibold transition-[background-color,transform] duration-150 whitespace-nowrap cursor-pointer"
                >
                  <FileText
                    className="w-3.5 h-3.5 text-[#E85D04]"
                    aria-hidden="true"
                  />
                  <span>Resume</span>
                </button>
              </MagneticWrap>

              <MagneticWrap>
                <button
                  type="button"
                  onClick={openAgent}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-3 rounded-full bg-[#1C130E] hover:bg-[#281B14] active:scale-[0.98] text-[#FAF6F0] text-xs sm:text-sm font-semibold shadow-[inset_0_1px_0_rgba(250,246,240,0.12)] transition-[background-color,transform] duration-150 whitespace-nowrap cursor-pointer"
                >
                  <MessageSquare
                    className="w-3.5 h-3.5 text-[#FF6B1A]"
                    aria-hidden="true"
                  />
                  <span>Ask Amit</span>
                </button>
              </MagneticWrap>
            </div>
          </motion.div>
        </div>

        {/* Tightened Bottom Tonal Identity & Verified Links Bar */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0.4, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.48, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={handleBarSpecular}
          className="specular-surface-dark overflow-hidden rounded-[32px] bg-[#140D09]/92 transition-shadow duration-250 shadow-[inset_0_1px_0_rgba(250,246,240,0.09),0_24px_56px_-28px_rgba(0,0,0,0.85)] hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.22),0_26px_62px_-26px_rgba(232,93,4,0.25)] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-xs font-medium text-[#A69688]"
        >
          <div className="relative z-10 flex flex-wrap items-center gap-x-3 gap-y-1">
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

          <div className="relative z-10 flex flex-wrap items-center gap-5">
            <a
              href="https://github.com/NexTechArchitect"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#FF6B1A] transition-colors"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/amit-kumar-811a11277"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#FF6B1A] transition-colors"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href="https://x.com/itZ_AmiT0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#FF6B1A] transition-colors"
            >
              <span>X (Twitter)</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </SectionRevealStage>
    </footer>
  );
}
