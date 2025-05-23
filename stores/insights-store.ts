import { create } from "zustand";
import useUserStatsStore from "./user-stats-store";
import { FocusDay, WeeklyStats } from "@/types/interfaces/pomodoro_timer";
import { convertSecsToHrMinsSec } from "@/utils/time";
import { firestoreTimestampToDate, isNewDay } from "@/utils/date";

export interface InsightsState {
  getStickyNoteStats: () => number;
  getAlarmsExpiredCount: () => number;
  getFavoriteScene: () => string | null;

  getTodaysFocusStats: () => Partial<FocusDay> | null;
  getAllFocusStats: () => Partial<FocusDay> | null;
  getBestFocusDay: () => FocusDay | null;
  getWeeklyFocusStats: () => WeeklyFocusStatsType[];
}

const useInsightsStore = create<InsightsState>((set, get) => ({
  getStickyNoteStats: () => {
    const { totalNotesCreated } = useUserStatsStore.getState();
    return totalNotesCreated;
  },

  getAlarmsExpiredCount: () => {
    const { alarmsExpiredCount } = useUserStatsStore.getState();
    return alarmsExpiredCount;
  },

  getFavoriteScene: () => {
    const { sceneCounts } = useUserStatsStore.getState();
    if (!sceneCounts) {
      return null;
    }
    return sceneCounts.favoriteSceneName;
  },

  getTodaysFocusStats: () => {
    const { pomodoroTimerStats } = useUserStatsStore.getState();
    const { focusDay } = pomodoroTimerStats;
    if (!focusDay || !focusDay.current) {
      return null;
    }
    const { focusTime, breakTime, sessionsCompleted, tasksCompleted, date } = focusDay.current;
    const convertedDate = firestoreTimestampToDate(date);
    const obj = {
      focusTime: isNewDay(convertedDate) ? 0 : focusTime,
      breakTime: isNewDay(convertedDate) ? 0 : breakTime,
      sessionsCompleted: isNewDay(convertedDate) ? 0 : sessionsCompleted,
      tasksCompleted: isNewDay(convertedDate) ? [] : tasksCompleted,
    };
    return obj;
  },

  getAllFocusStats: () => {
    const { pomodoroTimerStats } = useUserStatsStore.getState();

    const {
      totalFocusTime: focusTime,
      totalBreakTime: breakTime,
      totalSessionsCompleted: sessionsCompleted,
      tasksCompleted: tasksCompleted,
    } = pomodoroTimerStats;
    return {
      focusTime,
      breakTime,
      sessionsCompleted,
      tasksCompleted,
    };
  },

  getBestFocusDay: () => {
    const { pomodoroTimerStats } = useUserStatsStore.getState();
    const { focusDay } = pomodoroTimerStats;
    if (!focusDay || !focusDay.best) {
      return null;
    }
    const { date, focusTime, breakTime, sessionsCompleted, tasksCompleted } = focusDay.best;

    return {
      date,
      focusTime,
      breakTime,
      sessionsCompleted,
      tasksCompleted,
    };
  },

  getWeeklyFocusStats: () => {
    const { pomodoroTimerStats } = useUserStatsStore.getState();
    const { weeklyStats } = pomodoroTimerStats;
    let data: WeeklyFocusStatsType[] = [];
    if (!weeklyStats) {
      return data;
    }
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (const day of daysOfWeek) {
      if (!weeklyStats[day as keyof WeeklyStats]) {
        data.push({
          day,
          focusTime: 0,
          breakTime: 0,
          sessionsCompleted: 0,
          tasksCompleted: [],
        } as WeeklyFocusStatsType);
      } else {
        const { focusTime, breakTime, sessionsCompleted, tasksCompleted } =
          weeklyStats[day as keyof WeeklyStats];
        // let focusTimeConverted = convertSecsToHrMinsSec(focusTime);
        let focusTimeCalc = focusTime;
        // focusTimeConverted.hr > 0 ? focusTimeConverted.hr : focusTimeConverted.min / 100;
        let breakTimeConverted = convertSecsToHrMinsSec(breakTime);
        let breakTimeCalc =
          breakTimeConverted.hr > 0 ? breakTimeConverted.hr : breakTimeConverted.min / 100;
        data.push({
          day,
          focusTime: focusTimeCalc,
          breakTime: breakTimeCalc,
          sessionsCompleted,
          tasksCompleted,
        });
      }
    }
    return data;
  },
}));

interface WeeklyFocusStatsType extends Partial<FocusDay> {
  day: string;
}

export default useInsightsStore;
