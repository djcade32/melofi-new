import { IDBPDatabase, openDB } from "idb";
import { create } from "zustand";
import useUserStore from "./user-store";
import { fetchFirebaseWidgetData } from "@/lib/firebase/getters/general";
import { updateAppSettings as updateAppSettingsFirebase } from "@/lib/firebase/actions/app-settings";
import {
  IndexedDBAppSettings,
  IndexedDBUserStats,
  IndexedDBWidgetData,
} from "@/types/interfaces/indexedDb";
import { saveFirebaseWidgetData } from "@/lib/firebase/actions/general";
import useNotificationProviderStore from "./notification-provider-store";
import { AppSettings, UserStats } from "@/types/general";
import { updateUserStats as updateUserStatsFirebase } from "@/lib/firebase/actions/stats-actions";
import { BsDatabaseFillCheck, BsDatabaseFillX } from "@/imports/icons";

const log = {
  info: (...args: any) => console.log("[IndexedDB]", ...args),
  error: (...args: any) => console.error("[IndexedDB]", ...args),
  warn: (...args: any) => console.warn("[IndexedDB]", ...args),
};

export interface IndexedDBState {
  indexedDB: IDBPDatabase<unknown> | null;
  initializeIndexedDB: () => Promise<void>;
  setIndexedDB: (db: IDBPDatabase<unknown> | null) => void;
  syncWidgetData: () => Promise<void>;
  updateWidgetData: (
    uid: string,
    updaterFn: (settings: IndexedDBWidgetData) => IndexedDBWidgetData
  ) => Promise<void>;
  updateAppSettings: (
    uid: string,
    updaterFn: (settings: IndexedDBAppSettings) => IndexedDBAppSettings
  ) => Promise<void>;
  updateUserStats: (
    uid: string,
    updaterFn: (settings: IndexedDBUserStats) => IndexedDBUserStats
  ) => Promise<void>;
  pushAppSettingsToFirebase: () => Promise<boolean>;
  pushWidgetDataToFirebase: () => Promise<boolean>;
  pushUserStatsToFirebase: () => Promise<boolean>;
  pushAllDataToFirebase: () => Promise<void>;
}

