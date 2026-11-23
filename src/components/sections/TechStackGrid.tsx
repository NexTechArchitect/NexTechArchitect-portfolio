"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Hammer,
  Cpu,
  ShieldCheck,
  Link2,
  TrendingUp,
  KeyRound,
  Layers,
  Vault,
  Database,
  Globe,
  Wallet,
  Terminal,
  Network,
} from "lucide-react";
import type { TechDomain, TechStackItem } from "@/data/projects";
import { filterTechByDomain } from "@/lib/portfolio";

const DOMAINS: TechDomain[] = [
  "All",
  "Protocol & EVM",
  "Security & Testing",
  "DeFi Standards",
  "Full-Stack Web3",
];

const TECH_ICONS: Record<
  TechStackItem["iconKey"],
  React.ComponentType<{ className?: string }>
> = {
  code: Code2,
  hammer: Hammer,
  cpu: Cpu,
  shield: ShieldCheck,
  link: Link2,
  trending: TrendingUp,
  key: KeyRound,
  layers: Layers,
  vault: Vault,
  database: Database,
  globe: Globe,
  wallet: Wallet,
  terminal: Terminal,
  network: Network,
};

export default function TechStackGrid() {
  const [activeDomain, setActiveDomain] = useState<TechDomain>("All");

  const visibleItems = useMemo(
    () => filterTechByDomain(activeDomain),
    [activeDomain]
  );

  return (
    <section
      id="architecture"
      className="relative bg-white border-t border-slate-200/80 py-20 sm:py-28 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header + Interactive Domain Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-mono-tabular font-semibold text-[#0052FF] mb-3">
              01. Architecture & Security
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1220] leading-[1.08] mb-4 text-balance">
              Core Engineering Stack
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every tool in this stack is chosen for threat-modeled security,
              invariant-proven solvency, and Yul-optimized gas efficiency across
              mainnet EVM deployments.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter engineering stack by domain"
            className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 self-start lg:self-end"
          >
            {DOMAINS.map((domain) => {
              const isSelected = activeDomain === domain;
              return (
                <button
                  key={domain}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveDomain(domain)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#0B1220] text-white shadow-sm"
                      : "text-slate-600 hover:text-[#0B1220]"
                  }`}
                >
                  {domain}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hairline Architectural Stack Grid */}
        <div
          data-testid="tech-stack-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {visibleItems.map((item) => {
            const Icon = TECH_ICONS[item.iconKey] || Code2;
            return (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="group p-5 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-slate-200/80 hover:border-[#0052FF]/35 transition-all duration-200 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 group-hover:border-[#0052FF]/30 flex items-center justify-center text-[#0052FF] transition-colors">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-mono-tabular text-slate-500">
                      {item.domain}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#0B1220] tracking-tight mb-1.5">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.focus}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}