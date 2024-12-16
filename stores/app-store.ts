import { create } from "zustand";
import screenfull from "screenfull";

export interface AppState {
  isFullscreen: boolean;

  toggleFullscreen: (boolean: boolean) => void;
}

const useAppStore = create<AppState>((set, get) => ({
  isFullscreen: false,

  toggleFullscreen: (boolean) => {
    screenfull.toggle();
    set(() => ({ isFullscreen: boolean }));
  },
}));

export default useAppStore;
