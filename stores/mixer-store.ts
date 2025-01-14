import { sounds } from "@/data/sounds";
import { MusicSource } from "@/enums/general";
import { Scene } from "@/types/general";
import { toSnakeCase } from "@/utils/strings";
import { create } from "zustand";
import useTemplatesStore from "./widgets/templates-store";
import { MixerSoundConfig, Sound } from "@/types/interfaces/mixer";

export interface MixerState {
  mixerModalOpen: boolean;
  musicSource: MusicSource.MELOFI | MusicSource.SPOTIFY;
  mixerSoundsConfig: MixerSoundConfig;

  toggleMixerModal: (bool: boolean) => void;
  setMusicSource: (newSource: MusicSource) => void;
  getSceneSounds: (currentScene: Scene) => Sound[];
  getOtherSounds: (currentScene: Scene) => Sound[];
  changeSoundVolume: (soundName: string, newVolume: number) => void;
  resetSoundVolumes: () => void;
  setMixerSoundsConfig: (newConfig: MixerSoundConfig) => void;
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
  getOtherSounds: (currentScene: Scene) => {
    const { mixerSoundsConfig } = get();
    return Object.values(mixerSoundsConfig).filter(
      (sound) => !currentScene.soundIcons.map((soundIcon) => soundIcon.name).includes(sound.name)
    );
  },
  changeSoundVolume: (soundName: string, newVolume: number) => {
    const { mixerSoundsConfig, setMixerSoundsConfig } = get();
    const newMixerSoundsConfig = { ...mixerSoundsConfig };
    newMixerSoundsConfig[toSnakeCase(soundName).toUpperCase()].volume = newVolume;
    setMixerSoundsConfig(newMixerSoundsConfig);
  },
  resetSoundVolumes: () => {
    const { mixerSoundsConfig, setMixerSoundsConfig } = get();

    const newMixerSoundsConfig = { ...mixerSoundsConfig };
    Object.values(newMixerSoundsConfig).forEach((sound) => {
      sound.volume = 0;
    });
    setMixerSoundsConfig(newMixerSoundsConfig);
  },
  setMixerSoundsConfig: (newConfig: MixerSoundConfig) => {
    const { settingsChanged, selectedTemplate } = useTemplatesStore.getState();
    set({ mixerSoundsConfig: newConfig });
    selectedTemplate && settingsChanged();
  },
}));

export default useMixerStore;
