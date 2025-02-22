import { create } from "zustand";
import useUserStatsStore from "./user-stats-store";
import { FocusDay, WeeklyStats } from "@/types/interfaces/pomodoro_timer";
import { convertSecsToHrMinsSec } from "@/utils/time";

export interface InsightsState {
  getTodaysFocusStats: () => Partial<FocusDay> | null;
  getAllFocusStats: () => Partial<FocusDay> | null;
  getBestFocusDay: () => FocusDay | null;
  getWeeklyFocusStats: () => WeeklyFocusStatsType[];
}

const useInsightsStore = create<InsightsState>((set, get) => ({
  getTodaysFocusStats: () => {
    const { pomodoroTimerStats } = useUserStatsStore.getState();
    const { focusDay } = pomodoroTimerStats;
    if (!focusDay || !focusDay.current) {
      return null;
    }
    const { focusTime, breakTime, sessionsCompleted, tasksCompleted } = focusDay.current;
    return {
      focusTime,
      breakTime,
      sessionsCompleted,
      tasksCompleted,
    };
  },

  getAllFocusStats: () => {
    const { pomodoroTimerStats } = useUserStatsStore.getState();

    const {
      totalFocusTime: focusTime,
      totalBreakTime: breakTime,
      totalSessionsCompleted: sessionsCompleted,
      totalTasksCompleted: tasksCompleted,
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
          tasksCompleted: 0,
        } as WeeklyFocusStatsType);
      } else {
        const { focusTime, breakTime, sessionsCompleted, tasksCompleted } =
          weeklyStats[day as keyof WeeklyStats];
        let focusTimeConverted = convertSecsToHrMinsSec(focusTime);
        let focusTimeCalc =
          focusTimeConverted.hr > 0 ? focusTimeConverted.hr : focusTimeConverted.min / 100;
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
