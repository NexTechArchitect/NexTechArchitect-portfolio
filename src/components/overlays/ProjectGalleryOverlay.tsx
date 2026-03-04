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
      className="w-full flex justify-center" // Centered for mobile Grid
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        onClick={onClick}
        whileTap={{ scale: 0.975 }}
        className="cursor-pointer w-full max-w-[360px] md:max-w-[400px]" // Controlled Width
      >
        {/* ── Card ── */}
        <div
          className="relative flex flex-col overflow-hidden h-full"
          style={{
            borderRadius: 24,
            minHeight: 400, // Reduced slightly for mobile
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
          <div className="flex items-center justify-between px-5 sm:px-7 pt-5 sm:pt-6 pb-0">
            <span
              className="text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{
                color: accent,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {project.tag || project.category || "Contract"}
            </span>
            <span
              className="text-[10px] sm:text-[11px] font-medium tabular-nums"
              style={{ color: "#c8c2b8", fontFamily: "JetBrains Mono, monospace" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 px-5 sm:px-7 pt-4 pb-5">
            {/* Icon */}
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-4 flex-shrink-0"
              style={{
                background: accent + "12",
                border: `1px solid ${accent}25`,
              }}
            >
              {project.icon || "⚡"}
            </div>

            {/* Title */}
            <h3
              className="text-xl sm:text-2xl leading-tight mb-2 sm:mb-3 text-gray-900"
              style={{ fontFamily: "DM Serif Display, Georgia, serif", fontWeight: 400 }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              className="text-xs sm:text-sm leading-relaxed text-gray-500 flex-1"
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
            <div className="flex flex-wrap gap-1 mt-3 mb-4">
              {(project.tech || []).slice(0, 3).map((t: string) => ( // Show only 3 chips on mobile
                <span
                  key={t}
                  className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded-lg"
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
              className="flex items-center justify-between pt-3 sm:pt-4"
              style={{ borderTop: "1px solid #f0ece5" }}
            >
              <span
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  color: hovered ? accent : "#999",
                }}
              >
                View Details
              </span>
              <motion.div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors duration-200"
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

  // Handle Hardware Back Button
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.history.pushState({ overlayOpen: true }, "");

      const handlePopState = () => {
        onClose();
      };
      window.addEventListener("popstate", handlePopState);

      const h = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", h);

      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("keydown", h);
      };
    }
  }, [isOpen, onClose]);


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
        className="fixed inset-0 z-[150] flex flex-col overflow-y-auto" // Changed to overflow-y-auto
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
          className="flex-shrink-0 flex items-center justify-between px-6 sm:px-10 md:px-16 py-5 sm:py-7 sticky top-0 bg-[#FDFCF8]/90 backdrop-blur-md z-20" // Sticky Header
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
              onClick={() => {
                window.history.back(); // Trigger popstate
              }}
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-gray-600 transition-all duration-200 hover:bg-gray-900 hover:text-white"
              style={{ background: "#f0ece5", border: "1px solid #e2ddd5" }}
            >
              ✕
            </button>
          </div>
        </motion.div>

        {/* ── Grid Layout ── */}
        <div
          className="w-full max-w-7xl mx-auto px-4 sm:px-10 md:px-16 py-8 sm:py-12"
        >
           {/* Mobile: 1 column, sm: 2 cols, lg: 3 cols */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onClick={() => onProjectClick(project)}
              />
            ))}
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}