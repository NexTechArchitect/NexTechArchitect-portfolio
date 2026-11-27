"use client";

import { AnimatePresence } from "framer-motion";
import ProjectGalleryOverlay from "./ProjectGalleryOverlay";
import {
  fullStackProjects,
  coreProjects,
  type ProjectItem,
} from "@/data/projects";

interface WrapperProps {
  isOpen: boolean;
  type: "fullstack" | "core" | null;
  closeOverlay: () => void;
  openModal: (item: ProjectItem, type: "skill" | "project") => void;
  onAskAmit: (project: ProjectItem) => void;
}

export default function ProjectGalleryOverlayWrapper({
  isOpen,
  type,
  closeOverlay,
  openModal,
  onAskAmit,
}: WrapperProps) {
  const projects = type === "fullstack" ? fullStackProjects : coreProjects;
  const title =
    type === "fullstack" ? "Full-Stack Web3 Protocols" : "Core EVM Contracts";

  return (
    <AnimatePresence>
      {isOpen && type && (
        <ProjectGalleryOverlay
          key={`gallery-overlay-${type}`}
          variant={type}
          onClose={closeOverlay}
          projects={projects}
          title={title}
          onProjectClick={(project) => openModal(project, "project")}
          onAskAmit={(project) => {
            closeOverlay();
            onAskAmit(project);
          }}
        />
      )}
    </AnimatePresence>
  );
}
