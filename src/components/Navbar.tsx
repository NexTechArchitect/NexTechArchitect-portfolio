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
      const y = window.scrollY;
      setScrolled(y > 18);

      const probeY = y + 180;
      let current = "";
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el) {
          const docTop = el.getBoundingClientRect().top + y;
          if (docTop <= probeY) {
            current = link.id;
          }
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

  const pillSurfaceClass = scrolled
    ? "bg-[#16100C]/94 border-[#F4A261]/24 shadow-[inset_0_1px_0_rgba(250,246,240,0.12),0_20px_50px_-18px_rgba(10,6,4,0.58)] hover:border-[#FF6B1A]/50 hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.24),0_22px_52px_-16px_rgba(232,93,4,0.3)]"
    : "bg-[#16100C]/92 border-[#F4A261]/20 shadow-[inset_0_1px_0_rgba(250,246,240,0.12),0_18px_46px_-20px_rgba(20,14,11,0.42)] hover:border-[#FF6B1A]/48 hover:shadow-[inset_0_1px_0_rgba(244,162,97,0.22),0_20px_48px_-16px_rgba(232,93,4,0.28)]";

  return (
    <header className="fixed top-4 sm:top-5 inset-x-0 z-40 pointer-events-none">
      <div
        data-testid="floating-navbar-pill"
        className={`pointer-events-auto w-[calc(100%-1.5rem)] max-w-6xl mx-auto h-[62px] sm:h-[66px] lg:h-[68px] px-3.5 sm:px-5 lg:px-6 rounded-full border backdrop-blur-md text-[#FAF6F0] transition-[background-color,border-color,box-shadow] duration-300 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 ${pillSurfaceClass}`}
      >
        {/* Left: Refined Copper-Orange Geometric Mark + Wordmark */}
        <a
          href="#top"
          onClick={(e) => handleAnchorClick(e, "#top")}
          className="group inline-flex items-center gap-2.5 min-h-[44px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16100C] rounded-full pr-1"
        >
          <span
            aria-hidden="true"
            className="relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-[1.05] border bg-[#241812] border-[#E85D04]/60 shadow-[0_6px_18px_-6px_rgba(232,93,4,0.85)]"
          >
            <span className="w-3 h-3 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500 ease-out border-[2px] border-[#FF6B1A] rounded-[2px]" />
          </span>
          <span className="font-display font-bold text-[17px] sm:text-xl tracking-tight whitespace-nowrap text-[#FAF6F0]">
            NexTechArchitect
          </span>
        </a>

        {/* Center: Responsive Architectural Nav Links with Warm Copper Glow & Active Indicator */}
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
                className={`relative inline-flex items-center justify-center min-h-[44px] px-3.5 rounded-full text-[15px] font-medium transition-[color,background-color] duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] ${
                  isActive
                    ? "text-[#FAF6F0] font-semibold bg-[#FAF6F0]/[0.08]"
                    : "text-[#D8CEC4] hover:text-[#FAF6F0] hover:bg-[#E85D04]/18"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-3.5 right-3.5 bottom-1.5 h-[2px] rounded-full bg-[#FF6B1A] transition-transform duration-200 origin-left ${
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
            className="hidden sm:inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 lg:px-4.5 py-2 rounded-full text-[14.5px] font-semibold border border-[#FAF6F0]/18 bg-[#241812]/90 text-[#FAF6F0] hover:border-[#FF6B1A]/70 hover:bg-[#2E1E16] hover:-translate-y-0.5 active:scale-[0.98] transition-[background-color,border-color,color,transform] duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
          >
            <FileText
              className="w-4 h-4 text-[#FF6B1A]"
              aria-hidden="true"
            />
            <span>Resume</span>
          </button>

          <button
            type="button"
            data-testid="navbar-ask-agent"
            onClick={handleAskAgentClick}
            className="hidden sm:inline-flex items-center justify-center gap-2 min-h-[44px] px-4.5 lg:px-5 py-2 rounded-full text-[14.5px] font-semibold text-[#FAF6F0] bg-[#E85D04] hover:bg-[#D14F00] shadow-[0_12px_28px_-12px_rgba(232,93,4,0.78)] hover:-translate-y-0.5 active:scale-[0.98] transition-[background-color,transform,box-shadow] duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF6F0]"
          >
            <Terminal
              className="w-4 h-4 text-[#FAF6F0]"
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
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-[#FAF6F0] hover:bg-[#FAF6F0]/10 hover:text-[#FF6B1A] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
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
        <div className="pointer-events-auto lg:hidden mt-2.5 w-[calc(100%-1.5rem)] max-w-6xl mx-auto rounded-[28px] border border-[#F4A261]/22 bg-[#16100C]/96 backdrop-blur-xl p-4 sm:p-5 shadow-[0_24px_56px_-18px_rgba(0,0,0,0.82)] text-[#FAF6F0]">
          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col gap-1"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="min-h-[44px] px-3.5 rounded-xl flex items-center text-[15.5px] font-medium text-[#FAF6F0] hover:bg-[#E85D04]/18 hover:text-[#FF6B1A] transition-colors"
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
              className="inline-flex items-center justify-center gap-2 min-h-[44px] flex-1 px-5 py-2.5 rounded-full text-[15px] font-semibold border border-[#FAF6F0]/18 bg-[#241812] text-[#FAF6F0] cursor-pointer whitespace-nowrap"
            >
              <FileText
                className="w-4 h-4 text-[#FF6B1A]"
                aria-hidden="true"
              />
              <span>Resume</span>
            </button>
            <button
              type="button"
              onClick={handleAskAgentClick}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] flex-1 px-5 py-2.5 rounded-full text-[15px] font-semibold text-[#FAF6F0] bg-[#E85D04] hover:bg-[#D14F00] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Terminal className="w-4 h-4 text-[#FAF6F0]" aria-hidden="true" />
              <span>Ask Agent</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
