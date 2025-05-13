import { updatePomodoroTimerTaskInDb } from "@/lib/firebase/actions/pomodoro-timer-actions";
import { getPomodoroTimerTasks } from "@/lib/firebase/getters/pomodoro-timer-getters";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import useUserStore from "../user-store";
import { buildPomodoroTimerTasks } from "@/lib/type-builders/pomodoro-task-type-builder";
import { wait } from "@/utils/general";
import useUserStatsStore from "../user-stats-store";
import {
  FocusDay,
  PomodoroTimerStats,
  PomodoroTimerTask,
  PomodoroTimerTaskPayload,
  TasksCompleted,
  WeeklyStats,
} from "@/types/interfaces/pomodoro_timer";
import { firestoreTimestampToDate, getDayOfWeek, isNewDay } from "@/utils/date";
import React from "react";
import { createLogger } from "@/utils/logger";
const Logger = createLogger("Pomodoro Timer Store");

export interface PomodoroTimerState {
  isPomodoroTimerOpen: boolean;
  pomodoroTimerTasks: PomodoroTimerTask[];
  activePomodoroTimerTask: PomodoroTimerTask | null;

  setIsPomodoroTimerOpen: (isOpen: boolean) => void;
  fetchPomodoroTimerTasks: () => Promise<void>;
  setActivePomodoroTimerTask: (task: PomodoroTimerTask) => void;
  addPomodoroTimerTask: (task: PomodoroTimerTaskPayload) => Promise<void>;
  deletePomodoroTimerTask: (taskId: string) => void;
  findAndUpdateTask: (taskId: string, updatedTask: PomodoroTimerTask) => PomodoroTimerTask[];
  resetPomodoroTimerData: (resetDb?: boolean) => Promise<void>;

  // Timer state
  isTimerRunning: boolean;

  // Timer actions
  setIsTimerRunning: (isRunning: boolean) => void;
  startTimer: () => void;
  stopTimer: () => void;
  timerDone: (setTimerTime: React.Dispatch<React.SetStateAction<number>>) => Promise<void>;
  restartTimer: () => void;
  resetTimer: () => void;
}

