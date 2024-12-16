import { UserStats } from "@/types/interfaces";

export const buildUserStatsType = (userStats: any): UserStats => {
  return {
    totalNotesCreated: userStats.totalNotesCreated || 0,
    totalFocusTime: userStats.totalFocusTime || 0,
    totalConsecutiveDays: userStats.totalConsecutiveDays || 0,
    totalTasksCompleted: userStats.totalTasksCompleted || 0,
    favoriteScene: userStats.favoriteScene || null,
    lastLogin: userStats.lastLogin || "",
  };
};
