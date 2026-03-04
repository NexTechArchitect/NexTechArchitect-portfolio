"use client";
import ProjectGalleryOverlay from "./ProjectGalleryOverlay";
import { fullStackProjects, coreProjects } from "@/data/projects";

interface WrapperProps {
  isOpen: boolean;
  type: 'fullstack' | 'core' | null;
  closeOverlay: () => void;
  openModal: (item: any, type: "skill" | "project") => void;
}

export default function ProjectGalleryOverlayWrapper({ isOpen, type, closeOverlay, openModal }: WrapperProps) {
  if (!isOpen || !type) return null;

  const projects = type === 'fullstack' ? fullStackProjects : coreProjects;
  const title = type === 'fullstack' ? "Full-Stack dApps" : "Core Contracts";

  return (
    <ProjectGalleryOverlay
      isOpen={isOpen}
      onClose={closeOverlay}
      projects={projects}
      title={title}
      onProjectClick={(p) => openModal(p, "project")}
    />
  );
}
