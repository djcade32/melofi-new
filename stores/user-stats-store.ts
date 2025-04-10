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
import { saveUserStats } from "@/lib/firebase/actions/auth-actions";

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
    } catch (error) {
      Logger.getInstance().error(`Error setting user stats: ${error}`);
    }
  },

  async incrementTotalNotesCreated() {
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    try {
      const totalNotesCreated = get().totalNotesCreated;
      await updateTotalNotesCreated(uid, totalNotesCreated + 1);
      set((state) => ({ totalNotesCreated: totalNotesCreated + 1 }));
    } catch (error) {
      console.log("Error incrementing total notes created: ", error);
    }
  },

  async updatePomodoroTimerStats(updatedStats: PomodoroTimerStats) {
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    try {
      await updatePomodoroTimerStats(uid, updatedStats);
      set({ pomodoroTimerStats: updatedStats });
    } catch (error) {
      console.log("Error updating pomodoro timer stats: ", error);
    }
  },

  async incrementExpiredAlarmsCount() {
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    try {
      const expiredAlarmsCount = get().alarmsExpiredCount;
      await updateAlarmsExpiredCount(uid, expiredAlarmsCount + 1);
      set(() => ({ alarmsExpiredCount: expiredAlarmsCount + 1 }));
    } catch (error) {
      console.log("Error incrementing expired alarms count: ", error);
    }
  },

  async updateSceneCounts(sceneName: string) {
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

      await updatedSceneCountsFromDb(uid, updatedSceneCounts);
      set({ sceneCounts: updatedSceneCounts });
    } catch (error) {
      console.log("Error updating scene counts: ", error);
    }
  },

  async resetUserStatsData() {
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    await resetUserStats(uid);
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
  },

  setStats(stats: UserStats) {
    set({
      pomodoroTimerStats: stats.pomodoroTimer,
      totalNotesCreated: stats.totalNotesCreated,
      sceneCounts: stats.sceneCounts,
      alarmsExpiredCount: stats.alarmsExpiredCount,
    });
  },
}));

export default useUserStatsStore;
