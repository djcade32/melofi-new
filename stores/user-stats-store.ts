import {
  resetUserStats,
  updateAlarmsExpiredCount,
  updatePomodoroTimerStats,
  updateTotalNotesCreated,
  updateSceneCounts as updatedSceneCountsFromDb,
} from "@/lib/firebase/actions/stats-actions";
import { getUserStats } from "@/lib/firebase/getters/stats-getters";
import { buildUserStatsType } from "@/lib/type-builders/user-stats-type-builder";
import { create } from "zustand";
import useUserStore from "./user-store";
import { PomodoroTimerStats } from "@/types/interfaces/pomodoro_timer";
import { SceneCounts, UserStats } from "@/types/general";
import { Logger } from "@/classes/Logger";
import { saveUserStats } from "@/lib/electron-store";
import useIndexedDBStore from "./indexedDB-store";
import useAppStore from "./app-store";

export interface userStatsState {
  pomodoroTimerStats: PomodoroTimerStats;
  totalNotesCreated: number;
  sceneCounts: SceneCounts | null;
  alarmsExpiredCount: number;

  setUserStats: () => Promise<void>;
  incrementTotalNotesCreated: () => Promise<void>;
  updatePomodoroTimerStats: (updatedStats: PomodoroTimerStats) => Promise<void>;
  incrementExpiredAlarmsCount: () => Promise<void>;
  updateSceneCounts: (scene: string) => Promise<void>;
  resetUserStatsData: () => Promise<void>;
  setStats: (stats: UserStats) => void;
  getUserStats: () => UserStats | undefined;
}