const usePomodoroTimerStore = create<PomodoroTimerState>((set, get) => ({
  isPomodoroTimerOpen: false,
  pomodoroTimerTasks: [],
  activePomodoroTimerTask: null,

  setIsPomodoroTimerOpen: (isOpen: boolean) => set({ isPomodoroTimerOpen: isOpen }),

  fetchPomodoroTimerTasks: async () => {
    try {
      const uid = useUserStore.getState().currentUser?.authUser?.uid;
      if (!uid) {
        return;
      }
      const fetchedTasks = await getPomodoroTimerTasks(uid);
      if (fetchedTasks) {
        const builtTasks = buildPomodoroTimerTasks(fetchedTasks);
        if (builtTasks && builtTasks.length === 0) return;
        set({ pomodoroTimerTasks: builtTasks });
        builtTasks.length > 0 && get().setActivePomodoroTimerTask(builtTasks[0]);
      }
    } catch (error) {
      Logger.error("Error fetching pomodoro timer tasks: ", error);
    }
  },

  setActivePomodoroTimerTask: (task: PomodoroTimerTask) => {
    set({ activePomodoroTimerTask: task });
  },

  addPomodoroTimerTask: async (task: PomodoroTimerTaskPayload) => {
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    const newTask: PomodoroTimerTask = {
      ...task,
      id: uuidv4(),
      percentCompleted: 0,
      completed: false,
      sessionsCompleted: 0,
      currentMode: "Focus",
      completedAt: null,
    };
    try {
      const newTasksList = [newTask, ...get().pomodoroTimerTasks];
      await updatePomodoroTimerTaskInDb(uid, newTasksList);
      set({
        pomodoroTimerTasks: [newTask, ...get().pomodoroTimerTasks],
      });
      if (get().pomodoroTimerTasks.length === 0) {
        get().setActivePomodoroTimerTask(newTask);
      }
    } catch (error) {
      Logger.error("Error adding pomodoro timer task: ", error);
      return;
    }
  },

  deletePomodoroTimerTask: async (taskId: string) => {
    const newTasksList = get().pomodoroTimerTasks.filter((t) => t.id !== taskId);
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    const newActivePomodoroTimerTask = newTasksList.length > 0 ? newTasksList[0] : null;
    try {
      await updatePomodoroTimerTaskInDb(uid, newTasksList);
      set({
        pomodoroTimerTasks: newTasksList,
        activePomodoroTimerTask: newActivePomodoroTimerTask,
      });
    } catch (error) {
      Logger.error("Error deleting pomodoro timer task: ", error);
    }
  },

  resetPomodoroTimerData: async (resetDb: boolean = true) => {
    try {
      if (resetDb) {
        const uid = useUserStore.getState().currentUser?.authUser?.uid;
        if (!uid) {
          return;
        }
        await updatePomodoroTimerTaskInDb(uid, []);
      }
      set({
        pomodoroTimerTasks: [],
        activePomodoroTimerTask: null,
      });
    } catch (error) {
      Logger.error("Error resetting pomodoro timer data: ", error);
    }
  },

  // Timer state
  isTimerRunning: false,
  timerTime: 0,
  progress: 0,

  // Timer actions
  setIsTimerRunning: (isRunning: boolean) => set({ isTimerRunning: isRunning }),
  startTimer: () => {
    set({ isTimerRunning: true });
  },

  stopTimer: () => {
    set({ isTimerRunning: false });
  },

  timerDone: async (setTimerTime) => {
    const {
      activePomodoroTimerTask,
      startTimer,
      setActivePomodoroTimerTask,
      stopTimer,
      findAndUpdateTask,
    } = get();
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    const { updatePomodoroTimerStats, pomodoroTimerStats } = useUserStatsStore.getState();

    if (!activePomodoroTimerTask || !uid) {
      return;
    }

    const { focusTime, breakTime, sessions, sessionsCompleted } = activePomodoroTimerTask;

    setTimerTime(0);
    stopTimer();

    // Increase percent completed
    const increment = 100 / (sessions * 2 - 1);

    activePomodoroTimerTask.percentCompleted += increment;

    if (sessionsCompleted < sessions) {
      if (activePomodoroTimerTask.currentMode === "Focus") {
        activePomodoroTimerTask.sessionsCompleted = sessionsCompleted + 1;
        // Check if the task is completed
        if (activePomodoroTimerTask.sessionsCompleted === sessions) {
          activePomodoroTimerTask.completed = true;
          activePomodoroTimerTask.completedAt = new Date().toISOString();
          setActivePomodoroTimerTask(activePomodoroTimerTask);
          const newTasksList = findAndUpdateTask(
            activePomodoroTimerTask.id,
            activePomodoroTimerTask
          );
          set({ pomodoroTimerTasks: newTasksList });
          try {
            await updatePomodoroTimerTaskInDb(uid, newTasksList);
            const newTasksCompleted = pomodoroTimerStats.tasksCompleted || [];
            newTasksCompleted.push({
              title: activePomodoroTimerTask.title,
              completedAt: new Date().toISOString(),
              startedAt: activePomodoroTimerTask.completedAt,
            });
            const updatedStats = {
              ...pomodoroTimerStats,
              totalFocusTime: pomodoroTimerStats.totalFocusTime + focusTime,
              totalSessionsCompleted: pomodoroTimerStats.totalSessionsCompleted + 1,
              tasksCompleted: newTasksCompleted,
            };
            const incrementObj = {
              focusTime: focusTime,
              breakTime: 0,
              sessionsCompleted: 1,
              tasksCompleted: {
                title: activePomodoroTimerTask.title,
                completedAt: new Date().toISOString(),
                startedAt: activePomodoroTimerTask.completedAt,
              },
            };
            await updatePomodoroTimerStats({
              ...updatedStats,
              weeklyStats: calculateWeeklyStats(updatedStats, incrementObj),
              focusDay: calculateFocusDay(updatedStats, incrementObj),
            });
          } catch (error) {
            Logger.error("Error updating pomodoro timer task in db: ", error);
          }
          return;
        }
        activePomodoroTimerTask.currentMode = "Break";
        setActivePomodoroTimerTask(activePomodoroTimerTask);
        findAndUpdateTask(activePomodoroTimerTask.id, activePomodoroTimerTask);
        const newTasksList = findAndUpdateTask(activePomodoroTimerTask.id, activePomodoroTimerTask);
        set({ pomodoroTimerTasks: newTasksList });
        setTimerTime(breakTime);

        try {
          await updatePomodoroTimerTaskInDb(uid, newTasksList);
          const updatedStats = {
            ...pomodoroTimerStats,
            totalFocusTime: pomodoroTimerStats.totalFocusTime + focusTime,
            totalSessionsCompleted: pomodoroTimerStats.totalSessionsCompleted + 1,
          };

          const incrementObj = {
            focusTime: focusTime,
            breakTime: 0,
            sessionsCompleted: 1,
            tasksCompleted: null,
          };
          await updatePomodoroTimerStats({
            ...updatedStats,
            weeklyStats: calculateWeeklyStats(updatedStats, incrementObj),
            focusDay: calculateFocusDay(updatedStats, incrementObj),
          });
        } catch (error) {
          Logger.error("Error updating pomodoro timer task in db: ", error);
        }

        await wait(250);
        startTimer();
        return;
      }
      if (activePomodoroTimerTask.currentMode === "Break") {
        activePomodoroTimerTask.currentMode = "Focus";
        setActivePomodoroTimerTask(activePomodoroTimerTask);
        findAndUpdateTask(activePomodoroTimerTask.id, activePomodoroTimerTask);
        const newTasksList = findAndUpdateTask(activePomodoroTimerTask.id, activePomodoroTimerTask);
        set({ pomodoroTimerTasks: newTasksList });
        setTimerTime(focusTime);

        try {
          await updatePomodoroTimerTaskInDb(uid, newTasksList);
          const updatedStats = {
            ...pomodoroTimerStats,
            totalBreakTime: pomodoroTimerStats.totalBreakTime + breakTime,
          };

          const incrementObj = {
            focusTime: 0,
            breakTime: breakTime,
            sessionsCompleted: 0,
            tasksCompleted: null,
          };
          await updatePomodoroTimerStats({
            ...updatedStats,
            weeklyStats: calculateWeeklyStats(updatedStats, incrementObj),
            focusDay: calculateFocusDay(updatedStats, incrementObj),
          });
        } catch (error) {
          Logger.error("Error updating pomodoro timer task in db: ", error);
        }

        await wait(250);

        startTimer();
        return;
      }
    }
  },

  restartTimer: () => {
    const { activePomodoroTimerTask, stopTimer } = get();
    if (!activePomodoroTimerTask) {
      return;
    }
    stopTimer();
  },

  resetTimer: async () => {
    const {
      stopTimer,
      // setProgress,
      activePomodoroTimerTask,
      setActivePomodoroTimerTask,
      findAndUpdateTask,
    } = get();
    stopTimer();
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!activePomodoroTimerTask || !uid) {
      return;
    }
    // Without this line, the progress bar will not reset to 0 in the UI
    activePomodoroTimerTask.percentCompleted = 0;

    const newActivePomodoroTimerTask: PomodoroTimerTask = {
      ...activePomodoroTimerTask,
      sessionsCompleted: 0,
      percentCompleted: 0,
      completed: false,
      currentMode: "Focus",
    };

    setActivePomodoroTimerTask(newActivePomodoroTimerTask);
    const newTasksList = findAndUpdateTask(
      newActivePomodoroTimerTask.id,
      newActivePomodoroTimerTask
    );
    try {
      wait(500);
      await updatePomodoroTimerTaskInDb(uid, newTasksList);
    } catch (error) {
      Logger.error("Error updating pomodoro timer task in db: ", error);
    }
  },

  findAndUpdateTask: (taskId: string, updatedTask: PomodoroTimerTask): PomodoroTimerTask[] => {
    const { pomodoroTimerTasks } = get();
    const updatedTasks = pomodoroTimerTasks.map((task) => {
      if (task.id === taskId) {
        return updatedTask;
      }
      return task;
    });
    return updatedTasks;
  },
}));

