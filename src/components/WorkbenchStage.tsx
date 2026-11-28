"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, FileCode2, MessageSquare } from "lucide-react";
import { ARCHITECTURE_INSIGHTS } from "@/data/projects";
import {
  CINEMA_EASE,
  SheetSilkCrest,
  SolarHorizonArch,
  WORKBENCH_VIEWPORT,
  createCinemaVariants,
  createOrchestratorVariants,
  useIsMobile,
} from "@/components/SectionCurves";
import { useAgent } from "@/context/AgentContext";

const SOLIDITY_KEYWORDS = new Set([
  "pragma",
  "solidity",
  "error",
  "abstract",
  "contract",
  "library",
  "function",
  "internal",
  "external",
  "public",
  "private",
  "view",
  "pure",
  "virtual",
  "returns",
  "return",
  "if",
  "revert",
  "storage",
  "mapping",
  "struct",
  "assembly",
  "delete",
  "constant",
  "sstore",
]);

const SOLIDITY_TYPES = new Set([
  "address",
  "uint256",
  "uint64",
  "uint16",
  "bool",
  "bytes32",
]);

function highlightSolidityLine(line: string): React.ReactNode {
  const commentIndex = line.indexOf("//");
  const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : "";

  const parts = codePart.split(
    /(\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:_\d+)*\b)/g
  );

  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;
        if (SOLIDITY_KEYWORDS.has(part)) {
          return (
            <span key={idx} className="text-[#F48C06] font-medium">
              {part}
            </span>
          );
        }
        if (SOLIDITY_TYPES.has(part)) {
          return (
            <span key={idx} className="text-[#E6BE94]">
              {part}
            </span>
          );
        }
        if (/^\d+(?:_\d+)*$/.test(part)) {
          return (
            <span key={idx} className="text-[#E85D04]">
              {part}
            </span>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
      {commentPart && (
        <span className="text-[#8E7C70] italic">{commentPart}</span>
      )}
    </>
  );
}

interface WorkbenchStageProps {
  selectedTabId?: string;
  onSelectTabId?: (id: string) => void;
}

