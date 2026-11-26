"use client";

import React from "react";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";
import AmitAvatar3D from "@/components/AmitAvatar3D";
import { ScrollHorizonSweep } from "@/components/SectionCurves";
import { useAgent } from "@/context/AgentContext";

interface HeroSectionProps {
  onOpenResume: () => void;
  onOpenGallery: () => void;
  onInspectYulGas: () => void;
}

const CORE_SKILLS = [
  "Solidity & Yul Assembly",
  "Foundry & Stateful Invariant Fuzzing",
  "Threat Modeling, Slither & Echidna",
  "ERC-3643 / ERC-4626 / ERC-4337 / ERC-5484",
  "UUPS & EIP-1967 Upgradeable Proxies",
  "Chainlink CCIP, VRF & Data Feeds",
  "Aave V3 & Flash-Loan / MEV Defense",
  "EVM Gas Optimization & Storage Packing",
  "Next.js, TypeScript, Wagmi v2 & Viem",
  "The Graph & IPFS",
] as const;

export default function HeroSection({
  onOpenResume,
  onOpenGallery,
  onInspectYulGas,
}: HeroSectionProps) {
  const { openAgent } = useAgent();

  const handleScrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="top"
      className="relative bg-[#FAF6F0] silk-grain overflow-x-clip pt-[106px] sm:pt-[118px] lg:pt-[128px]"
    >
      {/* Subtle Sculptural Warm-Amber & Champagne Studio Light Wash Framing the Top Edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[92%] max-w-[1220px] h-[340px] rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(244, 140, 6, 0.16) 0%, rgba(232, 93, 4, 0.08) 38%, rgba(243, 234, 224, 0.25) 60%, rgba(250, 246, 240, 0) 78%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-28 right-[-8%] w-[640px] h-[640px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 140, 6, 0.14) 0%, rgba(232, 93, 4, 0.06) 40%, rgba(250, 246, 240, 0) 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-[-12%] w-[480px] h-[620px] rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(217, 107, 39, 0.11) 0%, rgba(250, 246, 240, 0) 72%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-6 sm:pb-8">
        {/* 2-Column Editorial Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[440px] lg:min-h-[480px]">
          {/* Left Column: Proud Executive Identity Lockup + Balanced Sora Headline */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unmistakable Executive Identity Lockup */}
            <div
              data-testid="hero-identity-lockup"
              className="flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#1A130F]">
                Amit Kumar
              </span>
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-[#E85D04] shrink-0"
              />
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#E85D04]/[0.08] border border-[#E85D04]/20 text-sm sm:text-[15.5px] font-medium text-[#8C4A1C]">
                Smart Contract Engineer &amp; DeFi Protocol Architect
              </span>
            </div>

            <h1 className="mt-5 font-display font-bold text-[#140E0B] text-4xl sm:text-5xl lg:text-[56px] leading-[1.06] tracking-[-0.032em]">
              <span className="block">I Architect DeFi</span>
              <span className="block mt-1">
                Protocols Built to{" "}
                <span className="text-[#E85D04]">Hold Under Fire.</span>
              </span>
            </h1>

            <div className="mt-5 space-y-3 text-[15.5px] sm:text-[16.5px] leading-[1.68] text-[#4E4039] max-w-[60ch]">
              <p>
                I&apos;m Amit Kumar, a Smart Contract Engineer shipping complete
                DeFi systems across Ethereum and EVM-compatible mainnets, from
                threat model and Solidity architecture through stateful
                invariant testing and the Next.js &amp; Wagmi application on
                top.
              </p>
              <p className="text-[#625249]">
                Strongest in the security-critical layer: enforcing compliance
                directly inside token transfer hooks, keeping vault accounting
                consistent under adversarial conditions, and closing attack
                paths at design time rather than patching them after.
              </p>
            </div>

            {/* Primary Actions */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <a
                href="#protocols"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full text-sm font-semibold text-[#FAF6F0] bg-[#E85D04] hover:bg-[#D14F00] active:scale-[0.98] transition-[background-color,transform] duration-150 whitespace-nowrap shrink-0 shadow-[0_14px_30px_-14px_rgba(232,93,4,0.62)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
              >
                <span>Explore Protocols</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="https://github.com/NexTechArchitect"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-6 py-3 rounded-full text-sm font-semibold text-[#140E0B] border border-[#140E0B]/16 bg-[#FFFCF7]/90 hover:border-[#140E0B]/40 hover:bg-[#F5EFE6] active:scale-[0.98] transition-[background-color,border-color,transform] duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
              >
                <span>GitHub</span>
                <ArrowUpRight
                  className="w-4 h-4 text-[#E85D04]"
                  aria-hidden="true"
                />
              </a>
            </div>

            {/* Clean Direct Social & Contact Row */}
            <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-5 gap-y-2 text-[13.5px] font-medium text-[#594A42]">
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/in/amit-kumar-811a11277"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors whitespace-nowrap"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 opacity-70"
                    aria-hidden="true"
                  />
                </a>
                <span aria-hidden="true" className="text-[#E85D04]/60">
                  ·
                </span>
                <a
                  href="https://x.com/itZ_AmiT0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors whitespace-nowrap"
                >
                  <span>X (Twitter)</span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 opacity-70"
                    aria-hidden="true"
                  />
                </a>
              </div>
              <span
                aria-hidden="true"
                className="hidden sm:inline text-[#E85D04]/60"
              >
                ·
              </span>
              <a
                href="mailto:nextech.amit@gmail.com"
                className="inline-flex items-center gap-1.5 hover:text-[#E85D04] transition-colors whitespace-nowrap"
              >
                <Mail
                  className="w-3.5 h-3.5 text-[#8C4A1C]"
                  aria-hidden="true"
                />
                <span>nextech.amit@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Right Column: Floating 3D Character + Dynamic Rotating Prompts */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full flex flex-col items-center justify-center">
              <AmitAvatar3D
                onOpenGallery={onOpenGallery}
                onInspectYulGas={onInspectYulGas}
                onOpenResume={onOpenResume}
                onAskAnything={openAgent}
                onScrollToContact={handleScrollToContact}
              />
            </div>
          </div>
        </div>

        {/* Expanded Senior Core Skills Strip (10 High-Signal Skills, Zero Straight Lines) */}
        <div
          data-testid="hero-core-skills"
          aria-label="Core engineering skills"
          className="mt-10 lg:mt-12 rounded-[28px] bg-[#F3EAE0]/70 px-5 sm:px-7 py-5 shadow-[0_18px_48px_-34px_rgba(20,14,11,0.2)]"
        >
          <ul className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
            {CORE_SKILLS.map((skill) => (
              <li
                key={skill}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/90 text-[12.5px] sm:text-[13px] font-medium text-[#4A3B32] shadow-[0_4px_14px_-10px_rgba(20,14,11,0.28)]"
              >
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-[#E85D04] shrink-0"
                />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transition #1: Scroll-Flattening Sculptural Horizon Sweep (#FAF6F0 -> #140E0B) */}
      <ScrollHorizonSweep
        idPrefix="hero-to-arch"
        bottomFill="#140E0B"
        className="mt-6 sm:mt-10"
      />
    </section>
  );
}
