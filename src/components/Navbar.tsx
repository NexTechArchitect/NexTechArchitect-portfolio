"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Architecture", href: "#architecture" },
  { label: "Protocols", href: "#protocols" },
  { label: "Workbench", href: "#workbench" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-40 pointer-events-none px-4 sm:px-6 pt-3 sm:pt-4">
      <div
        className={`pointer-events-auto max-w-[1180px] mx-auto rounded-full transition-shadow duration-200 cream-glass px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 sm:gap-8 ${
          scrolled
            ? "shadow-[0_12px_36px_-18px_rgba(35,23,18,0.22)]"
            : "shadow-[0_4px_20px_-14px_rgba(35,23,18,0.12)]"
        }`}
      >
        {/* Left: Editorial Wordmark */}
        <a
          href="#top"
          className="font-display font-bold text-lg sm:text-[19px] tracking-[-0.02em] text-[#231712] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0] rounded-sm"
        >
          NexTechArchitect
        </a>

        {/* Center: Smooth-scroll Anchor Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-[#5C4B43] hover:text-[#231712] transition-colors duration-150 whitespace-nowrap shrink-0 py-1 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1.5px] after:bg-[#E85D04] after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: EVM Mainnets status + Start a Conversation CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-[#5C4B43] whitespace-nowrap shrink-0">
            <span
              className="w-2 h-2 rounded-full bg-[#E85D04] inline-block shrink-0"
              aria-hidden="true"
            />
            <span className="font-mono-tabular tracking-tight">
              EVM Mainnets
            </span>
          </div>

          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs sm:text-[13px] font-semibold text-[#FAF6F0] bg-[#E85D04] hover:bg-[#D14F00] active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
          >
            Start a Conversation
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-[#231712] hover:bg-[#231712]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-2 max-w-[1180px] mx-auto rounded-2xl cream-glass-solid p-4 shadow-[0_18px_44px_-16px_rgba(35,23,18,0.22)]">
          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col divide-y divide-[#231712]/10"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-base font-medium text-[#231712] hover:text-[#E85D04] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 pt-3 border-t border-[#231712]/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#5C4B43]">
              <span
                className="w-2 h-2 rounded-full bg-[#E85D04] inline-block"
                aria-hidden="true"
              />
              <span className="font-mono-tabular">EVM Mainnets</span>
            </div>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-xs font-semibold text-[#FAF6F0] bg-[#E85D04] hover:bg-[#D14F00] transition-colors whitespace-nowrap"
            >
              Start a Conversation
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
