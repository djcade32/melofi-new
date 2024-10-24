import { create } from "zustand";

export interface AppState {
  isFullscreen: boolean;

  toggleFullscreen: (boolean: boolean) => void;
}

const useAppStore = create<AppState>((set, get) => ({
  isFullscreen: false,

  toggleFullscreen: (boolean) => {
    set(() => ({ isFullscreen: boolean }));
  },
}));

export default useAppStore;
