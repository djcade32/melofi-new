import { create } from "zustand";
import { Playlist, Song } from "@/types/interfaces";
import { Study } from "@/data/songs";

export interface MixerState {
  mixerModalOpen: boolean;

  toggleMixerModal: (bool: boolean) => void;
}

const useMixerStore = create<MixerState>((set) => ({
  mixerModalOpen: false,

  toggleMixerModal: (bool: boolean) => set((state) => ({ mixerModalOpen: bool })),
}));

export default useMixerStore;
