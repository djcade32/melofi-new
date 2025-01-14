import { UserStats } from "@/types/general";

export const buildUserStatsType = (userStats: any): UserStats => {
  return {
    pomodoroTimer: {
      totalFocusTime: userStats?.pomodoroTimer?.totalFocusTime || 0,
      totalBreakTime: userStats?.pomodoroTimer?.totalBreakTime || 0,
      totalSessionsCompleted: userStats?.pomodoroTimer?.totalSessionsCompleted || 0,
      totalTasksCompleted: userStats?.pomodoroTimer?.totalTasksCompleted || 0,
    },
    totalNotesCreated: userStats?.totalNotesCreated || 0,
    totalFocusTime: userStats?.totalFocusTime || 0,
    totalConsecutiveDays: userStats?.totalConsecutiveDays || 0,
    totalTasksCompleted: userStats?.totalTasksCompleted || 0,
    favoriteScene: userStats?.favoriteScene || null,
    lastLogin: userStats?.lastLogin || "",
  };
};
