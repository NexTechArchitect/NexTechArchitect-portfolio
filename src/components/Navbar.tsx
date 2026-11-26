"use client";

import React, { useEffect, useState } from "react";
import { FileText, Menu, Terminal, X } from "lucide-react";

const NAV_LINKS = [
  { id: "architecture", label: "Architecture", href: "#architecture" },
  { id: "protocols", label: "Protocols", href: "#protocols" },
  { id: "workbench", label: "Workbench", href: "#workbench" },
  { id: "contact", label: "Contact", href: "#contact" },
] as const;

interface NavbarProps {
  onOpenResume: () => void;
  onOpenAgent: () => void;
  onNavigate?: () => void;
}

export default function Navbar({
  onOpenResume,
  onOpenAgent,
  onNavigate,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);

      const probeY = window.scrollY + 180;
      let current = "";
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= probeY) {
          current = link.id;
        }
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate();
    }
    if (href.startsWith("#")) {
      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        window.requestAnimationFrame(() => {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.replaceState(null, "", href);
        });
      }
    }
  };

  const handleAskAgentClick = () => {
    setMobileMenuOpen(false);
    onOpenAgent();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 pointer-events-none pt-3.5 sm:pt-4 lg:pt-5">
      <div
        data-testid="floating-navbar-pill"
        className={`pointer-events-auto w-[calc(100%-1.5rem)] max-w-6xl mx-auto h-[66px] lg:h-[70px] px-4 sm:px-5 lg:px-6 rounded-full border bg-[rgba(255,253,249,0.88)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 hover:bg-[#FFFDF9] hover:border-[#E85D04]/40 hover:shadow-[0_18px_42px_-16px_rgba(232,93,4,0.18)] flex items-center justify-between gap-2.5 sm:gap-4 lg:gap-6 ${
          scrolled
            ? "border-[#18110D]/12 shadow-[0_18px_46px_-22px_rgba(24,17,13,0.28)]"
            : "border-[#18110D]/10 shadow-[0_14px_38px_-22px_rgba(24,17,13,0.16)]"
        }`}
      >
        {/* Left: Refined Copper-Orange Geometric Mark + Wordmark */}
        <a
          href="#top"
          onClick={(e) => handleAnchorClick(e, "#top")}
          className="inline-flex items-center gap-2.5 min-h-[44px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0] rounded-full pr-1"
        >
          <span
            aria-hidden="true"
            className="relative w-8 h-8 rounded-lg bg-[#18110D] border border-[#E85D04]/45 flex items-center justify-center shadow-[0_6px_16px_-8px_rgba(232,93,4,0.75)] shrink-0"
          >
            <span className="w-3 h-3 rotate-45 border-[2px] border-[#E85D04] rounded-[2px]" />
          </span>
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#18110D] whitespace-nowrap">
            NexTechArchitect
          </span>
        </a>

        {/* Center: Responsive Architectural Nav Links with Warm Pill Hover & Active Indicator */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-1.5 xl:gap-2"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                aria-current={isActive ? "page" : undefined}
                className={`relative inline-flex items-center justify-center min-h-[44px] px-3.5 rounded-full text-[15.5px] font-medium transition-colors duration-200 whitespace-nowrap shrink-0 hover:bg-[#E85D04]/10 hover:text-[#E85D04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
                  isActive
                    ? "text-[#18110D] font-semibold"
                    : "text-[#594A42]"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-3.5 right-3.5 bottom-1.5 h-[2px] rounded-full bg-[#E85D04] transition-transform duration-200 origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Right: Resume & Ask Agent Primary Trigger */}
        <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenResume}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 lg:px-4.5 py-2 rounded-full text-[15px] font-semibold text-[#18110D] border border-[#18110D]/16 bg-[#FAF6F0]/90 hover:border-[#E85D04]/55 hover:bg-[#F3EBE0] active:scale-[0.98] transition-[background-color,border-color,transform] duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
          >
            <FileText
              className="w-4 h-4 text-[#E85D04]"
              aria-hidden="true"
            />
            <span>Resume</span>
          </button>

          <button
            type="button"
            data-testid="navbar-ask-agent"
            onClick={handleAskAgentClick}
            className="hidden sm:inline-flex items-center justify-center gap-2 min-h-[44px] px-4.5 lg:px-5 py-2 rounded-full text-[15px] font-semibold text-[#FAF6F0] bg-[#18110D] hover:bg-[#E85D04] active:scale-[0.98] transition-[background-color,transform] duration-150 whitespace-nowrap shrink-0 cursor-pointer shadow-[0_12px_26px_-14px_rgba(24,17,13,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0] group"
          >
            <Terminal
              className="w-4 h-4 text-[#E85D04] group-hover:text-[#FAF6F0] transition-colors"
              aria-hidden="true"
            />
            <span>Ask Agent</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-[#18110D] hover:bg-[#E85D04]/10 hover:text-[#E85D04] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Portrait Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden mt-2.5 w-[calc(100%-1.5rem)] max-w-6xl mx-auto rounded-2xl border border-[#18110D]/12 bg-[rgba(251,248,243,0.97)] backdrop-blur-md p-4 sm:p-5 shadow-[0_22px_54px_-18px_rgba(24,17,13,0.28)]">
          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col gap-1"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="min-h-[44px] px-3.5 rounded-xl flex items-center text-[15.5px] font-medium text-[#18110D] hover:bg-[#E85D04]/10 hover:text-[#E85D04] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 pt-2 flex flex-wrap items-center justify-between gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] flex-1 px-5 py-2.5 rounded-full text-[15px] font-semibold text-[#18110D] border border-[#18110D]/16 bg-[#F5EFE6] cursor-pointer whitespace-nowrap"
            >
              <FileText
                className="w-4 h-4 text-[#E85D04]"
                aria-hidden="true"
              />
              <span>Resume</span>
            </button>
            <button
              type="button"
              onClick={handleAskAgentClick}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] flex-1 px-5 py-2.5 rounded-full text-[15px] font-semibold text-[#FAF6F0] bg-[#18110D] hover:bg-[#E85D04] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Terminal className="w-4 h-4 text-[#E85D04]" aria-hidden="true" />
              <span>Ask Agent</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
