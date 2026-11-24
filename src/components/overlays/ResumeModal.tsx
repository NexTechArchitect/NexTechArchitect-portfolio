"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RESUME_PATH = "/Amit_Blockchain_Engineer.pdf";

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
          aria-label="Amit Kumar Resume PDF"
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
            className="relative z-10 w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-[0_28px_80px_rgba(15,23,42,0.22)]"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-4 bg-white border-b border-slate-200/80 shrink-0">
              <div>
                <p className="text-xs font-mono-tabular text-[#0052FF] font-semibold">
                  Curriculum Vitae
                </p>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0B1220] tracking-tight">
                  Amit Kumar — Resume
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={RESUME_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Open Tab</span>
                </a>

                <a
                  href={RESUME_PATH}
                  download="Amit_Blockchain_Engineer.pdf"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0052FF] hover:bg-[#0040CC] text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download PDF</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume modal"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-[#0B1220] hover:text-white text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="flex-1 bg-slate-100">
              <iframe
                src={`${RESUME_PATH}#view=FitH`}
                title="Amit Kumar Resume PDF"
                className="w-full h-full border-0"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
