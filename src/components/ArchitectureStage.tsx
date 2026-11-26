"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

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
  const [activeDomainId, setActiveDomainId] = useState<string>(
    ARCHITECTURE_DOMAINS[0].id
  );

  const activeDomain = useMemo(
    () =>
      ARCHITECTURE_DOMAINS.find((d) => d.id === activeDomainId) ??
      ARCHITECTURE_DOMAINS[0],
    [activeDomainId]
  );

  return (
    <section
      id="architecture"
      className="relative bg-[#140E0B] text-[#FAF6F0] silk-grain-dark pt-12 sm:pt-16 lg:pt-20 pb-24 sm:pb-32 scroll-mt-12 overflow-x-clip"
    >
      {/* Subtle edge-hugging warm copper vertical ambient washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-[-8%] w-[460px] h-[640px] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 93, 4, 0.22) 0%, rgba(217, 107, 39, 0.08) 46%, rgba(20, 14, 11, 0) 74%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 right-[-8%] w-[440px] h-[580px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(244, 140, 6, 0.16) 0%, rgba(20, 14, 11, 0) 72%)",
        }}
      />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Left-Aligned Editorial Header with Staggered Entrance (Zero Straight Line) */}
        <div className="max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-[#FAF6F0] text-3xl sm:text-4xl lg:text-[3rem] leading-[1.05] tracking-[-0.032em]"
            style={{ textWrap: "balance" }}
          >
            Built for Adversarial{" "}
            <span className="text-[#E85D04]">Mainnet Execution.</span>
          </motion.h2>

          <motion.p
            data-testid="section-subtitle-architecture"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.55,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-4 max-w-2xl text-left text-[16px] sm:text-[17.5px] leading-[1.65] font-normal text-[#D9CEC2]"
          >
            The core engineering disciplines governing how every smart contract
            system is specified, verified, and deployed across Ethereum and EVM
            networks.
          </motion.p>
        </div>

        {/* Single Sleek Segmented Interactive Tab Bar with Sliding Burnt-Orange Pill */}
        <div className="mt-10 flex justify-start">
          <div
            role="tablist"
            aria-label="Engineering architecture domains"
            className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex items-center gap-1 p-1.5 rounded-2xl sm:rounded-full bg-[#1E1510] border border-[#FAF6F0]/12 shadow-[0_14px_34px_-18px_rgba(0,0,0,0.8)]"
          >
            {ARCHITECTURE_DOMAINS.map((domain) => {
              const isActive = domain.id === activeDomain.id;
              return (
                <button
                  key={domain.id}
                  type="button"
                  role="tab"
                  data-testid={`arch-tab-${domain.id}`}
                  aria-selected={isActive}
                  onClick={() => setActiveDomainId(domain.id)}
                  className={`relative inline-flex items-center justify-center min-h-[44px] px-3.5 sm:px-5 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
                    isActive
                      ? "text-[#FAF6F0]"
                      : "text-[#B8A699] hover:text-[#FAF6F0]"
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
                      className="absolute inset-0 rounded-xl sm:rounded-full bg-[#E85D04] shadow-[0_10px_24px_-10px_rgba(232,93,4,0.85)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{domain.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Open, High-Contrast Tonal Editorial Split (Zero Straight Divider Lines) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDomain.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
          >
            {/* Left: Large Domain Statement + 4 Tonal Capability Pills */}
            <div className="lg:col-span-5">
              <h3 className="font-display text-2xl sm:text-[1.75rem] font-bold text-[#FAF6F0] tracking-[-0.028em] leading-[1.2]">
                {activeDomain.headline}
              </h3>
              <p className="mt-3.5 text-sm sm:text-[15.5px] leading-[1.72] text-[#D9CEC2]">
                {activeDomain.summary}
              </p>

              <ul
                aria-label={`${activeDomain.label} capabilities`}
                className="mt-8 space-y-3"
              >
                {activeDomain.capabilities.map((item) => (
                  <li
                    key={item.name}
                    className="rounded-2xl bg-[#1D140F]/85 px-4 py-3.5 flex items-start gap-3.5"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 w-2 h-2 rounded-full bg-[#E85D04] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-display text-[15px] font-bold text-[#FAF6F0] tracking-[-0.015em]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-[#B5A598]">
                        {item.focus}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Numbered Architectural Principles (01, 02, 03) + Action */}
            <div className="lg:col-span-7">
              <ol className="space-y-4">
                {activeDomain.principles.map((principle) => (
                  <li
                    key={principle.num}
                    className="rounded-[24px] bg-[#1B130E]/90 p-5 sm:p-6 flex items-start gap-5 sm:gap-6"
                  >
                    <span className="font-mono-tabular text-sm sm:text-base font-semibold text-[#F48C06] tracking-[0.06em] pt-0.5 shrink-0">
                      {principle.num}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-display text-lg sm:text-xl font-bold text-[#FAF6F0] tracking-[-0.02em]">
                        {principle.title}
                      </h4>
                      <p className="mt-2 text-sm sm:text-[15px] leading-[1.7] text-[#D9CEC2]">
                        {principle.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onInspectWorkbench(activeDomain.workbenchId)}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-[#E85D04] hover:bg-[#D14F00] active:scale-[0.98] text-[#FAF6F0] text-sm font-semibold transition-[background-color,transform] duration-150 cursor-pointer shadow-[0_14px_30px_-14px_rgba(232,93,4,0.68)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6F0]"
                >
                  <span>Inspect Related Solidity Code</span>
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </button>

                <span className="font-mono-tabular text-xs text-[#A8988B]">
                  Opens {activeDomain.workbenchFile}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
