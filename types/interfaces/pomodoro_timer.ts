import { DaysOfWeek } from "@/enums/general";

export interface PomodoroTimerStats {
  totalFocusTime: number;
  totalBreakTime: number;
  totalSessionsCompleted: number;
  totalTasksCompleted: number;
  weeklyStats: WeeklyStats | null;
}

export type WeeklyStats =
  | {
      [key in DaysOfWeek]: {
        focusTime: number;
        breakTime: number;
        sessionsCompleted: number;
        tasksCompleted: number;
      };
    };

export interface PomodoroTimerTaskPayload {
  title: string;
  focusTime: number;
  breakTime: number;
  sessions: number;
}

export interface PomodoroTimerTask extends PomodoroTimerTaskPayload {
  id: string;
  completed: boolean;
  completedAt: string | null;
  sessionsCompleted: number;
  percentCompleted: number;
  currentMode: "Focus" | "Break";
}
