"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Check, Copy, FileCode2, MessageSquare } from "lucide-react";
import { ARCHITECTURE_INSIGHTS } from "@/data/projects";
import { SolarHorizonArch } from "@/components/SectionCurves";
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
  const { openAgent, sendMessage } = useAgent();
  const [internalId, setInternalId] = useState<string>(
    ARCHITECTURE_INSIGHTS[0].id
  );
  const [direction, setDirection] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Transition #4: Curved Studio Folio Reveal (#1B120D -> #F3EAE0) with rising architectural scale & y
  const folioOuterRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: folioScroll } = useScroll({
    target: folioOuterRef,
    offset: ["start end", "start 0.35"],
  });
  const folioY = useTransform(folioScroll, [0, 1], [36, 0]);
  const folioScale = useTransform(folioScroll, [0, 1], [0.975, 1]);

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
    const nextIdx = ARCHITECTURE_INSIGHTS.findIndex(
      (item) => item.id === nextId
    );
    setDirection(nextIdx >= activeIndex ? 1 : -1);
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
    /* Outer #1B120D backdrop guarantees exact hex parity behind the sculpted upper rounded corners */
    <div
      ref={folioOuterRef}
      className="relative bg-[#1B120D] -mt-[2px] overflow-x-clip"
    >
      <motion.section
        id="workbench"
        style={
          prefersReducedMotion
            ? undefined
            : { y: folioY, scale: folioScale, transformOrigin: "top center" }
        }
        className="relative z-20 bg-[#F3EAE0] text-[#140E0B] silk-grain rounded-t-[48px] md:rounded-t-[76px] pt-14 sm:pt-20 scroll-mt-20 overflow-x-clip shadow-[0_-28px_72px_-26px_rgba(10,6,4,0.55)] will-change-transform"
      >
        {/* Subtle warm-amber edge ambient light over Soft Champagne Sand canvas with GPU silk drift */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-6%] w-[560px] h-[560px] rounded-full opacity-65 ambient-silk-drift"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(244, 140, 6, 0.14) 0%, rgba(232, 93, 4, 0.06) 44%, rgba(243, 234, 224, 0) 74%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-32 left-[-8%] w-[480px] h-[520px] rounded-full opacity-45 ambient-silk-drift-reverse"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(217, 119, 54, 0.1) 0%, rgba(243, 234, 224, 0) 72%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          {/* Left-Aligned Staggered Editorial Header (Zero Straight Line) */}
          <div className="max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold text-[#140E0B] text-3xl sm:text-4xl lg:text-[3rem] leading-[1.05] tracking-[-0.032em]"
              style={{ textWrap: "balance" }}
            >
              Production Contract{" "}
              <span className="text-[#E85D04]">Primitives.</span>
            </motion.h2>

            <motion.p
              data-testid="section-subtitle-workbench"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 max-w-2xl text-left text-[16px] sm:text-[17.5px] leading-[1.65] font-normal text-[#4D4139]"
            >
              Inspect real Solidity and inline Yul guards extracted from
              deployed DeFi, RWA, keeper, and governance systems.
            </motion.p>
          </div>

          {/* Architectural Horizontal File-Switcher Dock */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 relative z-30"
          >
            <div
              role="tablist"
              aria-label="Solidity and Yul contract primitives"
              className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar-hide p-1.5 rounded-full bg-[#E7DCCE]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_12px_30px_-20px_rgba(20,14,11,0.2)] w-full lg:w-fit"
            >
              {ARCHITECTURE_INSIGHTS.map((insight) => {
                const isSelected = insight.id === activeInsight.id;
                return (
                  <button
                    key={insight.id}
                    type="button"
                    role="tab"
                    data-testid={`workbench-tab-${insight.id}`}
                    aria-selected={isSelected}
                    onClick={() => handleSelectTab(insight.id)}
                    className={`relative z-30 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full font-mono-tabular text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
                      isSelected
                        ? "text-[#FAF6F0]"
                        : "text-[#594A42] hover:text-[#140E0B]"
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
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Cinematic 2-Column Floating Studio Stage */}
          <div className="mt-9 relative z-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeInsight.id}
                initial={{ opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -16 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
              >
                {/* Left (5 cols): Crisp Light Editorial Breakdown */}
                <div className="lg:col-span-5 flex flex-col justify-between pt-1">
                  <div>
                    <p className="font-mono-tabular text-xs font-semibold text-[#B84700]">
                      {activeInsight.protocol}
                      <span
                        aria-hidden="true"
                        className="mx-2 text-[#140E0B]/25"
                      >
                        ·
                      </span>
                      <span className="text-[#6C5B52]">
                        {activeInsight.domain}
                      </span>
                    </p>

                    <h3 className="mt-3 font-display text-2xl sm:text-[1.85rem] font-bold text-[#140E0B] tracking-[-0.028em] leading-[1.16]">
                      {activeInsight.title}
                    </h3>

                    <p className="mt-4 text-[15px] leading-[1.72] text-[#4D4139]">
                      {activeInsight.body}
                    </p>

                    {/* Two Tonal Editorial Callout Cards (Zero Rigid Borders, Organic Curvature) */}
                    <div className="mt-7 space-y-3.5">
                      <div className="rounded-[28px] bg-[#EAE0D3]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_14px_34px_-26px_rgba(20,14,11,0.22)] px-6 py-5">
                        <p className="font-mono-tabular text-[11px] uppercase tracking-[0.12em] font-semibold text-[#7D6C61]">
                          Engineering Tradeoff
                        </p>
                        <p className="mt-1.5 text-sm leading-[1.68] text-[#3F332C]">
                          {activeInsight.tradeoff}
                        </p>
                      </div>

                      <div className="rounded-[28px] bg-[#EFE5D8] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_16px_38px_-26px_rgba(232,93,4,0.22)] px-6 py-5">
                        <p className="font-mono-tabular text-[11px] uppercase tracking-[0.12em] font-semibold text-[#E85D04]">
                          Verified Outcome
                        </p>
                        <p className="mt-1.5 text-sm leading-[1.68] font-medium text-[#140E0B]">
                          {activeInsight.outcome}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right (7 cols): Elevated Deep Espresso (#130D0A) Floating Code Studio */}
                <div
                  data-testid="workbench-code-panel"
                  onMouseMove={handleStudioSpecular}
                  className="specular-surface-dark lg:col-span-7 rounded-[34px] bg-[#130D0A] text-[#FAF6F0] transition-[box-shadow] duration-250 flex flex-col overflow-hidden shadow-[inset_0_1px_0_rgba(250,246,240,0.1),0_34px_76px_-28px_rgba(20,14,11,0.62)] hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.22),0_38px_82px_-26px_rgba(232,93,4,0.28)]"
                >
                  {/* Tonal Window Header (Zero Straight Hairline Border) */}
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
                        <p className="text-[11px] text-[#A8988B] truncate">
                          {activeInsight.language}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleAskCode}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full bg-[#271C15] border border-[#FAF6F0]/14 hover:border-[#E85D04] active:scale-[0.98] text-xs font-semibold text-[#FAF6F0] transition-[border-color,transform] cursor-pointer whitespace-nowrap"
                      >
                        <MessageSquare
                          className="w-3.5 h-3.5 text-[#E85D04]"
                          aria-hidden="true"
                        />
                        <span>Explain Code</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label={`Copy ${activeInsight.filename}`}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full bg-[#E85D04] hover:bg-[#D14F00] active:scale-[0.98] text-xs font-semibold text-[#FAF6F0] transition-[background-color,transform] cursor-pointer whitespace-nowrap"
                      >
                        {copiedId === activeInsight.id ? (
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
                      </button>
                    </div>
                  </div>

                  {/* Numbered Syntax-Highlighted Solidity / Yul Code */}
                  <div className="px-4 sm:px-6 py-5 overflow-x-auto bg-[#130D0A]">
                    <pre className="font-mono-tabular text-[12px] sm:text-[12.5px] leading-[1.74] text-[#EFE6DC]">
                      <code>
                        {codeLines.map((line, index) => (
                          <div
                            key={`${activeInsight.id}-${index}`}
                            className="flex"
                          >
                            <span
                              aria-hidden="true"
                              className="select-none w-8 pr-3 text-right text-[#6E5E54] shrink-0"
                            >
                              {index + 1}
                            </span>
                            <span className="whitespace-pre">
                              {highlightSolidityLine(line)}
                            </span>
                          </div>
                        ))}
                      </code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Transition #5: Signature Luminous Burnt-Orange Solar Horizon Arch (#F3EAE0 -> #0A0604 Midnight Obsidian) */}
        <SolarHorizonArch
          idPrefix="workbench-to-footer"
          bottomFill="#0A0604"
          className="mt-20 sm:mt-24"
        />
      </motion.section>
    </div>
  );
}
