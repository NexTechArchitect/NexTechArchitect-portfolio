"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenResume: () => void;
}

const NAV_ITEMS = [
  { id: "architecture", label: "Architecture" },
  { id: "protocols", label: "Protocols" },
  { id: "insights", label: "Insights" },
  { id: "contact", label: "Contact" },
] as const;

export default function Navbar({ onOpenResume }: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [baseBlock, setBaseBlock] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.05 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3500);

    fetch("https://mainnet.base.org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_blockNumber",
        params: [],
      }),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.result && typeof data.result === "string") {
          const parsed = Number.parseInt(data.result, 16);
          if (Number.isFinite(parsed) && parsed > 0) {
            setBaseBlock(parsed.toLocaleString("en-US"));
          }
        }
      })
      .catch(() => {
        // Silently keep static EVM Mainnet indicator when offline or sandboxed
      })
      .finally(() => {
        window.clearTimeout(timeout);
      });

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div
          className={`flex items-center justify-between gap-4 sm:gap-8 h-14 px-4 sm:px-6 rounded-2xl transition-all duration-300 ${
            scrolled
              ? "glass-surface-strong shadow-[0_10px_32px_rgba(15,23,42,0.08)]"
              : "glass-surface shadow-[0_4px_18px_rgba(15,23,42,0.04)]"
          }`}
        >
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-display text-base sm:text-lg font-bold tracking-tight text-[#0B1220] hover:text-[#0052FF] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] rounded-md"
          >
            NexTechArchitect
          </a>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] rounded-sm ${
                    isActive
                      ? "text-[#0052FF]"
                      : "text-slate-600 hover:text-[#0B1220]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-underline"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#0052FF] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Live EVM Mainnet Status & Resume Action */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div
              className="hidden lg:flex items-center gap-2 text-xs font-mono-tabular text-slate-600 whitespace-nowrap shrink-0"
              title="Live EVM Mainnet RPC telemetry"
            >
              <span className="text-[#0052FF] font-semibold">EVM Mainnet</span>
              {baseBlock && (
                <>
                  <span aria-hidden="true" className="text-slate-300">
                    /
                  </span>
                  <span className="text-slate-500">#{baseBlock}</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1220] hover:bg-[#0052FF] text-white text-xs font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] focus-visible:ring-offset-2"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Resume</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white/80 text-slate-700 hover:text-[#0052FF] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Menu className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              aria-label="Mobile navigation"
              className="md:hidden mt-2 p-3 rounded-2xl glass-surface-strong shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
            >
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? "bg-[#0052FF]/8 text-[#0052FF]"
                        : "text-slate-700 hover:bg-slate-100/80"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-2 pt-2.5 px-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono-tabular text-slate-500">
                <span className="text-[#0052FF] font-semibold">EVM Mainnet</span>
                <span>{baseBlock ? `#${baseBlock}` : "Live Network"}</span>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
