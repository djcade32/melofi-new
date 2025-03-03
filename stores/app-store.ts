import { create } from "zustand";
import screenfull from "screenfull";
import { AppSettings } from "@/types/general";
import { PremiumModalTypes } from "@/enums/general";
import useSceneStore from "./scene-store";
import { scenes } from "@/data/scenes";
import useMixerStore from "./mixer-store";
import useMusicPlayerStore from "./music-player-store";
import { Study } from "@/data/songs";
import useWidgetsStore from "./widgets-store";

export interface AppState {
  isFullscreen: boolean;
  appSettings: AppSettings;
  showPremiumModal: PremiumModalTypes | null;

  toggleFullscreen: (boolean: boolean) => void;
  isElectron: () => boolean;
  setInactivityThreshold: (threshold: number) => void;
  setPomodoroTimerSoundEnabled: (boolean: boolean) => void;
  setAlarmSoundEnabled: (boolean: boolean) => void;
  setCalendarHoverEffectEnabled: (boolean: boolean) => void;
  setTodoListHoverEffectEnabled: (boolean: boolean) => void;
  setDailyQuoteEnabled: (boolean: boolean) => void;
  fetchAppSettings: () => void;
  setShowPremiumModal: (modal: PremiumModalTypes | null) => void;
  removePremiumFeatures: () => void;
}

const useAppStore = create<AppState>((set, get) => ({
  isFullscreen: false,
  appSettings: {
    inActivityThreshold: 15000,
    pomodoroTimerSoundEnabled: true,
    alarmSoundEnabled: true,
    calendarHoverEffectEnabled: true,
    todoListHoverEffectEnabled: true,
    showDailyQuote: true,
  },
  showPremiumModal: null,

  toggleFullscreen: (boolean) => {
    screenfull.toggle();
    set(() => ({ isFullscreen: boolean }));
  },

  isElectron: () => {
    return navigator.userAgent.toLowerCase().includes("electron");
  },

  setInactivityThreshold: (threshold) => {
    // Set in local storage
    const newAppSettings = { ...get().appSettings, inActivityThreshold: threshold };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    set(() => ({ appSettings: newAppSettings }));
  },

  setPomodoroTimerSoundEnabled: (boolean) => {
    const newAppSettings = { ...get().appSettings, pomodoroTimerSoundEnabled: boolean };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    set(() => ({ appSettings: newAppSettings }));
  },

  setAlarmSoundEnabled: (boolean) => {
    const newAppSettings = { ...get().appSettings, alarmSoundEnabled: boolean };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    set(() => ({ appSettings: newAppSettings }));
  },

  setCalendarHoverEffectEnabled: (boolean) => {
    const newAppSettings = { ...get().appSettings, calendarHoverEffectEnabled: boolean };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    set(() => ({ appSettings: newAppSettings }));
  },

  setTodoListHoverEffectEnabled: (boolean) => {
    const newAppSettings = { ...get().appSettings, todoListHoverEffectEnabled: boolean };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    set(() => ({ appSettings: newAppSettings }));
  },

  setDailyQuoteEnabled: (boolean) => {
    const newAppSettings = { ...get().appSettings, showDailyQuote: boolean };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    set(() => ({ appSettings: newAppSettings }));
  },

  fetchAppSettings: () => {
    const appSettings = localStorage.getItem("app_settings");
    // check if AppSettings type is correct
    const localAppSettings = JSON.parse(appSettings || "{}") as AppSettings;

    // Iterate over the keys of the AppSettings object
    for (const key in localAppSettings) {
      // Check if the key is not in the AppSettings object
      if (!(key in get().appSettings)) {
        // Remove the AppSettings object from the local storage
        localStorage.removeItem("app_settings");
        return;
      }
    }
    if (appSettings) {
      set(() => ({ appSettings: JSON.parse(appSettings) }));
    }
  },

  setShowPremiumModal: (modal) => {
    set(() => ({ showPremiumModal: modal }));
  },

  removePremiumFeatures: () => {
    const { setCurrentScene } = useSceneStore.getState();
    const { resetSoundVolumes } = useMixerStore.getState();
    const { setCurrentPlaylist } = useMusicPlayerStore.getState();
    const { closePremiumWidgets } = useWidgetsStore.getState();

    // Reset scene
    setCurrentScene(scenes[0]);
    // Reset playlist
    setCurrentPlaylist(Study);
    // Reset mixer sounds
    resetSoundVolumes();
    // Close all premium widgets
    closePremiumWidgets();
  },
}));

export default useAppStore;
