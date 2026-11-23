"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  ShieldCheck,
  Terminal,
  Twitter,
} from "lucide-react";
import ShaderCanvas from "@/components/ui/ShaderCanvas";
import { fullStackProjects, type ProjectItem } from "@/data/projects";
import { formatContractAddress } from "@/lib/portfolio";

interface HeroSectionProps {
  openModal: (item: ProjectItem, type: "skill" | "project") => void;
}

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/NexTechArchitect",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/amit-kumar-811a11277",
    icon: Linkedin,
  },
  {
    label: "X / Twitter",
    href: "https://x.com/itZ_AmiT0",
    icon: Twitter,
  },
  {
    label: "Email",
    href: "mailto:nextech.amit@gmail.com",
    icon: Mail,
  },
] as const;

const METRICS = [
  {
    value: "6",
    label: "Production DeFi Protocols",
    sub: "Deployed on Base Mainnet",
  },
  {
    value: "5,000+",
    label: "Foundry Fuzz Sequences",
    sub: "Stateful Invariant Coverage",
  },
  {
    value: "35%",
    label: "Yul Gas Overhead Cut",
    sub: "O(1) Swap-and-Pop Queues",
  },
  {
    value: "0",
    label: "Critical & High Findings",
    sub: "Slither Static Analysis",
  },
] as const;

const BASE_DEPLOYMENTS = fullStackProjects.slice(0, 3);

export default function HeroSection({ openModal }: HeroSectionProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

  const activeProtocol = BASE_DEPLOYMENTS[selectedIdx] ?? BASE_DEPLOYMENTS[0];

  const handleCopy = (address: string) => {
    navigator.clipboard?.writeText(address);
    setCopiedAddr(address);
    window.setTimeout(() => {
      setCopiedAddr((prev) => (prev === address ? null : prev));
    }, 1800);
  };

  const scrollToProtocols = () => {
    const el = document.getElementById("protocols");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="top"
      className="relative bg-[#F8FAFC] overflow-hidden pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24"
    >
      {/* True WebGL2 GLSL Optical Refraction Backdrop */}
      <ShaderCanvas variant="hero" className="opacity-95" />

      {/* Crisp 1px Architectural Hairline Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 architectural-grid pointer-events-none z-[1]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* 2-Column Balanced Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Kinetic Typography & Core Engineering Thesis */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-mono-tabular text-slate-600 mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1"
            >
              <span className="font-semibold text-[#0B1220]">Amit Kumar</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="text-[#0052FF] font-semibold">
                Smart Contract Engineer & DeFi Protocol Architect
              </span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[#0B1220] leading-[1.03] mb-6 text-balance"
            >
              Engineering Trustless{" "}
              <span className="text-optical-gradient block sm:inline">
                DeFi Infrastructure.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8"
            >
              I design, fuzz, and ship production EVM protocols. Across six live
              deployments on Base Mainnet, my work spans ERC-3643 real-world asset
              compliance, ERC-4626 Aave V3 yield vaults, O(1) keeper automation,
              and 50x non-custodial perpetuals. Every system is hardened with
              Foundry stateful invariant fuzzing, Slither static analysis, and
              inline Yul gas optimization.
            </motion.p>

            {/* Primary CTA + Secondary Text Links */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-9"
            >
              <button
                type="button"
                onClick={scrollToProtocols}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0052FF] hover:bg-[#0040CC] text-white text-sm font-semibold tracking-wide shadow-[0_12px_28px_rgba(0,82,255,0.22)] transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] focus-visible:ring-offset-2"
              >
                <span>Explore Flagship Protocols</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <a
                href="https://github.com/NexTechArchitect"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl glass-surface hover:bg-white text-[#0B1220] text-sm font-semibold transition-all duration-200 whitespace-nowrap shrink-0"
              >
                <Github className="w-4 h-4 text-slate-700" aria-hidden="true" />
                <span>GitHub Repositories</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </a>
            </motion.div>

            {/* Clean Unboxed Social Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2.5 pt-5 border-t border-slate-200/80"
            >
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-xs font-mono-tabular font-medium text-slate-600 hover:text-[#0052FF] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Interactive Base Mainnet Deployment Inspector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex"
          >
            <div className="w-full rounded-3xl glass-surface-strong shadow-[0_24px_60px_rgba(15,23,42,0.08)] p-6 sm:p-7 flex flex-col justify-between">
              <div>
                {/* Inspector Header */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-mono-tabular font-semibold text-[#0B1220]">
                    <Terminal className="w-4 h-4 text-[#0052FF]" aria-hidden="true" />
                    <span>Base Mainnet Deployments</span>
                  </div>
                  <span className="text-xs font-mono-tabular text-slate-500">
                    Verified Contracts
                  </span>
                </div>

                {/* Segmented Protocol Selector */}
                <div
                  role="tablist"
                  aria-label="Select deployed Base Mainnet protocol"
                  className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100/90 mt-4 mb-5"
                >
                  {BASE_DEPLOYMENTS.map((protocol, idx) => {
                    const isSelected = idx === selectedIdx;
                    return (
                      <button
                        key={protocol.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setSelectedIdx(idx)}
                        className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap truncate cursor-pointer ${
                          isSelected
                            ? "bg-white text-[#0052FF] shadow-sm"
                            : "text-slate-600 hover:text-[#0B1220]"
                        }`}
                      >
                        {protocol.shortTitle}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Protocol Summary */}
                <div className="mb-5">
                  <p className="text-xs font-mono-tabular text-[#0891B2] font-semibold mb-1">
                    {activeProtocol.standard}
                  </p>
                  <h2 className="font-display text-xl font-bold text-[#0B1220] tracking-tight mb-1.5">
                    {activeProtocol.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeProtocol.metricDetail}
                  </p>
                </div>

                {/* Verified Contract Addresses */}
                <div className="divide-y divide-slate-200/70 border border-slate-200/80 rounded-2xl bg-[#F8FAFC]/80 overflow-hidden mb-5">
                  {(activeProtocol.contracts || []).map((contract) => {
                    const isCopied = copiedAddr === contract.address;
                    return (
                      <div
                        key={contract.address}
                        className="px-4 py-3 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#0B1220] truncate">
                            {contract.label}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {contract.role}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(contract.address)}
                          aria-label={`Copy ${contract.label} address`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0052FF]/40 text-[11px] font-mono-tabular text-slate-700 hover:text-[#0052FF] transition-colors shrink-0 cursor-pointer"
                        >
                          <span>
                            {isCopied
                              ? "Copied"
                              : formatContractAddress(contract.address)}
                          </span>
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Action Row */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono-tabular text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-[#0052FF]" aria-hidden="true" />
                  <span>Slither & Foundry Verified</span>
                </div>

                <button
                  type="button"
                  onClick={() => openModal(activeProtocol, "project")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1220] hover:bg-[#0052FF] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Inspect Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Verified Base Mainnet Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-16 rounded-2xl glass-surface-strong overflow-hidden"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x-0 sm:divide-x divide-slate-200/80">
            {METRICS.map((metric) => (
              <div key={metric.label} className="p-5 sm:p-6">
                <p className="font-mono-tabular text-2xl sm:text-3xl font-bold text-[#0B1220] tracking-tight mb-1">
                  {metric.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#0052FF]">
                  {metric.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{metric.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}