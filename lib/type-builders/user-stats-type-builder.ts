import { UserStats } from "@/types/general";

export const buildUserStatsType = (userStats: any): UserStats => {
  return {
    pomodoroTimer: {
      totalFocusTime: userStats?.pomodoroTimer?.totalFocusTime || 0,
      totalBreakTime: userStats?.pomodoroTimer?.totalBreakTime || 0,
      totalSessionsCompleted: userStats?.pomodoroTimer?.totalSessionsCompleted || 0,
      tasksCompleted: userStats?.pomodoroTimer?.tasksCompleted || [],
      weeklyStats: userStats?.pomodoroTimer?.weeklyStats || null,
      focusDay: userStats?.pomodoroTimer?.focusDay || null,
    },
    totalNotesCreated: userStats?.totalNotesCreated || 0,
    sceneCounts: userStats?.sceneCounts || null,
    alarmsExpiredCount: userStats?.alarmsExpiredCount || 0,
    achievements: userStats?.achievements || [],
  };
};
