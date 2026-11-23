"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import TechStackGrid from "@/components/sections/TechStackGrid";
import ProjectGatewaySection from "@/components/sections/ProjectGatewaySection";
import EngineeringJourneySection from "@/components/sections/EngineeringJourneySection";
import ContactFooter from "@/components/layout/ContactFooter";
import UniversalModal from "@/components/overlays/UniversalModal";
import ProjectGalleryOverlayWrapper from "@/components/overlays/ProjectGalleryOverlayWrapper";
import ResumeModal from "@/components/overlays/ResumeModal";
import { useModal } from "@/hooks/useModal";

export default function Portfolio() {
  const [overlayType, setOverlayType] = useState<"fullstack" | "core" | null>(
    null
  );
  const [resumeOpen, setResumeOpen] = useState(false);
  const { selectedItem, activeType, openModal, closeModal } = useModal();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1220] relative overflow-x-hidden">
      <Navbar onOpenResume={() => setResumeOpen(true)} />

      <main className="relative z-10">
        <HeroSection openModal={openModal} />

        <TechStackGrid />

        <ProjectGatewaySection
          openOverlay={(type) => setOverlayType(type)}
          openModal={openModal}
        />

        <EngineeringJourneySection />
      </main>

      <ContactFooter onOpenResume={() => setResumeOpen(true)} />

      <ProjectGalleryOverlayWrapper
        isOpen={overlayType !== null}
        type={overlayType}
        closeOverlay={() => setOverlayType(null)}
        openModal={openModal}
      />

      <UniversalModal
        selectedItem={selectedItem}
        activeType={activeType}
        closeModal={closeModal}
      />

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}