"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";

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

function GatewayCard({
  emoji,
  title,
  description,
  btnText,
  accent,
  index,
  onClick,
}: {
  emoji: string;
  title: string;
  description: string;
  btnText: string;
  accent: string;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cfg = { stiffness: 260, damping: 28 };
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), cfg);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), cfg);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
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
        <div
          className="relative flex flex-col items-center text-center overflow-hidden"
          style={{
            borderRadius: 32,
            background: "#ffffff",
            border: `1px solid ${hovered ? accent + "40" : "#e8e5df"}`,
            boxShadow: hovered
              ? `0 24px 56px rgba(0,0,0,0.09), 0 0 0 1px ${accent}18`
              : "0 2px 12px rgba(0,0,0,0.05)",
            transition: "border-color 0.3s, box-shadow 0.35s",
          }}
        >
          {/* Colored top bar */}
          <div
            className="w-full flex-shrink-0"
            style={{ height: 5, background: accent }}
          />

          <div className="flex flex-col items-center px-8 sm:px-10 py-8 sm:py-10 w-full">
            {/* Hover gradient wash */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at top center, ${accent}10, transparent 65%)`,
              }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Icon */}
            <motion.div
              className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6"
              style={{
                background: hovered ? accent + "12" : "#f5f3ef",
                border: `1px solid ${hovered ? accent + "30" : "#ece8e0"}`,
                transition: "all 0.3s",
              }}
              animate={{ scale: hovered ? 1.07 : 1 }}
              transition={{ duration: 0.25 }}
            >
              {emoji}
            </motion.div>

            {/* Title */}
            <h3
              className="relative z-10 text-2xl sm:text-3xl leading-tight mb-3 text-gray-900 transition-colors duration-300"
              style={{
                fontFamily: "DM Serif Display, Georgia, serif",
                fontWeight: 400,
                color: hovered ? accent : "#111",
              }}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              className="relative z-10 text-sm text-slate-500 mb-8 max-w-xs leading-relaxed"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              {description}
            </p>

            {/* CTA Button */}
            <motion.button
              className="relative z-10 px-8 py-3.5 rounded-2xl text-[10px] font-semibold uppercase tracking-widest text-white"
              style={{
                background: accent,
                boxShadow: hovered
                  ? `0 10px 28px ${accent}45`
                  : `0 4px 14px ${accent}28`,
                fontFamily: "JetBrains Mono, monospace",
                border: "none",
                cursor: "pointer",
                transition: "box-shadow 0.3s",
              }}
              animate={{ y: hovered ? -2 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {btnText}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectGatewaySection({
  openOverlay,
}: {
  openOverlay: (type: "fullstack" | "core") => void;
}) {
  return (
    <>
      <FontLoader />
      {/* Reduced bottom padding to cut empty space */}
      <section className="pt-8 pb-10 md:pb-12 relative overflow-hidden bg-[#FDFCF8]">
        <motion.div
          initial={{ x: -250, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", damping: 25, stiffness: 80 }}
          className="max-w-7xl mx-auto px-5 sm:px-6 flex flex-col items-center"
        >
          <div className="w-full max-w-5xl">
            <h2
              className="text-4xl md:text-6xl tracking-tight mb-14 sm:mb-16 text-gray-900 text-left"
              style={{
                fontFamily: "DM Serif Display, Georgia, serif",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              Engineered{" "}
              <em
                className="not-italic text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(to right, #0055FF, #00D4FF)",
                }}
              >
                Protocols.
              </em>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 w-full">
              <GatewayCard
                emoji="🌐"
                title="Full-Stack dApps"
                description="Next.js + Complex Smart Contract Backends"
                btnText="View Gallery →"
                accent="#0055FF"
                index={0}
                onClick={() => openOverlay("fullstack")}
              />
              <GatewayCard
                emoji="⚙️"
                title="Core Contracts"
                description="Pure Protocol Engineering & EVM Primitives"
                btnText="Explore Repos →"
                accent="#00B4D8"
                index={1}
                onClick={() => openOverlay("core")}
              />
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
