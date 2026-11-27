"use client";

import React from "react";
import { motion } from "framer-motion";
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
  "OpenZeppelin v5 & ERC-721 / ERC-1155",
  "Next.js, TypeScript, Wagmi v2 & Viem",
  "The Graph, Subgraphs & IPFS",
  "Hardhat, Tenderly & Alchemy SDK",
] as const;

const HERO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
      className="relative bg-[#FAF6F0] silk-grain overflow-x-clip pt-[100px] sm:pt-[110px] lg:pt-[118px]"
    >
      {/* Airy Warm-Champagne & Apricot Studio Light Wash at Top Edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[94%] max-w-[1320px] h-[230px] rounded-full opacity-75 ambient-silk-drift"
        style={{
          background:
            "radial-gradient(ellipse 68% 64% at 50% 20%, rgba(244, 162, 97, 0.16) 0%, rgba(232, 93, 4, 0.08) 42%, rgba(250, 246, 240, 0) 76%)",
        }}
      />

      {/* Subtle Sculptural Warm-Amber Studio Ambient Light with GPU-only Silk Drift */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-28 right-[-8%] w-[640px] h-[640px] rounded-full opacity-70 ambient-silk-drift"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 140, 6, 0.14) 0%, rgba(232, 93, 4, 0.06) 40%, rgba(250, 246, 240, 0) 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-[-12%] w-[480px] h-[620px] rounded-full opacity-55 ambient-silk-drift-reverse"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(217, 119, 54, 0.11) 0%, rgba(250, 246, 240, 0) 72%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-6 sm:pb-8">
        {/* 2-Column Editorial Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[390px] lg:min-h-[430px]">
          {/* Left Column: Proud Executive Identity Lockup + Refined Editorial Sora Headline */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unmistakable Executive Identity Lockup */}
            <motion.div
              data-testid="hero-identity-lockup"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: HERO_EASE }}
              className="flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#1A130F]">
                Amit Kumar
              </span>
              <span
                aria-hidden="true"
                className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#E85D04] shrink-0"
              />
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#E85D04]/[0.08] border border-[#E85D04]/20 text-[13.5px] sm:text-[15px] font-medium text-[#8C4A1C] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                Smart Contract Engineer &amp; DeFi Protocol Architect
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.54, delay: 0.06, ease: HERO_EASE }}
              className="mt-4 font-display font-bold text-[#140E0B] text-[30px] sm:text-[36px] lg:text-[40px] xl:text-[42px] leading-[1.12] tracking-[-0.025em] max-w-[26ch]"
            >
              <span className="block">I Architect DeFi Protocols</span>
              <span className="block mt-0.5">
                Built to{" "}
                <span className="text-[#E85D04]">Hold Under Fire.</span>
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.54, delay: 0.12, ease: HERO_EASE }}
              className="mt-4 space-y-2.5 text-[15px] sm:text-[16px] leading-[1.64] text-[#4E4039] max-w-[60ch]"
            >
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
            </motion.div>

            {/* Primary Actions (Cleanly Above the Fold on 1280x720 & 1440x900) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: HERO_EASE }}
              className="mt-5 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#protocols"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-full text-sm font-semibold text-[#FAF6F0] bg-[#E85D04] hover:bg-[#D14F00] hover:-translate-y-0.5 active:scale-[0.98] transition-[background-color,transform,box-shadow] duration-150 whitespace-nowrap shrink-0 shadow-[0_14px_30px_-14px_rgba(232,93,4,0.62)] hover:shadow-[0_18px_34px_-14px_rgba(232,93,4,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
              >
                <span>Explore Protocols</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="https://github.com/NexTechArchitect"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-6 py-2.5 rounded-full text-sm font-semibold text-[#140E0B] border border-[#140E0B]/16 bg-[#FFFCF7]/95 hover:border-[#E85D04]/45 hover:bg-[#F5EFE6] hover:-translate-y-0.5 active:scale-[0.98] transition-[background-color,border-color,transform,box-shadow] duration-150 whitespace-nowrap shrink-0 shadow-[0_10px_24px_-18px_rgba(20,14,11,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
              >
                <span>GitHub</span>
                <ArrowUpRight
                  className="w-4 h-4 text-[#E85D04]"
                  aria-hidden="true"
                />
              </a>
            </motion.div>

            {/* Clean Direct Social & Contact Row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.24, ease: HERO_EASE }}
              className="mt-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-5 gap-y-2 text-[13.5px] font-medium text-[#594A42]"
            >
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
            </motion.div>
          </div>

          {/* Right Column: Floating 3D Character + Dynamic Rotating Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: HERO_EASE }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <div className="relative w-full flex flex-col items-center justify-center">
              <AmitAvatar3D
                onOpenGallery={onOpenGallery}
                onInspectYulGas={onInspectYulGas}
                onOpenResume={onOpenResume}
                onAskAnything={openAgent}
                onScrollToContact={handleScrollToContact}
              />
            </div>
          </motion.div>
        </div>

        {/* Symmetrical 3-Row x 4-Column Core Skills Grid (12 High-Signal Skills, Zero Half-Empty Row) */}
        <motion.div
          data-testid="hero-core-skills"
          aria-label="Core engineering skills"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: HERO_EASE }}
          className="mt-8 lg:mt-10 rounded-[28px] bg-[#F3EAE0]/80 border border-[#140E0B]/[0.06] p-4 sm:p-5 lg:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_48px_-34px_rgba(20,14,11,0.2)]"
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CORE_SKILLS.map((skill) => (
              <li
                key={skill}
                className="flex items-center justify-center text-center gap-2 min-h-[44px] px-3.5 py-2.5 rounded-full bg-[#FFFDF9]/95 border border-[#140E0B]/[0.07] hover:border-[#E85D04]/38 hover:-translate-y-0.5 text-[12px] sm:text-[12.5px] font-medium text-[#4A3B32] leading-snug shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_18px_-12px_rgba(20,14,11,0.24)] hover:shadow-[0_12px_26px_-14px_rgba(232,93,4,0.28)] transition-[transform,border-color,box-shadow] duration-200"
              >
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-[#E85D04] shrink-0"
                />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Transition #1: Direct Scroll-Flattening Sculptural Horizon Sweep (#FAF6F0 -> #140E0B) */}
      <ScrollHorizonSweep
        idPrefix="hero-to-arch"
        bottomFill="#140E0B"
        className="mt-6 sm:mt-10"
      />
    </section>
  );
}
