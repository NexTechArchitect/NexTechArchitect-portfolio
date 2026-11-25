"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, FileCode2, MessageSquare } from "lucide-react";
import { ARCHITECTURE_INSIGHTS } from "@/data/projects";
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

  const parts = codePart.split(/(\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:_\d+)*\b)/g);

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
  const { openAgent, sendMessage } = useAgent();
  const [internalId, setInternalId] = useState<string>(
    ARCHITECTURE_INSIGHTS[0].id
  );
  const [direction, setDirection] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedId = selectedTabId ?? internalId;

  const activeIndex = useMemo(() => {
    const idx = ARCHITECTURE_INSIGHTS.findIndex((item) => item.id === selectedId);
    return idx >= 0 ? idx : 0;
  }, [selectedId]);

  const activeInsight = ARCHITECTURE_INSIGHTS[activeIndex];

  const handleSelectTab = (nextId: string) => {
    const nextIdx = ARCHITECTURE_INSIGHTS.findIndex((item) => item.id === nextId);
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
    <section
      id="workbench"
      className="relative z-20 bg-[#F3EAE0] text-[#140E0B] silk-grain pt-10 sm:pt-14 lg:pt-16 scroll-mt-20 overflow-x-clip"
    >
      {/* Subtle warm-amber ambient light over Warm Sand Alabaster canvas (strictly pointer-events-none) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[6%] w-[580px] h-[520px] rounded-full opacity-65"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 140, 6, 0.14) 0%, rgba(232, 93, 4, 0.06) 44%, rgba(243, 234, 224, 0) 74%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-32 left-[-8%] w-[480px] h-[440px] rounded-full opacity-45"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 107, 39, 0.1) 0%, rgba(243, 234, 224, 0) 72%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Clean Direct Editorial Header (Zero Eyebrow Kicker) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-9 border-b border-[#140E0B]/12">
          <div className="lg:col-span-7">
            <h2
              className="font-display font-bold text-[#140E0B] text-3xl sm:text-4xl lg:text-[2.95rem] leading-[1.05] tracking-[-0.032em]"
              style={{ textWrap: "balance" }}
            >
              Production Contract{" "}
              <span className="text-[#E85D04]">Primitives.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:text-right">
            <p className="text-sm sm:text-[15px] leading-[1.7] text-[#594A42] lg:ml-auto max-w-[44ch]">
              Inspect real Solidity and inline Yul guards extracted from
              deployed DeFi, RWA, keeper, and governance systems.
            </p>
          </div>
        </div>

        {/* Architectural Horizontal File-Switcher Dock */}
        <div className="mt-8 relative z-30">
          <div
            role="tablist"
            aria-label="Solidity and Yul contract primitives"
            className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar-hide p-1.5 rounded-2xl lg:rounded-full bg-[#E7DCCE]/85 border border-[#140E0B]/12 shadow-[0_12px_30px_-20px_rgba(20,14,11,0.2)] w-full lg:w-fit"
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
                  className={`relative z-30 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl lg:rounded-full font-mono-tabular text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
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
                      className="absolute inset-0 rounded-xl lg:rounded-full bg-[#E85D04] shadow-[0_10px_24px_-10px_rgba(232,93,4,0.75)]"
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
        </div>

        {/* Cinematic 2-Column Floating Studio Stage (Left 45% Light Editorial | Right 55% Elevated Dark Terminal) */}
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
              {/* Left (45% -> 5 cols): Crisp Light Editorial Breakdown */}
              <div className="lg:col-span-5 flex flex-col justify-between pt-1">
                <div>
                  <p className="font-mono-tabular text-xs font-semibold text-[#B84700]">
                    {activeInsight.protocol}
                    <span aria-hidden="true" className="mx-2 text-[#140E0B]/25">
                      ·
                    </span>
                    <span className="text-[#6C5B52]">{activeInsight.domain}</span>
                  </p>

                  <h3 className="mt-3 font-display text-2xl sm:text-[1.85rem] font-bold text-[#140E0B] tracking-[-0.028em] leading-[1.16]">
                    {activeInsight.title}
                  </h3>

                  <p className="mt-4 text-[15px] leading-[1.72] text-[#4E4039]">
                    {activeInsight.body}
                  </p>

                  {/* Two Clean Hairline-Separated Callouts (Zero Heavy Dark Box Clutter) */}
                  <div className="mt-8 border-t border-[#140E0B]/12 divide-y divide-[#140E0B]/12">
                    <div className="py-5">
                      <p className="font-mono-tabular text-[11px] uppercase tracking-[0.12em] font-semibold text-[#7D6C61]">
                        Engineering Tradeoff
                      </p>
                      <p className="mt-1.5 text-sm leading-[1.68] text-[#3F332C]">
                        {activeInsight.tradeoff}
                      </p>
                    </div>

                    <div className="py-5">
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

              {/* Right (55% -> 7 cols): Elevated Deep Espresso (#140D09) Floating Code Studio */}
              <div
                data-testid="workbench-code-panel"
                className="lg:col-span-7 rounded-[26px] bg-[#140D09] text-[#FAF6F0] border border-[#140E0B]/20 flex flex-col overflow-hidden shadow-[0_32px_72px_-28px_rgba(20,14,11,0.52)]"
              >
                {/* macOS-Style Subtle Window Header */}
                <div className="px-5 sm:px-6 py-4 bg-[#1C130E] border-b border-[#FAF6F0]/10 flex flex-wrap items-center justify-between gap-3">
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
                <div className="px-4 sm:px-6 py-5 overflow-x-auto bg-[#140D09]">
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

      {/* Transition #5: Signature Luminous Burnt-Orange Solar Horizon Arch (#F3EAE0 -> #0B0705 Deep Obsidian Footer) */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative w-full mt-20 sm:mt-24 leading-none overflow-hidden"
      >
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[82%] max-w-[1100px] h-[130px] rounded-full opacity-55"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.34) 0%, rgba(244, 140, 6, 0.16) 46%, rgba(243, 234, 224, 0) 76%)",
          }}
        />
        <svg
          viewBox="0 0 1440 148"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="relative z-10 block w-full h-[76px] sm:h-[108px] lg:h-[138px]"
        >
          <defs>
            <linearGradient
              id="copperHorizonStroke"
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#C85A17" stopOpacity="0.2" />
              <stop offset="28%" stopColor="#E85D04" stopOpacity="0.88" />
              <stop offset="50%" stopColor="#F48C06" stopOpacity="1" />
              <stop offset="72%" stopColor="#E85D04" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#C85A17" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient
              id="obsidianArchFill"
              x1="720"
              y1="18"
              x2="720"
              y2="148"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#1A100A" />
              <stop offset="40%" stopColor="#100906" />
              <stop offset="100%" stopColor="#0B0705" />
            </linearGradient>
          </defs>
          <path
            d="M0 148V114C360 16 1080 16 1440 114V148H0Z"
            fill="url(#obsidianArchFill)"
          />
          <path
            d="M0 114C360 16 1080 16 1440 114"
            stroke="url(#copperHorizonStroke)"
            strokeWidth="2.4"
          />
        </svg>
      </div>
    </section>
  );
}