// Helper functions
const calculateWeeklyStats = (
  pomodoroTimerStats: Partial<PomodoroTimerStats>,
  incrementObj: incrementObj
): WeeklyStats => {
  const weeklyStats = pomodoroTimerStats?.weeklyStats || null;

  const today = new Date();
  const dayOfWeek = getDayOfWeek(today) as keyof WeeklyStats;
  if (!weeklyStats) {
    return {
      [dayOfWeek]: {
        focusTime: pomodoroTimerStats.totalFocusTime || 0,
        breakTime: pomodoroTimerStats.totalBreakTime || 0,
        sessionsCompleted: pomodoroTimerStats.totalSessionsCompleted || 0,
        tasksCompleted: pomodoroTimerStats.tasksCompleted || [],
      },
    } as WeeklyStats;
  }

  return {
    ...weeklyStats,
    [dayOfWeek]: {
      focusTime:
        weeklyStats[dayOfWeek]?.focusTime + incrementObj.focusTime || incrementObj.focusTime,
      breakTime:
        weeklyStats[dayOfWeek]?.breakTime + incrementObj.breakTime || incrementObj.breakTime,
      sessionsCompleted:
        weeklyStats[dayOfWeek]?.sessionsCompleted + incrementObj.sessionsCompleted ||
        incrementObj.sessionsCompleted,
      tasksCompleted: weeklyStats[dayOfWeek]?.tasksCompleted
        ? [...weeklyStats[dayOfWeek]?.tasksCompleted, incrementObj.tasksCompleted]
        : [incrementObj.tasksCompleted],
    },
  } as WeeklyStats;
};

