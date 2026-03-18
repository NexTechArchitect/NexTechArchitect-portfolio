"use client";
import { motion, AnimatePresence } from "framer-motion";

// Imports
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

export default function UniversalModal({ selectedItem, activeType, closeModal }: any) {
  if (!selectedItem) return null;

  const renderContent = () => {
    if (activeType === "skill" || activeType === "experience") {
      return (
        <div className="p-8 md:p-12 text-slate-900 min-h-[50vh]">
          <h2 className="text-4xl font-black mb-4">{selectedItem.name || selectedItem.role}</h2>
          <p className="text-xl text-blue-600 mb-8">{selectedItem.description || selectedItem.company}</p>
          {(selectedItem.content || []).map((c: any, i: number) => (
            <div key={i} className="mb-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-700 mb-2 uppercase tracking-widest text-sm">{c.heading}</h4>
              <p className="text-slate-600 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      );
    }

    const id = selectedItem.id;
    if (id === "fs3") return <NexusPolkaCaseStudy />; // <-- NAYA PROJECT LINK KIYA
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
        <h3 className="text-2xl font-black mb-4 text-slate-800">Under Construction 🚧</h3>
        <p className="text-slate-500">The detailed case study is being written.</p>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl max-h-full overflow-y-auto rounded-[40px] bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_20px_80px_rgba(0,85,255,0.2)] custom-scrollbar-hide"
        >
          <button 
            onClick={closeModal} 
            className="absolute top-6 right-6 z-[300] w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            ✕
          </button>
          {renderContent()}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}