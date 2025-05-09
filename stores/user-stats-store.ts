import {
  resetUserStats,
  updateAlarmsExpiredCount,
  updateUserStats as updateUserStatsFromDb,
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
import { AchievementTypes } from "@/enums/general";
import useNotificationProviderStore from "./notification-provider-store";
import { convertSecsToHrMinsSec } from "@/utils/time";

export interface userStatsState {
  pomodoroTimerStats: PomodoroTimerStats;
  totalNotesCreated: number;
  sceneCounts: SceneCounts | null;
  alarmsExpiredCount: number;
  achievements: AchievementTypes[];

  setUserStats: () => Promise<void>;
  incrementTotalNotesCreated: () => Promise<void>;
  updatePomodoroTimerStats: (updatedStats: PomodoroTimerStats) => Promise<void>;
  incrementExpiredAlarmsCount: () => Promise<void>;
  updateSceneCounts: (scene: string) => Promise<void>;
  resetUserStatsData: () => Promise<void>;
  setStats: (stats: UserStats) => void;
  getUserStats: () => UserStats | undefined;

  checkPomodoroAchievements: (stat: PomodoroTimerStats) => Promise<AchievementTypes[]>;
  checkNotesAchievements: (stat: number) => Promise<AchievementTypes[]>;
  checkSceneAchievements: (sceneCounts: SceneCounts) => Promise<AchievementTypes[]>;
}

const useUserStatsStore = create<userStatsState>((set, get) => ({
  pomodoroTimerStats: {
    totalFocusTime: 0,
    totalBreakTime: 0,
    totalSessionsCompleted: 0,
    tasksCompleted: [],
    weeklyStats: null,
    focusDay: null,
  },
  totalNotesCreated: 0,
  sceneCounts: null,
  alarmsExpiredCount: 0,
  achievements: [],

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
        stats.pomodoroTimer = userStatsObj.pomodoroTimer;
        stats.notes.totalNotesCreated = userStatsObj.totalNotesCreated;
        stats.sceneCounts = userStatsObj.sceneCounts;
        stats.alarm.alarmsExpiredCount = userStatsObj.alarmsExpiredCount;
        stats.achievements.achievements = userStatsObj.achievements;
        stats._lastSynced = new Date().toISOString();
        return stats;
      });
    } catch (error) {
      Logger.getInstance().error(`Error setting user stats: ${error}`);
    }
  },

  async incrementTotalNotesCreated() {
    const { updateUserStats } = useIndexedDBStore.getState();
    const { checkNotesAchievements } = get();
    const { isOnline } = useAppStore.getState();

    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    try {
      const totalNotesCreated = get().totalNotesCreated + 1;
      const unlockedAchievements = await checkNotesAchievements(totalNotesCreated);

      // isOnline && (await updateTotalNotesCreated(uid, totalNotesCreated));
      if (isOnline) {
        // await updateTotalNotesCreated(uid, totalNotesCreated);
        await updateUserStatsFromDb(uid, {
          totalNotesCreated,
          achievements: unlockedAchievements,
        });
      }
      updateUserStats(uid, (stats) => {
        stats.notes.totalNotesCreated = totalNotesCreated;
        stats.achievements.achievements = unlockedAchievements;
        return stats;
      });
      set(() => ({ totalNotesCreated: totalNotesCreated }));
    } catch (error) {
      console.log("Error incrementing total notes created: ", error);
    }
  },

  async updatePomodoroTimerStats(updatedStats: PomodoroTimerStats) {
    const { updateUserStats } = useIndexedDBStore.getState();
    const { isOnline } = useAppStore.getState();
    const userStatsStore = useUserStatsStore.getState();
    const { checkPomodoroAchievements } = userStatsStore;

    // Check if achievements are unlocked
    const unlockedAchievements = await checkPomodoroAchievements(updatedStats);
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    try {
      if (isOnline) {
        await updateUserStatsFromDb(uid, {
          pomodoroTimer: updatedStats,
          achievements: unlockedAchievements,
        });
      }
      set({ pomodoroTimerStats: updatedStats });
      updateUserStats(uid, (stats) => {
        stats.pomodoroTimer = updatedStats;
        stats.achievements.achievements = unlockedAchievements;
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
    const { checkSceneAchievements } = get();

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
      const unlockedAchievements = await checkSceneAchievements(updatedSceneCounts);
      if (isOnline) {
        await updateUserStatsFromDb(uid, {
          sceneCounts: updatedSceneCounts,
          achievements: unlockedAchievements,
        });
      }
      set({ sceneCounts: updatedSceneCounts });
      updateUserStats(uid, (stats) => {
        stats.sceneCounts = updatedSceneCounts;
        stats.achievements.achievements = unlockedAchievements;
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
        tasksCompleted: [],
        weeklyStats: null,
        focusDay: null,
      },
      totalNotesCreated: 0,
      sceneCounts: null,
      alarmsExpiredCount: 0,
      achievements: [],
    });

    updateUserStats(uid, (stats) => {
      stats.pomodoroTimer = {
        totalFocusTime: 0,
        totalBreakTime: 0,
        totalSessionsCompleted: 0,
        tasksCompleted: [],
        weeklyStats: null,
        focusDay: null,
      };
      stats.notes.totalNotesCreated = 0;
      stats.sceneCounts = null;
      stats.alarm.alarmsExpiredCount = 0;
      stats.achievements.achievements = [];
      return stats;
    });
  },

  setStats(stats: UserStats) {
    set({
      pomodoroTimerStats: stats.pomodoroTimer,
      totalNotesCreated: stats.totalNotesCreated,
      sceneCounts: stats.sceneCounts,
      alarmsExpiredCount: stats.alarmsExpiredCount,
      achievements: stats.achievements,
    });
  },

  getUserStats: () => {
    const { currentUser } = useUserStore.getState();
    const { pomodoroTimerStats, totalNotesCreated, sceneCounts, alarmsExpiredCount, achievements } =
      useUserStatsStore.getState();

    if (currentUser?.authUser?.uid) {
      const userStats: UserStats = {
        pomodoroTimer: pomodoroTimerStats,
        totalNotesCreated: totalNotesCreated,
        sceneCounts: sceneCounts,
        alarmsExpiredCount: alarmsExpiredCount,
        achievements: achievements,
      };
      return userStats;
    }
  },

  async checkPomodoroAchievements(stats: PomodoroTimerStats) {
    const { achievements } = get();
    const { addNotification } = useNotificationProviderStore.getState();
    const unlockedAchievements: AchievementTypes[] = [];

    // Check if achievements are unlocked
    const totalFocusTime = convertSecsToHrMinsSec(stats.totalFocusTime).hr;
    const todayFocusTime = convertSecsToHrMinsSec(stats.focusDay?.current?.focusTime || 0).hr;
    const totalTasksCompleted = stats.tasksCompleted.length;
    const totalSessionsCompleted = stats.totalSessionsCompleted;

    // Check for 100+ hours of focus time
    if (totalFocusTime >= 100 && !achievements.includes("Focus Master 🧘‍♂️")) {
      unlockedAchievements.push("Focus Master 🧘‍♂️");
    }
    // Check for 500+ hours of focus time
    if (totalFocusTime >= 500 && !achievements.includes("Focus Legend ⭐")) {
      unlockedAchievements.push("Focus Legend ⭐");
    }
    // Check for 5+ hours of focus time in a single day
    if (todayFocusTime >= 5 && !achievements.includes("Marathon Focus 🏃‍♂️")) {
      unlockedAchievements.push("Marathon Focus 🏃‍♂️");
    }
    // Check for 50 tasks completed
    if (totalTasksCompleted >= 50 && !achievements.includes("Pomodoro Pro 🍅")) {
      unlockedAchievements.push("Pomodoro Pro 🍅");
    }
    // Check for 100 sessions completed
    if (totalSessionsCompleted >= 100 && !achievements.includes("Pomodoro Champion 🏆")) {
      unlockedAchievements.push("Pomodoro Champion 🏆");
    }

    unlockedAchievements.forEach((achievement) => {
      addNotification({
        message: achievement,
        type: "achievement",
      });
    });
    const newAchievements = [...achievements, ...unlockedAchievements];
    set({ achievements: newAchievements });

    return newAchievements;
  },

  async checkNotesAchievements(totalNotesCreated: number) {
    const { achievements } = get();
    const { addNotification } = useNotificationProviderStore.getState();
    const unlockedAchievements: AchievementTypes[] = [];

    // Check for 100 notes created
    if (totalNotesCreated >= 1 && !achievements.includes("Note Taker Extraordinaire 📝")) {
      unlockedAchievements.push("Note Taker Extraordinaire 📝");
    }
    if (totalNotesCreated >= 100 && !achievements.includes("Note Taker Master 📝")) {
      unlockedAchievements.push("Note Taker Master 📝");
    }
    unlockedAchievements.forEach((achievement) => {
      addNotification({
        message: achievement,
        type: "achievement",
      });
    });
    const newAchievements = [...achievements, ...unlockedAchievements];
    console.log("New Achievements: ", newAchievements);
    set({ achievements: newAchievements });

    return newAchievements;
  },

  async checkSceneAchievements(sceneCounts: SceneCounts) {
    const { achievements } = get();
    const { addNotification } = useNotificationProviderStore.getState();
    const unlockedAchievements: AchievementTypes[] = [];

    // Check for 5 different scenes used
    if (
      sceneCounts &&
      Object.keys(sceneCounts.counts).length >= 5 &&
      !achievements.includes("Scene Explorer 🎨")
    ) {
      unlockedAchievements.push("Scene Explorer 🎨");
    }
    unlockedAchievements.forEach((achievement) => {
      addNotification({
        message: achievement,
        type: "achievement",
      });
    });
    const newAchievements = [...achievements, ...unlockedAchievements];
    set({ achievements: newAchievements });

    return newAchievements;
  },
}));

export default useUserStatsStore;
