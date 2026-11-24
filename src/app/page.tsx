"use client";

import React from "react";
import { AgentProvider } from "@/context/AgentContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StudioStageSections from "@/components/StudioStageSections";
import ProtocolAgent from "@/components/ProtocolAgent";

export default function Portfolio() {
  return (
    <AgentProvider>
      <div className="min-h-screen bg-[#FAF6F0] text-[#231712] relative overflow-x-clip">
        <Navbar />

        <main className="relative z-10">
          <HeroSection />
          <StudioStageSections />
        </main>

        <ProtocolAgent />
      </div>
    </AgentProvider>
  );
}