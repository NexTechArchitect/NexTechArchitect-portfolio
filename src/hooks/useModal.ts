import { useState, useCallback } from "react";
import type { ProjectItem } from "@/data/projects";

export const useModal = () => {
  const [selectedItem, setSelectedItem] = useState<ProjectItem | null>(null);
  const [activeType, setActiveType] = useState<"skill" | "project" | null>(null);

  const openModal = useCallback(
    (item: ProjectItem, type: "skill" | "project") => {
      setSelectedItem(item);
      setActiveType(type);
    },
    []
  );

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    setActiveType(null);
  }, []);

  return { selectedItem, activeType, openModal, closeModal };
};
