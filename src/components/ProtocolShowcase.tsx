"use client";

import React, { useCallback, useMemo, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
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
import {
  CARD_VIEWPORT,
  CINEMA_EASE,
  REPLAY_VIEWPORT,
  SheetSilkCrest,
  SweepingRibbonCurve,
  createCinemaVariants,
  createOrchestratorVariants,
  useIsMobile,
} from "@/components/SectionCurves";
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
  index: number;
  darkVariant?: boolean;
  isMobile: boolean;
  onOpenCaseStudy: (project: ProjectItem) => void;
  onAskAmit: (project: ProjectItem) => void;
}

function FlagshipCard({
  project,
  index,
  darkVariant = false,
  isMobile,
  onOpenCaseStudy,
  onAskAmit,
}: FlagshipCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    },
    []
  );

  const Icon = PROJECT_ICON_MAP[project.iconKey] || Cpu;
  // Alternating Diagonal Banking Arcs: Cards 1 & 3 bank from Left (-72, +46, -2deg), Cards 2 & 4 bank from Right (+72, +46, +2deg)
  const isFromLeft = index % 2 === 0;

  const outerOrchestrator = useMemo(() => createOrchestratorVariants(0, 0), []);

  const cardVariants = useMemo(
    () =>
      createCinemaVariants({
        x: isFromLeft ? -72 : 72,
        y: 46,
        rotate: isFromLeft ? -2 : 2,
        scale: 0.92,
        duration: 1.35,
        delay: !isMobile && index % 2 === 1 ? 0.1 : 0,
        staggerChildren: 0.08,
        delayChildren: 0.12,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isFromLeft, index, isMobile, prefersReducedMotion]
  );

  const cardInnerVariants = useMemo(
    () =>
      createCinemaVariants({
        y: 18,
        duration: 0.95,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );

  return (
    /* Stationary outer motion.div triggers native Framer Motion whileInView (amount: 0.12) with zero edge flicker */
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={CARD_VIEWPORT}
      variants={outerOrchestrator}
      className="h-full"
    >
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        variants={cardVariants}
        whileHover={
          prefersReducedMotion || isMobile
            ? undefined
            : {
                y: -5,
                transition: { type: "spring", stiffness: 280, damping: 22 },
              }
        }
        className={`group card-sheen-sweep h-full rounded-[34px] sm:rounded-[38px] p-6 sm:p-8 flex flex-col justify-between transition-shadow duration-300 overflow-hidden ${
          darkVariant
            ? "specular-surface-dark bg-[#140E0B] text-[#FAF6F0] shadow-[inset_0_1px_0_rgba(250,246,240,0.1),0_26px_64px_-32px_rgba(20,14,11,0.75)] hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.34),0_38px_84px_-24px_rgba(232,93,4,0.42)]"
            : "specular-surface bg-[#FFFDF9] text-[#16100C] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_22px_54px_-34px_rgba(20,14,11,0.18)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_36px_76px_-24px_rgba(232,93,4,0.34)]"
        }`}
      >
        {/* Soft diagonal light sheen sweeping cleanly across card surface on hover */}
        <span aria-hidden="true" className="card-sheen-beam" />

        <div className="relative z-10">
          {/* Layer 1: Metadata Badge Bloom */}
          <motion.div
            variants={cardInnerVariants}
            className="flex items-center justify-between gap-3 text-xs font-mono-tabular"
          >
            <span
              className={
                darkVariant
                  ? "text-[#FF6B1A] font-semibold"
                  : "text-[#C84B04] font-semibold"
              }
            >
              {project.network}
              <span
                aria-hidden="true"
                className={
                  darkVariant
                    ? "mx-1.5 text-[#FAF6F0]/30"
                    : "mx-1.5 text-[#16100C]/25"
                }
              >
                ·
              </span>
              <span
                className={darkVariant ? "text-[#D8CEC4]" : "text-[#6E5F54]"}
              >
                {project.standard}
              </span>
            </span>
          </motion.div>

          {/* Layer 2: Icon + Title + Security Metric Bloom */}
          <motion.div
            variants={cardInnerVariants}
            className="mt-5 flex items-start gap-4"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 ${
                darkVariant
                  ? "bg-[#221813] text-[#FF6B1A] shadow-[inset_0_1px_0_rgba(250,246,240,0.1)]"
                  : "bg-[#F3EAE0] text-[#E85D04] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
              }`}
            >
              <Icon
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-105"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.025em] leading-snug">
                {project.title}
              </h3>
              <p
                className={`mt-1 text-xs font-mono-tabular font-medium ${
                  darkVariant ? "text-[#FF6B1A]" : "text-[#C84B04]"
                }`}
              >
                {project.metric}
              </p>
            </div>
          </motion.div>

          {/* Layer 3: Editorial Description, Contract Architecture Metrics & Tech Badges Bloom */}
          <motion.div variants={cardInnerVariants}>
            <p
              className={`mt-4 text-sm sm:text-[15px] leading-[1.68] ${
                darkVariant ? "text-[#D8CEC4]" : "text-[#4A3F37]"
              }`}
            >
              {project.description}
            </p>

            {project.contracts && project.contracts.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-1 gap-2">
                  {project.contracts.map((contract) => (
                    <div
                      key={contract.label}
                      className={`rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5 ${
                        darkVariant
                          ? "bg-[#201611]/92 shadow-[inset_0_1px_0_rgba(250,246,240,0.05)]"
                          : "bg-[#F4EDE3]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                      }`}
                    >
                      <p
                        className={`font-mono-tabular text-[11px] font-semibold ${
                          darkVariant ? "text-[#FAF6F0]" : "text-[#16100C]"
                        }`}
                      >
                        {contract.label}
                      </p>
                      <p
                        className={`text-[11px] text-right ${
                          darkVariant ? "text-[#A69688]" : "text-[#6E5F54]"
                        }`}
                      >
                        {contract.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {project.tech.map((techItem) => (
                <span
                  key={techItem}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono-tabular transition-transform duration-150 hover:-translate-y-0.5 ${
                    darkVariant
                      ? "bg-[#211712] text-[#B9ABA0] hover:text-[#FAF6F0]"
                      : "bg-[#F4EDE3]/85 text-[#5D4F46] hover:text-[#16100C]"
                  }`}
                >
                  {techItem}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Layer 4: Protocol Actions Bloom with Tactile Springs & Sheen */}
        <motion.div
          variants={cardInnerVariants}
          className="relative z-10 mt-7 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenCaseStudy(project)}
              className={`btn-spring btn-cta-sheen inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
                darkVariant
                  ? "bg-[#E85D04] hover:bg-[#D14F00] text-[#FAF6F0]"
                  : "bg-[#140E0B] hover:bg-[#E85D04] text-[#FAF6F0]"
              }`}
            >
              <BookOpen
                className="relative z-10 w-3.5 h-3.5"
                aria-hidden="true"
              />
              <span className="relative z-10">Open Case Study</span>
            </button>

            <button
              type="button"
              onClick={() => onAskAmit(project)}
              className={`btn-spring inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
                darkVariant
                  ? "bg-[#241913] text-[#FAF6F0] hover:bg-[#2F2018] hover:text-[#FF6B1A]"
                  : "bg-[#F3EAE0] text-[#140E0B] hover:bg-[#EAE0D2] hover:text-[#C84B04]"
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
              darkVariant ? "text-[#D8CEC4]" : "text-[#4A3F37]"
            }`}
          >
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Live App</span>
                <ArrowUpRight
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            )}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1 hover:text-[#E85D04] transition-colors whitespace-nowrap shrink-0"
            >
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>GitHub</span>
              <ArrowUpRight
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </motion.div>
      </motion.article>
    </motion.div>
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
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { explainProtocol } = useAgent();
  const flagshipProjects = getFlagshipProjects();

  // Flagship Header Masked Curtain Orchestrator
  const flagshipHeaderOrchestrator = useMemo(
    () => createOrchestratorVariants(0, 0),
    []
  );
  const flagshipHeadlineVariants = useMemo(
    () =>
      createCinemaVariants({
        y: "105%",
        duration: 1.2,
        delay: 0,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );
  const flagshipSubtitleVariants = useMemo(
    () =>
      createCinemaVariants({
        y: 26,
        duration: 1.15,
        delay: 0.14,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );

  // Archive Section: Opposing Corner Convergence (Top-Left vs Bottom-Right) + Fan-Out Spread
  const archiveSectionOrchestrator = useMemo(
    () => createOrchestratorVariants(0, 0),
    []
  );
  const archiveTitleVariants = useMemo(
    () =>
      createCinemaVariants({
        x: -40,
        y: -22,
        duration: 1.2,
        delay: 0,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );
  const archiveSubtitleVariants = useMemo(
    () =>
      createCinemaVariants({
        x: 40,
        y: 22,
        duration: 1.2,
        delay: 0.12,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );

  const archiveLeftCardVariants = useMemo<Variants>(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: { duration: 0 },
        },
      };
    }
    return {
      hidden: {
        opacity: 0,
        x: isMobile ? -16 : -36,
        y: isMobile ? 28 : 52,
        rotate: isMobile ? -0.75 : -1.5,
        scale: isMobile ? 0.94 : 0.89,
        transition: { duration: 0.2, ease: "easeOut" },
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: {
          layout: { type: "spring", stiffness: 320, damping: 28 },
          duration: 1.2,
          delay: 0.2,
          ease: CINEMA_EASE,
        },
      },
    };
  }, [isMobile, prefersReducedMotion]);

  const archiveRightCardVariants = useMemo<Variants>(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: { duration: 0 },
        },
      };
    }
    return {
      hidden: {
        opacity: 0,
        x: isMobile ? 16 : 36,
        y: isMobile ? 28 : 52,
        rotate: isMobile ? 0.75 : 1.5,
        scale: isMobile ? 0.94 : 0.89,
        transition: { duration: 0.2, ease: "easeOut" },
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: {
          layout: { type: "spring", stiffness: 320, damping: 28 },
          duration: 1.2,
          delay: 0.3,
          ease: CINEMA_EASE,
        },
      },
    };
  }, [isMobile, prefersReducedMotion]);

  const handlePortalSpecular = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    },
    []
  );

  return (
    <>
      {/* Section 3: Flagship Protocols — Masked Curtain + Alternating Diagonal Banking Arcs */}
      <div
        id="protocols"
        className="relative bg-[#140E0B] -mt-[2px] scroll-mt-24 section-perf"
      >
        <SheetSilkCrest idPrefix="arch-to-protocols" />
        <section
          aria-label="Flagship Protocols"
          className="relative z-10 rounded-t-[36px] sm:rounded-t-[48px] bg-[#FBF8F3] text-[#16100C] silk-grain pt-14 sm:pt-20 overflow-hidden shadow-[0_-24px_60px_-26px_rgba(10,6,4,0.48)] section-perf"
        >
          {/* Lightweight zero-blur pure CSS radial gradient ambient washes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-16 right-[-8%] w-[480px] h-[540px] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(217, 119, 54, 0.11) 0%, rgba(251, 248, 243, 0) 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-28 left-[-10%] w-[420px] h-[480px] rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(244, 140, 6, 0.09) 0%, rgba(251, 248, 243, 0) 70%)",
            }}
          />

          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Masked Editorial Curtain Headline + Soft Subtitle Rise */}
            <motion.div
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView="visible"
              viewport={REPLAY_VIEWPORT}
              variants={flagshipHeaderOrchestrator}
              className="max-w-3xl"
            >
              <div className="overflow-hidden pb-1">
                <motion.h2
                  variants={flagshipHeadlineVariants}
                  className="font-display font-bold text-[#16100C] text-3xl sm:text-4xl lg:text-[3rem] leading-[1.08] tracking-[-0.03em]"
                  style={{ textWrap: "balance" }}
                >
                  Flagship <span className="text-[#E85D04]">Protocols.</span>
                </motion.h2>
              </div>

              <motion.p
                variants={flagshipSubtitleVariants}
                data-testid="section-subtitle-flagship"
                className="mt-4 max-w-2xl text-left text-[16px] sm:text-[17.5px] leading-[1.65] font-normal text-[#4A3F37]"
              >
                Inspect deep architectural case studies, launch live
                applications, or ask the protocol assistant to walk through any
                contract system.
              </motion.p>
            </motion.div>

            {/* Alternating Diagonal Banking Arcs Grid (Cards 1 & 3 Left -2deg, Cards 2 & 4 Right +2deg) */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {flagshipProjects.map((project, index) => (
                <FlagshipCard
                  key={project.id}
                  project={project}
                  index={index}
                  darkVariant={index === 1 || index === 2}
                  isMobile={isMobile}
                  onOpenCaseStudy={onSelectProject}
                  onAskAmit={(item) => explainProtocol(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Transition #3: Pure Filled Sweeping Asymmetric Ribbon Curve (#FBF8F3 -> #1B120D) */}
          <SweepingRibbonCurve
            idPrefix="flagship-to-archive"
            bottomFill="#1B120D"
            className="mt-16 sm:mt-24"
          />
        </section>
      </div>

      {/* Section 4: Archive — Opposing Corner Convergence + Diagonal Fan-Out Spread */}
      <section
        id="archive"
        data-testid="protocol-archive-section"
        aria-label="Full-Stack and Core EVM Archive"
        className="relative -mt-[2px] bg-[#1B120D] text-[#FAF6F0] silk-grain-dark pt-12 sm:pt-16 lg:pt-20 pb-24 sm:pb-32 scroll-mt-24 overflow-hidden section-perf"
      >
        {/* Lightweight zero-blur pure CSS radial gradient copper-amber washes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-[-6%] w-[480px] h-[480px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(232, 93, 4, 0.24) 0%, rgba(217, 119, 54, 0.1) 44%, rgba(27, 18, 13, 0) 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-16 right-[-6%] w-[480px] h-[480px] rounded-full opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(244, 140, 6, 0.2) 0%, rgba(200, 90, 23, 0.08) 44%, rgba(27, 18, 13, 0) 70%)",
          }}
        />

        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={REPLAY_VIEWPORT}
          variants={archiveSectionOrchestrator}
          className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Opposing Corner Convergence: Header Top-Left (-40, -22 -> 0), Subtitle Bottom-Right (+40, +22 -> 0) */}
          <div className="max-w-3xl">
            <motion.h2
              variants={archiveTitleVariants}
              className="font-display font-bold text-[#FAF6F0] text-3xl sm:text-4xl lg:text-[2.85rem] leading-[1.08] tracking-[-0.03em]"
              style={{ textWrap: "balance" }}
            >
              Explore Full-Stack &amp;{" "}
              <span className="text-[#FF6B1A]">Core EVM Systems.</span>
            </motion.h2>

            <motion.p
              variants={archiveSubtitleVariants}
              data-testid="section-subtitle-archive"
              className="mt-4 max-w-2xl text-left text-[16px] sm:text-[17.5px] leading-[1.65] font-normal text-[#D8CEC4]"
            >
              Browse every production dApp and standalone EVM contract primitive
              with live search, case study breakdowns, and interactive agent
              explanations.
            </motion.p>
          </div>

          {/* Opposing Diagonal Fan-Out Spread (x: ±36, y: 52, rotate: ±1.5, scale: 0.89 -> 0, 0, 0, 1) */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Portal 1: Full-Stack Web3 Protocols (Bottom-Left Fan-Out) */}
            <motion.div
              layout
              variants={archiveLeftCardVariants}
              whileHover={
                prefersReducedMotion || isMobile
                  ? undefined
                  : {
                      y: -5,
                      transition: {
                        type: "spring",
                        stiffness: 280,
                        damping: 22,
                      },
                    }
              }
              onMouseMove={handlePortalSpecular}
              className="specular-surface card-sheen-sweep overflow-hidden group rounded-[36px] sm:rounded-[40px] bg-[#FBF8F3] text-[#16100C] p-7 sm:p-9 lg:p-10 flex flex-col justify-between transition-shadow duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_26px_64px_-30px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_34px_76px_-24px_rgba(232,93,4,0.34)]"
            >
              <span aria-hidden="true" className="card-sheen-beam" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#E85D04] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-transform duration-300 group-hover:scale-110">
                    <FolderKanban className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="font-mono-tabular text-xs font-semibold text-[#6E5F54]">
                    Warm Porcelain Atelier
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl sm:text-[1.65rem] font-bold text-[#16100C] tracking-[-0.025em]">
                  Full-Stack Web3 Protocols
                </h3>
                <p className="mt-2.5 text-sm sm:text-[15px] leading-[1.68] text-[#4A3F37]">
                  End-to-end DeFi, RWA, keeper automation, insurance,
                  governance, and on-chain reputation protocols pairing audited
                  Solidity cores with live Next.js and Wagmi interfaces.
                </p>

                <p className="mt-5 rounded-[24px] bg-[#EFE6DA]/82 px-4 py-3.5 text-xs font-mono-tabular text-[#4A3F37] leading-relaxed">
                  {fullStackProjects.map((p) => p.shortTitle).join(" · ")}
                </p>
              </div>

              <div className="relative z-10 mt-8">
                <button
                  type="button"
                  onClick={() => onOpenArchive("fullstack")}
                  className="group/btn btn-spring btn-cta-sheen inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-full bg-[#16100C] hover:bg-[#E85D04] text-[#FAF6F0] text-xs sm:text-sm font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                >
                  <span className="relative z-10">
                    Explore Full-Stack Web3 Protocols
                  </span>
                  <ArrowUpRight
                    className="relative z-10 w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </motion.div>

            {/* Portal 2: Core EVM Contracts (Bottom-Right Fan-Out) */}
            <motion.div
              layout
              variants={archiveRightCardVariants}
              whileHover={
                prefersReducedMotion || isMobile
                  ? undefined
                  : {
                      y: -5,
                      transition: {
                        type: "spring",
                        stiffness: 280,
                        damping: 22,
                      },
                    }
              }
              onMouseMove={handlePortalSpecular}
              className="specular-surface-dark card-sheen-sweep overflow-hidden group rounded-[36px] sm:rounded-[40px] bg-[#110B08] text-[#FAF6F0] p-7 sm:p-9 lg:p-10 flex flex-col justify-between transition-shadow duration-300 shadow-[inset_0_1px_0_rgba(250,246,240,0.1),0_26px_64px_-30px_rgba(0,0,0,0.82)] hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.28),0_34px_76px_-24px_rgba(232,93,4,0.38)]"
            >
              <span aria-hidden="true" className="card-sheen-beam" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#221610] flex items-center justify-center text-[#FF6B1A] shadow-[inset_0_1px_0_rgba(244,162,97,0.18)] transition-transform duration-300 group-hover:scale-110">
                    <Terminal className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="font-mono-tabular text-xs font-semibold text-[#FF6B1A]">
                    Obsidian Copper Lab
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl sm:text-[1.65rem] font-bold text-[#FAF6F0] tracking-[-0.025em]">
                  Core EVM Contracts
                </h3>
                <p className="mt-2.5 text-sm sm:text-[15px] leading-[1.68] text-[#D8CEC4]">
                  Focused Solidity and Foundry engineering covering CDP
                  stablecoins, Chainlink VRF state machines, ERC-4337 EntryPoint
                  smart accounts, UUPS proxies, and Merkle-712 claim vaults.
                </p>

                <p className="mt-5 rounded-[24px] bg-[#1D130E]/92 px-4 py-3.5 text-xs font-mono-tabular text-[#A69688] leading-relaxed shadow-[inset_0_1px_0_rgba(250,246,240,0.05)]">
                  {coreProjects.map((p) => p.shortTitle).join(" · ")}
                </p>
              </div>

              <div className="relative z-10 mt-8">
                <button
                  type="button"
                  onClick={() => onOpenArchive("core")}
                  className="group/btn btn-spring btn-cta-sheen inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-full bg-[#E85D04] hover:bg-[#D14F00] text-[#FAF6F0] text-xs sm:text-sm font-semibold cursor-pointer shadow-[0_14px_30px_-14px_rgba(232,93,4,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6F0]"
                >
                  <span className="relative z-10">
                    Explore Core EVM Contracts
                  </span>
                  <ArrowUpRight
                    className="relative z-10 w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