interface incrementObj {
  focusTime: number;
  breakTime: number;
  sessionsCompleted: number;
  tasksCompleted: TasksCompleted | null;
}

const calculateFocusDay = (
  pomodoroTimerStats: Partial<PomodoroTimerStats>,
  incrementObj: incrementObj
): { current: FocusDay; best: FocusDay } => {
  const today = new Date();
  const focusDay = pomodoroTimerStats.focusDay || null;

  if (!focusDay) {
    const newFocusDay = {
      date: today,
      tasksCompleted: incrementObj.tasksCompleted ? [incrementObj.tasksCompleted] : [],
      focusTime: incrementObj.focusTime,
      breakTime: incrementObj.breakTime,
      sessionsCompleted: incrementObj.sessionsCompleted,
    };
    return {
      current: newFocusDay,
      best: newFocusDay,
    };
  }
  const sameDay = !isNewDay(firestoreTimestampToDate(focusDay.current!.date));

  const currentFocusDate = today;
  const currentFocusTime = sameDay
    ? focusDay.current!.focusTime + incrementObj.focusTime
    : incrementObj.focusTime;

  const bestFocusDate = focusDay.best!.date;
  const bestFocusTime = focusDay.best!.focusTime;

  // Check if the current focus time is greater than the best focus time
  if (currentFocusTime > bestFocusTime) {
    const newFocusDay = {
      date: currentFocusDate,
      focusTime: currentFocusTime,
      breakTime: focusDay.current!.breakTime + incrementObj.breakTime,
      sessionsCompleted: focusDay.current!.sessionsCompleted + incrementObj.sessionsCompleted,
      tasksCompleted: incrementObj.tasksCompleted
        ? [...focusDay.current!.tasksCompleted, incrementObj.tasksCompleted]
        : focusDay.current!.tasksCompleted,
    };
    return {
      current: newFocusDay,
      best: newFocusDay,
    };
  }
  // If the current focus time is not greater than the best focus time, keep the best focus day as is
  return {
    current: {
      date: today,
      focusTime: currentFocusTime,
      breakTime: sameDay
        ? focusDay.current!.breakTime + incrementObj.breakTime
        : incrementObj.breakTime,
      sessionsCompleted: sameDay
        ? focusDay.current!.sessionsCompleted + incrementObj.sessionsCompleted
        : incrementObj.sessionsCompleted,
      tasksCompleted: sameDay
        ? incrementObj.tasksCompleted
          ? [...focusDay.current!.tasksCompleted, incrementObj.tasksCompleted]
          : focusDay.current!.tasksCompleted
        : incrementObj.tasksCompleted
        ? [incrementObj.tasksCompleted]
        : [],
    },
    best: {
      date: bestFocusDate,
      focusTime: bestFocusTime,
      breakTime: focusDay.best!.breakTime,
      sessionsCompleted: focusDay.best!.sessionsCompleted,
      tasksCompleted: focusDay.best!.tasksCompleted,
    },
  };
};

export default usePomodoroTimerStore;
