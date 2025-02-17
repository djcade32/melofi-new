import { create } from "zustand";
import screenfull from "screenfull";
import { AppSettings } from "@/types/general";

export interface AppState {
  isFullscreen: boolean;
  appSettings: AppSettings;

  toggleFullscreen: (boolean: boolean) => void;
  isElectron: () => boolean;
  setInactivityThreshold: (threshold: number) => void;
  setPomodoroTimerSoundEnabled: (boolean: boolean) => void;
  setAlarmSoundEnabled: (boolean: boolean) => void;
  setCalendarHoverEffectEnabled: (boolean: boolean) => void;
  setTodoListHoverEffectEnabled: (boolean: boolean) => void;
  setDailyQuoteEnabled: (boolean: boolean) => void;
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
}));

export default useAppStore;
