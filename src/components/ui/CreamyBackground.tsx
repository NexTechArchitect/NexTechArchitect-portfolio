"use client";

import { motion } from "framer-motion";

export default function CreamyBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#FDFBF7]">
      {/* Soft Yellow/Cream Blob 1 */}
      <motion.div
        animate={{ x: [0, 50, -20, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(253,230,138,0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      
      {/* Warm Ivory Blob 2 */}
      <motion.div
        animate={{ x: [0, -40, 30, 0], y: [0, 50, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(254,240,138,0.3) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Subtle Peach/Coral Blob 3 for depth */}
      <motion.div
        animate={{ x: [0, 30, -30, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] right-[20%] w-[40vw] h-[40vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,228,230,0.4) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Optional: Very light noise texture for a premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />
    </div>
  );
}