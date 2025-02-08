import { create } from "zustand";
import screenfull from "screenfull";

export interface AppState {
  isFullscreen: boolean;
  inActivityThreshold: number;

  toggleFullscreen: (boolean: boolean) => void;
  isElectron: () => boolean;
}

const useAppStore = create<AppState>((set, get) => ({
  isFullscreen: false,
  inActivityThreshold: 15000,

  toggleFullscreen: (boolean) => {
    screenfull.toggle();
    set(() => ({ isFullscreen: boolean }));
  },

  isElectron: () => {
    return navigator.userAgent.toLowerCase().includes("electron");
  },
}));

export default useAppStore;
