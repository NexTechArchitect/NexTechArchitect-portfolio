"use client";

import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";
import AmitAvatar3D from "@/components/AmitAvatar3D";
import {
  HeroHeaderCanopy,
  HeroSilkWave,
  LUXURY_EASE,
  REPLAY_VIEWPORT,
  ScrollHorizonSweep,
  useIsMobile,
} from "@/components/SectionCurves";
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

export default function HeroSection({
  onOpenResume,
  onOpenGallery,
  onInspectYulGas,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { openAgent } = useAgent();
  const heroRef = useRef<HTMLElement | null>(null);

  // Single ultra-lightweight GPU-only scroll listener for subtle silk wave & 3D avatar parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const avatarY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isMobile ? -10 : -24]
  );

  const handleScrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative bg-[#FAF6F0] text-[#16100C] silk-grain section-perf"
    >
      {/* Top Dark Espresso-Brown & Diffused Molten-Orange Curved Header Stage Behind Floating Navbar */}
      <HeroHeaderCanopy />

      {/* Lightweight Static Warm-Apricot Studio Ambient Washes (pointer-events-none, z-0) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 right-[-6%] w-[520px] h-[480px] rounded-full opacity-55 z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 140, 6, 0.13) 0%, rgba(232, 93, 4, 0.04) 44%, rgba(250, 246, 240, 0) 74%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-[-10%] w-[440px] h-[480px] rounded-full opacity-40 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(217, 119, 54, 0.1) 0%, rgba(250, 246, 240, 0) 72%)",
        }}
      />

      {/* Signature Translucent Apricot & Burnt-Orange Filled Silk Wave with Subtle Vertical Parallax */}
      <HeroSilkWave
        idPrefix="hero-signature-silk"
        scrollProgress={scrollYProgress}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Crisp Instant Staggered Editorial Entrance on Load */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* 1. Identity + Role Pill */}
            <motion.div
              data-testid="hero-identity-lockup"
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 18 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.04, ease: LUXURY_EASE }}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 will-change-transform"
            >
              <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#16100C]">
                Amit Kumar
              </span>
              <span
                aria-hidden="true"
                className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#E85D04] shrink-0"
              />
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#E85D04]/10 text-[13.5px] sm:text-[15px] font-medium text-[#9A3D08]">
                Smart Contract Engineer &amp; DeFi Protocol Architect
              </span>
            </motion.div>

            {/* 2. Hero H1 lines staggered cleanly upward */}
            <h1 className="mt-4 font-display font-bold text-[#16100C] text-[30px] sm:text-[36px] lg:text-[42px] leading-[1.1] tracking-[-0.025em] max-w-[26ch]">
              <motion.span
                initial={
                  prefersReducedMotion ? false : { opacity: 0, y: 22 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.62, delay: 0.1, ease: LUXURY_EASE }}
                className="block will-change-transform"
              >
                I Architect DeFi Protocols
              </motion.span>
              <motion.span
                initial={
                  prefersReducedMotion ? false : { opacity: 0, y: 22 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.62, delay: 0.17, ease: LUXURY_EASE }}
                className="block mt-1 will-change-transform"
              >
                Built to{" "}
                <span className="text-[#E85D04]">Hold Under Fire.</span>
              </motion.span>
            </h1>

            {/* 3. Bio paragraphs */}
            <div className="mt-5 space-y-3 text-[15px] sm:text-[16px] leading-[1.66] text-[#4A3F37] max-w-[60ch]">
              <motion.p
                initial={
                  prefersReducedMotion ? false : { opacity: 0, y: 20 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.62, delay: 0.24, ease: LUXURY_EASE }}
                className="will-change-transform"
              >
                I&apos;m Amit Kumar, a Smart Contract Engineer shipping complete
                DeFi systems across Ethereum and EVM-compatible mainnets, from
                threat model and Solidity architecture through stateful
                invariant testing and the Next.js &amp; Wagmi application on
                top.
              </motion.p>
              <motion.p
                initial={
                  prefersReducedMotion ? false : { opacity: 0, y: 20 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.62, delay: 0.3, ease: LUXURY_EASE }}
                className="text-[#5C4E45] will-change-transform"
              >
                Strongest in the security-critical layer: enforcing compliance
                directly inside token transfer hooks, keeping vault accounting
                consistent under adversarial conditions, and closing attack
                paths at design time rather than patching them after.
              </motion.p>
            </div>

            {/* 4. Primary Actions with Diagonal Specular Sheen & Directional Icon Nudge */}
            <motion.div
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 18 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36, ease: LUXURY_EASE }}
              className="mt-6 flex flex-wrap items-center gap-3.5 will-change-transform"
            >
              <a
                href="#protocols"
                className="group btn-spring btn-cta-sheen inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-full text-sm font-semibold text-[#FAF6F0] bg-[#E85D04] hover:bg-[#D14F00] whitespace-nowrap shrink-0 shadow-[0_14px_30px_-14px_rgba(232,93,4,0.62)] hover:shadow-[0_18px_36px_-14px_rgba(232,93,4,0.78)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
              >
                <span className="relative z-10">Explore Protocols</span>
                <ArrowDownRight
                  className="relative z-10 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>

              <a
                href="https://github.com/NexTechArchitect"
                target="_blank"
                rel="noopener noreferrer"
                className="group btn-spring inline-flex items-center justify-center gap-1.5 min-h-[44px] px-6 py-2.5 rounded-full text-sm font-semibold text-[#16100C] bg-[#F2E9DD]/92 hover:bg-[#EAE0D2] whitespace-nowrap shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_24px_-18px_rgba(20,14,11,0.34)] hover:shadow-[0_14px_28px_-16px_rgba(232,93,4,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
              >
                <span>GitHub</span>
                <ArrowUpRight
                  className="w-4 h-4 text-[#C84B04] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </motion.div>

            {/* 5. Direct Social & Contact Row */}
            <motion.div
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 16 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.42, ease: LUXURY_EASE }}
              className="mt-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-5 gap-y-2 text-[13.5px] font-medium text-[#4A3F37] will-change-transform"
            >
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/in/amit-kumar-811a11277"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 hover:text-[#C84B04] transition-colors whitespace-nowrap"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 opacity-75 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
                <span aria-hidden="true" className="text-[#C84B04]/60">
                  ·
                </span>
                <a
                  href="https://x.com/itZ_AmiT0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 hover:text-[#C84B04] transition-colors whitespace-nowrap"
                >
                  <span>X (Twitter)</span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 opacity-75 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
              <span
                aria-hidden="true"
                className="hidden sm:inline text-[#C84B04]/60"
              >
                ·
              </span>
              <a
                href="mailto:nextech.amit@gmail.com"
                className="group inline-flex items-center gap-1.5 hover:text-[#C84B04] transition-colors whitespace-nowrap"
              >
                <Mail
                  className="w-3.5 h-3.5 text-[#C84B04] transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span>nextech.amit@gmail.com</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Subtle Vertical Parallax Float + Refined Editorial Entrance */}
          <motion.div
            style={prefersReducedMotion ? undefined : { y: avatarY }}
            className="lg:col-span-5 relative z-20 flex flex-col items-center will-change-transform"
          >
            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, x: isMobile ? 16 : 28, scale: 0.96 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.72, delay: 0.14, ease: LUXURY_EASE }}
              className="relative w-full flex flex-col items-center justify-center will-change-transform"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full opacity-90 z-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 48%, rgba(244, 140, 6, 0.16) 0%, rgba(232, 93, 4, 0.08) 44%, rgba(250, 246, 240, 0) 74%)",
                }}
              />
              <div className="relative z-10 w-full flex flex-col items-center">
                <AmitAvatar3D
                  onOpenGallery={onOpenGallery}
                  onInspectYulGas={onInspectYulGas}
                  onOpenResume={onOpenResume}
                  onAskAnything={openAgent}
                  onScrollToContact={handleScrollToContact}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* All 12 Skill Pills — Clean Wave Reveal with Flicker-Free Replay */}
        <div
          data-testid="hero-core-skills"
          aria-label="Core engineering skills"
          className="mt-10 lg:mt-12"
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {CORE_SKILLS.map((skill, idx) => (
              <motion.li
                key={skill}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 18, scale: 0.97 }
                }
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={REPLAY_VIEWPORT}
                whileHover={
                  prefersReducedMotion || isMobile
                    ? undefined
                    : {
                        y: -3,
                        transition: {
                          type: "spring",
                          stiffness: 380,
                          damping: 22,
                        },
                      }
                }
                transition={{
                  duration: 0.55,
                  delay: idx * 0.03,
                  ease: LUXURY_EASE,
                }}
                className="flex items-center justify-center text-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full bg-[#F3EAE0]/88 hover:bg-[#FFFDF9] text-[12px] sm:text-[12.5px] font-medium text-[#4A3F37] hover:text-[#16100C] leading-snug shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_26px_-18px_rgba(20,14,11,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_16px_32px_-14px_rgba(232,93,4,0.32)] transition-[background-color,color,box-shadow] duration-200 will-change-transform cursor-default"
              >
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-[#E85D04] shrink-0"
                />
                <span>{skill}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transition #1: Pure Filled Sculptural Horizon Sweep (#FAF6F0 -> #140E0B) */}
      <ScrollHorizonSweep
        idPrefix="hero-to-arch"
        bottomFill="#140E0B"
        className="mt-8 sm:mt-12"
      />
    </section>
  );
}
