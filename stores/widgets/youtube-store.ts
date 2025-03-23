import { create } from "zustand";

export interface YoutubeState {
  isYoutubeOpen: boolean;

  setIsYoutubeOpen: (isYoutubeOpen: boolean) => void;
}

const useYoutubeStore = create<YoutubeState>((set, get) => ({
  isYoutubeOpen: false,

  setIsYoutubeOpen: (isYoutubeOpen) => set({ isYoutubeOpen }),
}));

export default useYoutubeStore;
