"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Printer,
  ExternalLink,
  Mail,
  ShieldCheck,
  Layers,
  Cpu,
} from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HIGHLIGHTS = [
  {
    protocol: "Nexus RWA Protocol (Base Mainnet)",
    scope: "ERC-3643 Compliance, Chainlink NAV Oracle, Merkle Yield",
    detail:
      "Architected stateless on-chain KYC and OFAC transfer hooks, a 15% 24-hour NAV circuit breaker, and O(1) Merkle yield claims validated with 219+ Foundry tests and zero critical Slither findings.",
  },
  {
    protocol: "On-Chain Automation Protocol (Base Mainnet)",
    scope: "O(1) Keeper Queue, Yul Assembly, Slashing Registry",
    detail:
      "Engineered a constant-time swap-and-pop batch execution queue with staked keeper bonds and inline Yul storage updates, cutting gas overhead by up to 35% without bounded loop limits.",
  },
  {
    protocol: "Sentinel Insurance Protocol (Base Mainnet)",
    scope: "ERC-4626 Vaults, Aave V3 Routing, Flash-Loan Resistant DAO",
    detail:
      "Built capital-efficient ERC-4626 coverage pools routing idle liquidity into Aave V3 with ERC-721 policies and block.number - 1 snapshot adjudication protected by a Veto Council.",
  },
  {
    protocol: "Nexus Perpetuals Protocol OS",
    scope: "50x Leverage DEX, ERC-4337 Paymasters, Chainlink CCIP",
    detail:
      "Designed non-custodial 50x perpetuals margin vaults featuring CCIP messageId replay defense, automated liquidation engines, and gasless ERC-4337 smart account execution.",
  },
];

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Amit Kumar Engineering Dossier and Resume"
          className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6 md:p-10"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0B1220]/45 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200/90 shadow-[0_28px_80px_rgba(15,23,42,0.22)] custom-scrollbar-hide"
          >
            {/* Header Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 sm:px-10 py-5 bg-white/92 backdrop-blur-xl border-b border-slate-200/80">
              <div>
                <p className="text-xs font-mono-tabular text-[#0052FF] font-semibold">
                  Engineering Dossier / Curriculum Vitae
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1220] tracking-tight">
                  Amit Kumar
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume modal"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-[#0B1220] hover:text-white text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                <div className="space-y-1.5">
                  <p className="text-base font-semibold text-[#0B1220]">
                    Smart Contract Engineer & DeFi Protocol Architect
                  </p>
                  <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                    Architecting production EVM infrastructure on Base Mainnet and Ethereum ecosystems with emphasis on mathematical solvency, Foundry stateful invariant fuzzing, Slither static verification, and Yul gas efficiency.
                  </p>
                </div>
              </div>

              {/* Quick Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#0052FF] font-semibold mb-1.5">
                    <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Mainnet Deployments</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">
                    6 production DeFi protocols live on Base Mainnet
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#0891B2] font-semibold mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Verification Rigor</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">
                    Foundry stateful invariant fuzzing and Slither static audits
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#0B1220] font-semibold mb-1.5">
                    <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>EVM Optimization</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">
                    Inline Yul assembly, O(1) queues, and UUPS storage safety
                  </p>
                </div>
              </div>

              {/* Production Protocols */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono-tabular font-semibold tracking-wider text-slate-500">
                  Selected Production Protocols
                </h3>
                <div className="divide-y divide-slate-200/80 border border-slate-200/80 rounded-2xl overflow-hidden">
                  {HIGHLIGHTS.map((item) => (
                    <div key={item.protocol} className="p-5 bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                        <h4 className="font-display text-base font-bold text-[#0B1220]">
                          {item.protocol}
                        </h4>
                        <span className="text-xs font-mono-tabular text-[#0052FF]">
                          {item.scope}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Competencies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <h3 className="text-xs font-mono-tabular font-semibold tracking-wider text-slate-500 mb-2">
                    Smart Contracts & Security
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Solidity 0.8+, Yul Assembly, Foundry, Anvil, Chisel, Stateful Invariant Fuzzing, Slither Static Analysis, ERC-3643, ERC-4626, ERC-4337, ERC-5484, EIP-1822 UUPS, EIP-712, Chainlink CCIP / VRF / Data Feeds, Aave V3.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-mono-tabular font-semibold tracking-wider text-slate-500 mb-2">
                    Full-Stack Web3 Interfaces
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Next.js App Router, React 19, TypeScript, Wagmi, Viem, Tailwind CSS, WebGL2 / GLSL Shaders, Subgraphs, Deterministic Deployment Pipelines.
                  </p>
                </div>
              </div>

              {/* Direct Links */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <a
                  href="mailto:nextech.amit@gmail.com"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0052FF] hover:underline"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>nextech.amit@gmail.com</span>
                </a>
                <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600">
                  <a
                    href="https://github.com/NexTechArchitect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#0B1220] transition-colors"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/amit-kumar-811a11277"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#0B1220] transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href="https://x.com/itZ_AmiT0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#0B1220] transition-colors"
                  >
                    <span>X / Twitter</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
