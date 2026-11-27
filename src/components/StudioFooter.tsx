"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
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
import {
  REPLAY_VIEWPORT,
  SLOMO_EASE,
  SectionRevealStage,
  getSloMoSpringConfig,
  useIsMobile,
} from "@/components/SectionCurves";
import { useAgent } from "@/context/AgentContext";

interface StudioFooterProps {
  onOpenResume: () => void;
}

const CONTACT_EMAIL = "nextech.amit@gmail.com";

export default function StudioFooter({ onOpenResume }: StudioFooterProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { openAgent } = useAgent();
  const [copied, setCopied] = useState(false);

  const footerRef = useRef<HTMLElement | null>(null);
  // Weighted slo-mo spring-smoothed Solar Horizon ember swell (strict GPU-only transforms)
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const smoothFooterProgress = useSpring(
    scrollYProgress,
    getSloMoSpringConfig(isMobile)
  );
  const emberRiseY = useTransform(smoothFooterProgress, [0, 1], [34, 0]);
  const emberScale = useTransform(smoothFooterProgress, [0, 1], [0.92, 1.06]);
  const emberOpacity = useTransform(smoothFooterProgress, [0, 1], [0.3, 0.76]);

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
      className="relative -mt-[2px] bg-[#0A0604] text-[#FAF6F0] silk-grain-dark pt-6 sm:pt-10 pb-16 sm:pb-20 overflow-y-hidden scroll-mt-24 section-perf"
    >
      {/* Weighted Slo-Mo Spring-Smoothed Solar Horizon Ember Swell */}
      <motion.div
        aria-hidden="true"
        style={
          prefersReducedMotion
            ? undefined
            : { y: emberRiseY, scale: emberScale, opacity: emberOpacity }
        }
        className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 w-[820px] h-[240px] rounded-full gpu-layer"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 107, 26, 0.34) 0%, rgba(217, 119, 54, 0.14) 45%, rgba(10, 6, 4, 0) 74%)",
          }}
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 w-[720px] h-[300px] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.24) 0%, rgba(200, 90, 23, 0.09) 42%, rgba(10, 6, 4, 0) 74%)",
        }}
      />

      <SectionRevealStage
        variant="horizon-rise"
        outerClassName="relative z-10"
        innerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end pb-10">
          {/* Headline & Bio Glide from Left (-64 -> 0) */}
          <motion.div
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, x: isMobile ? -26 : -64 }
            }
            whileInView={{ opacity: 1, x: 0 }}
            viewport={REPLAY_VIEWPORT}
            transition={{ duration: 0.95, ease: SLOMO_EASE }}
            className="lg:col-span-7 gpu-layer"
          >
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] text-[#FAF6F0]"
              style={{ textWrap: "balance" }}
            >
              Let&apos;s Architect Your{" "}
              <span className="text-[#FF5E0E]">Next Protocol.</span>
            </h2>
            <p
              data-testid="section-subtitle-footer"
              className="mt-4 text-[17px] sm:text-[19px] leading-relaxed text-[#DDD2C7] max-w-2xl"
            >
              Available for remote Smart Contract Engineer roles, DeFi protocol
              architecture, Foundry invariant hardening, and full-stack EVM
              system engineering.
            </p>
          </motion.div>

          {/* Right Email Copy Pill & Primary CTA Buttons Glide from Right (+64 -> 0) */}
          <motion.div
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, x: isMobile ? 26 : 64 }
            }
            whileInView={{ opacity: 1, x: 0 }}
            viewport={REPLAY_VIEWPORT}
            transition={{ duration: 0.95, delay: 0.07, ease: SLOMO_EASE }}
            className="lg:col-span-5 flex flex-col items-start lg:items-end gap-4 gpu-layer"
          >
            {/* One-Click Copyable Email Pill with Spring Pop Copied Micro-Feedback */}
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy email address nextech.amit@gmail.com"
              className="btn-spring inline-flex items-center gap-2.5 max-w-full min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full bg-[#160F0B] hover:bg-[#1F150F] text-[#FAF6F0] text-xs sm:text-sm font-mono-tabular shadow-[inset_0_1px_0_rgba(250,246,240,0.12),0_12px_28px_-16px_rgba(0,0,0,0.8)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
            >
              <span className="truncate">{CONTACT_EMAIL}</span>
              <span aria-hidden="true" className="text-[#FAF6F0]/25">
                ·
              </span>
              <span className="inline-flex items-center gap-1 shrink-0 min-w-[66px] justify-center text-xs font-sans font-semibold text-[#FF6B1A]">
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.72, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 22,
                      }}
                      className="inline-flex items-center gap-1 text-[#FF8A3D]"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copied!</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.16 }}
                      className="inline-flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>

            {/* Primary Contact Actions with Snappy Spring Hover & Specular Sheen */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group btn-spring btn-cta-sheen inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-[#E85D04] hover:bg-[#D14F00] text-[#FAF6F0] text-xs sm:text-sm font-semibold whitespace-nowrap shadow-[0_14px_32px_-14px_rgba(232,93,4,0.65)] hover:shadow-[0_18px_38px_-12px_rgba(255,107,26,0.88)]"
              >
                <Mail
                  className="relative z-10 w-4 h-4 transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="relative z-10">Send Email</span>
              </a>

              <button
                type="button"
                onClick={onOpenResume}
                className="btn-spring inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-3 rounded-full bg-[#FAF6F0] hover:bg-[#F5EFE6] text-[#16100C] text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer"
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
                className="btn-spring inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-3 rounded-full bg-[#1C130E] hover:bg-[#281B14] text-[#FAF6F0] text-xs sm:text-sm font-semibold shadow-[inset_0_1px_0_rgba(250,246,240,0.12)] whitespace-nowrap cursor-pointer"
              >
                <MessageSquare
                  className="w-3.5 h-3.5 text-[#FF6B1A]"
                  aria-hidden="true"
                />
                <span>Ask Amit</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Brand Bar Rises Smoothly from Bottom (+34 -> 0) */}
        <motion.div
          initial={
            prefersReducedMotion
              ? false
              : { opacity: 0, y: isMobile ? 16 : 34 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REPLAY_VIEWPORT}
          transition={{ duration: 0.95, delay: 0.12, ease: SLOMO_EASE }}
          onMouseMove={handleBarSpecular}
          className="specular-surface-dark overflow-hidden rounded-[32px] bg-[#140D09]/92 transition-shadow duration-250 shadow-[inset_0_1px_0_rgba(250,246,240,0.09),0_24px_56px_-28px_rgba(0,0,0,0.85)] hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.22),0_26px_62px_-26px_rgba(232,93,4,0.25)] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-xs font-medium text-[#A69688] gpu-layer"
        >
          <div className="relative z-10 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-display font-bold text-[#FAF6F0] text-sm tracking-[-0.02em]">
              NexTechArchitect
            </span>
            <span aria-hidden="true" className="text-[#FAF6F0]/25">
              ·
            </span>
            <span>
              Amit Kumar · Smart Contract Engineer &amp; DeFi Protocol
              Architect
            </span>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-5">
            <a
              href="https://github.com/NexTechArchitect"
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1 hover:text-[#FF6B1A] transition-colors"
            >
              <span>GitHub</span>
              <ArrowUpRight
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/amit-kumar-811a11277"
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1 hover:text-[#FF6B1A] transition-colors"
            >
              <span>LinkedIn</span>
              <ArrowUpRight
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="https://x.com/itZ_AmiT0"
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1 hover:text-[#FF6B1A] transition-colors"
            >
              <span>X (Twitter)</span>
              <ArrowUpRight
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </motion.div>
      </SectionRevealStage>
    </footer>
  );
}
