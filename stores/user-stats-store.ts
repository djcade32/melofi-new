import {
  updatePomodoroTimerStats,
  updateTotalNotesCreated,
} from "@/lib/firebase/actions/stats-actions";
import { getUserStats } from "@/lib/firebase/getters/stats-getters";
import { buildUserStatsType } from "@/lib/type-builders/user-stats-type-builder";
import { create } from "zustand";
import useUserStore from "./user-store";
import { PomodoroTimerStats } from "@/types/interfaces/pomodoro_timer";

export interface userStatsState {
  pomodoroTimerStats: PomodoroTimerStats;
  totalFocusTime: number;
  totalConsecutiveDays: number;
  totalTasksCompleted: number;
  totalNotesCreated: number;
  favoriteScene: string | null;
  lastLogin: string;

  setUserStats: () => Promise<void>;
  incrementTotalNotesCreated: (email: string) => Promise<void>;
  updatePomodoroTimerStats: (updatedStats: PomodoroTimerStats) => Promise<void>;
}

const useUserStatsStore = create<userStatsState>((set, get) => ({
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
  lastLogin: "",

  async setUserStats() {
    const email = useUserStore.getState().currentUser?.authUser?.email;
    try {
      if (!email) {
        return;
      }
      const userStats = await getUserStats(email);
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
    const email = useUserStore.getState().currentUser?.authUser?.email;
    if (!email) {
      return;
    }
    try {
      await updateTotalNotesCreated(email, get().totalNotesCreated + 1);
      set((state) => ({ totalNotesCreated: state.totalNotesCreated + 1 }));
    } catch (error) {
      console.log("Error incrementing total notes created: ", error);
    }
  },

  async updatePomodoroTimerStats(updatedStats: PomodoroTimerStats) {
    const email = useUserStore.getState().currentUser?.authUser?.email;
    if (!email) {
      return;
    }
    try {
      await updatePomodoroTimerStats(email, updatedStats);
      set({ pomodoroTimerStats: updatedStats });
    } catch (error) {
      console.log("Error updating pomodoro timer stats: ", error);
    }
  },
}));

export default useUserStatsStore;
