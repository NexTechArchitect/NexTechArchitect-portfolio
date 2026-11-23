"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
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
} from "lucide-react";
import type { ProjectItem } from "@/data/projects";
import { filterProjectsByQuery } from "@/lib/portfolio";

const ICON_MAP: Record<ProjectItem["iconKey"], React.ComponentType<{ className?: string }>> = {
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
  onSelect,
}: {
  project: ProjectItem;
  index: number;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = { stiffness: 280, damping: 28 };
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), springConfig);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), springConfig);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        className="h-full rounded-2xl bg-white border border-slate-200/90 hover:border-[#0052FF]/35 transition-all duration-200 shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_48px_rgba(15,23,42,0.09)] flex flex-col overflow-hidden"
      >
        <div className="p-6 flex flex-col flex-1">
          {/* Quiet unboxed metadata header */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono-tabular text-slate-500 mb-4">
            <span className="truncate">
              <span className="text-[#0052FF] font-semibold">{project.network}</span>
              <span aria-hidden="true" className="mx-1.5 text-slate-300">
                /
              </span>
              <span>{project.standard}</span>
            </span>
            <span className="text-slate-400 shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Icon + Title */}
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-center text-[#0052FF] shrink-0">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3
                className={`font-display text-lg font-bold tracking-tight leading-snug transition-colors ${
                  hovered ? "text-[#0052FF]" : "text-[#0B1220]"
                }`}
              >
                {project.title}
              </h3>
              <p className="text-xs font-mono-tabular text-[#0891B2] font-medium mt-0.5">
                {project.metric}
              </p>
            </div>
          </div>

          {/* Complete description (zero truncation) */}
          <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-5">
            {project.description}
          </p>

          {/* Clean unboxed stack list */}
          <p className="text-xs font-mono-tabular text-slate-500 mb-5">
            {project.tech.join(" · ")}
          </p>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onSelect}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1220] hover:bg-[#0052FF] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Case Study</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#0052FF] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Live dApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#0B1220] transition-colors whitespace-nowrap shrink-0"
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
  onClose,
  projects,
  title,
  onProjectClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  title: string;
  onProjectClick: (project: ProjectItem) => void;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const filteredProjects = useMemo(
    () => filterProjectsByQuery(projects, query),
    [projects, query]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="gallery-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} Archive`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[150] flex flex-col overflow-y-auto bg-[#F8FAFC] architectural-grid"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-xl border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono-tabular text-[#0052FF] font-semibold">
                Protocol Archive · {filteredProjects.length} of {projects.length}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1220] tracking-tight">
                {title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by protocol or standard"
                  aria-label="Filter projects by protocol or standard"
                  className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-slate-200 text-sm text-[#0B1220] placeholder:text-slate-400 focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project gallery"
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-[#0B1220] hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-10">
          {filteredProjects.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center">
              <p className="font-display text-lg font-bold text-[#0B1220] mb-1">
                No matching protocols
              </p>
              <p className="text-sm text-slate-500 mb-4">
                Try clearing your filter query to view all {projects.length} entries.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="px-4 py-2 rounded-xl bg-[#0052FF] text-white text-xs font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <GalleryCard
                  key={project.id}
                  project={project}
                  index={index}
                  onSelect={() => onProjectClick(project)}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}