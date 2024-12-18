import { updateTotalNotesCreated } from "@/lib/firebase/actions/stats-actions";
import { getUserStats } from "@/lib/firebase/getters/stats-getters";
import { buildUserStatsType } from "@/lib/type-builders/user-stats-type-builder";
import { create } from "zustand";
import useUserStore from "./user-store";

export interface userStatsState {
  totalFocusTime: number;
  totalConsecutiveDays: number;
  totalTasksCompleted: number;
  totalNotesCreated: number;
  favoriteScene: string | null;
  lastLogin: string;

  setUserStats: () => Promise<void>;
  incrementTotalNotesCreated: (email: string) => Promise<void>;
}

const useUserStatsStore = create<userStatsState>((set, get) => ({
  totalFocusTime: 0,
  totalConsecutiveDays: 0,
  totalTasksCompleted: 0,
  totalNotesCreated: 0,
  favoriteScene: null,
  lastLogin: "",

  async setUserStats() {
    const email = useUserStore.getState().currentUser?.authUser?.email;
    if (!email) {
      return;
    }
    const userStats = await getUserStats(email);
    const userStatsBuilt = buildUserStatsType(userStats);
    set({ ...userStatsBuilt });
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
}));

export default useUserStatsStore;
