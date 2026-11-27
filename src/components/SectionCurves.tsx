"use client";

import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

interface CurveProps {
  idPrefix: string;
  bottomFill: string;
  className?: string;
}

/**
 * Signature Hero Translucent Apricot & Burnt-Orange Silk Wave
 * Flows gracefully behind the Hero & 3D Amit avatar on luminous Warm Ivory (#FAF6F0).
 * Strictly GPU-accelerated scroll parallax (translateY / scaleY) + gentle breathing shimmer,
 * pointer-events-none, z-0 so it never blocks text or interactive buttons.
 */
export function HeroSilkWave({
  idPrefix = "hero-silk-wave",
  className = "",
}: {
  idPrefix?: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const waveRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: waveRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 34]);
  const scaleY = useTransform(scrollYProgress, [0, 1], [1, 1.09]);

  const ribbonPrimaryId = `${idPrefix}-primary`;
  const ribbonSecondaryId = `${idPrefix}-secondary`;
  const strokeGlowId = `${idPrefix}-stroke`;
  const blurId = `${idPrefix}-blur`;

  return (
    <div
      ref={waveRef}
      data-testid="hero-silk-wave"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-[210px] sm:top-[225px] lg:top-[195px] z-0 overflow-hidden select-none ${className}`}
    >
      {/* Soft warm apricot ambient radial halo behind the silk wave crest */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-4 w-[94%] max-w-[1440px] h-[220px] rounded-full opacity-70 ambient-silk-drift"
        style={{
          background:
            "radial-gradient(ellipse 68% 54% at 62% 48%, rgba(255, 118, 36, 0.22) 0%, rgba(244, 162, 97, 0.14) 44%, rgba(250, 246, 240, 0) 76%)",
        }}
      />

      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { y, scaleY, transformOrigin: "center center" }
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
                <stop offset="0%" stopColor="#E85D04" stopOpacity="0.0" />
                <stop offset="30%" stopColor="#FF964F" stopOpacity="0.14" />
                <stop offset="68%" stopColor="#E85D04" stopOpacity="0.19" />
                <stop offset="100%" stopColor="#D97736" stopOpacity="0.02" />
              </linearGradient>

              <linearGradient
                id={strokeGlowId}
                x1="0"
                y1="0"
                x2="1440"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#F4A261" stopOpacity="0" />
                <stop offset="22%" stopColor="#FF7E2D" stopOpacity="0.46" />
                <stop offset="58%" stopColor="#E85D04" stopOpacity="0.58" />
                <stop offset="84%" stopColor="#F4A261" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#F4A261" stopOpacity="0" />
              </linearGradient>

              <filter
                id={blurId}
                x="-6%"
                y="-30%"
                width="112%"
                height="160%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>

            {/* Back translucent apricot silk veil */}
            <path
              d="M0 156C250 74 560 72 885 138C1130 188 1310 154 1440 94L1440 202C1270 250 1065 246 820 198C525 140 245 160 0 224V156Z"
              fill={`url(#${ribbonSecondaryId})`}
              filter={`url(#${blurId})`}
            />

            {/* Primary glowing apricot-to-burnt-orange translucent silk ribbon */}
            <path
              d="M0 176C290 96 620 90 945 150C1165 190 1320 162 1440 112L1440 196C1285 234 1095 238 870 194C575 136 270 154 0 218V176Z"
              fill={`url(#${ribbonPrimaryId})`}
            />

            {/* Soft luminous crest ribbon (feathered glow, zero harsh hairline) */}
            <path
              d="M0 176C290 96 620 90 945 150C1165 190 1320 162 1440 112"
              stroke={`url(#${strokeGlowId})`}
              strokeWidth="12"
              filter={`url(#${blurId})`}
              opacity="0.72"
            />
            <path
              d="M0 176C290 96 620 90 945 150C1165 190 1320 162 1440 112"
              stroke={`url(#${strokeGlowId})`}
              strokeWidth="2"
              opacity="0.42"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Delicate Translucent Copper/Amber Silk Ribbon Crest
 * Nested cleanly behind rising sculptural editorial sheets (Architecture -> Protocols, Archive -> Workbench)
 * so the Hero's translucent silk-wave motif ties every single section boundary together.
 */
export function SheetSilkCrest({
  idPrefix,
  className = "",
}: {
  idPrefix: string;
  className?: string;
}) {
  const glowId = `${idPrefix}-crest-glow`;
  const blurId = `${idPrefix}-crest-blur`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 -top-9 sm:-top-12 z-0 overflow-hidden select-none ${className}`}
    >
      <div
        className="pointer-events-none mx-auto w-[86%] max-w-[1180px] h-[96px] rounded-full opacity-75"
        style={{
          background:
            "radial-gradient(ellipse 68% 58% at 50% 62%, rgba(255, 107, 26, 0.34) 0%, rgba(244, 162, 97, 0.16) 46%, rgba(20, 14, 11, 0) 76%)",
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
            <stop offset="24%" stopColor="#E85D04" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#F6B57D" stopOpacity="0.65" />
            <stop offset="76%" stopColor="#E85D04" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D97736" stopOpacity="0" />
          </linearGradient>
          <filter
            id={blurId}
            x="-6%"
            y="-40%"
            width="112%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <path
          d="M60 78C380 18 1060 18 1380 78"
          stroke={`url(#${glowId})`}
          strokeWidth="12"
          filter={`url(#${blurId})`}
          opacity="0.88"
        />
      </svg>
    </div>
  );
}

/**
 * Transition 1: Scroll-Flattening Sculptural Horizon Sweep
 * Used for Hero (#FAF6F0) -> Architecture (#140E0B).
 * Pairs a wide sculptural concave horizon with a layered translucent apricot/burnt-orange silk echo.
 */
export function ScrollHorizonSweep({
  idPrefix,
  bottomFill,
  className = "",
}: CurveProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 0.55, 1], [1.12, 0.94, 0.5]);

  const glowId = `${idPrefix}-horizon-glow`;
  const rimId = `${idPrefix}-horizon-rim`;
  const silkEchoId = `${idPrefix}-horizon-silk`;
  const blurId = `${idPrefix}-horizon-blur`;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none relative w-full -mt-[2px] -mb-[2px] leading-none overflow-hidden select-none ${className}`}
    >
      {/* Luminous apricot & burnt-orange ambient halo hovering over the dark stage horizon */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-2 w-[86%] max-w-[1160px] h-[126px] rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.28) 0%, rgba(244, 162, 97, 0.14) 48%, rgba(250, 246, 240, 0) 76%)",
        }}
      />

      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { scaleY, transformOrigin: "bottom center" }
        }
        className="w-full will-change-transform"
      >
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
              <stop offset="0%" stopColor="#F4A261" stopOpacity="0.22" />
              <stop offset="55%" stopColor="#E85D04" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#E85D04" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={silkEchoId}
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#F4A261" stopOpacity="0" />
              <stop offset="22%" stopColor="#F4A261" stopOpacity="0.28" />
              <stop offset="55%" stopColor="#FF7A26" stopOpacity="0.42" />
              <stop offset="82%" stopColor="#E85D04" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#D97736" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={rimId}
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#D97736" stopOpacity="0" />
              <stop offset="26%" stopColor="#E85D04" stopOpacity="0.52" />
              <stop offset="50%" stopColor="#F6B57D" stopOpacity="0.72" />
              <stop offset="74%" stopColor="#E85D04" stopOpacity="0.52" />
              <stop offset="100%" stopColor="#D97736" stopOpacity="0" />
            </linearGradient>
            <filter
              id={blurId}
              x="-6%"
              y="-40%"
              width="112%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="6.5" />
            </filter>
          </defs>

          {/* Layered translucent apricot silk ribbon crest */}
          <path
            d="M0 140V84C360 0 1080 2 1440 88V140H0Z"
            fill={`url(#${glowId})`}
            filter={`url(#${blurId})`}
          />
          <path
            d="M0 92C380 8 1060 10 1440 96"
            stroke={`url(#${silkEchoId})`}
            strokeWidth="16"
            filter={`url(#${blurId})`}
            opacity="0.78"
          />
          <path
            d="M0 104C380 18 1060 18 1440 104"
            stroke={`url(#${rimId})`}
            strokeWidth="8"
            filter={`url(#${blurId})`}
            opacity="0.88"
          />
          <path
            d="M0 140V106C380 20 1060 20 1440 106V140H0Z"
            fill={bottomFill}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * Transition 3: Graceful Sweeping Asymmetric Silk Ribbon Curve
 * Used for Flagship Protocols (#FBF8F3) -> Archive (#1B120D).
 * Dual layered translucent apricot & burnt-orange silk wave echoing the Hero motif.
 */
export function SweepingRibbonCurve({
  idPrefix,
  bottomFill,
  className = "",
}: CurveProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 0.55, 1], [1.1, 0.94, 0.6]);

  const ribbonGlowId = `${idPrefix}-ribbon-glow`;
  const rimId = `${idPrefix}-ribbon-rim`;
  const blurId = `${idPrefix}-ribbon-blur`;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none relative w-full -mt-[2px] -mb-[2px] leading-none overflow-hidden select-none ${className}`}
    >
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { scaleY, transformOrigin: "bottom center" }
        }
        className="w-full will-change-transform"
      >
        <svg
          viewBox="0 0 1440 148"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          className="pointer-events-none block w-full h-[76px] sm:h-[108px] lg:h-[136px]"
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
              <stop offset="46%" stopColor="#E85D04" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#FF7A26" stopOpacity="0.14" />
            </linearGradient>
            <linearGradient
              id={rimId}
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#C85A17" stopOpacity="0" />
              <stop offset="32%" stopColor="#E85D04" stopOpacity="0.56" />
              <stop offset="66%" stopColor="#F6B57D" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#C85A17" stopOpacity="0" />
            </linearGradient>
            <filter
              id={blurId}
              x="-6%"
              y="-40%"
              width="112%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          {/* Back translucent apricot silk swell */}
          <path
            d="M0 148V98C420 8 980 24 1440 78V148H0Z"
            fill={`url(#${ribbonGlowId})`}
            filter={`url(#${blurId})`}
          />

          {/* Luminous copper/amber silk crest */}
          <path
            d="M0 116C440 26 1000 40 1440 94"
            stroke={`url(#${rimId})`}
            strokeWidth="12"
            filter={`url(#${blurId})`}
            opacity="0.86"
          />

          {/* Single fluid sweeping asymmetric curve matching exact Archive #1B120D */}
          <path
            d="M0 148V120C440 30 1000 44 1440 96V148H0Z"
            fill={bottomFill}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * Transition 5: Signature Glowing Burnt-Orange Solar Horizon Arch
 * Used for Workbench (#F3EAE0) -> Midnight Obsidian Contact Footer (#0A0604).
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
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 0.55, 1], [1.1, 0.96, 0.72]);

  const strokeId = `${idPrefix}-stroke`;
  const fillId = `${idPrefix}-fill`;
  const blurId = `${idPrefix}-blur`;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none relative w-full -mt-[2px] -mb-[2px] leading-none overflow-hidden select-none ${className}`}
    >
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[86%] max-w-[1180px] h-[146px] rounded-full opacity-72"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 107, 26, 0.42) 0%, rgba(244, 162, 97, 0.2) 46%, rgba(243, 234, 224, 0) 76%)",
        }}
      />
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { scaleY, transformOrigin: "bottom center" }
        }
        className="w-full will-change-transform"
      >
        <svg
          viewBox="0 0 1440 156"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          className="pointer-events-none relative z-10 block w-full h-[80px] sm:h-[114px] lg:h-[148px]"
        >
          <defs>
            <linearGradient
              id={strokeId}
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#C85A17" stopOpacity="0" />
              <stop offset="24%" stopColor="#E85D04" stopOpacity="0.88" />
              <stop offset="50%" stopColor="#FF7E2D" stopOpacity="1" />
              <stop offset="76%" stopColor="#E85D04" stopOpacity="0.88" />
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
            <filter
              id={blurId}
              x="-6%"
              y="-40%"
              width="112%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="7.5" />
            </filter>
          </defs>

          {/* Diffused solar burnt-orange & apricot silk corona above the arch */}
          <path
            d="M0 112C360 10 1080 10 1440 112"
            stroke={`url(#${strokeId})`}
            strokeWidth="16"
            filter={`url(#${blurId})`}
            opacity="0.92"
          />

          <path
            d="M0 156V118C360 18 1080 18 1440 118V156H0Z"
            fill={`url(#${fillId})`}
          />
        </svg>
      </motion.div>
    </div>
  );
}
