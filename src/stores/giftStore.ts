import { create } from "zustand";
import { StoreGiftResponse } from "@/api/api";

interface GiftStore {
  selectedGift: StoreGiftResponse | null;
  setSelectedGift: (gift: StoreGiftResponse | null) => void;
}

export const useGiftStore = create<GiftStore>((set) => ({
  selectedGift: null,
  setSelectedGift: (gift) => set({ selectedGift: gift }),
}));
