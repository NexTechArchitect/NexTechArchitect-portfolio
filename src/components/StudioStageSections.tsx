"use client";

import React from "react";
import { ArrowUpRight, MessageSquareText } from "lucide-react";
import { useAgent } from "@/context/AgentContext";
import { fullStackProjects, ARCHITECTURE_INSIGHTS } from "@/data/projects";

const ARCHITECTURE_PILLARS = [
  {
    index: "01.",
    title: "Deterministic Solvency & Threat Modeling",
    description:
      "Every state machine begins with explicit solvency invariants, prior-block checkpoint voting, and oracle circuit breakers before any deployment script runs.",
    metric: "Prior-block checkpoints & 15% NAV halt guards",
    prompt: "How do you prevent flash-loan exploits?",
  },
  {
    index: "02.",
    title: "Gas-Efficient Solidity & Inline Yul",
    description:
      "Constant-time O(1) swap-and-pop keeper queues, single-word struct packing, and minimal inline Yul assembly reduce execution overhead without obscuring auditability.",
    metric: "Up to 35% execution gas reduction",
    prompt: "Tell me about your Yul gas optimizations",
  },
  {
    index: "03.",
    title: "Storage-Safe Upgradeability & Vault Accounting",
    description:
      "EIP-1822 UUPS proxies reserve explicit storage gaps and automated layout diffs, paired with ERC-4626 virtual share offsets that block first-depositor inflation attacks.",
    metric: "Zero slot drift across V1-to-V2 upgrades",
    prompt: "How do you keep UUPS proxies storage-safe?",
  },
] as const;

