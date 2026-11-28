"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import {
  CINEMA_EASE,
  REPLAY_VIEWPORT,
  createCinemaVariants,
  createOrchestratorVariants,
  useIsMobile,
} from "@/components/SectionCurves";

interface DomainSpec {
  id: string;
  label: string;
  shortLabel: string;
  workbenchId: string;
  workbenchFile: string;
  headline: string;
  summary: string;
  capabilities: readonly { name: string; focus: string }[];
  principles: readonly { num: string; title: string; detail: string }[];
}

const ARCHITECTURE_DOMAINS: DomainSpec[] = [
  {
    id: "solidity-evm",
    label: "Solidity & EVM Internals",
    shortLabel: "Solidity & EVM",
    workbenchId: "l2",
    workbenchFile: "SwapPopQueue.yul",
    headline: "Deterministic state layouts and inline Yul gas engineering.",
    summary:
      "Storage slot packing, constant-time swap-and-pop queues, and collision-safe EIP-1822 UUPS proxy architectures engineered for Ethereum and EVM-compatible mainnets.",
    capabilities: [
      {
        name: "Solidity 0.8+",
        focus: "Custom errors, checked math, modular interfaces",
      },
      {
        name: "Yul & EVM Internals",
        focus: "Inline assembly, slot packing, calldata layout",
      },
      {
        name: "Ethereum & EVM Mainnets",
        focus: "Production multi-contract DeFi deployments",
      },
      {
        name: "UUPS & Proxies",
        focus: "EIP-1822 storage gaps and safe upgrades",
      },
    ],
    principles: [
      {
        num: "01",
        title: "Constant-Time Data Structures",
        detail:
          "Eliminate linear array scans with 1-based index mappings and O(1) swap-and-pop removal so gas cost remains bounded at scale.",
      },
      {
        num: "02",
        title: "Storage-Gap Safe Upgradeability",
        detail:
          "Reserve explicit storage gaps and inspect slot layouts inside CI before authorizing any UUPS V2 implementation upgrade.",
      },
      {
        num: "03",
        title: "Targeted Inline Yul Assembly",
        detail:
          "Drop to Yul only on proven hot paths such as array length updates and packed slot writes while keeping core accounting readable in Solidity 0.8+.",
      },
    ],
  },
  {
    id: "security-audits",
    label: "Protocol Security & Audits",
    shortLabel: "Security & Audits",
    workbenchId: "l1",
    workbenchFile: "ClaimsGovernor.sol",
    headline: "Threat-modeled invariants verified before mainnet launch.",
    summary:
      "Stateful Foundry handler fuzzing, Slither static sweeps, prior-block voting checkpoints, and Checks-Effects-Interactions isolation across every value-bearing state transition.",
    capabilities: [
      {
        name: "Foundry & Anvil",
        focus: "Stateful handler-based invariant fuzzing and fork tests",
      },
      {
        name: "Slither Static Analysis",
        focus: "Automated vulnerability sweeps and CI security gates",
      },
      {
        name: "Flash-Loan & Replay Defense",
        focus: "Prior-block snapshots, Timelocks, and nonce locks",
      },
      {
        name: "Oracle Circuit Breakers",
        focus: "Chainlink staleness guards and 15% NAV deviation halts",
      },
    ],
    principles: [
      {
        num: "01",
        title: "Flash-Loan Resistant Snapshots",
        detail:
          "Anchor governance and insurance claim adjudication strictly to block.number - 1 checkpoints with TimelockController execution delays.",
      },
      {
        num: "02",
        title: "Handler-Based Invariant Fuzzing",
        detail:
          "Stress-test multi-actor call sequences in Foundry to verify protocol solvency, oracle staleness guards, and role boundaries under adversarial ordering.",
      },
      {
        num: "03",
        title: "Static & Replay Defenses",
        detail:
          "Pair Slither CI sweeps with deterministic messageId nonce locking so cross-chain relays and delegated signatures cannot replay.",
      },
    ],
  },
  {
    id: "defi-standards",
    label: "DeFi & Tokenization",
    shortLabel: "DeFi & RWA",
    workbenchId: "l3",
    workbenchFile: "ComplianceHook.sol",
    headline: "Institutional compliance, yield vaults, and cross-chain relays.",
    summary:
      "Production primitives combining ERC-3643 permissioned transfers, ERC-4626 Aave V3 vaults, ERC-4337 smart account paymasters, and Chainlink CCIP, VRF, and NAV feeds.",
    capabilities: [
      {
        name: "ERC-3643 RWA Compliance",
        focus: "On-chain KYC/OFAC registries inside transfer hooks",
      },
      {
        name: "ERC-4626 & Aave V3 Vaults",
        focus: "Tokenized yield strategies with share inflation guards",
      },
      {
        name: "ERC-4337 Account Abstraction",
        focus: "EntryPoint validation and gasless Paymaster flows",
      },
      {
        name: "Chainlink CCIP, VRF & Oracles",
        focus: "Cross-chain margin relays, randomness, and NAV feeds",
      },
    ],
    principles: [
      {
        num: "01",
        title: "On-Chain Transfer Compliance",
        detail:
          "Enforce ERC-3643 identity registries, sanctions checks, and 15% Chainlink NAV circuit breakers directly inside ERC-20 transfer hooks.",
      },
      {
        num: "02",
        title: "Inflation-Protected Yield Vaults",
        detail:
          "Route ERC-4626 capital reserves into Aave V3 liquidity strategies with virtual share offsets to block first-depositor donation exploits.",
      },
      {
        num: "03",
        title: "Gasless Smart Account Settlement",
        detail:
          "Integrate canonical ERC-4337 EntryPoint flows and custom paymasters so traders execute leveraged perpetuals without native gas friction.",
      },
    ],
  },
  {
    id: "fullstack-web3",
    label: "Full-Stack Web3 Systems",
    shortLabel: "Full-Stack Web3",
    workbenchId: "l4",
    workbenchFile: "CCIPMarginReceiver.sol",
    headline: "End-to-end dApp orchestration from ABI layer to live settlement.",
    summary:
      "Strict TypeScript contract bindings wired to Next.js App Router, Wagmi, and Viem so traders, keepers, and compliance operators interact with live on-chain state cleanly.",
    capabilities: [
      {
        name: "Next.js & TypeScript",
        focus: "App Router protocol interfaces with strict ABI typing",
      },
      {
        name: "Wagmi & Viem",
        focus: "Simulated writes, multicall reads, and wallet sessions",
      },
      {
        name: "EIP-712 & Gasless UX",
        focus: "Typed domain signing and sponsored UserOperation relays",
      },
      {
        name: "Keeper & Telemetry Views",
        focus: "Live vault utilization, oracle health, and batch status",
      },
    ],
    principles: [
      {
        num: "01",
        title: "Strict End-to-End ABI Typing",
        detail:
          "Eliminate runtime calldata mismatches with typed Viem clients and Wagmi contract hooks across read, simulate, and write flows.",
      },
      {
        num: "02",
        title: "Real-Time Settlement Visibility",
        detail:
          "Surface oracle health, vault utilization, and keeper execution state clearly without hiding protocol mechanics from operators.",
      },
      {
        num: "03",
        title: "Zero-Friction Operator Flows",
        detail:
          "Combine gasless ERC-4337 transaction sponsorship and EIP-712 structured signatures with crisp responsive interfaces.",
      },
    ],
  },
];