const useUserStatsStore = create<userStatsState>((set, get) => ({
  pomodoroTimerStats: {
    totalFocusTime: 0,
    totalBreakTime: 0,
    totalSessionsCompleted: 0,
    totalTasksCompleted: 0,
    weeklyStats: null,
    focusDay: null,
  },
  totalNotesCreated: 0,
  sceneCounts: null,
  alarmsExpiredCount: 0,

  async setUserStats() {
    const { updateUserStats } = useIndexedDBStore.getState();

    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    const email = useUserStore.getState().currentUser?.authUser?.email;
    try {
      if (!uid) {
        Logger.getInstance().error("No user uid provided");
        return;
      }
      const userStats = await getUserStats(uid);
      if (!userStats) {
        Logger.getInstance().warn("No user stats found");
        return;
      }
      const userStatsBuilt = buildUserStatsType(userStats);
      const userStatsObj = { ...userStatsBuilt, pomodoroTimerStats: userStatsBuilt.pomodoroTimer };
      set(userStatsObj);
      email && saveUserStats(email, userStatsObj);
      updateUserStats(uid, (stats) => {
        stats.pomodoroTimer = userStatsBuilt.pomodoroTimer;
        stats.notes.totalNotesCreated = userStatsBuilt.totalNotesCreated;
        stats.sceneCounts = userStatsBuilt.sceneCounts;
        stats.alarm.alarmsExpiredCount = userStatsBuilt.alarmsExpiredCount;
        stats._lastSynced = new Date().toISOString();
        return stats;
      });
    } catch (error) {
      Logger.getInstance().error(`Error setting user stats: ${error}`);
    }
  },

  async incrementTotalNotesCreated() {
    const { updateUserStats } = useIndexedDBStore.getState();
    const { isOnline } = useAppStore.getState();

    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    try {
      const totalNotesCreated = get().totalNotesCreated;
      isOnline && (await updateTotalNotesCreated(uid, totalNotesCreated + 1));
      updateUserStats(uid, (stats) => {
        stats.notes.totalNotesCreated = totalNotesCreated + 1;
        return stats;
      });
      set(() => ({ totalNotesCreated: totalNotesCreated + 1 }));
    } catch (error) {
      console.log("Error incrementing total notes created: ", error);
    }
  },

  async updatePomodoroTimerStats(updatedStats: PomodoroTimerStats) {
    const { updateUserStats } = useIndexedDBStore.getState();
    const { isOnline } = useAppStore.getState();
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    try {
      isOnline && (await updatePomodoroTimerStats(uid, updatedStats));
      set({ pomodoroTimerStats: updatedStats });
      updateUserStats(uid, (stats) => {
        stats.pomodoroTimer = updatedStats;
        return stats;
      });
    } catch (error) {
      console.log("Error updating pomodoro timer stats: ", error);
    }
  },

  async incrementExpiredAlarmsCount() {
    const { updateUserStats } = useIndexedDBStore.getState();
    const { isOnline } = useAppStore.getState();

    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    try {
      const expiredAlarmsCount = get().alarmsExpiredCount;
      isOnline && (await updateAlarmsExpiredCount(uid, expiredAlarmsCount + 1));
      set(() => ({ alarmsExpiredCount: expiredAlarmsCount + 1 }));
      updateUserStats(uid, (stats) => {
        stats.alarm.alarmsExpiredCount = expiredAlarmsCount + 1;
        return stats;
      });
    } catch (error) {
      console.log("Error incrementing expired alarms count: ", error);
    }
  },

  async updateSceneCounts(sceneName: string) {
    const { updateUserStats } = useIndexedDBStore.getState();
    const { isOnline } = useAppStore.getState();

    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      console.log("No user uid provided");
      return;
    }
    try {
      const sceneCounts = get().sceneCounts;
      let updatedSceneCounts: SceneCounts = {
        counts: {},
        favoriteSceneName: null,
      };

      if (!sceneCounts) {
        console.log("No scene counts found");
      } else {
        updatedSceneCounts = sceneCounts;
      }

      // Increment scene count
      if (updatedSceneCounts.counts[sceneName]) {
        updatedSceneCounts.counts[sceneName] += 1;
      } else {
        updatedSceneCounts.counts[sceneName] = 1;
      }

      // If necessary, update favorite scene
      if (
        !updatedSceneCounts.favoriteSceneName ||
        updatedSceneCounts.counts[sceneName] >
          updatedSceneCounts.counts[updatedSceneCounts.favoriteSceneName]
      ) {
        updatedSceneCounts.favoriteSceneName = sceneName;
      }

      isOnline && (await updatedSceneCountsFromDb(uid, updatedSceneCounts));
      set({ sceneCounts: updatedSceneCounts });
      updateUserStats(uid, (stats) => {
        stats.sceneCounts = updatedSceneCounts;
        return stats;
      });
    } catch (error) {
      console.log("Error updating scene counts: ", error);
    }
  },

  async resetUserStatsData() {
    const { updateUserStats } = useIndexedDBStore.getState();
    const { isOnline } = useAppStore.getState();

    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    isOnline && (await resetUserStats(uid));
    set({
      pomodoroTimerStats: {
        totalFocusTime: 0,
        totalBreakTime: 0,
        totalSessionsCompleted: 0,
        totalTasksCompleted: 0,
        weeklyStats: null,
        focusDay: null,
      },
      totalNotesCreated: 0,
      sceneCounts: null,
      alarmsExpiredCount: 0,
    });

    updateUserStats(uid, (stats) => {
      stats.pomodoroTimer = {
        totalFocusTime: 0,
        totalBreakTime: 0,
        totalSessionsCompleted: 0,
        totalTasksCompleted: 0,
        weeklyStats: null,
        focusDay: null,
      };
      stats.notes.totalNotesCreated = 0;
      stats.sceneCounts = null;
      stats.alarm.alarmsExpiredCount = 0;
      return stats;
    });
  },

  setStats(stats: UserStats) {
    set({
      pomodoroTimerStats: stats.pomodoroTimer,
      totalNotesCreated: stats.totalNotesCreated,
      sceneCounts: stats.sceneCounts,
      alarmsExpiredCount: stats.alarmsExpiredCount,
    });
  },

  getUserStats: () => {
    const { currentUser } = useUserStore.getState();
    const { pomodoroTimerStats, totalNotesCreated, sceneCounts, alarmsExpiredCount } =
      useUserStatsStore.getState();

    if (currentUser?.authUser?.uid) {
      const userStats: UserStats = {
        pomodoroTimer: pomodoroTimerStats,
        totalNotesCreated: totalNotesCreated,
        sceneCounts: sceneCounts,
        alarmsExpiredCount: alarmsExpiredCount,
      };
      return userStats;
    }
  },
}));

export default useUserStatsStore;
