import { useState, useCallback } from "react";

export const useModal = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeType, setActiveType] = useState<"skill" | "project" | null>(null);

  const openModal = useCallback((item: any, type: "skill" | "project") => {
    setSelectedItem(item);
    setActiveType(type);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    setActiveType(null);
  }, []);

  return { selectedItem, activeType, openModal, closeModal };
};
