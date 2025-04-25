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
import { updateAppSettings } from "@/lib/firebase/actions/app-settings";
import useUserStore from "./user-store";
import { getUserFromUserDb } from "@/lib/firebase/getters/auth-getters";
import { Logger } from "@/classes/Logger";
import useToolsStore from "./tools-store";
import useNotificationProviderStore from "./notification-provider-store";
import { BiWifi, BiWifiOff } from "@/imports/icons";
import useIndexedDBStore from "./indexedDB-store";

export interface AppState {
  isFullscreen: boolean;
  isOnline: boolean;
  appSettings: AppSettings;
  showPremiumModal: PremiumModalTypes | null;

  toggleFullscreen: (boolean: boolean) => void;
  setIsOnline: (boolean: boolean) => void;
  isElectron: () => boolean;
  setInactivityThreshold: (threshold: number) => void;
  setPomodoroTimerSoundEnabled: (boolean: boolean) => void;
  setAlarmSoundEnabled: (boolean: boolean) => void;
  setCalendarHoverEffectEnabled: (boolean: boolean) => void;
  setTodoListHoverEffectEnabled: (boolean: boolean) => void;
  setDailyQuoteEnabled: (boolean: boolean) => void;
  fetchAppSettings: () => Promise<void>;
  setAppSettings: (appSettings: AppSettings, userId: string | null) => void;
  setShowPremiumModal: (modal: PremiumModalTypes | null) => void;
  removePremiumFeatures: () => void;
}

