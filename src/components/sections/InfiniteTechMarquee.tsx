"use client";
import { motion } from "framer-motion";

export default function InfiniteTechMarquee({ items = [] }: { items?: string[] }) {
  const displayItems = Array.isArray(items) && items.length > 0 ? items : ["EVM", "Solidity", "Foundry", "Security", "Next.js"];
  
  return (
    <div className="py-10 bg-[#FAFAFA] border-y border-gray-100 overflow-hidden flex font-black select-none">
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-10 items-center px-5"
      >
        {[...displayItems, ...displayItems].map((item, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="text-4xl md:text-6xl text-gray-200 uppercase tracking-tighter">{item}</span>
            <span className="w-3 h-3 rounded-full bg-orange-500/20" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
