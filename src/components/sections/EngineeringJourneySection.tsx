"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, FileCode2, ShieldAlert, Sparkles } from "lucide-react";
import { ARCHITECTURE_INSIGHTS } from "@/data/projects";

function highlightSolidityLine(line: string) {
  const trimmed = line.trim();
  if (trimmed.startsWith("//")) {
    return <span className="text-slate-400 italic">{line}</span>;
  }

  const tokenRegex =
    /(\b(?:pragma|solidity|abstract|contract|library|function|internal|external|public|private|view|pure|virtual|returns|return|if|revert|error|mapping|struct|storage|assembly|delete|constant|uint256|uint64|uint16|address|bool|bytes32)\b|\b0x[a-fA-F0-9]+\b|\b\d+(?:_\d+)*\b|"[^"]*"|\/\/.*$)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`p-${lastIndex}`} className="text-slate-200">
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }

    const token = match[0];
    let cls = "text-slate-200";
    if (token.startsWith("//")) {
      cls = "text-slate-400 italic";
    } else if (token.startsWith('"')) {
      cls = "text-emerald-300";
    } else if (/^(?:0x|\d)/.test(token)) {
      cls = "text-amber-300";
    } else if (
      /^(?:uint256|uint64|uint16|address|bool|bytes32|mapping|struct)$/.test(token)
    ) {
      cls = "text-cyan-300";
    } else {
      cls = "text-sky-400 font-medium";
    }

    parts.push(
      <span key={`t-${match.index}`} className={cls}>
        {token}
      </span>
    );
    lastIndex = match.index + token.length;
  }

  if (lastIndex < line.length) {
    parts.push(
      <span key={`e-${lastIndex}`} className="text-slate-200">
        {line.slice(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : <span>&nbsp;</span>;
}

export default function EngineeringJourneySection() {
  const [selectedId, setSelectedId] = useState(ARCHITECTURE_INSIGHTS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeInsight =
    ARCHITECTURE_INSIGHTS.find((item) => item.id === selectedId) ??
    ARCHITECTURE_INSIGHTS[0];

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(activeInsight.code);
    setCopiedId(activeInsight.id);
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === activeInsight.id ? null : prev));
    }, 1800);
  };

  return (
    <section
      id="insights"
      className="relative bg-white border-t border-slate-200/80 py-20 sm:py-28 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-xs font-mono-tabular font-semibold text-[#0052FF] mb-3">
            03. Protocol Engineering Log
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1220] leading-[1.08] mb-4 text-balance">
            Architecture Insights &{" "}
            <span className="text-optical-gradient">System Design.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Production security decisions, gas engineering trade-offs, and the
            exact Solidity and Yul patterns used to neutralize hostile execution
            vectors before mainnet deployment.
          </p>
        </div>

        {/* Interactive Split-View Architecture Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Rail: Selectable Architectural Index */}
          <div
            role="tablist"
            aria-label="Architecture engineering insights"
            className="lg:col-span-5 flex flex-col gap-2.5"
          >
            {ARCHITECTURE_INSIGHTS.map((insight) => {
              const isSelected = insight.id === activeInsight.id;
              return (
                <button
                  key={insight.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(insight.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] ${
                    isSelected
                      ? "bg-[#F8FAFC] border-[#0052FF]/45 shadow-[0_10px_30px_rgba(0,82,255,0.08)]"
                      : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-[#F8FAFC]/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular mb-2">
                    <span
                      className={
                        isSelected
                          ? "text-[#0052FF] font-semibold"
                          : "text-slate-500"
                      }
                    >
                      {insight.num}. {insight.protocol}
                    </span>
                    <span className="text-slate-400">{insight.domain}</span>
                  </div>
                  <h3
                    className={`font-display text-base sm:text-lg font-bold tracking-tight leading-snug ${
                      isSelected ? "text-[#0B1220]" : "text-slate-700"
                    }`}
                  >
                    {insight.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {insight.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Pane: Tactile Glassmorphic Detail & Solidity/Yul Code Viewer */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInsight.id}
                role="tabpanel"
                aria-label={activeInsight.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl bg-[#F8FAFC] border border-slate-200/90 p-6 sm:p-8 shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
              >
                {/* Header Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular text-slate-500 pb-4 border-b border-slate-200/80 mb-5">
                  <span>
                    <span className="text-[#0052FF] font-semibold">
                      Note {activeInsight.num}
                    </span>
                    <span aria-hidden="true" className="mx-2 text-slate-300">
                      ·
                    </span>
                    <span>{activeInsight.protocol}</span>
                  </span>
                  <span>{activeInsight.language}</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1220] tracking-tight leading-tight mb-4">
                  {activeInsight.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                  {activeInsight.body}
                </p>

                {/* Trade-off & Verified Outcome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-mono-tabular font-semibold text-slate-700 mb-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#0891B2]" aria-hidden="true" />
                      <span>Design Trade-Off</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {activeInsight.tradeoff}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-mono-tabular font-semibold text-slate-700 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0052FF]" aria-hidden="true" />
                      <span>Verified Outcome</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {activeInsight.outcome}
                    </p>
                  </div>
                </div>

                {/* Syntax-Highlighted Solidity / Yul Snippet */}
                <div className="rounded-2xl bg-[#0B1220] border border-slate-800 overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#111A2E] border-b border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-mono-tabular text-slate-300">
                      <FileCode2 className="w-4 h-4 text-sky-400" aria-hidden="true" />
                      <span>{activeInsight.filename}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      aria-label={`Copy ${activeInsight.filename} snippet`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono-tabular text-slate-200 transition-colors cursor-pointer"
                    >
                      {copiedId === activeInsight.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-6 font-mono-tabular">
                    <code>
                      {activeInsight.code.split("\n").map((line, i) => (
                        <div key={i} className="table-row">
                          <span className="table-cell pr-4 text-right select-none text-slate-600 w-8">
                            {i + 1}
                          </span>
                          <span className="table-cell whitespace-pre">
                            {highlightSolidityLine(line)}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}