const useAppStore = create<AppState>((set, get) => ({
  isFullscreen: false,
  isOnline: true,
  appSettings: {
    userUid: null,
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

  setIsOnline: (boolean) => {
    const { addNotification } = useNotificationProviderStore.getState();
    if (boolean) {
      Logger.getInstance().info("Melofi is online.");
      addNotification({
        message: "Melofi is online.",
        type: "success",
        icon: BiWifi,
      });
    } else {
      Logger.getInstance().error("Melofi is offline.");
      addNotification({
        message: "Melofi is offline.",
        type: "normal",
        icon: BiWifiOff,
      });
    }
    set(() => ({ isOnline: boolean }));
  },

  isElectron: () => {
    return navigator.userAgent.toLowerCase().includes("electron");
  },

  setInactivityThreshold: (threshold) => {
    const { currentUser, isUserLoggedIn } = useUserStore.getState();
    const { indexedDB } = useIndexedDBStore.getState();
    // Set in local storage
    const newAppSettings = {
      ...get().appSettings,
      inActivityThreshold: threshold,
      userUid: currentUser?.authUser?.uid || "",
    };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    isUserLoggedIn &&
      updateAppSettings(currentUser?.authUser?.uid || "", newAppSettings, indexedDB);
    set(() => ({ appSettings: newAppSettings }));
  },

  setPomodoroTimerSoundEnabled: (boolean) => {
    const { currentUser, isUserLoggedIn } = useUserStore.getState();
    const { indexedDB } = useIndexedDBStore.getState();
    const newAppSettings = { ...get().appSettings, pomodoroTimerSoundEnabled: boolean };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    isUserLoggedIn &&
      updateAppSettings(currentUser?.authUser?.uid || "", newAppSettings, indexedDB);
    set(() => ({ appSettings: newAppSettings }));
  },

  setAlarmSoundEnabled: (boolean) => {
    const { currentUser, isUserLoggedIn } = useUserStore.getState();
    const { indexedDB } = useIndexedDBStore.getState();
    const newAppSettings = {
      ...get().appSettings,
      alarmSoundEnabled: boolean,
      userUid: currentUser?.authUser?.uid || "",
    };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    isUserLoggedIn &&
      updateAppSettings(currentUser?.authUser?.uid || "", newAppSettings, indexedDB);
    set(() => ({ appSettings: newAppSettings }));
  },

  setCalendarHoverEffectEnabled: (boolean) => {
    const { currentUser, isUserLoggedIn } = useUserStore.getState();
    const { indexedDB } = useIndexedDBStore.getState();
    const newAppSettings = {
      ...get().appSettings,
      calendarHoverEffectEnabled: boolean,
      userUid: currentUser?.authUser?.uid || "",
    };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    isUserLoggedIn &&
      updateAppSettings(currentUser?.authUser?.uid || "", newAppSettings, indexedDB);
    set(() => ({ appSettings: newAppSettings }));
  },

  setTodoListHoverEffectEnabled: (boolean) => {
    const { currentUser, isUserLoggedIn } = useUserStore.getState();
    const { indexedDB } = useIndexedDBStore.getState();
    const newAppSettings = {
      ...get().appSettings,
      todoListHoverEffectEnabled: boolean,
      userUid: currentUser?.authUser?.uid || "",
    };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    isUserLoggedIn &&
      updateAppSettings(currentUser?.authUser?.uid || "", newAppSettings, indexedDB);
    set(() => ({ appSettings: newAppSettings }));
  },

  setDailyQuoteEnabled: (boolean) => {
    const { currentUser, isUserLoggedIn } = useUserStore.getState();
    const { indexedDB } = useIndexedDBStore.getState();
    const newAppSettings = {
      ...get().appSettings,
      showDailyQuote: boolean,
      userUid: currentUser?.authUser?.uid || "",
    };
    localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    isUserLoggedIn &&
      currentUser?.authUser?.uid &&
      updateAppSettings(currentUser?.authUser?.uid, newAppSettings, indexedDB);
    set(() => ({ appSettings: newAppSettings }));
  },

  fetchAppSettings: async () => {
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
    const { currentUser } = useUserStore.getState();
    const currentUserUid = currentUser?.authUser?.uid;

    if (currentUserUid) {
      if (appSettings && currentUserUid === localAppSettings.userUid) {
        Logger.getInstance().info("App settings in local storage");
        set(() => ({
          appSettings: { userUid: currentUserUid, ...JSON.parse(appSettings) },
        }));
      } else {
        Logger.getInstance().info("No app settings in local storage fetch from db");
        try {
          const { isOnline } = useAppStore.getState();
          if (isOnline) {
            const user = await getUserFromUserDb(currentUserUid);
            if (user?.appSettings) {
              useAppStore.getState().setAppSettings(user.appSettings, currentUserUid);
            }
          } else {
            const { indexedDB } = useIndexedDBStore.getState();
            Logger.getInstance().info("Melofi is offline. Fetching app settings from indexedDB");
            const appSettings = await indexedDB?.get("appSettings", currentUserUid);

            if (appSettings) {
              useAppStore.getState().setAppSettings(appSettings, currentUserUid);
            } else {
              console.log("No app settings found in indexedDB");
            }
          }
        } catch (error) {
          Logger.getInstance().error(`Error fetching app settings: ${error}`);
        }
      }
    } else {
      const newAppSettings: AppSettings = appSettings
        ? { ...JSON.parse(appSettings), userUid: null }
        : { ...get().appSettings, userUid: null };
      set(() => ({
        appSettings: newAppSettings,
      }));
      localStorage.setItem("app_settings", JSON.stringify(newAppSettings));
    }
  },

  setAppSettings: (appSettings, userUid) => {
    const { updateAppSettings } = useIndexedDBStore.getState();
    const { currentUser } = useUserStore.getState();
    appSettings.userUid = userUid;
    localStorage.setItem("app_settings", JSON.stringify(appSettings));
    set(() => ({ appSettings }));
    if (currentUser?.authUser?.uid) {
      updateAppSettings(currentUser.authUser.uid, (oldAppSettings) => {
        oldAppSettings.userUid = userUid;
        oldAppSettings.inActivityThreshold.inActivityThreshold = appSettings.inActivityThreshold;
        oldAppSettings.pomodoro.pomodoroTimerSoundEnabled = appSettings.pomodoroTimerSoundEnabled;
        oldAppSettings.alarm.alarmSoundEnabled = appSettings.alarmSoundEnabled;
        oldAppSettings.calendar.calendarHoverEffectEnabled = appSettings.calendarHoverEffectEnabled;
        oldAppSettings.todo.todoListHoverEffectEnabled = appSettings.todoListHoverEffectEnabled;
        oldAppSettings.quote.showDailyQuote = appSettings.showDailyQuote;
        oldAppSettings._lastSynced = new Date().toISOString();
        return oldAppSettings;
      });
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
    const { resetToolbarSettings } = useToolsStore.getState();

    // Reset scene
    setCurrentScene(scenes[0]);
    // Reset playlist
    setCurrentPlaylist(Study);
    // Reset mixer sounds
    resetSoundVolumes();
    // Close all premium widgets
    closePremiumWidgets();
    // Reset toolbar settings
    resetToolbarSettings();
  },
}));

export default useAppStore;
