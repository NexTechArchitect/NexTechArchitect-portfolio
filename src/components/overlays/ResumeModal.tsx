"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RESUME_PATH = "/Amit_Blockchain_Engineer.pdf";

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const prefersReducedMotion = useReducedMotion();

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
            transition={{ duration: 0.24 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#140E0B]/68 backdrop-blur-md"
          />

          <motion.div
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: 28, scale: 0.93 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, y: 20, scale: 0.95 }
            }
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative z-10 w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden rounded-3xl bg-[#FAF6F0] shadow-[0_28px_80px_rgba(15,10,8,0.5)] will-change-transform"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 bg-[#140E0B] text-[#FAF6F0] shrink-0">
              <div className="min-w-0">
                <p className="text-[11px] font-mono-tabular uppercase tracking-[0.12em] text-[#D96B27] font-semibold">
                  Curriculum Vitae
                </p>
                <h2 className="font-display text-base sm:text-xl font-bold text-[#FAF6F0] tracking-[-0.025em] truncate">
                  Amit Kumar · Resume
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={RESUME_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-spring inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full bg-[#221813] hover:bg-[#31221A] text-xs font-semibold text-[#FAF6F0]"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Open Tab</span>
                </a>

                <a
                  href={RESUME_PATH}
                  download="Amit_Blockchain_Engineer.pdf"
                  className="btn-spring btn-cta-sheen inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-full bg-[#E85D04] hover:bg-[#D14F00] text-[#FAF6F0] text-xs font-semibold whitespace-nowrap"
                >
                  <Download
                    className="relative z-10 w-3.5 h-3.5"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 hidden sm:inline">
                    Download PDF
                  </span>
                  <span className="relative z-10 sm:hidden">PDF</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume modal"
                  className="btn-spring inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#221813] hover:bg-[#E85D04] text-[#FAF6F0] cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div
              className="flex-1 bg-[#F5EFE6] h-full w-full overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
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
