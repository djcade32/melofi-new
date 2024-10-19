import { MusicSource } from "@/enums/general";
import { create } from "zustand";

export interface MixerState {
  mixerModalOpen: boolean;
  musicSource: MusicSource.MELOFI | MusicSource.SPOTIFY;

  toggleMixerModal: (bool: boolean) => void;
  setMusicSource: (newSource: MusicSource) => void;
}

const useMixerStore = create<MixerState>((set) => ({
  mixerModalOpen: false,
  musicSource: MusicSource.MELOFI,

  toggleMixerModal: (bool: boolean) => set((state) => ({ mixerModalOpen: bool })),
  setMusicSource: (newSource: MusicSource) => {
    set({ musicSource: newSource });
  },
}));

export default useMixerStore;
