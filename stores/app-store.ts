import { create } from "zustand";
import screenfull from "screenfull";
import { AppSettings } from "@/types/general";

export interface AppState {
  isFullscreen: boolean;
  appSettings: AppSettings;

  toggleFullscreen: (boolean: boolean) => void;
  isElectron: () => boolean;
  setInactivityThreshold: (threshold: number) => void;
  fetchAppSettings: () => void;
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

  fetchAppSettings: () => {
    const appSettings = localStorage.getItem("app_settings");
    // check if AppSettings type is correct
    const localAppSettings = JSON.parse(appSettings || "{}") as AppSettings;
    if (
      !localAppSettings.inActivityThreshold ||
      !localAppSettings.pomodoroTimerSoundEnabled ||
      !localAppSettings.alarmSoundEnabled ||
      !localAppSettings.calendarHoverEffectEnabled ||
      !localAppSettings.todoListHoverEffectEnabled ||
      !localAppSettings.showDailyQuote
    ) {
      localStorage.removeItem("app_settings");
      return;
    }
    if (appSettings) {
      set(() => ({ appSettings: JSON.parse(appSettings) }));
    }
  },
}));

export default useAppStore;
