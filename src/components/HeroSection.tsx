"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";
import AmitAvatar3D from "@/components/AmitAvatar3D";
import { useAgent } from "@/context/AgentContext";

interface HeroSectionProps {
  onOpenResume: () => void;
  onOpenGallery: () => void;
  onInspectYulGas: () => void;
}

const CAPABILITY_ITEMS = [
  "Solidity & Yul",
  "Threat Modeling & Invariant Testing",
  "ERC-3643 / ERC-4626 / ERC-4337",
  "Chainlink & Aave V3",
  "Next.js & Wagmi",
] as const;

export default function HeroSection({
  onOpenResume,
  onOpenGallery,
  onInspectYulGas,
}: HeroSectionProps) {
  const { openAgent } = useAgent();
  const heroRef = useRef<HTMLElement | null>(null);

  // Transition #1: Scroll-Reactive Dynamic Horizon Curve that subtly flattens & widens
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const horizonScaleY = useTransform(scrollYProgress, [0, 1], [1.14, 0.48]);
  const horizonScaleX = useTransform(scrollYProgress, [0, 1], [1.0, 1.07]);

  const handleScrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative bg-[#FAF6F0] silk-grain overflow-x-clip"
    >
      {/* Top Architectural Canopy: Deep Obsidian Espresso (#140E0B) -> Warm Ivory (#FAF6F0) Concave Curve & Burnt-Orange Rim */}
      <div
        aria-hidden="true"
        data-testid="hero-top-canopy"
        className="pointer-events-none relative w-full bg-[#140E0B] silk-grain-dark overflow-hidden"
      >
        <div
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[72%] max-w-[980px] h-[170px] rounded-full opacity-45"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.28) 0%, rgba(217, 107, 39, 0.1) 48%, rgba(20, 14, 11, 0) 76%)",
          }}
        />
        {/* Upper Dark Espresso Band Framing the Floating Navbar */}
        <div className="h-[92px] sm:h-[104px] lg:h-[110px]" />

        {/* Concave Dark-to-Light Curve & Glowing Burnt-Orange Hairline */}
        <div className="pointer-events-none relative w-full leading-none">
          <svg
            viewBox="0 0 1440 124"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="pointer-events-none block w-full h-[46px] sm:h-[58px] lg:h-[68px]"
          >
            <defs>
              <linearGradient
                id="topCanopyRimStroke"
                x1="0"
                y1="0"
                x2="1440"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#D96B27" stopOpacity="0.16" />
                <stop offset="28%" stopColor="#E85D04" stopOpacity="0.72" />
                <stop offset="50%" stopColor="#F48C06" stopOpacity="0.95" />
                <stop offset="72%" stopColor="#E85D04" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#D96B27" stopOpacity="0.16" />
              </linearGradient>
            </defs>
            <path
              d="M0 124V92C360 10 1080 10 1440 92V124H0Z"
              fill="#FAF6F0"
            />
            <path
              d="M0 92C360 10 1080 10 1440 92"
              stroke="url(#topCanopyRimStroke)"
              strokeWidth="2.2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      {/* Organic layered apricot & warm amber studio light diffusion */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-28 right-[-6%] w-[640px] h-[640px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 140, 6, 0.15) 0%, rgba(232, 93, 4, 0.07) 38%, rgba(250, 246, 240, 0) 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 left-[-10%] w-[520px] h-[520px] rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 107, 39, 0.11) 0%, rgba(250, 246, 240, 0) 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6">
        {/* 2-Column Editorial Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px] lg:min-h-[500px]">
          {/* Left Column: Commanding Upright Sora Typography & Humanized Senior Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-[13px] sm:text-sm font-mono-tabular tracking-[0.04em] text-[#7D6C61]">
              Amit Kumar{" "}
              <span aria-hidden="true" className="mx-1.5 text-[#E85D04]">
                ·
              </span>{" "}
              Smart Contract Engineer &amp; DeFi Protocol Architect
            </p>

            <h1 className="mt-4 font-display font-bold text-[#140E0B] text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] leading-[1.03] lg:leading-[1.01] tracking-[-0.035em]">
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

            {/* Unboxed Capability Strip */}
            <p className="mt-6 pt-4 border-t border-[#140E0B]/10 text-[12.5px] sm:text-[13px] font-mono-tabular leading-relaxed text-[#6C5B52]">
              {CAPABILITY_ITEMS.join(" · ")}
            </p>

            {/* Clean Direct Social & Contact Row */}
            <div className="mt-3.5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-5 gap-y-2 text-[13px] font-medium text-[#594A42]">
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
                <span aria-hidden="true" className="text-[#140E0B]/20">
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
                className="hidden sm:inline text-[#140E0B]/20"
              >
                ·
              </span>
              <a
                href="mailto:nextech.amit@gmail.com"
                className="inline-flex items-center gap-1.5 hover:text-[#E85D04] transition-colors whitespace-nowrap"
              >
                <Mail
                  className="w-3.5 h-3.5 text-[#7D6C61]"
                  aria-hidden="true"
                />
                <span>nextech.amit@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Right Column: Floating 3D Character + Dynamic Rotating Spotlight Card */}
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
      </div>

      {/* Transition #1: Scroll-Reactive Dynamic Horizon Curve (#FAF6F0 -> #140E0B) */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative w-full mt-4 sm:mt-8 leading-none overflow-hidden"
      >
        <motion.div
          style={{
            scaleY: horizonScaleY,
            scaleX: horizonScaleX,
            transformOrigin: "bottom center",
          }}
          className="w-full will-change-transform"
        >
          <svg
            viewBox="0 0 1440 132"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="block w-full h-[68px] sm:h-[98px] lg:h-[126px]"
          >
            <defs>
              <linearGradient
                id="heroCopperSheen"
                x1="0"
                y1="0"
                x2="1440"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#D96B27" stopOpacity="0.1" />
                <stop offset="32%" stopColor="#E85D04" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#F48C06" stopOpacity="0.88" />
                <stop offset="68%" stopColor="#E85D04" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#D96B27" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M0 132V104C340 12 1100 12 1440 104V132H0Z"
              fill="#140E0B"
            />
            <path
              d="M0 104C340 12 1100 12 1440 104"
              stroke="url(#heroCopperSheen)"
              strokeWidth="1.6"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
