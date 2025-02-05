import {
  resetUserStats,
  updateAlarmsExpiredCount,
  updatePomodoroTimerStats,
  updateTotalNotesCreated,
} from "@/lib/firebase/actions/stats-actions";
import { getUserStats } from "@/lib/firebase/getters/stats-getters";
import { buildUserStatsType } from "@/lib/type-builders/user-stats-type-builder";
import { create } from "zustand";
import useUserStore from "./user-store";
import { PomodoroTimerStats } from "@/types/interfaces/pomodoro_timer";

export interface userStatsState {
  lastLogin: string;

  pomodoroTimerStats: PomodoroTimerStats;
  totalFocusTime: number;
  totalConsecutiveDays: number;
  totalTasksCompleted: number;
  totalNotesCreated: number;
  favoriteScene: string | null;
  alarmsExpiredCount: number;

  setUserStats: () => Promise<void>;
  incrementTotalNotesCreated: () => Promise<void>;
  updatePomodoroTimerStats: (updatedStats: PomodoroTimerStats) => Promise<void>;
  incrementExpiredAlarmsCount: () => Promise<void>;
  resetUserStatsData: () => Promise<void>;
}

const useUserStatsStore = create<userStatsState>((set, get) => ({
  lastLogin: "",

  pomodoroTimerStats: {
    totalFocusTime: 0,
    totalBreakTime: 0,
    totalSessionsCompleted: 0,
    totalTasksCompleted: 0,
  },
  totalFocusTime: 0,
  totalConsecutiveDays: 0,
  totalTasksCompleted: 0,
  totalNotesCreated: 0,
  favoriteScene: null,
  alarmsExpiredCount: 0,

  async setUserStats() {
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    try {
      if (!uid) {
        return;
      }
      const userStats = await getUserStats(uid);
      if (!userStats) {
        return;
      }
      const userStatsBuilt = buildUserStatsType(userStats);
      set({ ...userStatsBuilt });
    } catch (error) {
      console.log("Error getting user stats: ", error);
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

  async resetUserStatsData() {
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    await resetUserStats(uid);
    set({
      lastLogin: "",
      pomodoroTimerStats: {
        totalFocusTime: 0,
        totalBreakTime: 0,
        totalSessionsCompleted: 0,
        totalTasksCompleted: 0,
      },
      totalFocusTime: 0,
      totalConsecutiveDays: 0,
      totalTasksCompleted: 0,
      totalNotesCreated: 0,
      favoriteScene: null,
      alarmsExpiredCount: 0,
    });
  },
}));

export default useUserStatsStore;