const useIndexedDBStore = create<IndexedDBState>((set, get) => ({
  indexedDB: null,

  initializeIndexedDB: async () => {
    log.info("Initializing IndexedDB...");
    if (get().indexedDB) {
      return;
    }
    const db = await openDB("melofiDB", 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains("appSettings")) {
            db.deleteObjectStore("appSettings");
          }
          if (!db.objectStoreNames.contains("settings")) {
            db.deleteObjectStore("settings");
          }
          if (!db.objectStoreNames.contains("widgetData")) {
            db.deleteObjectStore("widgetData");
          }
          if (!db.objectStoreNames.contains("stats")) {
            db.deleteObjectStore("stats");
          }
        }
      },
    });
    set({ indexedDB: db });
    log.info("IndexedDB initialized");
  },

  setIndexedDB: (db) => {
    set({ indexedDB: db });
  },

  // Update widget data in IndexedDB
  updateWidgetData: async (uid: string, updaterFn) => {
    const indexedDBStore = get();
    const indexedDB = indexedDBStore.indexedDB;
    if (!indexedDB) {
      log.error("IndexedDB is not initialized");
      return;
    }
    const settings = await indexedDB.get("widgetData", uid);
    if (!settings) {
      log.error("No settings found in IndexedDB");
      return;
    }
    const updated = updaterFn({ ...settings }); // clone for safety
    await indexedDB.put("widgetData", updated, uid);
  },

  // Update app settings in IndexedDB
  updateAppSettings: async (uid: string, updaterFn) => {
    const indexedDBStore = get();
    const indexedDB = indexedDBStore.indexedDB;
    if (!indexedDB) {
      log.error("IndexedDB is not initialized");
      return;
    }
    const defaultAppSettings: IndexedDBAppSettings = {
      alarm: { alarmSoundEnabled: true },
      calendar: { calendarHoverEffectEnabled: true },
      inActivityThreshold: { inActivityThreshold: 15000 },
      pomodoro: { pomodoroTimerSoundEnabled: true },
      quote: { showDailyQuote: true },
      todo: { todoListHoverEffectEnabled: true },
      userUid: uid,
      _lastSynced: new Date().toISOString(),
    };

    const settings = (await indexedDB.get("appSettings", uid)) || defaultAppSettings;

    const updated = updaterFn({ ...settings }); // clone for safety
    await indexedDB.put("appSettings", updated, uid);
  },

  // Update user stats in IndexedDB
  updateUserStats: async (uid: string, updaterFn) => {
    const indexedDBStore = get();
    const indexedDB = indexedDBStore.indexedDB;

    if (!indexedDB) {
      log.error("IndexedDB is not initialized");
      return;
    }

    const defaultUserStats: IndexedDBUserStats = {
      alarm: { alarmsExpiredCount: 0 },
      pomodoroTimer: undefined,
      notes: { totalNotesCreated: 0 },
      sceneCounts: null,
      _lastSynced: new Date().toISOString(),
    };

    const stats = (await indexedDB.get("stats", uid)) || defaultUserStats;

    const updated = updaterFn({ ...stats }); // clone for safety
    await indexedDB.put("stats", updated, uid);
  },

  // Sync widget data from Firebase to IndexedDB
  syncWidgetData: async () => {
    log.info("Syncing IndexedDB widget data with Firebase...");
    const indexedDBStore = get();
    const indexedDB = indexedDBStore.indexedDB;

    const { getCurrentUserUid } = useUserStore.getState();
    const uid = getCurrentUserUid();
    if (uid) {
      const data = await fetchFirebaseWidgetData(uid);
      // Create object to store in IndexedDB
      const widgetData: IndexedDBWidgetData = {
        alarm: { alarmList: data?.alarmList || [] },
        notesList: { notesList: data?.notesList },
        selectedNote: { selectedNote: data?.selectedNote },
        pomodoroTimer: { pomodoroTasks: data?.pomodoroTasks || [] },
        templates: { templatesList: data?.templatesList },
        todos: { todosList: data?.todosList || [] },
        _lastSynced: new Date().toISOString(),
      };

      if (indexedDB) {
        await indexedDB.put("widgetData", widgetData, uid);
        log.info("IndexedDB widget data synced with Firebase");
      } else {
        log.error("IndexedDB is not initialized");
      }
    }
  },

  pushWidgetDataToFirebase: async () => {
    log.info("Pushing IndexedDB widget data to Firebase...");
    const indexedDBStore = get();
    const indexedDB = indexedDBStore.indexedDB;
    const { updateWidgetData } = indexedDBStore;

    const { getCurrentUserUid } = useUserStore.getState();
    const uid = getCurrentUserUid();

    if (uid) {
      const data = await indexedDB?.get("widgetData", uid);
      const now = new Date();
      if (data && new Date(data._lastSynced) < now) {
        log.info("Pushing widget data to Firebase...");
        // Push data to Firebase
        const widgetData = {
          alarmsList: data.alarm.alarmList,
          notesList: data.notesList.notesList,
          selectedNote: data.selectedNote.selectedNote,
          pomodoroTasks: data.pomodoroTimer.pomodoroTasks,
          templatesList: data.templates.templatesList,
          todoList: data.todos.todosList,
        };
        const success = await saveFirebaseWidgetData(uid, widgetData);
        if (!success.result) {
          log.error(success.message);
          return false;
        }

        updateWidgetData(uid, (settings) => {
          settings._lastSynced = new Date().toISOString();
          return settings;
        });

        log.info("Widget data pushed to Firebase");
        return true;
      }
    }
    return false;
  },

  pushAppSettingsToFirebase: async () => {
    log.info("Pushing IndexedDB app settings to Firebase...");
    const indexedDBStore = get();
    const indexedDB = indexedDBStore.indexedDB;
    const { updateAppSettings } = indexedDBStore;

    const { getCurrentUserUid } = useUserStore.getState();
    const uid = getCurrentUserUid();

    if (uid) {
      const data = await indexedDB?.get("appSettings", uid);
      const now = new Date();
      if (data && new Date(data._lastSynced) < now) {
        log.info("Pushing app settings to Firebase...");
        // Push data to Firebase
        const appSettings: AppSettings = {
          alarmSoundEnabled: data.alarm.alarmSoundEnabled,
          calendarHoverEffectEnabled: data.calendar.calendarHoverEffectEnabled,
          inActivityThreshold: data.inActivityThreshold.inActivityThreshold,
          pomodoroTimerSoundEnabled: data.pomodoro.pomodoroTimerSoundEnabled,
          showDailyQuote: data.quote.showDailyQuote,
          todoListHoverEffectEnabled: data.todo.todoListHoverEffectEnabled,
          userUid: uid,
        };
        const success = await updateAppSettingsFirebase(uid, appSettings);

        if (!success.result) {
          log.error(success.message);
          return false;
        }

        updateAppSettings(uid, (settings) => {
          settings._lastSynced = new Date().toISOString();
          return settings;
        });

        log.info("App settings pushed to Firebase");
        return true;
      }
    }
    return false;
  },

  pushUserStatsToFirebase: async () => {
    log.info("Pushing IndexedDB user stats to Firebase...");
    const indexedDBStore = get();
    const indexedDB = indexedDBStore.indexedDB;
    const { updateUserStats } = indexedDBStore;

    const { getCurrentUserUid } = useUserStore.getState();
    const uid = getCurrentUserUid();

    if (uid) {
      const data = await indexedDB?.get("stats", uid);
      const now = new Date();
      if (data && new Date(data._lastSynced) < now) {
        log.info("Pushing user stats to Firebase...");
        // Push data to Firebase
        const userStats: UserStats = {
          alarmsExpiredCount: data.alarm.alarmsExpiredCount,
          pomodoroTimer: data.pomodoroTimer,
          totalNotesCreated: data.notes.totalNotesCreated,
          sceneCounts: data.sceneCounts,
        };
        const success = await updateUserStatsFirebase(uid, userStats);

        if (!success.result) {
          log.error(success.message);
          return false;
        }

        updateUserStats(uid, (settings) => {
          settings._lastSynced = new Date().toISOString();
          return settings;
        });

        log.info("User stats pushed to Firebase");
        return true;
      }
    }
    return false;
  },

  pushAllDataToFirebase: async () => {
    const indexedDBStore = get();
    const { pushWidgetDataToFirebase, pushAppSettingsToFirebase, pushUserStatsToFirebase } =
      indexedDBStore;
    const { addNotification } = useNotificationProviderStore.getState();
    const result = await Promise.all([
      pushWidgetDataToFirebase(),
      pushAppSettingsToFirebase(),
      pushUserStatsToFirebase(),
    ]);
    const allSuccess = result.every((res) => res === true);
    if (allSuccess) {
      log.info("All data pushed to Firebase successfully");
      addNotification({
        type: "success",
        message: "All data synced",
        icon: BsDatabaseFillCheck,
      });
    } else {
      log.error("Error syncing data with Firebase");
      addNotification({
        type: "error",
        message: "Error syncing data",
        icon: BsDatabaseFillX,
      });
    }
  },
}));
export default useIndexedDBStore;
