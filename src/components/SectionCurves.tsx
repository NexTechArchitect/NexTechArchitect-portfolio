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
 * Hero Half-Stage Liquid-Silk Curve: Deep Velvet Espresso (#18100C) -> Warm Ivory (#FAF6F0)
 * Sweeps directly beneath the Hero H1 via a wide, graceful asymmetric Bezier wave curve.
 * Scroll-reactive on GPU scaleY / translateY only, traced with a soft diffused burnt-orange
 * and warm-champagne ambient light glow (zero harsh 1px line, exact hex match).
 */
export function HeroDarkToIvoryCurve({
  idPrefix = "hero-dark-to-ivory",
  bottomFill = "#FAF6F0",
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
  const scaleY = useTransform(scrollYProgress, [0, 0.55, 1], [1.08, 0.96, 0.68]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, 10]);

  const glowId = `${idPrefix}-glow`;
  const mistId = `${idPrefix}-mist`;
  const blurId = `${idPrefix}-blur`;

  return (
    <div
      ref={containerRef}
      data-testid="hero-dark-to-ivory-curve"
      aria-hidden="true"
      className={`pointer-events-none relative w-full -mt-[2px] -mb-[2px] leading-none overflow-hidden select-none ${className}`}
    >
      {/* Diffused burnt-orange & champagne horizon aura bathing the wave crest */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[92%] max-w-[1380px] h-[126px] rounded-full opacity-75"
        style={{
          background:
            "radial-gradient(ellipse 68% 58% at 54% 58%, rgba(255, 94, 14, 0.28) 0%, rgba(244, 162, 97, 0.14) 44%, rgba(24, 16, 12, 0) 76%)",
        }}
      />

      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { scaleY, y: translateY, transformOrigin: "bottom center" }
        }
        className="w-full will-change-transform"
      >
        <svg
          viewBox="0 0 1440 132"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          className="pointer-events-none relative z-10 block w-full h-[74px] sm:h-[98px] lg:h-[116px]"
        >
          <defs>
            <linearGradient
              id={glowId}
              x1="0"
              y1="66"
              x2="1440"
              y2="66"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#E85D04" stopOpacity="0" />
              <stop offset="22%" stopColor="#FF5E0E" stopOpacity="0.28" />
              <stop offset="52%" stopColor="#F6BD87" stopOpacity="0.42" />
              <stop offset="78%" stopColor="#E85D04" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#D97736" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id={mistId}
              x1="720"
              y1="14"
              x2="720"
              y2="124"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FF5E0E" stopOpacity="0.24" />
              <stop offset="52%" stopColor="#F4A261" stopOpacity="0.12" />
              <stop offset="100%" stopColor={bottomFill} stopOpacity="0" />
            </linearGradient>

            <filter
              id={blurId}
              x="-8%"
              y="-45%"
              width="116%"
              height="190%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          {/* Soft atmospheric champagne-amber mist rising gently behind the wave */}
          <path
            d="M0 132V76C260 18 590 12 910 58C1145 92 1320 82 1440 44V132H0Z"
            fill={`url(#${mistId})`}
            filter={`url(#${blurId})`}
          />

          {/* Diffused ambient light ribbon hugging the asymmetric curve (zero harsh 1px stroke) */}
          <path
            d="M0 86C260 28 590 22 910 68C1145 102 1320 92 1440 54"
            stroke={`url(#${glowId})`}
            strokeWidth="14"
            filter={`url(#${blurId})`}
            opacity="0.88"
          />

          {/* Exact Warm Ivory (#FAF6F0) asymmetric sculptural wave fill */}
          <path
            d="M0 132V90C260 32 590 26 910 72C1145 106 1320 96 1440 58V132H0Z"
            fill={bottomFill}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * Transition 1: Scroll-Flattening Sculptural Horizon Sweep
 * Used for Hero (#FAF6F0) -> Architecture (#140E0B).
 * A single graceful sculptural arc that glides smoothly on scroll (GPU scaleY only),
 * traced with a feathered burnt-orange ambient light band (zero harsh hairline).
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
  const scaleY = useTransform(scrollYProgress, [0, 0.55, 1], [1.14, 0.92, 0.44]);

  const glowId = `${idPrefix}-horizon-glow`;
  const rimId = `${idPrefix}-horizon-rim`;
  const blurId = `${idPrefix}-horizon-blur`;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none relative w-full -mt-[2px] -mb-[2px] leading-none overflow-hidden select-none ${className}`}
    >
      {/* Razor-soft luminous burnt-orange ambient halo hovering over the horizon */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-2 w-[82%] max-w-[1100px] h-[120px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.28) 0%, rgba(244, 140, 6, 0.12) 48%, rgba(250, 246, 240, 0) 76%)",
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
          viewBox="0 0 1440 136"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          className="pointer-events-none relative z-10 block w-full h-[68px] sm:h-[98px] lg:h-[124px]"
        >
          <defs>
            <linearGradient
              id={glowId}
              x1="720"
              y1="6"
              x2="720"
              y2="122"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#E85D04" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#E85D04" stopOpacity="0" />
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
              <stop offset="28%" stopColor="#E85D04" stopOpacity="0.48" />
              <stop offset="50%" stopColor="#F48C06" stopOpacity="0.68" />
              <stop offset="72%" stopColor="#E85D04" stopOpacity="0.48" />
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

          <path
            d="M0 136V90C380 4 1060 4 1440 90V136H0Z"
            fill={`url(#${glowId})`}
            filter={`url(#${blurId})`}
          />
          <path
            d="M0 102C380 16 1060 16 1440 102"
            stroke={`url(#${rimId})`}
            strokeWidth="10"
            filter={`url(#${blurId})`}
            opacity="0.85"
          />
          <path
            d="M0 136V104C380 18 1060 18 1440 104V136H0Z"
            fill={bottomFill}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * Transition 3: Graceful Sweeping Asymmetric Ribbon Curve
 * Used for Flagship Protocols (#FBF8F3) -> Archive (#1B120D).
 * A single fluid sweeping cubic Bezier curve accented with a diffused warm copper mist.
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
  const scaleY = useTransform(scrollYProgress, [0, 0.55, 1], [1.1, 0.94, 0.58]);

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
          viewBox="0 0 1440 144"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          className="pointer-events-none block w-full h-[72px] sm:h-[104px] lg:h-[132px]"
        >
          <defs>
            <linearGradient
              id={ribbonGlowId}
              x1="0"
              y1="16"
              x2="1440"
              y2="132"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#D97736" stopOpacity="0.1" />
              <stop offset="48%" stopColor="#E85D04" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#F48C06" stopOpacity="0.14" />
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
              <stop offset="38%" stopColor="#E85D04" stopOpacity="0.58" />
              <stop offset="72%" stopColor="#F48C06" stopOpacity="0.68" />
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
              <feGaussianBlur stdDeviation="6.5" />
            </filter>
          </defs>

          {/* Subtle translucent copper shadow crest */}
          <path
            d="M0 144V104C420 12 980 26 1440 80V144H0Z"
            fill={`url(#${ribbonGlowId})`}
            filter={`url(#${blurId})`}
          />

          <path
            d="M0 116C440 26 1000 40 1440 92"
            stroke={`url(#${rimId})`}
            strokeWidth="10"
            filter={`url(#${blurId})`}
            opacity="0.82"
          />

          {/* Single fluid sweeping asymmetric curve matching exact Archive #1B120D */}
          <path
            d="M0 144V118C440 28 1000 42 1440 94V144H0Z"
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
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[84%] max-w-[1140px] h-[142px] rounded-full opacity-68"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 94, 14, 0.4) 0%, rgba(244, 140, 6, 0.18) 46%, rgba(243, 234, 224, 0) 76%)",
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
          viewBox="0 0 1440 152"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          className="pointer-events-none relative z-10 block w-full h-[78px] sm:h-[112px] lg:h-[144px]"
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
              <stop offset="26%" stopColor="#E85D04" stopOpacity="0.88" />
              <stop offset="50%" stopColor="#FF7A1A" stopOpacity="1" />
              <stop offset="74%" stopColor="#E85D04" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#C85A17" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={fillId}
              x1="720"
              y1="16"
              x2="720"
              y2="152"
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
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          {/* Diffused solar burnt-orange corona above the arch */}
          <path
            d="M0 112C360 12 1080 12 1440 112"
            stroke={`url(#${strokeId})`}
            strokeWidth="14"
            filter={`url(#${blurId})`}
            opacity="0.9"
          />

          <path
            d="M0 152V116C360 16 1080 16 1440 116V152H0Z"
            fill={`url(#${fillId})`}
          />
        </svg>
      </motion.div>
    </div>
  );
}
