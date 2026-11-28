"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";
import AmitAvatar3D from "@/components/AmitAvatar3D";
import {
  CINEMA_EASE,
  HeroHeaderCanopy,
  HeroSilkWave,
  REPLAY_VIEWPORT,
  ScrollHorizonSweep,
  createOrchestratorVariants,
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

/**
 * Center-Out Diagonal Ripple delay per skill pill in the 4x3 desktop grid.
 * Center pills (row 1, cols 1 & 2) bloom first at 0s, rippling diagonally outward to corners.
 */
const SKILL_RIPPLE_DELAYS = CORE_SKILLS.map((_, idx) => {
  const row = Math.floor(idx / 4);
  const col = idx % 4;
  const dist = Math.hypot(col - 1.5, row - 1.0);
  return Number(((dist - 0.5) * 0.26).toFixed(3));
});

export default function HeroSection({
  onOpenResume,
  onOpenGallery,
  onInspectYulGas,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { openAgent } = useAgent();

  // Stationary outer orchestrator for the 12 skill pills (zero useScroll, zero useInView state)
  const skillsOrchestrator = useMemo(
    () => createOrchestratorVariants(0, 0),
    []
  );

  const skillPillVariants = useMemo<Variants>(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 1, y: 0, scale: 1 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
      };
    }
    return {
      hidden: {
        opacity: 0,
        y: isMobile ? 12 : 20,
        scale: isMobile ? 0.92 : 0.84,
        transition: { duration: 0.2, ease: "easeOut" },
      },
      visible: (rippleDelay: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 1.0,
          delay: isMobile ? Number((rippleDelay * 0.65).toFixed(3)) : rippleDelay,
          ease: CINEMA_EASE,
        },
      }),
    };
  }, [isMobile, prefersReducedMotion]);

  const handleScrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="top"
      className="relative bg-[#FAF6F0] text-[#16100C] silk-grain section-perf"
    >
      {/* Top Dark Espresso-Brown & Diffused Molten-Orange Curved Header Stage Behind Floating Navbar */}
      <HeroHeaderCanopy />

      {/* Lightweight Zero-Blur Pure CSS Radial Gradient Studio Washes (0ms paint cost) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 right-[-6%] w-[520px] h-[480px] rounded-full opacity-55 z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 140, 6, 0.13) 0%, rgba(232, 93, 4, 0.04) 44%, rgba(250, 246, 240, 0) 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-[-10%] w-[440px] h-[480px] rounded-full opacity-40 z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 119, 54, 0.1) 0%, rgba(250, 246, 240, 0) 70%)",
        }}
      />

      {/* Signature Translucent Apricot & Burnt-Orange Silk Wave (Zero Scroll Scrubber) */}
      <HeroSilkWave idPrefix="hero-signature-silk" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Masked Skew-Curtain Reveal + Weighted Slo-Mo Settle */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* 1. Identity Lockup Glides Smoothly (0.04s) */}
            <motion.div
              data-testid="hero-identity-lockup"
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, x: isMobile ? -18 : -40 }
              }
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.15, delay: 0.04, ease: CINEMA_EASE }}
              className="flex flex-wrap items-center gap-x-3 gap-y-2"
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

            {/* 2. Hero 2-Line H1: Masked Skew-Curtain Reveal (y: 105%, skewY: 2.5 -> 0%, 0, 0.12s stagger) */}
            <h1 className="mt-4 font-display font-bold text-[#16100C] text-[30px] sm:text-[36px] lg:text-[42px] leading-[1.12] tracking-[-0.025em] max-w-[26ch]">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  initial={
                    prefersReducedMotion
                      ? false
                      : { y: "105%", skewY: isMobile ? 1.4 : 2.5, opacity: 0.001 }
                  }
                  animate={{ y: "0%", skewY: 0, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.1, ease: CINEMA_EASE }}
                  className="block origin-top-left"
                >
                  I Architect DeFi Protocols
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-1 mt-0.5">
                <motion.span
                  initial={
                    prefersReducedMotion
                      ? false
                      : { y: "105%", skewY: isMobile ? 1.4 : 2.5, opacity: 0.001 }
                  }
                  animate={{ y: "0%", skewY: 0, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.22, ease: CINEMA_EASE }}
                  className="block origin-top-left"
                >
                  Built to{" "}
                  <span className="text-[#E85D04]">Hold Under Fire.</span>
                </motion.span>
              </span>
            </h1>

            {/* 3. Bio Paragraphs Rise Smoothly */}
            <div className="mt-4 space-y-3 text-[15px] sm:text-[16px] leading-[1.66] text-[#4A3F37] max-w-[60ch]">
              <motion.p
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: isMobile ? 14 : 24 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.15, delay: 0.3, ease: CINEMA_EASE }}
              >
                I&apos;m Amit Kumar, a Smart Contract Engineer shipping complete
                DeFi systems across Ethereum and EVM-compatible mainnets, from
                threat model and Solidity architecture through stateful
                invariant testing and the Next.js &amp; Wagmi application on
                top.
              </motion.p>
              <motion.p
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: isMobile ? 14 : 24 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.15, delay: 0.38, ease: CINEMA_EASE }}
                className="text-[#5C4E45]"
              >
                Strongest in the security-critical layer: enforcing compliance
                directly inside token transfer hooks, keeping vault accounting
                consistent under adversarial conditions, and closing attack
                paths at design time rather than patching them after.
              </motion.p>
            </div>

            {/* 4. Primary Actions Settle Smoothly */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: isMobile ? 12 : 22 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.15, delay: 0.44, ease: CINEMA_EASE }}
              className="mt-6 flex flex-wrap items-center gap-3.5"
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
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: isMobile ? 10 : 18 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.15, delay: 0.5, ease: CINEMA_EASE }}
              className="mt-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-5 gap-y-2 text-[13.5px] font-medium text-[#4A3F37]"
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

          {/* Right Column: Silky Depth Zoom-In (scale: 0.85 -> 1, y: 28 -> 0, opacity: 0 -> 1, 1.3s) */}
          <div className="lg:col-span-5 relative z-20 flex flex-col items-center">
            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: isMobile ? 0.9 : 0.85,
                      y: isMobile ? 16 : 28,
                    }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.16, ease: CINEMA_EASE }}
              className="relative w-full flex flex-col items-center justify-center"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full opacity-90 z-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 48%, rgba(244, 140, 6, 0.16) 0%, rgba(232, 93, 4, 0.08) 44%, rgba(250, 246, 240, 0) 70%)",
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
          </div>
        </div>

        {/* All 12 Skill Pills — Center-Out Diagonal Ripple (Stationary Outer Observer, Replayable) */}
        <motion.div
          data-testid="hero-core-skills"
          aria-label="Core engineering skills"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={REPLAY_VIEWPORT}
          variants={skillsOrchestrator}
          className="mt-10 lg:mt-12"
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {CORE_SKILLS.map((skill, idx) => (
              <motion.li
                key={skill}
                custom={SKILL_RIPPLE_DELAYS[idx]}
                variants={skillPillVariants}
                whileHover={
                  prefersReducedMotion || isMobile
                    ? undefined
                    : {
                        y: -3,
                        transition: {
                          type: "spring",
                          stiffness: 360,
                          damping: 22,
                        },
                      }
                }
                className="flex items-center justify-center text-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full bg-[#F3EAE0]/88 hover:bg-[#FFFDF9] text-[12px] sm:text-[12.5px] font-medium text-[#4A3F37] hover:text-[#16100C] leading-snug shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_26px_-18px_rgba(20,14,11,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_16px_32px_-14px_rgba(232,93,4,0.32)] transition-[background-color,color,box-shadow] duration-200 cursor-default"
              >
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-[#E85D04] shrink-0"
                />
                <span>{skill}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
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
