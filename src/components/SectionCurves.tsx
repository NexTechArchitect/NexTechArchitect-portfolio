"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface CurveProps {
  idPrefix: string;
  bottomFill: string;
  className?: string;
}

/**
 * Unified 2026 Quiet-Luxury Editorial Motion Tokens
 * Single smooth deceleration bezier + flicker-free viewport thresholds.
 */
export const LUXURY_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const REPLAY_VIEWPORT = {
  once: false,
  amount: "some" as const,
  margin: "-10% 0px -6% 0px",
};

export const IMMEDIATE_VIEWPORT = {
  once: false,
  amount: "some" as const,
  margin: "0px 0px -40px 0px",
};

/**
 * Lightweight responsive viewport hook (< 768px) for adaptive mobile motion ergonomics.
 */
export function useIsMobile(maxWidth = 767): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [maxWidth]);

  return isMobile;
}

/**
 * Dark Espresso-Brown & Warm Burnt-Orange Curved Header Stage
 * Frames the top floating Navbar with a sleek filled espresso-brown (#140D09 -> #1F120B)
 * canopy illuminated by soft diffused molten-orange radial glows, curving smoothly into
 * Warm Ivory (#FAF6F0) with a pure filled SVG curve (zero stroke hairlines, zero seams).
 */
export function HeroHeaderCanopy() {
  return (
    <div
      data-testid="hero-header-canopy"
      aria-hidden="true"
      className="pointer-events-none relative w-full h-[126px] sm:h-[138px] lg:h-[148px] overflow-hidden select-none z-10"
      style={{
        background:
          "linear-gradient(180deg, #140D09 0%, #1A100A 54%, #1F120B 100%)",
      }}
    >
      {/* Diffused dark molten-orange ambient radial glows blending organically inside the dark curve */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[92%] max-w-[1160px] h-[200px] rounded-full opacity-95"
        style={{
          background:
            "radial-gradient(ellipse 64% 58% at 50% 42%, rgba(232, 93, 4, 0.34) 0%, rgba(200, 75, 4, 0.18) 42%, rgba(31, 18, 11, 0) 76%)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-12 right-[12%] w-[420px] h-[170px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.24) 0%, rgba(200, 75, 4, 0.1) 46%, rgba(31, 18, 11, 0) 74%)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-10 left-[10%] w-[360px] h-[160px] rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200, 75, 4, 0.22) 0%, rgba(31, 18, 11, 0) 74%)",
        }}
      />

      {/* Pure filled sculptural curve seamlessly transitioning into Warm Ivory (#FAF6F0) */}
      <svg
        viewBox="0 0 1440 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="pointer-events-none absolute inset-x-0 bottom-0 -mb-[2px] block w-full h-[38px] sm:h-[46px] lg:h-[54px]"
      >
        <path d="M0 68V14C360 62 1080 62 1440 14V68H0Z" fill="#FAF6F0" />
      </svg>
    </div>
  );
}

/**
 * Lightweight Static Sculpted Editorial Sheet Wrapper (Zero Scroll-Jank)
 * Preserves the signature sculpted rounded top transition without morphing borderRadius
 * or running competing scroll listeners on outer wrappers.
 */
export function SectionRevealStage({
  children,
  outerClassName = "",
  innerClassName = "",
  backdropNode,
  sculptedTop = true,
  id,
  dataTestId,
}: {
  children: React.ReactNode;
  outerClassName?: string;
  innerClassName?: string;
  backdropNode?: React.ReactNode;
  sculptedTop?: boolean;
  id?: string;
  dataTestId?: string;
}) {
  return (
    <div
      id={id}
      data-testid={dataTestId}
      className={`relative section-perf ${outerClassName}`}
    >
      {backdropNode}
      <div
        className={`relative z-10 ${
          sculptedTop ? "rounded-t-[36px] sm:rounded-t-[48px]" : ""
        } ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Signature Hero Translucent Apricot & Burnt-Orange Silk Wave
 * Pure filled sculptural shapes (zero stroke hairlines, zero expensive SVG feGaussianBlur)
 * flowing behind the Hero & 3D avatar with subtle GPU-only vertical scroll parallax.
 */
export function HeroSilkWave({
  idPrefix = "hero-silk-wave",
  className = "",
  scrollProgress,
}: {
  idPrefix?: string;
  className?: string;
  scrollProgress?: MotionValue<number>;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const fallbackProgress = useMotionValue(0);

  // Subtle GPU-only vertical parallax driven by the Hero's single scroll progress
  const y = useTransform(
    scrollProgress ?? fallbackProgress,
    [0, 1],
    [0, isMobile ? 14 : 28]
  );

  const ribbonPrimaryId = `${idPrefix}-primary`;
  const ribbonSecondaryId = `${idPrefix}-secondary`;
  const ribbonCrestId = `${idPrefix}-crest`;

  return (
    <div
      data-testid="hero-silk-wave"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-[235px] sm:top-[250px] lg:top-[225px] z-0 overflow-hidden select-none ${className}`}
    >
      {/* Soft warm apricot ambient radial halo behind the silk wave crest */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-4 w-[94%] max-w-[1440px] h-[220px] rounded-full opacity-75"
        style={{
          background:
            "radial-gradient(ellipse 68% 54% at 62% 48%, rgba(255, 118, 36, 0.2) 0%, rgba(244, 162, 97, 0.12) 44%, rgba(250, 246, 240, 0) 76%)",
        }}
      />

      <motion.div
        style={
          prefersReducedMotion || !scrollProgress ? undefined : { y }
        }
        className="w-full will-change-transform"
      >
        <div className="silk-wave-shimmer w-full">
          <svg
            viewBox="0 0 1440 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            shapeRendering="geometricPrecision"
            className="pointer-events-none block w-full h-[180px] sm:h-[225px] lg:h-[268px]"
          >
            <defs>
              <linearGradient
                id={ribbonPrimaryId}
                x1="0"
                y1="140"
                x2="1440"
                y2="140"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#F4A261" stopOpacity="0.02" />
                <stop offset="26%" stopColor="#F4A261" stopOpacity="0.18" />
                <stop offset="56%" stopColor="#FF7A26" stopOpacity="0.28" />
                <stop offset="82%" stopColor="#E85D04" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#F4A261" stopOpacity="0.04" />
              </linearGradient>

              <linearGradient
                id={ribbonSecondaryId}
                x1="0"
                y1="95"
                x2="1440"
                y2="195"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#E85D04" stopOpacity="0" />
                <stop offset="30%" stopColor="#FF964F" stopOpacity="0.11" />
                <stop offset="68%" stopColor="#E85D04" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#D97736" stopOpacity="0.02" />
              </linearGradient>

              <linearGradient
                id={ribbonCrestId}
                x1="0"
                y1="0"
                x2="1440"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#F4A261" stopOpacity="0" />
                <stop offset="24%" stopColor="#FF7E2D" stopOpacity="0.18" />
                <stop offset="58%" stopColor="#E85D04" stopOpacity="0.24" />
                <stop offset="84%" stopColor="#F4A261" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#F4A261" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Back translucent apricot silk veil (pure filled shape, zero SVG filter repaint) */}
            <path
              d="M0 156C250 74 560 72 885 138C1130 188 1310 154 1440 94L1440 202C1270 250 1065 246 820 198C525 140 245 160 0 224V156Z"
              fill={`url(#${ribbonSecondaryId})`}
            />

            {/* Primary glowing apricot-to-burnt-orange translucent silk ribbon (pure filled shape) */}
            <path
              d="M0 176C290 96 620 90 945 150C1165 190 1320 162 1440 112L1440 196C1285 234 1095 238 870 194C575 136 270 154 0 218V176Z"
              fill={`url(#${ribbonPrimaryId})`}
            />

            {/* Soft luminous upper silk band (pure filled shape, zero stroke) */}
            <path
              d="M0 170C290 88 620 82 945 142C1165 182 1320 154 1440 104L1440 124C1320 174 1165 202 945 162C620 102 290 108 0 188V170Z"
              fill={`url(#${ribbonCrestId})`}
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Pure Filled Diffused Copper/Amber Silk Crest
 * Static lightweight radial crest nested behind sculpted editorial sheets (zero stroke lines, zero scroll listeners).
 */
export function SheetSilkCrest({
  idPrefix,
  className = "",
}: {
  idPrefix: string;
  className?: string;
}) {
  const glowId = `${idPrefix}-crest-glow`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 -top-9 sm:-top-12 z-0 overflow-hidden select-none ${className}`}
    >
      <div
        className="pointer-events-none mx-auto w-[78%] max-w-[1040px] h-[108px] rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 68% 58% at 50% 62%, rgba(255, 118, 36, 0.34) 0%, rgba(244, 162, 97, 0.14) 46%, rgba(20, 14, 11, 0) 76%)",
        }}
      />

      <svg
        viewBox="0 0 1440 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="pointer-events-none absolute inset-x-0 top-1 block w-full h-[58px] sm:h-[76px]"
      >
        <defs>
          <linearGradient
            id={glowId}
            x1="0"
            y1="45"
            x2="1440"
            y2="45"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#D97736" stopOpacity="0" />
            <stop offset="24%" stopColor="#E85D04" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#F6B57D" stopOpacity="0.4" />
            <stop offset="76%" stopColor="#E85D04" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#D97736" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Pure filled curved glow crescent (zero stroke, zero filter repaint) */}
        <path
          d="M60 78C380 14 1060 14 1380 78L1380 90C1060 36 380 36 60 90V78Z"
          fill={`url(#${glowId})`}
        />
      </svg>
    </div>
  );
}

/**
 * Transition 1: Pure Filled Sculptural Horizon Sweep
 * Static zero-jank curved bridge for Hero (#FAF6F0) -> Architecture (#140E0B) with zero stroke hairlines.
 */
export function ScrollHorizonSweep({
  idPrefix,
  bottomFill,
  className = "",
}: CurveProps) {
  const glowId = `${idPrefix}-horizon-glow`;
  const crestId = `${idPrefix}-horizon-crest`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative w-full -mt-[2px] -mb-[2px] leading-none overflow-hidden select-none ${className}`}
    >
      {/* Static warm molten-copper horizon halo */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-2 w-[78%] max-w-[1060px] h-[132px] rounded-full opacity-75"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 118, 36, 0.3) 0%, rgba(244, 162, 97, 0.14) 48%, rgba(250, 246, 240, 0) 76%)",
        }}
      />

      <svg
        viewBox="0 0 1440 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="pointer-events-none relative z-10 block w-full h-[72px] sm:h-[102px] lg:h-[128px]"
      >
        <defs>
          <linearGradient
            id={glowId}
            x1="720"
            y1="6"
            x2="720"
            y2="126"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F4A261" stopOpacity="0.18" />
            <stop offset="55%" stopColor="#E85D04" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#E85D04" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={crestId}
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#D97736" stopOpacity="0" />
            <stop offset="26%" stopColor="#E85D04" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#F6B57D" stopOpacity="0.4" />
            <stop offset="74%" stopColor="#E85D04" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#D97736" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Layered translucent apricot silk crescent (pure filled shapes, zero SVG blur) */}
        <path
          d="M0 140V84C360 0 1080 2 1440 88V140H0Z"
          fill={`url(#${glowId})`}
        />
        <path
          d="M0 140V96C380 10 1060 10 1440 96V140H0Z"
          fill={`url(#${crestId})`}
        />
        <path
          d="M0 140V106C380 20 1060 20 1440 106V140H0Z"
          fill={bottomFill}
        />
      </svg>
    </div>
  );
}

/**
 * Transition 3: Pure Filled Graceful Sweeping Asymmetric Silk Ribbon Curve
 * Static zero-jank bridge for Flagship Protocols (#FBF8F3) -> Archive (#1B120D) with zero stroke lines.
 */
export function SweepingRibbonCurve({
  idPrefix,
  bottomFill,
  className = "",
}: CurveProps) {
  const ribbonGlowId = `${idPrefix}-ribbon-glow`;
  const crestId = `${idPrefix}-ribbon-crest`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative w-full -mt-[2px] -mb-[2px] leading-none overflow-hidden select-none ${className}`}
    >
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-2 w-[74%] max-w-[980px] h-[112px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.24) 0%, rgba(244, 162, 97, 0.12) 48%, rgba(251, 248, 243, 0) 76%)",
        }}
      />

      <svg
        viewBox="0 0 1440 148"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="pointer-events-none relative z-10 block w-full h-[76px] sm:h-[108px] lg:h-[136px]"
      >
        <defs>
          <linearGradient
            id={ribbonGlowId}
            x1="0"
            y1="16"
            x2="1440"
            y2="136"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F4A261" stopOpacity="0.12" />
            <stop offset="46%" stopColor="#E85D04" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FF7A26" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient
            id={crestId}
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#C85A17" stopOpacity="0" />
            <stop offset="32%" stopColor="#E85D04" stopOpacity="0.32" />
            <stop offset="66%" stopColor="#F6B57D" stopOpacity="0.44" />
            <stop offset="100%" stopColor="#C85A17" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Back translucent apricot silk swell (pure filled shape) */}
        <path
          d="M0 148V98C420 8 980 24 1440 78V148H0Z"
          fill={`url(#${ribbonGlowId})`}
        />

        {/* Soft filled luminous copper crescent (zero stroke) */}
        <path
          d="M0 148V110C440 20 1000 34 1440 88V148H0Z"
          fill={`url(#${crestId})`}
        />

        {/* Single fluid sweeping asymmetric curve matching exact Archive #1B120D */}
        <path
          d="M0 148V120C440 30 1000 44 1440 96V148H0Z"
          fill={bottomFill}
        />
      </svg>
    </div>
  );
}

/**
 * Transition 5: Pure Filled Glowing Burnt-Orange Solar Horizon Arch
 * Static zero-jank bridge for Workbench (#F3EAE0) -> Midnight Obsidian Contact Footer (#0A0604) with zero stroke lines.
 */
export function SolarHorizonArch({
  idPrefix = "footer-solar",
  bottomFill = "#0A0604",
  className = "",
}: {
  idPrefix?: string;
  bottomFill?: string;
  className?: string;
}) {
  const coronaId = `${idPrefix}-corona`;
  const fillId = `${idPrefix}-fill`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative w-full -mt-[2px] -mb-[2px] leading-none overflow-hidden select-none ${className}`}
    >
      {/* Warm molten-amber sunrise corona */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[88%] max-w-[1220px] h-[156px] rounded-full opacity-85"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 107, 26, 0.4) 0%, rgba(244, 162, 97, 0.18) 46%, rgba(243, 234, 224, 0) 76%)",
        }}
      />

      <svg
        viewBox="0 0 1440 156"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="pointer-events-none relative z-10 block w-full h-[76px] sm:h-[104px] lg:h-[132px]"
      >
        <defs>
          <linearGradient
            id={coronaId}
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#C85A17" stopOpacity="0" />
            <stop offset="24%" stopColor="#E85D04" stopOpacity="0.48" />
            <stop offset="50%" stopColor="#FF8A3D" stopOpacity="0.62" />
            <stop offset="76%" stopColor="#E85D04" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#C85A17" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={fillId}
            x1="720"
            y1="16"
            x2="720"
            y2="156"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#190F0A" />
            <stop offset="40%" stopColor="#100906" />
            <stop offset="100%" stopColor={bottomFill} />
          </linearGradient>
        </defs>

        {/* Pure filled diffused burnt-orange solar corona crescent (zero stroke, zero SVG blur) */}
        <path
          d="M0 156V102C360 2 1080 2 1440 102V156H0Z"
          fill={`url(#${coronaId})`}
        />

        <path
          d="M0 156V118C360 18 1080 18 1440 118V156H0Z"
          fill={`url(#${fillId})`}
        />
      </svg>
    </div>
  );
}
