"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AgentProvider, useAgent } from "@/context/AgentContext";
import { useModal } from "@/hooks/useModal";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ArchitectureStage from "@/components/ArchitectureStage";
import ProtocolShowcase from "@/components/ProtocolShowcase";
import WorkbenchStage from "@/components/WorkbenchStage";
import StudioFooter from "@/components/StudioFooter";
import ProtocolAgent from "@/components/ProtocolAgent";
import ProjectGalleryOverlayWrapper from "@/components/overlays/ProjectGalleryOverlayWrapper";
import UniversalModal from "@/components/overlays/UniversalModal";
import ResumeModal from "@/components/overlays/ResumeModal";

function PortfolioShell() {
  const { selectedItem, activeType, openModal, closeModal } = useModal();
  const { openAgent, explainProtocol } = useAgent();
  const [overlayType, setOverlayType] = useState<"fullstack" | "core" | null>(
    null
  );
  const [resumeOpen, setResumeOpen] = useState(false);
  const [activeWorkbenchId, setActiveWorkbenchId] = useState<string>("l1");

  const isAnyOverlayOpen =
    overlayType !== null || selectedItem !== null || resumeOpen;

  // Single centralized scroll lock so nested gallery + case study modals NEVER trap overflow: hidden
  useEffect(() => {
    if (isAnyOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isAnyOverlayOpen]);

  // Centralized Escape handler closes topmost layer cleanly (Resume -> Case Study -> Archive Gallery)
  useEffect(() => {
    if (!isAnyOverlayOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (resumeOpen) {
        setResumeOpen(false);
        return;
      }
      if (selectedItem !== null) {
        closeModal();
        return;
      }
      if (overlayType !== null) {
        setOverlayType(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnyOverlayOpen, resumeOpen, selectedItem, overlayType, closeModal]);

  const handleCloseAllOverlays = useCallback(() => {
    setResumeOpen(false);
    closeModal();
    setOverlayType(null);
  }, [closeModal]);

  const handleInspectWorkbench = useCallback((insightId: string) => {
    setActiveWorkbenchId(insightId);
    window.requestAnimationFrame(() => {
      const targetEl = document.getElementById("workbench");
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#140E0B] relative overflow-x-clip">
      <Navbar
        onOpenResume={() => setResumeOpen(true)}
        onOpenAgent={openAgent}
        onNavigate={handleCloseAllOverlays}
      />

      <main className="relative z-10">
        <HeroSection
          onOpenResume={() => setResumeOpen(true)}
          onOpenGallery={() => setOverlayType("fullstack")}
          onInspectYulGas={() => handleInspectWorkbench("l2")}
        />
        <ArchitectureStage onInspectWorkbench={handleInspectWorkbench} />
        <ProtocolShowcase
          onSelectProject={(project) => openModal(project, "project")}
          onOpenArchive={(type) => setOverlayType(type)}
        />
        <WorkbenchStage
          selectedTabId={activeWorkbenchId}
          onSelectTabId={setActiveWorkbenchId}
        />
      </main>

      <StudioFooter onOpenResume={() => setResumeOpen(true)} />

      <ProjectGalleryOverlayWrapper
        isOpen={overlayType !== null}
        type={overlayType}
        closeOverlay={() => setOverlayType(null)}
        openModal={(item, type) => openModal(item, type)}
        onAskAmit={(project) => explainProtocol(project.id)}
      />

      <UniversalModal
        selectedItem={selectedItem}
        activeType={activeType}
        closeModal={closeModal}
      />

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />

      <ProtocolAgent />
    </div>
  );
}

export default function Portfolio() {
  return (
    <AgentProvider>
      <PortfolioShell />
    </AgentProvider>
  );
}