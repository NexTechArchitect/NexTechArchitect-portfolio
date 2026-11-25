"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Preserved 15 Case Study Imports
import NexusCaseStudy from "../projects/NexusCaseStudy";
import SentinelCaseStudy from "../projects/SentinelCaseStudy";
import StableCoinCaseStudy from "../projects/StableCoinCaseStudy";
import RaffleCaseStudy from "../projects/RaffleCaseStudy";
import AACoreCaseStudy from "../projects/AACoreCaseStudy";
import UUPSCaseStudy from "../projects/UUPSCaseStudy";
import MerkleAirdropCaseStudy from "../projects/MerkleAirdropCaseStudy";
import CuteCatNFTCaseStudy from "../projects/CuteCatNFTCaseStudy";
import SISOTokenCaseStudy from "../projects/SISOTokenCaseStudy";
import OracleFundingCaseStudy from "../projects/OracleFundingCaseStudy";
import NexusPolkaCaseStudy from "../projects/NexusPolkaCaseStudy";
import ReputationCaseStudy from "../projects/ReputationCaseStudy";
import InsuranceProtocol from "../projects/InsuranceProtocol";
import AutomationProtocolCaseStudy from "../projects/AutomationProtocolCaseStudy";
import NexusRWACaseStudy from "../projects/NexusRWACaseStudy";

interface UniversalModalProps {
  selectedItem: {
    id?: string;
    name?: string;
    role?: string;
    description?: string;
    company?: string;
    content?: Array<{ heading: string; text: string }>;
  } | null;
  activeType: "skill" | "project" | "experience" | null;
  closeModal: () => void;
}

export default function UniversalModal({
  selectedItem,
  activeType,
  closeModal,
}: UniversalModalProps) {
  if (!selectedItem) return null;

  const renderContent = () => {
    if (activeType === "skill" || activeType === "experience") {
      return (
        <div className="p-8 md:p-12 text-[#140E0B] min-h-[50vh]">
          <h2 className="font-display text-4xl font-bold tracking-[-0.03em] mb-4">
            {selectedItem.name || selectedItem.role}
          </h2>
          <p className="text-lg text-[#E85D04] mb-8">
            {selectedItem.description || selectedItem.company}
          </p>
          {(selectedItem.content || []).map((c, i) => (
            <div
              key={i}
              className="mb-6 p-6 bg-[#F5EFE6]/80 rounded-2xl border border-[#140E0B]/10"
            >
              <h4 className="font-mono-tabular font-semibold text-[#E85D04] mb-2 text-xs">
                {c.heading}
              </h4>
              <p className="text-[#594A42] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      );
    }

    const id = selectedItem.id;

    if (id === "nexus-rwa") return <NexusRWACaseStudy />;
    if (id === "onchain-automation") return <AutomationProtocolCaseStudy />;
    if (id === "sentinel-insurance") return <InsuranceProtocol />;
    if (id === "fs4") return <ReputationCaseStudy />;
    if (id === "fs3") return <NexusPolkaCaseStudy />;
    if (id === "fs1") return <NexusCaseStudy />;
    if (id === "fs2") return <SentinelCaseStudy />;
    if (id === "c1") return <StableCoinCaseStudy />;
    if (id === "c2") return <RaffleCaseStudy />;
    if (id === "c3") return <AACoreCaseStudy />;
    if (id === "c4") return <UUPSCaseStudy />;
    if (id === "c5") return <MerkleAirdropCaseStudy />;
    if (id === "c6") return <CuteCatNFTCaseStudy />;
    if (id === "c7") return <SISOTokenCaseStudy />;
    if (id === "c8") return <OracleFundingCaseStudy />;

    return (
      <div className="p-20 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h3 className="font-display text-2xl font-bold mb-3 text-[#140E0B]">
          Case Study Unavailable
        </h3>
        <p className="text-[#594A42] text-sm">
          The detailed architectural breakdown for this entry is being prepared.
        </p>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Protocol case study"
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 md:p-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-[#140E0B]/65 backdrop-blur-sm"
        />
        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl h-[90vh] max-h-[90vh] overflow-hidden rounded-[28px] sm:rounded-[32px] bg-[#FAF6F0] border border-[#140E0B]/15 shadow-[0_28px_90px_rgba(15,10,8,0.5)] flex flex-col"
        >
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close case study modal"
            className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-[300] w-11 h-11 flex items-center justify-center rounded-full bg-[#140E0B] border border-[#FAF6F0]/15 text-[#FAF6F0] hover:bg-[#E85D04] hover:border-[#E85D04] transition-colors shadow-md cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Dedicated overscroll-contain touch-scrollable container */}
          <div
            className="h-full w-full overflow-y-auto overflow-x-clip overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}