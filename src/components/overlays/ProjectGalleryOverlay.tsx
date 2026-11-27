"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Cpu,
  Shield,
  Activity,
  Landmark,
  Layers,
  Award,
  Coins,
  Dices,
  KeyRound,
  RefreshCw,
  GitBranch,
  Image as ImageIcon,
  Lock,
  Globe,
  Search,
  X,
  Code2,
  MessageSquare,
} from "lucide-react";
import type { ProjectItem } from "@/data/projects";
import { filterProjectsByQuery } from "@/lib/portfolio";

const ICON_MAP: Record<
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

function GalleryCard({
  project,
  index,
  isDarkLab,
  onSelect,
  onAskAmit,
}: {
  project: ProjectItem;
  index: number;
  isDarkLab: boolean;
  onSelect: () => void;
  onAskAmit: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 20 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = { stiffness: 250, damping: 24 };
  const rotX = useSpring(
    useTransform(my, [-0.5, 0.5], [5.5, -5.5]),
    springConfig
  );
  const rotY = useSpring(
    useTransform(mx, [-0.5, 0.5], [-5.5, 5.5]),
    springConfig
  );

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      el.style.setProperty("--mx", `${px}px`);
      el.style.setProperty("--my", `${py}px`);
      const relX = px / rect.width;
      const relY = py / rect.height;
      mx.set(relX - 0.5);
      my.set(relY - 0.5);
      setSheenPos({ x: Math.round(relX * 100), y: Math.round(relY * 100) });
    },
    [mx, my]
  );

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }, [mx, my]);

  const Icon = ICON_MAP[project.iconKey] || Cpu;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{
        layout: { type: "spring", stiffness: 320, damping: 30 },
        delay: Math.min(index * 0.04, 0.2),
        duration: 0.34,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1100 }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        className={`relative h-full rounded-[24px] border transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 flex flex-col overflow-hidden ${
          isDarkLab
            ? "specular-surface-dark bg-[#1C120C] border-[#FAF6F0]/12 hover:border-[#FF6B1A]/65 shadow-[0_22px_54px_-28px_rgba(0,0,0,0.85)] hover:shadow-[0_28px_60px_-26px_rgba(232,93,4,0.34)]"
            : "specular-surface bg-[#FFFCF7] border-[#16100C]/12 hover:border-[#E85D04]/55 shadow-[0_14px_38px_-24px_rgba(20,14,11,0.22)] hover:shadow-[0_28px_58px_-26px_rgba(232,93,4,0.28)]"
        }`}
      >
        {/* Dynamic pointer-tracked copper specular sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            opacity: hovered ? 1 : 0,
            background: isDarkLab
              ? `radial-gradient(360px circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(244, 140, 6, 0.16), rgba(232, 93, 4, 0.06) 42%, transparent 72%)`
              : `radial-gradient(340px circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(232, 93, 4, 0.11), rgba(244, 140, 6, 0.04) 45%, transparent 72%)`,
          }}
        />

        <div className="relative z-10 p-6 flex flex-col flex-1">
          {/* Monospace Protocol Metadata Header */}
          <div
            className={`flex items-center justify-between gap-3 text-xs font-mono-tabular mb-4 ${
              isDarkLab ? "text-[#A69688]" : "text-[#6E5F54]"
            }`}
          >
            <span className="truncate">
              <span
                className={
                  isDarkLab
                    ? "text-[#FF6B1A] font-semibold"
                    : "text-[#C84B04] font-semibold"
                }
              >
                {project.network}
              </span>
              <span
                aria-hidden="true"
                className={
                  isDarkLab
                    ? "mx-1.5 text-[#FAF6F0]/25"
                    : "mx-1.5 text-[#16100C]/25"
                }
              >
                ·
              </span>
              <span>{project.standard}</span>
            </span>
          </div>

          {/* Icon + Title */}
          <div className="flex items-start gap-3.5 mb-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                isDarkLab
                  ? "bg-[#120B07] border-[#E85D04]/30 text-[#FF6B1A]"
                  : "bg-[#F3EAE0] border-[#16100C]/10 text-[#E85D04]"
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3
                className={`font-display text-lg font-bold tracking-[-0.025em] leading-snug transition-colors ${
                  hovered
                    ? isDarkLab
                      ? "text-[#FF6B1A]"
                      : "text-[#E85D04]"
                    : isDarkLab
                    ? "text-[#FAF6F0]"
                    : "text-[#16100C]"
                }`}
              >
                {project.title}
              </h3>
              <p
                className={`text-xs font-mono-tabular font-medium mt-0.5 ${
                  isDarkLab ? "text-[#FF6B1A]" : "text-[#C84B04]"
                }`}
              >
                {project.metric}
              </p>
            </div>
          </div>

          {/* Humanized 2-sentence description */}
          <p
            className={`text-sm leading-relaxed flex-1 mb-4 ${
              isDarkLab ? "text-[#D8CEC4]" : "text-[#4A3F37]"
            }`}
          >
            {project.description}
          </p>

          {/* Clean unboxed stack list */}
          <p
            className={`text-xs font-mono-tabular mb-5 ${
              isDarkLab ? "text-[#A69688]" : "text-[#6E5F54]"
            }`}
          >
            {project.tech.join(" · ")}
          </p>

          {/* Action Bar (Zero Straight Divider Line) */}
          <div className="pt-2 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onSelect}
                className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isDarkLab
                    ? "bg-[#E85D04] hover:bg-[#D14F00] text-[#FAF6F0]"
                    : "bg-[#16100C] hover:bg-[#E85D04] text-[#FAF6F0]"
                }`}
              >
                <span>Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onAskAmit}
                className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isDarkLab
                    ? "bg-[#120B07] hover:bg-[#261810] text-[#FAF6F0] border-[#FAF6F0]/14 hover:border-[#FF6B1A]"
                    : "bg-[#F3EAE0] hover:bg-[#16100C] text-[#16100C] hover:text-[#FAF6F0] border-[#16100C]/12"
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
                isDarkLab ? "text-[#D8CEC4]" : "text-[#4A3F37]"
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
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectGalleryOverlay({
  isOpen,
  variant,
  onClose,
  projects,
  title,
  onProjectClick,
  onAskAmit,
}: {
  isOpen: boolean;
  variant: "fullstack" | "core";
  onClose: () => void;
  projects: ProjectItem[];
  title: string;
  onProjectClick: (project: ProjectItem) => void;
  onAskAmit: (project: ProjectItem) => void;
}) {
  const [query, setQuery] = useState("");
  const isDarkLab = variant === "core";

  const filteredProjects = useMemo(
    () => filterProjectsByQuery(projects, query),
    [projects, query]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`gallery-overlay-${variant}`}
        data-testid="project-gallery-overlay"
        data-variant={variant}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} Archive`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-0 z-[150] overflow-hidden ${
          isDarkLab
            ? "bg-[#120B07] text-[#FAF6F0] silk-grain-dark"
            : "bg-[#FAF5EE] text-[#140E0B] silk-grain"
        }`}
      >
        {/* Ambient Studio Light Ribbons (strictly pointer-events-none, zero blur-3xl raster overhead) */}
        {isDarkLab ? (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-28 left-[12%] w-[640px] h-[420px] rounded-full opacity-55"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.32) 0%, rgba(244, 140, 6, 0.14) 44%, rgba(18, 11, 7, 0) 76%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[-10%] right-[6%] w-[560px] h-[380px] rounded-full opacity-45"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(244, 140, 6, 0.24) 0%, rgba(200, 90, 23, 0.1) 48%, rgba(18, 11, 7, 0) 76%)",
              }}
            />
          </>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-[8%] w-[680px] h-[420px] rounded-full opacity-75"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(244, 140, 6, 0.22) 0%, rgba(232, 93, 4, 0.1) 46%, rgba(250, 245, 238, 0) 74%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[-8%] left-[4%] w-[580px] h-[380px] rounded-full opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.16) 0%, rgba(244, 140, 6, 0.08) 46%, rgba(250, 245, 238, 0) 74%)",
              }}
            />
          </>
        )}

        {/* Dedicated full-viewport scrollable container for effortless wheel, trackpad, and touch scroll */}
        <div
          data-testid="gallery-scroll-container"
          className="relative z-10 h-full w-full overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Sticky Header (Tonal Shadow Separation, Zero Straight Hairline) */}
          <div
            className={`sticky top-0 z-20 backdrop-blur-md ${
              isDarkLab
                ? "bg-[#120B07]/94 shadow-[0_14px_32px_-20px_rgba(0,0,0,0.85)]"
                : "bg-[#FAF5EE]/94 shadow-[0_14px_32px_-22px_rgba(20,14,11,0.16)]"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
              <div>
                <h2
                  className={`font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em] ${
                    isDarkLab ? "text-[#FAF6F0]" : "text-[#16100C]"
                  }`}
                >
                  {title}
                </h2>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="relative flex-1 sm:w-72">
                  <Search
                    className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isDarkLab ? "text-[#A69688]" : "text-[#6E5F54]"
                    }`}
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filter by protocol or standard"
                    aria-label="Filter projects by protocol or standard"
                    className={`w-full h-11 pl-10 pr-3 rounded-full border text-sm focus:outline-none focus:border-[#E85D04] ${
                      isDarkLab
                        ? "bg-[#1C120C] border-[#FAF6F0]/14 text-[#FAF6F0] placeholder:text-[#A69688]"
                        : "bg-[#FFFCF7] border-[#16100C]/15 text-[#16100C] placeholder:text-[#6E5F54]"
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close project gallery"
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors shrink-0 cursor-pointer ${
                    isDarkLab
                      ? "bg-[#E85D04] text-[#FAF6F0] hover:bg-[#D14F00]"
                      : "bg-[#16100C] text-[#FAF6F0] hover:bg-[#E85D04]"
                  }`}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* 3D Tilt Cards Grid */}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24">
            {filteredProjects.length === 0 ? (
              <div
                className={`p-10 sm:p-12 rounded-2xl border text-center ${
                  isDarkLab
                    ? "bg-[#1C120C] border-[#FAF6F0]/12"
                    : "bg-[#FFFCF7] border-[#16100C]/12"
                }`}
              >
                <p
                  className={`font-display text-lg font-bold mb-1 ${
                    isDarkLab ? "text-[#FAF6F0]" : "text-[#16100C]"
                  }`}
                >
                  No matching protocols
                </p>
                <p
                  className={`text-sm mb-4 ${
                    isDarkLab ? "text-[#D8CEC4]" : "text-[#4A3F37]"
                  }`}
                >
                  Try clearing your filter query to browse the full archive.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-full bg-[#E85D04] text-[#FAF6F0] text-xs font-semibold cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => (
                    <GalleryCard
                      key={project.id}
                      project={project}
                      index={index}
                      isDarkLab={isDarkLab}
                      onSelect={() => onProjectClick(project)}
                      onAskAmit={() => onAskAmit(project)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}