export default function StudioStageSections() {
  const { explainProtocol, sendMessage, openAgent } = useAgent();
  const flagshipProtocols = fullStackProjects.filter((p) => p.flagship);

  return (
    <>
      {/* STAGE 1 WARM SAND CHAPTER: ARCHITECTURE PRINCIPLES */}
      <section
        id="architecture"
        className="relative bg-[#F3ECE1] text-[#231712] py-20 sm:py-24 scroll-mt-24"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-4">
              <p className="text-[13px] font-medium text-[#8C7A6B]">
                Design Philosophy
              </p>
              <h2
                className="mt-3 font-display font-bold text-3xl sm:text-[38px] leading-[1.12] tracking-[-0.02em] text-[#231712]"
                style={{ textWrap: "balance" }}
              >
                Architecture built for{" "}
                <span className="italic font-semibold text-[#E85D04]">
                  adversarial
                </span>{" "}
                mainnets.
              </h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-[#5C4B43]">
                Production smart contracts operate in hostile execution
                environments. Every system below is verified through stateful
                Foundry invariant fuzzing and Slither static sweeps.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#231712]/12 border-t border-b border-[#231712]/12">
              {ARCHITECTURE_PILLARS.map((pillar) => (
                <div
                  key={pillar.index}
                  className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-start"
                >
                  <div className="sm:col-span-2 font-mono-tabular text-sm font-medium text-[#8C7A6B] pt-1">
                    {pillar.index}
                  </div>
                  <div className="sm:col-span-10">
                    <h3 className="font-display font-bold text-xl sm:text-[22px] text-[#231712]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-[1.68] text-[#5C4B43] max-w-[60ch]">
                      {pillar.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-mono-tabular text-[#8C7A6B]">
                        {pillar.metric}
                      </span>
                      <button
                        type="button"
                        onClick={() => sendMessage(pillar.prompt)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E85D04] hover:text-[#231712] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] rounded-sm"
                      >
                        <MessageSquareText className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Ask Amit about this</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROTOCOL INDEX (EDITORIAL MONOGRAPH LEDGER) */}
      <section
        id="protocols"
        className="relative bg-[#FAF6F0] text-[#231712] py-20 sm:py-24 border-t border-[#231712]/12 scroll-mt-24"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#231712]/12">
            <div>
              <p className="text-[13px] font-medium text-[#8C7A6B]">
                Selected Deployments · Ethereum &amp; EVM Mainnets
              </p>
              <h2
                className="mt-3 font-display font-bold text-3xl sm:text-[40px] leading-[1.1] tracking-[-0.02em] text-[#231712]"
                style={{ textWrap: "balance" }}
              >
                Flagship Protocol{" "}
                <span className="italic font-semibold text-[#E85D04]">
                  Systems.
                </span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#5C4B43] max-w-[40ch]">
              Select any protocol below to walk through its contract topology
              with the studio guide, or inspect the verified repository directly.
            </p>
          </div>

          <div className="divide-y divide-[#231712]/12">
            {flagshipProtocols.map((protocol, idx) => (
              <article
                key={protocol.id}
                className="py-8 sm:py-9 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start transition-colors"
              >
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#8C7A6B]">
                    <span>0{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span>{protocol.network}</span>
                    <span aria-hidden="true">·</span>
                    <span>{protocol.standard}</span>
                  </div>
                  <h3 className="mt-2 font-display font-bold text-2xl text-[#231712]">
                    {protocol.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-mono-tabular font-medium text-[#E85D04]">
                    {protocol.metric}
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <p className="text-[15px] leading-[1.68] text-[#5C4B43]">
                    {protocol.description}
                  </p>
                  <p className="mt-3 text-xs text-[#8C7A6B]">
                    {protocol.tech.join(" · ")}
                  </p>
                </div>

                <div className="lg:col-span-3 flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => explainProtocol(protocol.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#FAF6F0] bg-[#231712] hover:bg-[#E85D04] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                  >
                    <MessageSquareText className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Walkthrough {protocol.shortTitle}</span>
                  </button>

                  <div className="flex items-center gap-4 text-xs font-semibold text-[#5C4B43] pt-1">
                    <a
                      href={protocol.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors whitespace-nowrap"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                    {protocol.liveUrl && (
                      <>
                        <span aria-hidden="true" className="text-[#231712]/20">
                          ·
                        </span>
                        <a
                          href={protocol.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors whitespace-nowrap"
                        >
                          <span>Live App</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WORKBENCH PREVIEW (WARM SAND STAGE) */}
      <section
        id="workbench"
        className="relative bg-[#F3ECE1] text-[#231712] py-20 sm:py-24 border-t border-[#231712]/12 scroll-mt-24"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="text-[13px] font-medium text-[#8C7A6B]">
                Protocol Workbench · Solidity &amp; Yul
              </p>
              <h2
                className="mt-3 font-display font-bold text-3xl sm:text-[38px] leading-[1.12] tracking-[-0.02em] text-[#231712]"
                style={{ textWrap: "balance" }}
              >
                Inspection-ready{" "}
                <span className="italic font-semibold text-[#E85D04]">
                  execution
                </span>{" "}
                primitives.
              </h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-[#5C4B43]">
                {ARCHITECTURE_INSIGHTS[1].body}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono-tabular text-[#8C7A6B]">
                <span>{ARCHITECTURE_INSIGHTS[1].filename}</span>
                <span aria-hidden="true">·</span>
                <span>{ARCHITECTURE_INSIGHTS[1].language}</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  sendMessage("Tell me about your Yul gas optimizations")
                }
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#231712] border border-[#231712]/18 bg-[#FAF6F0] hover:border-[#E85D04] hover:text-[#E85D04] transition-colors whitespace-nowrap"
              >
                <MessageSquareText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Discuss Yul Assembly Strategy</span>
              </button>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#231712] text-[#FAF6F0] border border-[#231712]/20 overflow-hidden shadow-[0_22px_50px_-24px_rgba(35,23,18,0.45)]">
                <div className="px-5 py-3.5 border-b border-[#FAF6F0]/10 flex items-center justify-between text-xs font-mono-tabular text-[#D9C7B4]">
                  <span>{ARCHITECTURE_INSIGHTS[1].filename}</span>
                  <span className="text-[#F48C06]">O(1) Swap-and-Pop</span>
                </div>
                <pre className="p-5 sm:p-6 overflow-x-auto text-[12.5px] sm:text-[13px] leading-[1.68] font-mono-tabular text-[#FAF6F0]/90">
                  <code>{ARCHITECTURE_INSIGHTS[1].code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL CONTACT FOOTER (NO RESUME BUTTON IN STAGE 1) */}
      <footer
        id="contact"
        className="relative bg-[#FAF6F0] text-[#231712] pt-20 pb-14 border-t border-[#231712]/12 scroll-mt-24"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-[#231712]/12 items-end">
            <div className="lg:col-span-7">
              <p className="text-[13px] font-medium text-[#8C7A6B]">
                Direct Inquiries · Protocol Engineering &amp; Security Reviews
              </p>
              <h2
                className="mt-3 font-display font-bold text-3xl sm:text-[44px] leading-[1.08] tracking-[-0.025em] text-[#231712]"
                style={{ textWrap: "balance" }}
              >
                Ready to architect your next{" "}
                <span className="italic font-semibold text-[#E85D04]">
                  on-chain system?
                </span>
              </h2>
            </div>

            <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
              <a
                href="mailto:nextech.amit@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-[#FAF6F0] bg-[#E85D04] hover:bg-[#D14F00] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
              >
                <span>nextech.amit@gmail.com</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={openAgent}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-semibold text-[#231712] border border-[#231712]/15 bg-[#FFFCF7] hover:border-[#E85D04] hover:text-[#E85D04] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
              >
                <MessageSquareText className="w-4 h-4" aria-hidden="true" />
                <span>Ask Amit</span>
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#8C7A6B]">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-[#231712]">
                NexTechArchitect
              </span>
              <span aria-hidden="true">·</span>
              <span>Amit Kumar · Ethereum &amp; EVM Protocol Architecture</span>
            </div>

            <div className="flex flex-wrap items-center gap-5 font-medium text-[#5C4B43]">
              <a
                href="https://github.com/NexTechArchitect"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E85D04] transition-colors whitespace-nowrap"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/amit-kumar-811a11277"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E85D04] transition-colors whitespace-nowrap"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/itZ_AmiT0"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E85D04] transition-colors whitespace-nowrap"
              >
                X (Twitter)
              </a>
              <a
                href="mailto:nextech.amit@gmail.com"
                className="hover:text-[#E85D04] transition-colors whitespace-nowrap"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