export default function WorkbenchStage({
  selectedTabId,
  onSelectTabId,
}: WorkbenchStageProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { openAgent, sendMessage } = useAgent();
  const [internalId, setInternalId] = useState<string>(
    ARCHITECTURE_INSIGHTS[0].id
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Instant-trigger (amount: 0.08) stationary orchestrator + sequential Cinema Expo-Out slo-mo beats
  const sectionOrchestrator = useMemo(
    () => createOrchestratorVariants(0, 0),
    []
  );
  const headlineVariants = useMemo(
    () =>
      createCinemaVariants({
        x: -56,
        duration: 1.25,
        delay: 0,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );
  const subtitleVariants = useMemo(
    () =>
      createCinemaVariants({
        y: 26,
        duration: 1.2,
        delay: 0.14,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );
  const tabsOrchestrator = useMemo(
    () => createOrchestratorVariants(0.1, 0.18),
    []
  );
  const tabItemVariants = useMemo(
    () =>
      createCinemaVariants({
        x: -44,
        duration: 1.15,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );
  const leftShutterVariants = useMemo(
    () =>
      createCinemaVariants({
        x: -52,
        duration: 1.3,
        delay: 0.2,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );
  const rightStudioVariants = useMemo(
    () =>
      createCinemaVariants({
        x: 68,
        scale: 0.96,
        duration: 1.35,
        delay: 0.22,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );

  const handleStudioSpecular = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    },
    []
  );

  const selectedId = selectedTabId ?? internalId;

  const activeIndex = useMemo(() => {
    const idx = ARCHITECTURE_INSIGHTS.findIndex(
      (item) => item.id === selectedId
    );
    return idx >= 0 ? idx : 0;
  }, [selectedId]);

  const activeInsight = ARCHITECTURE_INSIGHTS[activeIndex];

  const handleSelectTab = (nextId: string) => {
    if (onSelectTabId) {
      onSelectTabId(nextId);
    } else {
      setInternalId(nextId);
    }
  };

  const codeLines = useMemo(
    () => activeInsight.code.split("\n"),
    [activeInsight.code]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeInsight.code);
      setCopiedId(activeInsight.id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === activeInsight.id ? null : prev));
      }, 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleAskCode = () => {
    openAgent();
    sendMessage(
      `Walk me through ${activeInsight.filename} from ${activeInsight.protocol} line by line and explain the security and gas tradeoffs.`
    );
  };

  return (
    /* Section 5: Solidity Workbench — Instant Trigger (amount: 0.08), Slo-Mo Cinema Finish */
    <div
      id="workbench"
      className="relative bg-[#1B120D] -mt-[2px] scroll-mt-24 section-perf"
    >
      <SheetSilkCrest idPrefix="archive-to-workbench" />
      <section
        aria-label="Solidity Workbench"
        className="relative z-10 rounded-t-[36px] sm:rounded-t-[48px] bg-[#F3EAE0] text-[#16100C] silk-grain pt-14 sm:pt-20 overflow-hidden shadow-[0_-24px_60px_-26px_rgba(10,6,4,0.5)] section-perf"
      >
        {/* Lightweight static warm-amber washes over Soft Champagne Sand canvas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-6%] w-[480px] h-[480px] rounded-full opacity-55"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(244, 140, 6, 0.13) 0%, rgba(232, 93, 4, 0.05) 44%, rgba(243, 234, 224, 0) 74%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-32 left-[-8%] w-[440px] h-[460px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(217, 119, 54, 0.09) 0%, rgba(243, 234, 224, 0) 72%)",
          }}
        />

        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={WORKBENCH_VIEWPORT}
          variants={sectionOrchestrator}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
        >
          {/* Beat 1 (0.00s): Headline from Left (-56 -> 0), Beat 2 (+0.14s): Subtitle rises */}
          <div className="max-w-3xl">
            <motion.h2
              variants={headlineVariants}
              className="font-display font-bold text-[#16100C] text-3xl sm:text-4xl lg:text-[3rem] leading-[1.08] tracking-[-0.032em]"
              style={{ textWrap: "balance" }}
            >
              Production Contract{" "}
              <span className="text-[#E85D04]">Primitives.</span>
            </motion.h2>

            <motion.p
              variants={subtitleVariants}
              data-testid="section-subtitle-workbench"
              className="mt-4 max-w-2xl text-left text-[16px] sm:text-[17.5px] leading-[1.65] font-normal text-[#4A3F37]"
            >
              Inspect real Solidity and inline Yul guards extracted from
              deployed DeFi, RWA, keeper, and governance systems.
            </motion.p>
          </div>

          {/* Beat 3: Solidity/Yul File Tabs Cascade One-by-One from Left (-44 -> 0, stagger 0.1s) */}
          <div className="mt-9 relative z-30">
            <motion.div
              role="tablist"
              aria-label="Solidity and Yul contract primitives"
              variants={tabsOrchestrator}
              className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar-hide p-1.5 rounded-full bg-[#E7DCCE]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_12px_30px_-20px_rgba(20,14,11,0.2)] w-full lg:w-fit"
            >
              {ARCHITECTURE_INSIGHTS.map((insight) => {
                const isSelected = insight.id === activeInsight.id;
                return (
                  <motion.button
                    key={insight.id}
                    type="button"
                    role="tab"
                    data-testid={`workbench-tab-${insight.id}`}
                    aria-selected={isSelected}
                    onClick={() => handleSelectTab(insight.id)}
                    variants={tabItemVariants}
                    className={`relative z-30 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full font-mono-tabular text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
                      isSelected
                        ? "text-[#FAF6F0]"
                        : "text-[#4A3F37] hover:text-[#16100C]"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="workbench-active-tab"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                        className="absolute inset-0 rounded-full bg-[#E85D04] shadow-[0_10px_24px_-10px_rgba(232,93,4,0.75)]"
                        aria-hidden="true"
                      />
                    )}
                    <FileCode2
                      className={`relative z-10 w-3.5 h-3.5 ${
                        isSelected ? "text-[#FAF6F0]" : "text-[#E85D04]"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="relative z-10">{insight.filename}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Beat 4: Left Breakdown (-52 -> 0) & Right Dark Espresso Code Studio (+68 -> 0, scale 0.96 -> 1) */}
          <div className="mt-9 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Shutter (5 cols): Editorial Breakdown Glides from Left */}
            <motion.div
              variants={leftShutterVariants}
              className="lg:col-span-5 flex flex-col justify-between pt-1"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`meta-${activeInsight.id}`}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 16 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -10 }
                  }
                  transition={{ duration: 0.55, ease: CINEMA_EASE }}
                >
                  <p className="font-mono-tabular text-xs font-semibold text-[#C84B04]">
                    {activeInsight.protocol}
                    <span
                      aria-hidden="true"
                      className="mx-2 text-[#16100C]/25"
                    >
                      ·
                    </span>
                    <span className="text-[#6E5F54]">
                      {activeInsight.domain}
                    </span>
                  </p>

                  <h3 className="mt-3 font-display text-2xl sm:text-[1.85rem] font-bold text-[#16100C] tracking-[-0.028em] leading-[1.16]">
                    {activeInsight.title}
                  </h3>

                  <p className="mt-4 text-[15px] leading-[1.72] text-[#4A3F37]">
                    {activeInsight.body}
                  </p>

                  {/* Two Tonal Editorial Callout Cards */}
                  <div className="mt-7 space-y-3.5">
                    <div className="rounded-[28px] bg-[#EAE0D3]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_14px_34px_-26px_rgba(20,14,11,0.22)] px-6 py-5 transition-transform duration-200 hover:-translate-y-0.5">
                      <p className="font-mono-tabular text-[11px] uppercase tracking-[0.12em] font-semibold text-[#6E5F54]">
                        Engineering Tradeoff
                      </p>
                      <p className="mt-1.5 text-sm leading-[1.68] text-[#4A3F37]">
                        {activeInsight.tradeoff}
                      </p>
                    </div>

                    <div className="rounded-[28px] bg-[#EFE5D8] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_16px_38px_-26px_rgba(232,93,4,0.22)] px-6 py-5 transition-transform duration-200 hover:-translate-y-0.5">
                      <p className="font-mono-tabular text-[11px] uppercase tracking-[0.12em] font-semibold text-[#C84B04]">
                        Verified Outcome
                      </p>
                      <p className="mt-1.5 text-sm leading-[1.68] font-medium text-[#16100C]">
                        {activeInsight.outcome}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Right Shutter (7 cols): Dark Espresso Code Studio Glides Slo-Mo from Right (+68 -> 0, scale 0.96 -> 1) */}
            <motion.div
              variants={rightStudioVariants}
              data-testid="workbench-code-panel"
              onMouseMove={handleStudioSpecular}
              className="specular-surface-dark relative lg:col-span-7 rounded-[34px] bg-[#130D0A] text-[#FAF6F0] transition-shadow duration-250 flex flex-col overflow-hidden shadow-[inset_0_1px_0_rgba(250,246,240,0.1),0_30px_68px_-28px_rgba(20,14,11,0.6)] hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.24),0_34px_74px_-26px_rgba(232,93,4,0.28)]"
            >
              {/* Soft Ambient Studio Top Radial Wash */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[78%] h-[110px] z-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.24) 0%, rgba(244, 162, 97, 0.08) 48%, rgba(19, 13, 10, 0) 76%)",
                }}
              />

              {/* Tonal Window Header */}
              <div className="relative z-10 px-5 sm:px-6 py-4 bg-[#1C130E] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    aria-hidden="true"
                    className="flex items-center gap-1.5 shrink-0"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E85D04]/75" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D96B27]/45" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FAF6F0]/22" />
                  </div>
                  <div className="min-w-0">
                    <p
                      data-testid="workbench-active-filename"
                      className="font-mono-tabular text-xs font-semibold text-[#FAF6F0] truncate"
                    >
                      {activeInsight.filename}
                    </p>
                    <p className="text-[11px] text-[#A69688] truncate">
                      {activeInsight.language}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAskCode}
                    className="btn-spring inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full bg-[#271C15] hover:bg-[#33241B] text-xs font-semibold text-[#FAF6F0] cursor-pointer whitespace-nowrap"
                  >
                    <MessageSquare
                      className="w-3.5 h-3.5 text-[#FF6B1A]"
                      aria-hidden="true"
                    />
                    <span>Explain Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={`Copy ${activeInsight.filename}`}
                    className="btn-spring btn-cta-sheen inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[96px] px-4 py-2 rounded-full bg-[#E85D04] hover:bg-[#D14F00] text-xs font-semibold text-[#FAF6F0] cursor-pointer whitespace-nowrap"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copiedId === activeInsight.id ? (
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
                          className="relative z-10 inline-flex items-center gap-1.5"
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
                          className="relative z-10 inline-flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* Numbered Syntax-Highlighted Solidity / Yul Code with Silky Upward Fade-Glide (y: 16 -> 0, 0.55s) */}
              <div className="px-4 sm:px-6 py-5 overflow-x-auto bg-[#130D0A]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.pre
                    key={`code-${activeInsight.id}`}
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: 16 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion ? undefined : { opacity: 0, y: -10 }
                    }
                    transition={{ duration: 0.55, ease: CINEMA_EASE }}
                    className="font-mono-tabular text-[12px] sm:text-[12.5px] leading-[1.74] text-[#EFE6DC]"
                  >
                    <code>
                      {codeLines.map((line, index) => (
                        <div
                          key={`${activeInsight.id}-${index}`}
                          className="flex"
                        >
                          <span
                            aria-hidden="true"
                            className="select-none w-8 pr-3 text-right text-[#8E7E72] shrink-0"
                          >
                            {index + 1}
                          </span>
                          <span className="whitespace-pre">
                            {highlightSolidityLine(line)}
                          </span>
                        </div>
                      ))}
                    </code>
                  </motion.pre>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Transition #5: Pure Filled Luminous Burnt-Orange Solar Horizon Arch (#F3EAE0 -> #0A0604) */}
        <SolarHorizonArch
          idPrefix="workbench-to-footer"
          bottomFill="#0A0604"
          className="mt-14 sm:mt-16"
        />
      </section>
    </div>
  );
}
