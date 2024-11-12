import { ProfileResponse } from "@/api/api";
import { create } from "zustand";
import { InitData } from "@telegram-apps/types";

interface AppStore {
  loaded: boolean;
  theme: "light" | "dark";
  profile: ProfileResponse | null;
  initData: InitData | null;
  objectSourceRect: DOMRect | null;
  objectAnimating: boolean;
  setLoaded: (loaded: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  setProfile: (profile: ProfileResponse | null) => void;
  setInitData: (initData: InitData | null) => void;
  setObjectSourceRect: (objectSourceRect: DOMRect | null) => void;
  setObjectAnimating: (objectAnimating: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  loaded: false,
  theme: "light",
  profile: null,
  initData: null,
  objectSourceRect: null,
  objectAnimating: false,
  setLoaded: (loaded: boolean) => set({ loaded }),
  setTheme: (theme: "light" | "dark") => set({ theme }),
  setProfile: (profile: ProfileResponse | null) => set({ profile }),
  setInitData: (initData: InitData | null) => set({ initData }),
  setObjectSourceRect: (objectSourceRect: DOMRect | null) =>
    set({ objectSourceRect }),
  setObjectAnimating: (objectAnimating: boolean) => set({ objectAnimating }),
}));
