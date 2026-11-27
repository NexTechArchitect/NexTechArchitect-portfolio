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
 * Top Hero Framing Canopy: Bespoke Asymmetric Deep Velvet Espresso (#140E0B) Gallery Arch
 * Frames the floating frosted-ivory Navbar with soft architectural depth and dissolves
 * into the Warm Ivory (#FAF6F0) Hero via a wide asymmetric Bezier curve cushioned by
 * a feathered champagne-amber glow band and silky studio rim sheen.
 */
export function TopCanopyWave({
  idPrefix = "hero-top-canopy",
}: {
  idPrefix?: string;
}) {
  const fillId = `${idPrefix}-fill`;
  const sheenId = `${idPrefix}-sheen`;
  const mistId = `${idPrefix}-mist`;
  const rimId = `${idPrefix}-rim`;
  const blurId = `${idPrefix}-blur`;

  return (
    <div
      data-testid="hero-top-canopy"
      aria-hidden="true"
      className="pointer-events-none absolute top-0 inset-x-0 z-0 -mb-[2px] leading-none overflow-hidden select-none"
    >
      {/* Silky studio radial warmth blooming gently beneath the asymmetric arch */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[44px] sm:top-[56px] lg:top-[64px] w-[90%] max-w-[1280px] h-[118px] rounded-full opacity-65 ambient-silk-drift"
        style={{
          background:
            "radial-gradient(ellipse 68% 58% at 52% 24%, rgba(232, 93, 4, 0.22) 0%, rgba(244, 158, 76, 0.12) 44%, rgba(250, 246, 240, 0) 78%)",
        }}
      />

      <svg
        viewBox="0 0 1440 138"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        className="pointer-events-none relative z-10 block w-full h-[98px] sm:h-[112px] lg:h-[124px]"
      >
        <defs>
          <linearGradient
            id={fillId}
            x1="720"
            y1="0"
            x2="720"
            y2="128"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#120C09" />
            <stop offset="68%" stopColor="#140E0B" />
            <stop offset="100%" stopColor="#1C130E" />
          </linearGradient>

          {/* Feathered warm champagne & copper ambient crescent behind the espresso edge */}
          <linearGradient
            id={sheenId}
            x1="0"
            y1="96"
            x2="1440"
            y2="96"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E85D04" stopOpacity="0" />
            <stop offset="22%" stopColor="#E85D04" stopOpacity="0.14" />
            <stop offset="48%" stopColor="#F4A261" stopOpacity="0.26" />
            <stop offset="76%" stopColor="#E85D04" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#C85A17" stopOpacity="0" />
          </linearGradient>

          {/* Soft vertical atmospheric fade dissolving sheen cleanly into warm ivory */}
          <linearGradient
            id={mistId}
            x1="720"
            y1="82"
            x2="720"
            y2="136"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E85D04" stopOpacity="0.2" />
            <stop offset="52%" stopColor="#F4A261" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#FAF6F0" stopOpacity="0" />
          </linearGradient>

          {/* Ultra-delicate feathered champagne specular kiss along the crest */}
          <linearGradient
            id={rimId}
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F4A261" stopOpacity="0" />
            <stop offset="18%" stopColor="#E85D04" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#F6BD87" stopOpacity="0.46" />
            <stop offset="82%" stopColor="#E85D04" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#F4A261" stopOpacity="0" />
          </linearGradient>

          <filter
            id={blurId}
            x="-6%"
            y="-40%"
            width="112%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="5.5" />
          </filter>
        </defs>

        {/* Layer 1: Diffused feathered champagne-orange ambient aura following the asymmetric arch */}
        <path
          d="M0 90C190 120 510 126 840 116C1110 108 1310 118 1440 88V122C1260 136 960 132 620 134C320 136 120 124 0 108V90Z"
          fill={`url(#${mistId})`}
          filter={`url(#${blurId})`}
        />

        {/* Layer 2: Soft translucent copper sheen ribbon hugging the arch underside */}
        <path
          d="M0 0H1440V92C1240 122 980 114 710 121C430 128 190 124 0 94V0Z"
          fill={`url(#${sheenId})`}
        />

        {/* Layer 3: Sculptural asymmetric Deep Velvet Espresso gallery arch */}
        <path
          d="M0 0H1440V84C1230 116 970 108 700 115C420 122 185 117 0 86V0Z"
          fill={`url(#${fillId})`}
        />

        {/* Layer 4: Diffused inner champagne sheen glow along the arch edge */}
        <path
          d="M0 86C185 117 420 122 700 115C970 108 1230 116 1440 84"
          stroke={`url(#${rimId})`}
          strokeWidth="3.5"
          filter={`url(#${blurId})`}
          opacity="0.7"
        />
        <path
          d="M0 86C185 117 420 122 700 115C970 108 1230 116 1440 84"
          stroke={`url(#${rimId})`}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

/**
 * Transition 1: Scroll-Flattening Sculptural Horizon Sweep
 * Used for Aperture Bridge (#FAF6F0) -> Architecture (#140E0B).
 * A single graceful sculptural arc that stretches and glides flat smoothly
 * on scroll (GPU scaleY only), traced with a soft burnt-orange ambient glow.
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

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none relative w-full -mt-[2px] -mb-[2px] leading-none overflow-hidden select-none ${className}`}
    >
      {/* Razor-soft luminous burnt-orange ambient halo hovering over the horizon */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-2 w-[78%] max-w-[1040px] h-[110px] rounded-full opacity-45"
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
              <stop offset="0%" stopColor="#E85D04" stopOpacity="0.18" />
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
              <stop offset="0%" stopColor="#D97736" stopOpacity="0.12" />
              <stop offset="28%" stopColor="#E85D04" stopOpacity="0.54" />
              <stop offset="50%" stopColor="#F48C06" stopOpacity="0.74" />
              <stop offset="72%" stopColor="#E85D04" stopOpacity="0.54" />
              <stop offset="100%" stopColor="#D97736" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          <path
            d="M0 136V94C380 8 1060 8 1440 94V136H0Z"
            fill={`url(#${glowId})`}
          />
          <path
            d="M0 136V104C380 18 1060 18 1440 104V136H0Z"
            fill={bottomFill}
          />
          <path
            d="M0 104C380 18 1060 18 1440 104"
            stroke={`url(#${rimId})`}
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * Transition 3: Graceful Sweeping Asymmetric Ribbon Curve
 * Used for Flagship Protocols (#FBF8F3) -> Archive (#1B120D).
 * A single fluid sweeping cubic Bezier curve (zero double humps) accented
 * with a soft warm copper gradient sheen along the crest.
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
              <stop offset="48%" stopColor="#E85D04" stopOpacity="0.22" />
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
              <stop offset="0%" stopColor="#C85A17" stopOpacity="0.14" />
              <stop offset="38%" stopColor="#E85D04" stopOpacity="0.68" />
              <stop offset="72%" stopColor="#F48C06" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#C85A17" stopOpacity="0.16" />
            </linearGradient>
          </defs>

          {/* Subtle translucent copper shadow crest */}
          <path
            d="M0 144V106C420 14 980 28 1440 82V144H0Z"
            fill={`url(#${ribbonGlowId})`}
          />

          {/* Single fluid sweeping asymmetric curve matching exact Archive #1B120D */}
          <path
            d="M0 144V118C440 28 1000 42 1440 94V144H0Z"
            fill={bottomFill}
          />

          <path
            d="M0 118C440 28 1000 42 1440 94"
            stroke={`url(#${rimId})`}
            strokeWidth="1.9"
            vectorEffect="non-scaling-stroke"
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

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none relative w-full -mt-[2px] -mb-[2px] leading-none overflow-hidden select-none ${className}`}
    >
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[82%] max-w-[1100px] h-[134px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.36) 0%, rgba(244, 140, 6, 0.16) 46%, rgba(243, 234, 224, 0) 76%)",
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
              <stop offset="0%" stopColor="#C85A17" stopOpacity="0.22" />
              <stop offset="28%" stopColor="#E85D04" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#F48C06" stopOpacity="1" />
              <stop offset="72%" stopColor="#E85D04" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C85A17" stopOpacity="0.22" />
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
          </defs>
          <path
            d="M0 152V116C360 16 1080 16 1440 116V152H0Z"
            fill={`url(#${fillId})`}
          />
          <path
            d="M0 116C360 16 1080 16 1440 116"
            stroke={`url(#${strokeId})`}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </motion.div>
    </div>
  );
}
