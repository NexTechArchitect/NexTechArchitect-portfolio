"use client";

import React, { useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Award,
  BookOpen,
  Building2,
  Code2,
  Coins,
  Cpu,
  Dices,
  FolderKanban,
  GitBranch,
  Globe,
  Image as ImageIcon,
  KeyRound,
  Landmark,
  Layers,
  Lock,
  MessageSquare,
  RefreshCw,
  Shield,
  Terminal,
} from "lucide-react";
import {
  coreProjects,
  fullStackProjects,
  type ProjectItem,
} from "@/data/projects";
import { getFlagshipProjects } from "@/lib/portfolio";
import { useAgent } from "@/context/AgentContext";

const PROJECT_ICON_MAP: Record<
  ProjectItem["iconKey"],
  React.ComponentType<{ className?: string }>
> = {
  building: Building2,
  cpu: Cpu,
  shield: Shield,
  activity: Activity,
  landmark: Landmark,
  layers: Layers,
  award: Award,
  coins: Coins,
  dice: Dices,
  key: KeyRound,
  refresh: RefreshCw,
  gitbranch: GitBranch,
  image: ImageIcon,
  lock: Lock,
  globe: Globe,
};

interface FlagshipCardProps {
  project: ProjectItem;
  darkVariant?: boolean;
  onOpenCaseStudy: (project: ProjectItem) => void;
  onAskAmit: (project: ProjectItem) => void;
}

