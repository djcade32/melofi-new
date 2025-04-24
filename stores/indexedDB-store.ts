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
    console.log("Initializing IndexedDB...");
    if (get().indexedDB) {
      return;
    }
    const db = await openDB("melofiDB", 1, {
      upgrade(db, oldVersion) {
        if (oldVersion < 2) {
          console.log("Creating object stores...");
          db.createObjectStore("appSettings");
          db.createObjectStore("settings");
          db.createObjectStore("widgetData");
          db.createObjectStore("stats");
        }
      },
    });
    set({ indexedDB: db });
    console.log("IndexedDB initialized");
  },

  setIndexedDB: (db) => {
    set({ indexedDB: db });
  },

  // Update widget data in IndexedDB
  updateWidgetData: async (uid: string, updaterFn) => {
    const { indexedDB } = get();
    if (!indexedDB) {
      console.error("IndexedDB is not initialized");
      return;
    }
    const settings = await indexedDB.get("widgetData", uid);
    if (!settings) {
      console.error("No settings found in IndexedDB");
      return;
    }
    const updated = updaterFn({ ...settings }); // clone for safety
    await indexedDB.put("widgetData", updated, uid);
  },

  // Update app settings in IndexedDB
  updateAppSettings: async (uid: string, updaterFn) => {
    const { indexedDB } = get();
    if (!indexedDB) {
      console.error("IndexedDB is not initialized");
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
    if (!settings) {
      console.error("No settings found in IndexedDB");
      return;
    }
    const updated = updaterFn({ ...settings }); // clone for safety
    await indexedDB.put("appSettings", updated, uid);
  },

  // Update user stats in IndexedDB
  updateUserStats: async (uid: string, updaterFn) => {
    const { indexedDB } = get();
    if (!indexedDB) {
      console.error("IndexedDB is not initialized");
      return;
    }

    const defaultUserStats: IndexedDBUserStats = {
      alarm: { alarmsExpiredCount: 0 },
      pomodoroTimer: undefined,
      notes: { totalNotesCreated: 0 },
      sceneCounts: null,
      _lastSynced: new Date().toISOString(),
    };

    const settings = (await indexedDB.get("stats", uid)) || defaultUserStats;
    if (!settings) {
      console.error("No settings found in IndexedDB");
      return;
    }
    const updated = updaterFn({ ...settings }); // clone for safety
    await indexedDB.put("stats", updated, uid);
  },

  // Sync widget data from Firebase to IndexedDB
  syncWidgetData: async () => {
    console.log("Syncing IndexedDB widget data with Firebase...");

    const { indexedDB } = get();
    const { currentUser } = useUserStore.getState();
    if (currentUser?.authUser?.uid) {
      const data = await fetchFirebaseWidgetData(currentUser.authUser.uid);
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
        await indexedDB.put("widgetData", widgetData, currentUser.authUser.uid);
        console.log("IndexedDB widget data synced with Firebase");
      } else {
        console.error("IndexedDB is not initialized");
      }
    }
  },

  pushWidgetDataToFirebase: async () => {
    console.log("Pushing IndexedDB widget data to Firebase...");
    const { indexedDB } = get();
    const { currentUser } = useUserStore.getState();
    const { updateWidgetData } = get();

    if (currentUser?.authUser?.uid) {
      const data = await indexedDB?.get("widgetData", currentUser.authUser.uid);
      if (data && data._lastSynced < new Date().toISOString()) {
        console.log("Pushing widget data to Firebase...");
        // Push data to Firebase
        const widgetData = {
          alarmsList: data.alarm.alarmList,
          notesList: data.notesList.notesList,
          selectedNote: data.selectedNote.selectedNote,
          pomodoroTasks: data.pomodoroTimer.pomodoroTasks,
          templatesList: data.templates.templatesList,
          todoList: data.todos.todosList,
        };
        const success = await saveFirebaseWidgetData(currentUser.authUser.uid, widgetData);
        if (!success.result) {
          console.error(success.message);
          return false;
        }

        updateWidgetData(currentUser.authUser.uid, (settings) => {
          settings._lastSynced = new Date().toISOString();
          return settings;
        });

        console.log("Widget data pushed to Firebase");
        return true;
      }
    }
    return false;
  },

  pushAppSettingsToFirebase: async () => {
    console.log("Pushing IndexedDB app settings to Firebase...");
    const { indexedDB } = get();
    const { currentUser } = useUserStore.getState();
    const { updateAppSettings } = get();

    if (currentUser?.authUser?.uid) {
      const data = await indexedDB?.get("appSettings", currentUser.authUser.uid);
      if (data && data._lastSynced < new Date().toISOString()) {
        console.log("Pushing app settings to Firebase...");
        // Push data to Firebase
        const appSettings: AppSettings = {
          alarmSoundEnabled: data.alarm.alarmSoundEnabled,
          calendarHoverEffectEnabled: data.calendar.calendarHoverEffectEnabled,
          inActivityThreshold: data.inActivityThreshold.inActivityThreshold,
          pomodoroTimerSoundEnabled: data.pomodoro.pomodoroTimerSoundEnabled,
          showDailyQuote: data.quote.showDailyQuote,
          todoListHoverEffectEnabled: data.todo.todoListHoverEffectEnabled,
          userUid: currentUser.authUser.uid,
        };
        const success = await updateAppSettingsFirebase(currentUser.authUser.uid, appSettings);

        if (!success.result) {
          console.error(success.message);
          return false;
        }

        updateAppSettings(currentUser.authUser.uid, (settings) => {
          settings._lastSynced = new Date().toISOString();
          return settings;
        });

        console.log("App settings pushed to Firebase");
        return true;
      }
    }
    return false;
  },

  pushUserStatsToFirebase: async () => {
    console.log("Pushing IndexedDB user stats to Firebase...");
    const { indexedDB } = get();
    const { currentUser } = useUserStore.getState();
    const { updateUserStats } = get();

    if (currentUser?.authUser?.uid) {
      const data = await indexedDB?.get("stats", currentUser.authUser.uid);
      if (data && data._lastSynced < new Date().toISOString()) {
        console.log("Pushing user stats to Firebase...");
        // Push data to Firebase
        const userStats: UserStats = {
          alarmsExpiredCount: data.alarm.alarmsExpiredCount,
          pomodoroTimer: data.pomodoroTimer,
          totalNotesCreated: data.notes.totalNotesCreated,
          sceneCounts: data.sceneCounts,
        };
        const success = await updateUserStatsFirebase(currentUser.authUser.uid, userStats);

        if (!success.result) {
          console.error(success.message);
          return false;
        }

        updateUserStats(currentUser.authUser.uid, (settings) => {
          settings._lastSynced = new Date().toISOString();
          return settings;
        });

        console.log("User stats pushed to Firebase");
        return true;
      }
    }
    return false;
  },

  pushAllDataToFirebase: async () => {
    const { pushWidgetDataToFirebase, pushAppSettingsToFirebase, pushUserStatsToFirebase } = get();
    const { addNotification } = useNotificationProviderStore.getState();
    const result = await Promise.all([
      pushWidgetDataToFirebase(),
      pushAppSettingsToFirebase(),
      pushUserStatsToFirebase(),
    ]);
    const allSuccess = result.every((res) => res === true);
    if (allSuccess) {
      console.log("All data pushed to Firebase successfully");
      addNotification({
        type: "success",
        message: "All data synced with Firebase",
        icon: BsDatabaseFillCheck,
      });
    } else {
      console.error("Error syncing data with Firebase");
      addNotification({
        type: "error",
        message: "Error syncing data with Firebase",
        icon: BsDatabaseFillX,
      });
    }
  },
}));
export default useIndexedDBStore;