interface ArchitectureStageProps {
  onInspectWorkbench: (insightId: string) => void;
}

export default function ArchitectureStage({
  onInspectWorkbench,
}: ArchitectureStageProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const stageRef = useRef<HTMLElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  const [activeDomainId, setActiveDomainId] = useState<string>(
    ARCHITECTURE_DOMAINS[0].id
  );

  const activeDomain = useMemo(
    () =>
      ARCHITECTURE_DOMAINS.find((d) => d.id === activeDomainId) ??
      ARCHITECTURE_DOMAINS[0],
    [activeDomainId]
  );

  // Section 2: Masked Curtain + Bottom-Left Diagonal Sweep + Cinema Lens Pull-Back (scale 1.07 -> 1)
  const sectionOrchestrator = useMemo(
    () => createOrchestratorVariants(0, 0),
    []
  );

  const headlineVariants = useMemo(
    () =>
      createCinemaVariants({
        y: "105%",
        duration: 1.2,
        delay: 0,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );

  const subtitleVariants = useMemo(
    () =>
      createCinemaVariants({
        y: 26,
        duration: 1.15,
        delay: 0.14,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );

  const tabsOrchestrator = useMemo(
    () => createOrchestratorVariants(0.12, 0.2),
    []
  );

  const tabItemVariants = useMemo(
    () =>
      createCinemaVariants({
        x: -44,
        y: 34,
        scale: 0.94,
        duration: 1.15,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );

  // High-end Cinema Lens Pull-Back (scale: 1.07 -> 1, x: 48 -> 0, opacity: 0 -> 1, 1.35s)
  const specPanelVariants = useMemo(
    () =>
      createCinemaVariants({
        x: 48,
        scale: 1.07,
        duration: 1.35,
        delay: 0.26,
        isMobile,
        reducedMotion: prefersReducedMotion,
      }),
    [isMobile, prefersReducedMotion]
  );

  const handleStageMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const spot = spotlightRef.current;
      const stage = stageRef.current;
      if (!spot || !stage) return;
      const rect = stage.getBoundingClientRect();
      spot.style.setProperty("--stage-x", `${e.clientX - rect.left}px`);
      spot.style.setProperty("--stage-y", `${e.clientY - rect.top}px`);
    },
    []
  );

  const handleSpecularMove = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    },
    []
  );

  return (
    /* Section 2: Architecture — Masked Curtain + Diagonal Sweep + Cinema Lens Pull-Back */
    <section
      ref={stageRef}
      id="architecture"
      aria-label="Engineering Architecture"
      onMouseMove={handleStageMouseMove}
      className="relative -mt-[2px] bg-[#140E0B] text-[#FAF6F0] silk-grain-dark pt-10 sm:pt-14 lg:pt-16 pb-24 sm:pb-32 overflow-hidden scroll-mt-24 section-perf"
    >
      {/* Smooth Cursor-Following Warm Molten-Copper Radial Spotlight */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 stage-spotlight-dark transition-opacity duration-300"
      />

      {/* Lightweight zero-blur pure CSS radial gradient ambient washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-[-8%] w-[440px] h-[560px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(232, 93, 4, 0.2) 0%, rgba(217, 119, 54, 0.07) 44%, rgba(20, 14, 11, 0) 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 right-[-8%] w-[420px] h-[520px] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 140, 6, 0.14) 0%, rgba(20, 14, 11, 0) 70%)",
        }}
      />

      <motion.div
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={REPLAY_VIEWPORT}
        variants={sectionOrchestrator}
        className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Beat 1: Masked Editorial Curtain Rise (y: 105% -> 0%), Beat 2 (+0.14s): Subtitle Rises */}
        <div className="max-w-3xl">
          <div className="overflow-hidden pb-1">
            <motion.h2
              variants={headlineVariants}
              className="font-display font-bold text-[#FAF6F0] text-3xl sm:text-4xl lg:text-[3rem] leading-[1.08] tracking-[-0.032em]"
              style={{ textWrap: "balance" }}
            >
              Built for Adversarial{" "}
              <span className="text-[#FF6B1A]">Mainnet Execution.</span>
            </motion.h2>
          </div>

          <motion.p
            variants={subtitleVariants}
            data-testid="section-subtitle-architecture"
            className="mt-4 max-w-2xl text-left text-[16px] sm:text-[17.5px] leading-[1.65] font-normal text-[#D8CEC4]"
          >
            The core engineering disciplines governing how every smart contract
            system is specified, verified, and deployed across Ethereum and EVM
            networks.
          </motion.p>
        </div>

        {/* Beat 3: Pillar Navigation Tabs Sweep Diagonally from Bottom-Left (-44, +34, 0.94 -> 0, 0, 1) */}
        <div className="mt-10 flex justify-start">
          <motion.div
            role="tablist"
            aria-label="Engineering architecture domains"
            variants={tabsOrchestrator}
            className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex items-center gap-1 p-1.5 rounded-[28px] sm:rounded-full bg-[#1E1510]/95 shadow-[inset_0_1px_0_rgba(250,246,240,0.08),0_18px_38px_-20px_rgba(0,0,0,0.85)]"
          >
            {ARCHITECTURE_DOMAINS.map((domain) => {
              const isActive = domain.id === activeDomain.id;
              return (
                <motion.button
                  key={domain.id}
                  type="button"
                  role="tab"
                  data-testid={`arch-tab-${domain.id}`}
                  aria-selected={isActive}
                  onClick={() => setActiveDomainId(domain.id)}
                  variants={tabItemVariants}
                  className={`relative inline-flex items-center justify-center min-h-[44px] px-3.5 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] ${
                    isActive
                      ? "text-[#FAF6F0]"
                      : "text-[#A69688] hover:text-[#FAF6F0]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="architecture-active-tab"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                      }}
                      className="absolute inset-0 rounded-full bg-[#E85D04] shadow-[0_10px_24px_-10px_rgba(232,93,4,0.85)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{domain.shortLabel}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Beat 4: Active Spec Panel — Cinema Lens Pull-Back (scale: 1.07 -> 1, x: 48 -> 0, 1.35s) */}
        <motion.div variants={specPanelVariants} className="mt-10 origin-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeDomain.id}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, scale: 0.97, x: 20 }
              }
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, scale: 0.985, x: -14 }
              }
              transition={{ duration: 0.55, ease: CINEMA_EASE }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
            >
              {/* Left: Domain Statement + 4 Tonal Capability Rows */}
              <div className="lg:col-span-5">
                <h3 className="font-display text-2xl sm:text-[1.75rem] font-bold text-[#FAF6F0] tracking-[-0.028em] leading-[1.2]">
                  {activeDomain.headline}
                </h3>
                <p className="mt-3.5 text-sm sm:text-[15.5px] leading-[1.72] text-[#D8CEC4]">
                  {activeDomain.summary}
                </p>

                <ul
                  aria-label={`${activeDomain.label} capabilities`}
                  className="mt-8 space-y-3"
                >
                  {activeDomain.capabilities.map((item, idx) => (
                    <motion.li
                      key={item.name}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 14 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.65,
                        delay: idx * 0.055,
                        ease: CINEMA_EASE,
                      }}
                      className="rounded-[28px] bg-[#1E1510]/90 hover:bg-[#241913] hover:-translate-y-0.5 px-5 py-4 flex items-start gap-3.5 shadow-[inset_0_1px_0_rgba(250,246,240,0.07),0_14px_32px_-22px_rgba(0,0,0,0.75)] hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.18),0_18px_38px_-20px_rgba(232,93,4,0.22)] transition-[background-color,transform,box-shadow] duration-200"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 w-2 h-2 rounded-full bg-[#FF6B1A] shrink-0 shadow-[0_0_10px_rgba(255,107,26,0.65)]"
                      />
                      <div className="min-w-0">
                        <p className="font-display text-[15px] font-bold text-[#FAF6F0] tracking-[-0.015em]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-[#A69688]">
                          {item.focus}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Right: Numbered Architectural Principles (01, 02, 03) + Action */}
              <div className="lg:col-span-7">
                <ol className="space-y-4">
                  {activeDomain.principles.map((principle, idx) => (
                    <motion.li
                      key={principle.num}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 16 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: idx * 0.07,
                        ease: CINEMA_EASE,
                      }}
                      onMouseMove={handleSpecularMove}
                      className="specular-surface-dark overflow-hidden rounded-[32px] bg-[#1C140F]/92 hover:bg-[#221711] hover:-translate-y-0.5 p-6 sm:p-7 flex items-start gap-5 sm:gap-6 shadow-[inset_0_1px_0_rgba(250,246,240,0.08),0_22px_46px_-26px_rgba(0,0,0,0.78)] hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.22),0_26px_54px_-24px_rgba(232,93,4,0.26)] transition-[background-color,transform,box-shadow] duration-200"
                    >
                      <span className="relative z-10 font-mono-tabular text-sm sm:text-base font-semibold text-[#FF6B1A] tracking-[0.06em] pt-0.5 shrink-0">
                        {principle.num}
                      </span>
                      <div className="relative z-10 min-w-0">
                        <h4 className="font-display text-lg sm:text-xl font-bold text-[#FAF6F0] tracking-[-0.02em]">
                          {principle.title}
                        </h4>
                        <p className="mt-2 text-sm sm:text-[15px] leading-[1.7] text-[#D8CEC4]">
                          {principle.detail}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ol>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      onInspectWorkbench(activeDomain.workbenchId)
                    }
                    className="group btn-spring btn-cta-sheen inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-[#E85D04] hover:bg-[#D14F00] text-[#FAF6F0] text-sm font-semibold cursor-pointer shadow-[0_14px_30px_-14px_rgba(232,93,4,0.68)] hover:shadow-[0_18px_36px_-14px_rgba(232,93,4,0.82)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6F0]"
                  >
                    <span className="relative z-10">
                      Inspect Related Solidity Code
                    </span>
                    <ArrowDown
                      className="relative z-10 w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
                      aria-hidden="true"
                    />
                  </button>

                  <span className="font-mono-tabular text-xs text-[#A69688]">
                    Opens {activeDomain.workbenchFile}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