function FlagshipCard({
  project,
  darkVariant = false,
  onOpenCaseStudy,
  onAskAmit,
}: FlagshipCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = { stiffness: 240, damping: 26 };
  const rotateX = useSpring(
    useTransform(my, [-0.5, 0.5], [3, -3]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mx, [-0.5, 0.5], [-3, 3]),
    springConfig
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my]
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const Icon = PROJECT_ICON_MAP[project.iconKey] || Cpu;

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`h-full rounded-[28px] p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 border ${
          darkVariant
            ? "bg-[#140E0B] text-[#FAF6F0] border-[#FAF6F0]/12 shadow-[0_24px_64px_-32px_rgba(20,14,11,0.72)]"
            : "bg-[#FFFCF7] text-[#140E0B] border-[#140E0B]/12 shadow-[0_20px_54px_-36px_rgba(20,14,11,0.24)] hover:border-[#E85D04]/45"
        }`}
      >
        <div>
          {/* Top Metadata Line (zero count numbers) */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono-tabular">
            <span
              className={
                darkVariant
                  ? "text-[#D96B27] font-semibold"
                  : "text-[#E85D04] font-semibold"
              }
            >
              {project.network}
              <span
                aria-hidden="true"
                className={
                  darkVariant
                    ? "mx-1.5 text-[#FAF6F0]/25"
                    : "mx-1.5 text-[#140E0B]/25"
                }
              >
                ·
              </span>
              <span
                className={darkVariant ? "text-[#C9BDB3]" : "text-[#7D6C61]"}
              >
                {project.standard}
              </span>
            </span>
          </div>

          {/* Icon + Title + Security Highlight */}
          <div className="mt-5 flex items-start gap-4">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                darkVariant
                  ? "bg-[#221813] border-[#FAF6F0]/12 text-[#E85D04]"
                  : "bg-[#F5EFE6] border-[#140E0B]/10 text-[#E85D04]"
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.025em] leading-snug">
                {project.title}
              </h3>
              <p
                className={`mt-1 text-xs font-mono-tabular font-medium ${
                  darkVariant ? "text-[#D96B27]" : "text-[#B84700]"
                }`}
              >
                {project.metric}
              </p>
            </div>
          </div>

          {/* Complete Editorial Description */}
          <p
            className={`mt-4 text-sm sm:text-[15px] leading-[1.68] ${
              darkVariant ? "text-[#C9BDB3]" : "text-[#594A42]"
            }`}
          >
            {project.description}
          </p>

          {/* Uniform Architectural Contract Rows (zero truncation) */}
          {project.contracts && project.contracts.length > 0 && (
            <div
              className={`mt-5 pt-4 border-t ${
                darkVariant ? "border-[#FAF6F0]/10" : "border-[#140E0B]/10"
              }`}
            >
              <div className="grid grid-cols-1 gap-2">
                {project.contracts.map((contract) => (
                  <div
                    key={contract.label}
                    className={`rounded-xl px-3.5 py-2.5 border flex items-center justify-between gap-3 ${
                      darkVariant
                        ? "bg-[#221813]/85 border-[#FAF6F0]/10"
                        : "bg-[#F5EFE6]/75 border-[#140E0B]/8"
                    }`}
                  >
                    <p
                      className={`font-mono-tabular text-[11px] font-semibold ${
                        darkVariant ? "text-[#FAF6F0]" : "text-[#140E0B]"
                      }`}
                    >
                      {contract.label}
                    </p>
                    <p
                      className={`text-[11px] text-right ${
                        darkVariant ? "text-[#A8988B]" : "text-[#7D6C61]"
                      }`}
                    >
                      {contract.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unboxed Stack Row */}
          <p
            className={`mt-4 text-xs font-mono-tabular ${
              darkVariant ? "text-[#9C8B7E]" : "text-[#7D6C61]"
            }`}
          >
            {project.tech.join(" · ")}
          </p>
        </div>

        {/* 4 Clean Protocol Actions */}
        <div
          className={`mt-6 pt-5 border-t flex flex-wrap items-center justify-between gap-3 ${
            darkVariant ? "border-[#FAF6F0]/10" : "border-[#140E0B]/10"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenCaseStudy(project)}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
                darkVariant
                  ? "bg-[#E85D04] hover:bg-[#D14F00] text-[#FAF6F0]"
                  : "bg-[#140E0B] hover:bg-[#E85D04] text-[#FAF6F0]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Open Case Study</span>
            </button>

            <button
              type="button"
              onClick={() => onAskAmit(project)}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
                darkVariant
                  ? "border-[#FAF6F0]/18 bg-[#221813] text-[#FAF6F0] hover:border-[#E85D04] hover:text-[#E85D04]"
                  : "border-[#140E0B]/15 bg-[#FAF6F0] text-[#140E0B] hover:border-[#E85D04] hover:text-[#E85D04]"
              }`}
            >
              <MessageSquare
                className="w-3.5 h-3.5 text-[#E85D04]"
                aria-hidden="true"
              />
              <span>Ask Amit</span>
            </button>
          </div>

          <div
            className={`flex items-center gap-4 text-xs font-semibold ${
              darkVariant ? "text-[#D9CFC6]" : "text-[#594A42]"
            }`}
          >
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Live App</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors whitespace-nowrap shrink-0"
            >
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

interface ProtocolShowcaseProps {
  onSelectProject: (project: ProjectItem) => void;
  onOpenArchive: (type: "fullstack" | "core") => void;
}

export default function ProtocolShowcase({
  onSelectProject,
  onOpenArchive,
}: ProtocolShowcaseProps) {
  const { explainProtocol } = useAgent();
  const flagshipProjects = getFlagshipProjects();

  return (
    <>
      {/* Section 3: Flagship Protocols on Crisp Warm Porcelain (#FAF6F0) */}
      <section
        id="protocols"
        className="relative bg-[#FAF6F0] text-[#140E0B] silk-grain pt-10 sm:pt-14 scroll-mt-16 overflow-x-clip"
      >
        {/* Subtle bronze luminous depth behind protocol gallery */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 right-[-6%] w-[560px] h-[560px] rounded-full opacity-55"
          style={{
            background:
              "radial-gradient(circle, rgba(217, 107, 39, 0.12) 0%, rgba(250, 246, 240, 0) 72%)",
          }}
        />

        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Editorial Header (Scale & Rise Entrance, Zero Eyebrow Kicker) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-10 border-b border-[#140E0B]/10"
          >
            <div className="lg:col-span-7">
              <h2
                className="font-display font-bold text-[#140E0B] text-3xl sm:text-4xl lg:text-[2.95rem] leading-[1.05] tracking-[-0.03em]"
                style={{ textWrap: "balance" }}
              >
                Flagship <span className="text-[#E85D04]">Protocols.</span>
              </h2>
            </div>

            <div className="lg:col-span-5 lg:text-right">
              <p className="text-sm sm:text-[15px] leading-[1.7] text-[#594A42] lg:ml-auto max-w-[44ch]">
                Inspect deep architectural case studies, launch live
                applications, or ask the protocol assistant to walk through any
                contract system.
              </p>
            </div>
          </motion.div>

          {/* Perfectly Balanced Equal-Height 2-Column Flagship Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {flagshipProjects.map((project, index) => (
              <FlagshipCard
                key={project.id}
                project={project}
                darkVariant={index === 1 || index === 2}
                onOpenCaseStudy={onSelectProject}
                onAskAmit={(item) => explainProtocol(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Transition #3: Sculpted Sweeping Curve (#FAF6F0 -> #1B120D Rich Roasted Espresso Archive) */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative w-full mt-16 sm:mt-24 leading-none overflow-hidden"
        >
          <svg
            viewBox="0 0 1440 124"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="block w-full h-[66px] sm:h-[96px] lg:h-[120px]"
          >
            <defs>
              <linearGradient
                id="archiveTopCopperStroke"
                x1="0"
                y1="0"
                x2="1440"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#C85A17" stopOpacity="0.14" />
                <stop offset="35%" stopColor="#E85D04" stopOpacity="0.65" />
                <stop offset="65%" stopColor="#F48C06" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#C85A17" stopOpacity="0.14" />
              </linearGradient>
            </defs>
            <path
              d="M0 124V46C340 116 1100 10 1440 84V124H0Z"
              fill="#1B120D"
            />
            <path
              d="M0 46C340 116 1100 10 1440 84"
              stroke="url(#archiveTopCopperStroke)"
              strokeWidth="1.7"
            />
          </svg>
        </div>
      </section>

      {/* Section 4: Dedicated Archive Environment on Rich Roasted Espresso (#1B120D) */}
      <section
        id="archive"
        data-testid="protocol-archive-section"
        className="relative bg-[#1B120D] text-[#FAF6F0] silk-grain-dark pt-12 sm:pt-16 lg:pt-20 scroll-mt-16 overflow-x-clip"
      >
        {/* Subtle Copper-Amber Ambient Studio Illumination */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 left-[10%] w-[560px] h-[420px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(232, 93, 4, 0.24) 0%, rgba(217, 107, 39, 0.1) 44%, rgba(27, 18, 13, 0) 74%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-24 right-[6%] w-[520px] h-[400px] rounded-full opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(244, 140, 6, 0.2) 0%, rgba(200, 90, 23, 0.08) 46%, rgba(27, 18, 13, 0) 74%)",
          }}
        />

        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-10 border-b border-[#FAF6F0]/12">
            <div className="lg:col-span-7">
              <h2
                className="font-display font-bold text-[#FAF6F0] text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.06] tracking-[-0.03em]"
                style={{ textWrap: "balance" }}
              >
                Explore Full-Stack &amp;{" "}
                <span className="text-[#E85D04]">Core EVM Systems.</span>
              </h2>
            </div>

            <div className="lg:col-span-5 lg:text-right">
              <p className="text-sm sm:text-[15px] leading-[1.7] text-[#C9BDB3] lg:ml-auto max-w-[44ch]">
                Browse every production dApp and standalone EVM contract
                primitive with live search, case study breakdowns, and
                interactive agent explanations.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Portal 1: Full-Stack Web3 Protocols (Warm Porcelain Luxury Portal on Dark Stage) */}
            <div className="group rounded-[28px] bg-[#FAF6F0] text-[#140E0B] border border-[#FAF6F0]/20 hover:border-[#E85D04]/70 p-6 sm:p-8 lg:p-9 flex flex-col justify-between transition-[border-color,box-shadow] duration-200 shadow-[0_28px_68px_-30px_rgba(0,0,0,0.68)] hover:shadow-[0_32px_74px_-28px_rgba(232,93,4,0.28)]">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#EFE6DA] border border-[#140E0B]/10 flex items-center justify-center text-[#E85D04]">
                    <FolderKanban className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="font-mono-tabular text-xs font-semibold text-[#7D6C61]">
                    Warm Porcelain Atelier
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl sm:text-[1.65rem] font-bold text-[#140E0B] tracking-[-0.025em]">
                  Full-Stack Web3 Protocols
                </h3>
                <p className="mt-2.5 text-sm sm:text-[15px] leading-[1.68] text-[#594A42]">
                  End-to-end DeFi, RWA, keeper automation, insurance,
                  governance, and on-chain reputation protocols pairing audited
                  Solidity cores with live Next.js and Wagmi interfaces.
                </p>

                <p className="mt-5 pt-4 border-t border-[#140E0B]/10 text-xs font-mono-tabular text-[#594A42] leading-relaxed">
                  {fullStackProjects.map((p) => p.shortTitle).join(" · ")}
                </p>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => onOpenArchive("fullstack")}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-full bg-[#140E0B] hover:bg-[#E85D04] active:scale-[0.98] text-[#FAF6F0] text-xs sm:text-sm font-semibold transition-[background-color,transform] duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                >
                  <span>Explore Full-Stack Web3 Protocols</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Portal 2: Core EVM Contracts (Obsidian Copper Vault Portal on Dark Stage) */}
            <div className="group rounded-[28px] bg-[#100A07] text-[#FAF6F0] border border-[#E85D04]/25 hover:border-[#E85D04]/70 p-6 sm:p-8 lg:p-9 flex flex-col justify-between transition-[border-color,box-shadow] duration-200 shadow-[0_28px_68px_-30px_rgba(0,0,0,0.8)] hover:shadow-[0_32px_74px_-28px_rgba(232,93,4,0.32)]">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#221610] border border-[#E85D04]/25 flex items-center justify-center text-[#F48C06]">
                    <Terminal className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="font-mono-tabular text-xs font-semibold text-[#D96B27]">
                    Obsidian Copper Lab
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl sm:text-[1.65rem] font-bold text-[#FAF6F0] tracking-[-0.025em]">
                  Core EVM Contracts
                </h3>
                <p className="mt-2.5 text-sm sm:text-[15px] leading-[1.68] text-[#C9BDB3]">
                  Focused Solidity and Foundry engineering covering CDP
                  stablecoins, Chainlink VRF state machines, ERC-4337 EntryPoint
                  smart accounts, UUPS proxies, and Merkle-712 claim vaults.
                </p>

                <p className="mt-5 pt-4 border-t border-[#FAF6F0]/10 text-xs font-mono-tabular text-[#A8988B] leading-relaxed">
                  {coreProjects.map((p) => p.shortTitle).join(" · ")}
                </p>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => onOpenArchive("core")}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-full bg-[#E85D04] hover:bg-[#D14F00] active:scale-[0.98] text-[#FAF6F0] text-xs sm:text-sm font-semibold transition-[background-color,transform] duration-150 cursor-pointer shadow-[0_14px_30px_-14px_rgba(232,93,4,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6F0]"
                >
                  <span>Explore Core EVM Contracts</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transition #4: Sculpted Curved Transition (#1B120D -> #F3EAE0 Luminous Warm Sand Alabaster Workbench) */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative w-full mt-16 sm:mt-24 leading-none overflow-hidden"
        >
          <svg
            viewBox="0 0 1440 124"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="block w-full h-[66px] sm:h-[96px] lg:h-[120px]"
          >
            <defs>
              <linearGradient
                id="archiveBottomCopperStroke"
                x1="0"
                y1="0"
                x2="1440"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#D96B27" stopOpacity="0.14" />
                <stop offset="32%" stopColor="#E85D04" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#F48C06" stopOpacity="0.82" />
                <stop offset="68%" stopColor="#E85D04" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#D96B27" stopOpacity="0.14" />
              </linearGradient>
            </defs>
            <path
              d="M0 124V94C360 12 1080 12 1440 94V124H0Z"
              fill="#F3EAE0"
            />
            <path
              d="M0 94C360 12 1080 12 1440 94"
              stroke="url(#archiveBottomCopperStroke)"
              strokeWidth="1.7"
            />
          </svg>
        </div>
      </section>
    </>
  );
}
