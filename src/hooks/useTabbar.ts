import { useCallback } from "react";
import { create } from "zustand";

interface TabbarStore {
  initialized: boolean;
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
}

const useTabbarStore = create<TabbarStore>((set) => ({
  initialized: false,
  isVisible: true,
  setVisible: (visible) => set({ isVisible: visible, initialized: true }),
}));

export const useTabbar = () => {
  const { initialized, isVisible, setVisible } = useTabbarStore();

  const show = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const hide = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return { initialized, isVisible, show, hide };
};
