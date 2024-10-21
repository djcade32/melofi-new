import { sounds } from "@/data/sounds";
import { MusicSource } from "@/enums/general";
import { Scene, Sound } from "@/types/interfaces";
import { toSnakeCase } from "@/utils/strings";
import { create } from "zustand";

export interface MixerState {
  mixerModalOpen: boolean;
  musicSource: MusicSource.MELOFI | MusicSource.SPOTIFY;
  mixerSoundsConfig: Record<string, Sound>;

  toggleMixerModal: (bool: boolean) => void;
  setMusicSource: (newSource: MusicSource) => void;
  getSceneSounds: (currentScene: Scene) => Sound[];
  changeSoundVolume: (soundName: string, newVolume: number) => void;
}

const useMixerStore = create<MixerState>((set, get) => ({
  mixerModalOpen: false,
  musicSource: MusicSource.MELOFI,
  mixerSoundsConfig: sounds,

  toggleMixerModal: (bool: boolean) => set((state) => ({ mixerModalOpen: bool })),
  setMusicSource: (newSource: MusicSource) => {
    set({ musicSource: newSource });
  },
  getSceneSounds: (currentScene: Scene) => {
    const { mixerSoundsConfig } = get();
    return currentScene.soundIcons.map(
      (soundIcon) => mixerSoundsConfig[toSnakeCase(soundIcon.name).toUpperCase()]
    );
  },
  changeSoundVolume: (soundName: string, newVolume: number) => {
    set((state) => {
      const newMixerSoundsConfig = { ...state.mixerSoundsConfig };
      newMixerSoundsConfig[toSnakeCase(soundName).toUpperCase()].volume = newVolume;
      return { mixerSoundsConfig: newMixerSoundsConfig };
    });
  },
}));

export default useMixerStore;
