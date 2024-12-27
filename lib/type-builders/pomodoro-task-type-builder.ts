import { PomodoroTimerTask } from "@/types/interfaces";

export const buildPomodoroTimerTasks = (task: any[]): PomodoroTimerTask[] => {
  return task.map((task) => ({
    id: task.id,
    percentCompleted: task.percentCompleted,
    sessions: task.sessions,
    sessionsCompleted: task.sessionsCompleted,
    currentMode: task.currentMode,
    title: task.title,
    focusTime: task.focusTime,
    breakTime: task.breakTime,
    completed: task.completed,
    completedAt: task.completedAt,
  }));
};
