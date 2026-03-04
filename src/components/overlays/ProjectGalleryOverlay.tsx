"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";

// ─── Fonts ─────────────────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
}

// ─── Project Card ──────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: any;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cfg = { stiffness: 280, damping: 28 };
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), cfg);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), cfg);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my]
  );
  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }, [mx, my]);

  const accent = project.accentColor || "#0055FF";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", damping: 22, stiffness: 130 }}
      style={{ perspective: 1000 }}
      className="flex-shrink-0 w-[80vw] sm:w-[380px] md:w-[400px] snap-center"
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        onClick={onClick}
        whileTap={{ scale: 0.975 }}
        className="cursor-pointer"
      >
        {/* ── Card ── */}
        <div
          className="relative flex flex-col overflow-hidden"
          style={{
            borderRadius: 24,
            height: 440,
            background: "#ffffff",
            border: `1px solid ${hovered ? accent + "40" : "#e8e5df"}`,
            boxShadow: hovered
              ? `0 24px 60px rgba(0,0,0,0.10), 0 0 0 1px ${accent}20`
              : "0 2px 16px rgba(0,0,0,0.06)",
            transition: "border-color 0.3s, box-shadow 0.35s",
          }}
        >
          {/* Colored top bar */}
          <div
            className="flex-shrink-0 w-full relative overflow-hidden"
            style={{ height: 7, background: accent }}
          />

          {/* Subtle gradient wash on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${accent}08 0%, transparent 55%)`,
            }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Index + tag row */}
          <div className="flex items-center justify-between px-7 pt-6 pb-0">
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{
                color: accent,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {project.tag || project.category || "Contract"}
            </span>
            <span
              className="text-[11px] font-medium tabular-nums"
              style={{ color: "#c8c2b8", fontFamily: "JetBrains Mono, monospace" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 px-7 pt-5 pb-6">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 flex-shrink-0"
              style={{
                background: accent + "12",
                border: `1px solid ${accent}25`,
              }}
            >
              {project.icon || "⚡"}
            </div>

            {/* Title */}
            <h3
              className="text-2xl leading-tight mb-3 text-gray-900"
              style={{ fontFamily: "DM Serif Display, Georgia, serif", fontWeight: 400 }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              className="text-sm leading-relaxed text-gray-500 flex-1"
              style={{
                fontFamily: "DM Sans, sans-serif",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {project.description}
            </p>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-1.5 mt-4 mb-5">
              {(project.tech || []).slice(0, 4).map((t: string) => (
                <span
                  key={t}
                  className="text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                  style={{
                    color: "#888",
                    background: "#f5f3ef",
                    border: "1px solid #ede9e2",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTA row */}
            <div
              className="flex items-center justify-between pt-4"
              style={{ borderTop: "1px solid #f0ece5" }}
            >
              <span
                className="text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  color: hovered ? accent : "#999",
                }}
              >
                View Details
              </span>
              <motion.div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
                animate={{
                  x: hovered ? 4 : 0,
                  background: hovered ? accent : "#f5f3ef",
                  color: hovered ? "#fff" : "#aaa",
                }}
                style={{ border: `1px solid ${hovered ? accent : "#e8e4dc"}` }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Overlay ───────────────────────────────────────────────────────────────
export default function ProjectGalleryOverlay({
  isOpen,
  onClose,
  projects,
  title,
  onProjectClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  projects: any[];
  title: string;
  onProjectClick: (p: any) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", h);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Sync active dot with scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isOpen) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / projects.length;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(idx, 0), projects.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isOpen, projects.length]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <FontLoader key="font" />

      {/* Full-screen overlay */}
      <motion.div key="overlay"
        initial={{ opacity: 0, y: "4%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "4%" }}
        transition={{ type: "spring", damping: 28, stiffness: 200 }}
        className="fixed inset-0 z-[150] flex flex-col"
        style={{ background: "#FDFCF8" }}
      >
        {/* Subtle top ambient */}
        <div
          className="absolute top-0 left-0 right-0 h-[30vh] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,85,255,0.03) 0%, transparent 100%)",
          }}
        />

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="flex-shrink-0 flex items-center justify-between px-6 sm:px-10 md:px-16 py-5 sm:py-7"
          style={{ borderBottom: "1px solid #ede9e2" }}
        >
          <div>
            <h2
              className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-gray-900 leading-none"
              style={{ fontFamily: "DM Serif Display, Georgia, serif" }}
            >
              {title}{" "}
              <em style={{ color: "#FF4F00", fontStyle: "italic" }}>Gallery.</em>
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <span
              className="hidden sm:block text-[10px] font-medium text-gray-400 tracking-widest"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {projects.length} projects
            </span>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-gray-600 transition-all duration-200 hover:bg-gray-900 hover:text-white"
              style={{ background: "#f0ece5", border: "1px solid #e2ddd5" }}
            >
              ✕
            </button>
          </div>
        </motion.div>

        {/* Mobile swipe hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="sm:hidden text-[9px] font-mono tracking-[0.22em] uppercase text-gray-400 px-6 pt-4 pb-0"
        >
          Swipe to explore →
        </motion.p>

        {/* ── Cards Row ── */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden px-6 sm:px-10 md:px-16 py-8 sm:py-12 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`div::-webkit-scrollbar{display:none}`}</style>

          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={() => onProjectClick(project)}
            />
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-6 sm:w-10" />
        </div>

        {/* ── Bottom — progress dots ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex-shrink-0 flex items-center justify-center gap-2 pb-7 sm:pb-9"
        >
          {projects.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 22 : 6,
                height: 6,
                background: i === activeIndex ? "#FF4F00" : "#ddd8d0",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
