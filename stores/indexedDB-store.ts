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
import useAppStore from "./app-store";

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
  /**
    @param uid - User ID
    @param updaterFn - Function to update widget data
    @returns {Promise<void>}
    @description Updates widget data in IndexedDB. If IndexedDB is not initialized, it will log an error.
   */
  updateWidgetData: (
    uid: string,
    updaterFn: (settings: IndexedDBWidgetData) => IndexedDBWidgetData
  ) => Promise<void>;
  /**
    @param uid - User ID
    @param updaterFn - Function to update app settings
    @returns {Promise<void>}
    @description Updates app settings in IndexedDB. If IndexedDB is not initialized, it will log an error.
   */
  updateAppSettings: (
    uid: string,
    updaterFn: (settings: IndexedDBAppSettings) => IndexedDBAppSettings
  ) => Promise<void>;
  /**
    @param uid - User ID
    @param updaterFn - Function to update user stats
    @returns {Promise<void>}
    @description Updates user stats in IndexedDB. If IndexedDB is not initialized, it will log an error.
   */
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
    const { isElectron } = useAppStore.getState();
    if (!isElectron()) return;

    log.info("Initializing IndexedDB...");
    if (get().indexedDB) {
      return;
    }

    indexedDB.databases().then((databases) => {
      const dbExists = databases.some((db) => db.name === "melofiDB");
      if (!dbExists) {
        log.warn("melofiDB does not exist");
        return;
      }
      log.info("melofiDB exists");
      const dbVersion = databases.find((db) => db.name === "melofiDB")?.version;
      if (dbVersion && dbVersion < 2) {
        log.warn("melofiDB version is less than 2");
        return;
      }
      log.info("melofiDB version is 2 or greater");
    });

    const db = await openDB("melofiDB", 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 3) {
          if (!db.objectStoreNames.contains("appSettings")) {
            db.createObjectStore("appSettings");
          }
          if (!db.objectStoreNames.contains("settings")) {
            db.createObjectStore("settings");
          }
          if (!db.objectStoreNames.contains("widgetData")) {
            db.createObjectStore("widgetData");
          }
          if (!db.objectStoreNames.contains("stats")) {
            db.createObjectStore("stats");
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
    const { isElectron } = useAppStore.getState();
    if (!isElectron()) return;

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
    const { isElectron } = useAppStore.getState();
    if (!isElectron()) return;

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
      clock: { showMiddleClock: false },
      todo: { todoListHoverEffectEnabled: true },
      sceneRoulette: { sceneRouletteEnabled: false },
      userUid: uid,
      _lastSynced: new Date().toISOString(),
    };

    const settings = (await indexedDB.get("appSettings", uid)) || defaultAppSettings;

    const updated = updaterFn({ ...settings }); // clone for safety
    await indexedDB.put("appSettings", updated, uid);
  },

  // Update user stats in IndexedDB
  updateUserStats: async (uid: string, updaterFn) => {
    const { isElectron } = useAppStore.getState();
    if (!isElectron()) return;

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
      achievements: { achievements: [] },
      _lastSynced: new Date().toISOString(),
    };
    const fetchedStats = await indexedDB.get("stats", uid);

    const stats = {
      alarm: fetchedStats?.alarm || defaultUserStats.alarm,
      pomodoroTimer: fetchedStats?.pomodoroTimer || defaultUserStats.pomodoroTimer,
      notes: fetchedStats?.notes || defaultUserStats.notes,
      sceneCounts: fetchedStats?.sceneCounts || defaultUserStats.sceneCounts,
      achievements: fetchedStats?.achievements || defaultUserStats.achievements,
      _lastSynced: new Date().toISOString(),
    };
    const updated = updaterFn({ ...stats }); // clone for safety
    await indexedDB.put("stats", updated, uid);
  },

  // Sync widget data from Firebase to IndexedDB
  syncWidgetData: async () => {
    const { isElectron } = useAppStore.getState();
    if (!isElectron()) return;

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
        templates: { templatesList: data?.templatesList || [] },
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
      log.info("No widget data changes to push to Firebase");
      return true;
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
          showMiddleClock: data.clock.showMiddleClock,
          todoListHoverEffectEnabled: data.todo.todoListHoverEffectEnabled,
          sceneRouletteEnabled: data.sceneRoulette.sceneRouletteEnabled,
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
      log.info("No app settings changes to push to Firebase");
      return true;
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
        // Push data to Firebase
        const userStats: UserStats = {
          alarmsExpiredCount: data.alarm.alarmsExpiredCount,
          pomodoroTimer: data.pomodoroTimer,
          totalNotesCreated: data.notes.totalNotesCreated,
          sceneCounts: data.sceneCounts,
          achievements: data.achievements.achievements,
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
      log.info("No user stats changes to push to Firebase");
      return true;
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
