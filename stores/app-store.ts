import { create } from "zustand";
import screenfull from "screenfull";

export interface AppState {
  isFullscreen: boolean;
  isSleep: boolean;
  inActivityThreshold: number;

  toggleFullscreen: (boolean: boolean) => void;
  isElectron: () => boolean;
  setIsSleep: (boolean: boolean) => void;
  setInactivityThreshold: (number: number) => void;
}

const useAppStore = create<AppState>((set, get) => ({
  isFullscreen: false,
  isSleep: false,
  inActivityThreshold: 15000,

  toggleFullscreen: (boolean) => {
    screenfull.toggle();
    set(() => ({ isFullscreen: boolean }));
  },

  isElectron: () => {
    return navigator.userAgent.toLowerCase().includes("electron");
  },

  setIsSleep: (boolean) => {
    set(() => ({ isSleep: boolean }));
  },

  setInactivityThreshold: (number) => {
    set(() => ({ inActivityThreshold: number }));
  },
}));

export default useAppStore;
