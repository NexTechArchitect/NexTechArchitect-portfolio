"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";
import Sculpture4D from "@/components/Sculpture4D";

const PROOF_METRICS = [
  {
    value: "6",
    label: "Production DeFi Systems",
    detail: "Deployed across Base and EVM mainnets",
  },
  {
    value: "O(1)",
    label: "Yul Keeper Queue",
    detail: "Up to 35% execution gas reduction",
  },
  {
    value: "15%",
    label: "Chainlink NAV Breaker",
    detail: "ERC-3643 compliance & halt guards",
  },
  {
    value: "5,000+",
    label: "Foundry Fuzz Runs",
    detail: "Zero high or critical Slither issues",
  },
] as const;

export default function HeroSection() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });

  // Subtle compositor-only 3D perspective stage shift on scroll
  const stageRotateX = useTransform(scrollYProgress, [0, 1], [0, 4.5]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.975]);

  return (
    <section
      id="top"
      ref={stageRef}
      className="relative bg-[#FAF6F0] editorial-drafting-grid pt-20 sm:pt-24 lg:pt-28"
    >
      {/* Subtle warm radial light behind the 4D sculpture stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 right-[4%] w-[520px] h-[520px] rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 140, 6, 0.14) 0%, rgba(232, 93, 4, 0.05) 42%, rgba(250, 246, 240, 0) 72%)",
        }}
      />

      <div className="perspective-stage">
        <motion.div
          style={{
            rotateX: stageRotateX,
            scale: stageScale,
            transformOrigin: "center top",
          }}
          className="max-w-[1180px] mx-auto px-5 sm:px-8"
        >
          {/* 2-Column Editorial Hero Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[480px] lg:min-h-[510px]">
            {/* Left Column: Editorial Typography & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-[13px] sm:text-sm font-medium tracking-[0.01em] text-[#8C7A6B]">
                Amit Kumar <span aria-hidden="true" className="mx-1.5 text-[#E85D04]">·</span> Smart Contract Engineer &amp; Protocol Architect
              </p>

              <h1
                className="mt-4 font-display font-bold text-[#231712] text-[2.65rem] sm:text-[3.4rem] lg:text-[4rem] leading-[1.04] tracking-[-0.025em]"
                style={{ textWrap: "balance" }}
              >
                Engineering Trustless{" "}
                <span className="italic font-semibold text-[#E85D04] block sm:inline">
                  DeFi Infrastructure.
                </span>
              </h1>

              <p className="mt-5 text-[15px] sm:text-[16px] leading-[1.68] text-[#5C4B43] max-w-[54ch]">
                I architect, audit, and deploy multi-contract DeFi, real-world
                asset, and account abstraction systems across Ethereum and
                EVM-compatible mainnets. My work focuses on deterministic
                solvency, storage-safe upgradeability, and gas-efficient
                Solidity and Yul execution.
              </p>

              {/* Primary Actions */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <a
                  href="#protocols"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#FAF6F0] bg-[#E85D04] hover:bg-[#D14F00] active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 shadow-[0_12px_28px_-12px_rgba(232,93,4,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
                >
                  <span>Explore Protocols</span>
                  <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <a
                  href="https://github.com/NexTechArchitect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-semibold text-[#231712] border border-[#231712]/15 bg-[#FFFCF7]/75 hover:border-[#231712]/35 hover:bg-[#FFFCF7] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-4 h-4 text-[#E85D04]" aria-hidden="true" />
                </a>
              </div>

              {/* Clean Direct Social & Contact Row */}
              <div className="mt-6 pt-4 border-t border-[#231712]/12 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-5 gap-y-2 text-[13px] font-medium text-[#5C4B43]">
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.linkedin.com/in/amit-kumar-811a11277"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors whitespace-nowrap"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
                  </a>
                  <span aria-hidden="true" className="text-[#231712]/25">·</span>
                  <a
                    href="https://x.com/itZ_AmiT0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors whitespace-nowrap"
                  >
                    <span>X (Twitter)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
                  </a>
                </div>
                <span aria-hidden="true" className="hidden sm:inline text-[#231712]/25">·</span>
                <a
                  href="mailto:nextech.amit@gmail.com"
                  className="inline-flex items-center gap-1.5 hover:text-[#E85D04] transition-colors whitespace-nowrap"
                >
                  <Mail className="w-3.5 h-3.5 text-[#8C7A6B]" aria-hidden="true" />
                  <span>nextech.amit@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Right Column: 60fps Three.js 4D Kinetic Sculpture */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full h-[330px] sm:h-[400px] lg:h-[460px]">
                <Sculpture4D />
              </div>
              <div className="mt-1 flex items-center gap-3 text-[12px] text-[#8C7A6B] font-mono-tabular">
                <span>Fig. 01</span>
                <span aria-hidden="true">·</span>
                <span>4D Tesseract Projection (XW / YW / ZW)</span>
              </div>
            </div>
          </div>

          {/* Full-Width Architectural Proof Strip (Unboxed Editorial Hairlines) */}
          <div className="mt-8 lg:mt-10 pt-6 pb-4 border-t border-[#231712]/12 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5 lg:pr-28">
            {PROOF_METRICS.map((metric) => (
              <div key={metric.label} className="flex flex-col">
                <span className="font-display font-bold text-3xl sm:text-[34px] leading-none text-[#231712] font-mono-tabular">
                  {metric.value}
                </span>
                <span className="mt-2.5 text-sm font-semibold text-[#231712]">
                  {metric.label}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-[#8C7A6B]">
                  {metric.detail}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sculpted Curved Horizon Architectural Arch Transition (#FAF6F0 -> #F3ECE1) */}
      <div
        aria-hidden="true"
        className="relative w-full mt-6 sm:mt-10 leading-none overflow-hidden"
      >
        <svg
          viewBox="0 0 1440 124"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block w-full h-[62px] sm:h-[94px] lg:h-[118px]"
        >
          {/* Warm Sand architectural vault rising smoothly into the next stage */}
          <path
            d="M0 124V96C340 12 1100 12 1440 96V124H0Z"
            fill="#F3ECE1"
          />
          {/* Fine bronze drafting hairline crowning the arch */}
          <path
            d="M0 96C340 12 1100 12 1440 96"
            stroke="#231712"
            strokeOpacity="0.14"
            strokeWidth="1.25"
          />
        </svg>
      </div>
    </section>
  );
}
