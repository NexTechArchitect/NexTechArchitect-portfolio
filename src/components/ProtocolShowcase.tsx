"use client";

import React, { useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
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
  SheetSilkCrest,
  SweepingRibbonCurve,
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
  onOpenCaseStudy: (project: ProjectItem) => void;
  onAskAmit: (project: ProjectItem) => void;
}

function FlagshipCard({
  project,
  index,
  darkVariant = false,
  onOpenCaseStudy,
  onAskAmit,
}: FlagshipCardProps) {
  const prefersReducedMotion = useReducedMotion();
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
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      el.style.setProperty("--mx", `${relX}px`);
      el.style.setProperty("--my", `${relY}px`);
      if (!prefersReducedMotion) {
        mx.set(relX / rect.width - 0.5);
        my.set(relY / rect.height - 0.5);
      }
    },
    [mx, my, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const Icon = PROJECT_ICON_MAP[project.iconKey] || Cpu;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: 0.54,
        delay: (index % 2) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1200 }}
      className="h-full"
    >
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          prefersReducedMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        className={`h-full rounded-[34px] sm:rounded-[38px] p-6 sm:p-8 flex flex-col justify-between transition-[box-shadow,transform] duration-250 overflow-hidden ${
          darkVariant
            ? "specular-surface-dark bg-[#140E0B] text-[#FAF6F0] shadow-[inset_0_1px_0_rgba(250,246,240,0.1),0_28px_72px_-32px_rgba(20,14,11,0.78)] hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.24),0_32px_80px_-28px_rgba(232,93,4,0.3)]"
            : "specular-surface bg-[#FFFDF9] text-[#16100C] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_24px_60px_-34px_rgba(20,14,11,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_30px_68px_-30px_rgba(232,93,4,0.24)]"
        }`}
      >
        <div className="relative z-10">
          {/* Top Metadata Line */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono-tabular">
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
          </div>

          {/* Icon + Title + Security Highlight */}
          <div className="mt-5 flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                darkVariant
                  ? "bg-[#221813] text-[#FF6B1A] shadow-[inset_0_1px_0_rgba(250,246,240,0.1)]"
                  : "bg-[#F3EAE0] text-[#E85D04] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
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
                  darkVariant ? "text-[#FF6B1A]" : "text-[#C84B04]"
                }`}
              >
                {project.metric}
              </p>
            </div>
          </div>

          {/* Complete Editorial Description */}
          <p
            className={`mt-4 text-sm sm:text-[15px] leading-[1.68] ${
              darkVariant ? "text-[#D8CEC4]" : "text-[#4A3F37]"
            }`}
          >
            {project.description}
          </p>

          {/* Uniform Architectural Contract Rows (Zero Straight Divider Line) */}
          {project.contracts && project.contracts.length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-2">
                {project.contracts.map((contract) => (
                  <div
                    key={contract.label}
                    className={`rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 ${
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

          {/* Unboxed Stack Row */}
          <p
            className={`mt-4 text-xs font-mono-tabular ${
              darkVariant ? "text-[#A69688]" : "text-[#6E5F54]"
            }`}
          >
            {project.tech.join(" · ")}
          </p>
        </div>

        {/* 4 Clean Protocol Actions (Tonal Separation, Zero Straight Divider Line) */}
        <div className="relative z-10 mt-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenCaseStudy(project)}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold hover:-translate-y-0.5 active:scale-[0.98] transition-[background-color,transform] duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
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
              className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2.5 rounded-full text-xs font-semibold border active:scale-[0.98] transition-[border-color,color,transform] duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
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
              darkVariant ? "text-[#D8CEC4]" : "text-[#4A3F37]"
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
  const { explainProtocol } = useAgent();
  const flagshipProjects = getFlagshipProjects();

  // Transition #2: Curved Editorial Sheet Rise (#140E0B -> #FBF8F3) with rising architectural scale & y
  const sheetOuterRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: sheetScroll } = useScroll({
    target: sheetOuterRef,
    offset: ["start end", "start 0.35"],
  });
  const sheetY = useTransform(sheetScroll, [0, 1], [36, 0]);
  const sheetScale = useTransform(sheetScroll, [0, 1], [0.975, 1]);

  // Archive Stage (#1B120D) rising depth
  const archiveStageRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: archiveScroll } = useScroll({
    target: archiveStageRef,
    offset: ["start end", "start 0.32"],
  });
  const archiveY = useTransform(archiveScroll, [0, 1], [32, 0]);
  const archiveScale = useTransform(archiveScroll, [0, 1], [0.975, 1]);

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
      {/* Outer #140E0B backdrop guarantees exact hex parity behind the sculpted upper rounded corners */}
      <div
        ref={sheetOuterRef}
        className="relative bg-[#140E0B] -mt-[2px] overflow-x-clip"
      >
        <SheetSilkCrest idPrefix="arch-to-protocols" />

        {/* Section 3: Curved Editorial Sheet Rise on Luminous Warm Porcelain (#FBF8F3) */}
        <motion.section
          id="protocols"
          style={
            prefersReducedMotion
              ? undefined
              : { y: sheetY, scale: sheetScale, transformOrigin: "top center" }
          }
          className="relative z-10 bg-[#FBF8F3] text-[#16100C] silk-grain rounded-t-[44px] md:rounded-t-[72px] pt-14 sm:pt-20 scroll-mt-24 overflow-x-clip shadow-[0_-28px_72px_-26px_rgba(10,6,4,0.52)] will-change-transform"
        >
          {/* Subtle edge-hugging warm apricot/bronze ambient light washes with GPU silk drift */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-16 right-[-8%] w-[520px] h-[620px] rounded-full opacity-55 ambient-silk-drift"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(217, 119, 54, 0.12) 0%, rgba(251, 248, 243, 0) 72%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-28 left-[-10%] w-[460px] h-[540px] rounded-full opacity-45 ambient-silk-drift-reverse"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(244, 140, 6, 0.1) 0%, rgba(251, 248, 243, 0) 72%)",
            }}
          />

          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Left-Aligned Staggered Editorial Header (Zero Straight Line) */}
            <div className="max-w-3xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-bold text-[#16100C] text-3xl sm:text-4xl lg:text-[3rem] leading-[1.05] tracking-[-0.03em]"
                style={{ textWrap: "balance" }}
              >
                Flagship <span className="text-[#E85D04]">Protocols.</span>
              </motion.h2>

              <motion.p
                data-testid="section-subtitle-flagship"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-4 max-w-2xl text-left text-[16px] sm:text-[17.5px] leading-[1.65] font-normal text-[#4A3F37]"
              >
                Inspect deep architectural case studies, launch live
                applications, or ask the protocol assistant to walk through any
                contract system.
              </motion.p>
            </div>

            {/* Perfectly Balanced Equal-Height 2-Column Flagship Grid */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {flagshipProjects.map((project, index) => (
                <FlagshipCard
                  key={project.id}
                  project={project}
                  index={index}
                  darkVariant={index === 1 || index === 2}
                  onOpenCaseStudy={onSelectProject}
                  onAskAmit={(item) => explainProtocol(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Transition #3: Graceful Sweeping Asymmetric Ribbon Curve (#FBF8F3 -> #1B120D) */}
          <SweepingRibbonCurve
            idPrefix="flagship-to-archive"
            bottomFill="#1B120D"
            className="mt-16 sm:mt-24"
          />
        </motion.section>
      </div>

      {/* Section 4: Archive Environment on Rich Smoked Espresso (#1B120D) */}
      <section
        ref={archiveStageRef}
        id="archive"
        data-testid="protocol-archive-section"
        className="relative bg-[#1B120D] text-[#FAF6F0] silk-grain-dark pt-12 sm:pt-16 lg:pt-20 pb-24 sm:pb-32 scroll-mt-24 overflow-x-clip"
      >
        {/* Soft Copper-Amber Edge & Studio Illumination with GPU silk drift */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-[-6%] w-[540px] h-[540px] rounded-full opacity-40 ambient-silk-drift"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.24) 0%, rgba(217, 119, 54, 0.1) 46%, rgba(27, 18, 13, 0) 74%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-20 right-[-6%] w-[520px] h-[520px] rounded-full opacity-35 ambient-silk-drift-reverse"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(244, 140, 6, 0.2) 0%, rgba(200, 90, 23, 0.08) 46%, rgba(27, 18, 13, 0) 74%)",
          }}
        />

        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : {
                  y: archiveY,
                  scale: archiveScale,
                  transformOrigin: "top center",
                }
          }
          className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 will-change-transform"
        >
          {/* Left-Aligned Staggered Editorial Header (Zero Straight Line) */}
          <div className="max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold text-[#FAF6F0] text-3xl sm:text-4xl lg:text-[2.85rem] leading-[1.06] tracking-[-0.03em]"
              style={{ textWrap: "balance" }}
            >
              Explore Full-Stack &amp;{" "}
              <span className="text-[#FF6B1A]">Core EVM Systems.</span>
            </motion.h2>

            <motion.p
              data-testid="section-subtitle-archive"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 max-w-2xl text-left text-[16px] sm:text-[17.5px] leading-[1.65] font-normal text-[#D8CEC4]"
            >
              Browse every production dApp and standalone EVM contract primitive
              with live search, case study breakdowns, and interactive agent
              explanations.
            </motion.p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Portal 1: Full-Stack Web3 Protocols */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 0.54, ease: [0.22, 1, 0.36, 1] }}
              onMouseMove={handlePortalSpecular}
              className="specular-surface overflow-hidden group rounded-[36px] sm:rounded-[40px] bg-[#FBF8F3] text-[#16100C] hover:-translate-y-1 p-7 sm:p-9 lg:p-10 flex flex-col justify-between transition-[box-shadow,transform] duration-250 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_30px_72px_-30px_rgba(0,0,0,0.72)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_36px_80px_-28px_rgba(232,93,4,0.32)]"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#E85D04] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
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
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-full bg-[#16100C] hover:bg-[#E85D04] hover:-translate-y-0.5 active:scale-[0.98] text-[#FAF6F0] text-xs sm:text-sm font-semibold transition-[background-color,transform] duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                >
                  <span>Explore Full-Stack Web3 Protocols</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>

            {/* Portal 2: Core EVM Contracts */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{
                duration: 0.54,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseMove={handlePortalSpecular}
              className="specular-surface-dark overflow-hidden group rounded-[36px] sm:rounded-[40px] bg-[#110B08] text-[#FAF6F0] hover:-translate-y-1 p-7 sm:p-9 lg:p-10 flex flex-col justify-between transition-[box-shadow,transform] duration-250 shadow-[inset_0_1px_0_rgba(250,246,240,0.1),0_30px_72px_-30px_rgba(0,0,0,0.84)] hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.24),0_36px_80px_-28px_rgba(232,93,4,0.36)]"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#221610] flex items-center justify-center text-[#FF6B1A] shadow-[inset_0_1px_0_rgba(244,162,97,0.18)]">
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
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-full bg-[#E85D04] hover:bg-[#D14F00] hover:-translate-y-0.5 active:scale-[0.98] text-[#FAF6F0] text-xs sm:text-sm font-semibold transition-[background-color,transform] duration-150 cursor-pointer shadow-[0_14px_30px_-14px_rgba(232,93,4,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6F0]"
                >
                  <span>Explore Core EVM Contracts</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
