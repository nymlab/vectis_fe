import React from "react";
import create from "zustand";

interface ModalState {
  children: React.ReactElement | null;
  openModal: (children: React.ReactElement) => void;
  closeModal: () => void;
}

export const useModal = create<ModalState>((set) => ({
  children: null,
  openModal: (children) => set({ children }),
  closeModal: () => set({ children: null }),
}));
