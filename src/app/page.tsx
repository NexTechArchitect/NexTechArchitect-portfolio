"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import ClickableSkillsGrid from "@/components/sections/ClickableSkillsGrid";
import ProjectGatewaySection from "@/components/sections/ProjectGatewaySection";
import StickyEducationSection from "@/components/sections/StickyEducationSection";
import EngineeringJourneySection from "@/components/sections/EngineeringJourneySection";
import ContactFooter from "@/components/layout/ContactFooter";
import UniversalModal from "@/components/overlays/UniversalModal";
import ProjectGalleryOverlayWrapper from "@/components/overlays/ProjectGalleryOverlayWrapper";

import { skillsData } from "@/data/skills";
import { journeyData } from "@/data/journey";
import { useModal } from "@/hooks/useModal";

export default function Portfolio() {
  const [isMounted, setIsMounted] = useState(false);
  const [overlayType, setOverlayType] = useState<'fullstack' | 'core' | null>(null);
  const { selectedItem, activeType, openModal, closeModal } = useModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <main className="min-h-screen bg-white" />;

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden">
      
      {/* Ambient Background Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0055FF]/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00D4FF]/5 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <HeroSection />
        
        <ClickableSkillsGrid data={skillsData || []} />
        
        <ProjectGatewaySection openOverlay={(type) => setOverlayType(type)} />
        
        <StickyEducationSection />
        
        {/* 🔥 FIX: Removed openModal prop because this component now handles its own modal 🔥 */}
        <EngineeringJourneySection data={journeyData || []} />
        
        <ContactFooter />
      </div>

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
      
    </main>
  );
}
