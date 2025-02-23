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
  WeeklyStats,
} from "@/types/interfaces/pomodoro_timer";
import { getDayOfWeek } from "@/utils/date";

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
  resetPomodoroTimerData: () => Promise<void>;

  // Timer state
  isTimerRunning: boolean;
  timerTime: number;
  worker: Worker | null;
  progress: number;

  // Timer actions
  setWorker: (worker: Worker) => void;
  setIsTimerRunning: (isRunning: boolean) => void;
  setTimerTime: (time: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  timerDone: () => void;
  restartTimer: () => void;
  setProgress: (progress: number) => void;
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
      console.log("Error fetching pomodoro timer tasks: ", error);
    }
  },

  setActivePomodoroTimerTask: (task: PomodoroTimerTask) => {
    get().setTimerTime(task.currentMode === "Focus" ? task.focusTime : task.breakTime);
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
      console.log("Error adding pomodoro timer task: ", error);
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
      if (newActivePomodoroTimerTask) {
        get().setTimerTime(
          newActivePomodoroTimerTask.currentMode === "Focus"
            ? newActivePomodoroTimerTask.focusTime
            : newActivePomodoroTimerTask.breakTime
        );
      }
    } catch (error) {
      console.log("Error deleting pomodoro timer task: ", error);
    }
  },

  resetPomodoroTimerData: async () => {
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    try {
      await updatePomodoroTimerTaskInDb(uid, []);
      set({
        pomodoroTimerTasks: [],
        activePomodoroTimerTask: null,
      });
    } catch (error) {
      console.log("Error resetting pomodoro timer data: ", error);
    }
  },

  // Timer state
  isTimerRunning: false,
  timerTime: 0,
  worker: null,
  progress: 0,

  // Timer actions
  setWorker: (worker: Worker) => set({ worker: worker }),

  setIsTimerRunning: (isRunning: boolean) => set({ isTimerRunning: isRunning }),

  setTimerTime: (time: number) => set({ timerTime: time }),

  startTimer: () => {
    const worker = get().worker;
    if (!worker) return;

    set({ isTimerRunning: true });
    worker.postMessage({ turn: "on", timeInput: get().timerTime });
  },

  stopTimer: () => {
    const worker = get().worker;
    if (!worker) return;

    set({ isTimerRunning: false });
    worker.postMessage({ turn: "off", timeInput: get().timerTime });
  },

  timerDone: async () => {
    const {
      activePomodoroTimerTask,
      startTimer,
      setTimerTime,
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
            const updatedStats = {
              ...pomodoroTimerStats,
              totalFocusTime: pomodoroTimerStats.totalFocusTime + focusTime,
              totalSessionsCompleted: pomodoroTimerStats.totalSessionsCompleted + 1,
              totalTasksCompleted: pomodoroTimerStats.totalTasksCompleted + 1,
            };
            const incrementObj = {
              focusTime: focusTime,
              breakTime: 0,
              sessionsCompleted: 1,
              tasksCompleted: 1,
            };
            await updatePomodoroTimerStats({
              ...updatedStats,
              weeklyStats: calculateWeeklyStats(updatedStats, incrementObj),
              focusDay: calculateFocusDay(updatedStats, incrementObj),
            });
          } catch (error) {
            console.log("Error updating pomodoro timer task in db: ", error);
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
            tasksCompleted: 0,
          };
          await updatePomodoroTimerStats({
            ...updatedStats,
            weeklyStats: calculateWeeklyStats(updatedStats, incrementObj),
            focusDay: calculateFocusDay(updatedStats, incrementObj),
          });
        } catch (error) {
          console.log("Error updating pomodoro timer task in db: ", error);
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
            tasksCompleted: 0,
          };
          await updatePomodoroTimerStats({
            ...updatedStats,
            weeklyStats: calculateWeeklyStats(updatedStats, incrementObj),
            focusDay: calculateFocusDay(updatedStats, incrementObj),
          });
        } catch (error) {
          console.log("Error updating pomodoro timer task in db: ", error);
        }

        await wait(250);

        startTimer();
        return;
      }
    }
  },

  restartTimer: () => {
    const { activePomodoroTimerTask, setTimerTime, stopTimer, setProgress, progress } = get();
    if (!activePomodoroTimerTask) {
      return;
    }
    stopTimer();
    setTimerTime(
      activePomodoroTimerTask.currentMode === "Focus"
        ? activePomodoroTimerTask.focusTime
        : activePomodoroTimerTask.breakTime
    );
    const newValue = progress - (progress % 100);
    setProgress(newValue);
  },

  setProgress: (progress: number) => set({ progress }),

  resetTimer: async () => {
    const {
      stopTimer,
      setProgress,
      activePomodoroTimerTask,
      setActivePomodoroTimerTask,
      findAndUpdateTask,
    } = get();
    stopTimer();
    setProgress(0);
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
      console.log("Error updating pomodoro timer task in db: ", error);
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
        tasksCompleted: pomodoroTimerStats.totalTasksCompleted || 0,
      },
    } as WeeklyStats;
  }

  return {
    ...weeklyStats,
    [dayOfWeek]: {
      focusTime: weeklyStats[dayOfWeek]?.focusTime + incrementObj.focusTime || 0,
      breakTime: weeklyStats[dayOfWeek]?.breakTime + incrementObj.breakTime || 0,
      sessionsCompleted:
        weeklyStats[dayOfWeek]?.sessionsCompleted + incrementObj.sessionsCompleted || 0,
      tasksCompleted: weeklyStats[dayOfWeek]?.tasksCompleted + incrementObj.tasksCompleted || 0,
    },
  } as WeeklyStats;
};

interface incrementObj {
  focusTime: number;
  breakTime: number;
  sessionsCompleted: number;
  tasksCompleted: number;
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
      ...incrementObj,
    };
    return {
      current: newFocusDay,
      best: newFocusDay,
    };
  }
  const currentFocusDate = today;
  const currentFocusTime = focusDay.current!.focusTime + incrementObj.focusTime;

  const bestFocusDate = focusDay.best!.date;
  const bestFocusTime = focusDay.best!.focusTime;

  if (currentFocusTime > bestFocusTime) {
    const newFocusDay = {
      date: currentFocusDate,
      focusTime: currentFocusTime,
      breakTime: focusDay.current!.breakTime + incrementObj.breakTime,
      sessionsCompleted: focusDay.current!.sessionsCompleted + incrementObj.sessionsCompleted,
      tasksCompleted: focusDay.current!.tasksCompleted + incrementObj.tasksCompleted,
    };
    return {
      current: newFocusDay,
      best: newFocusDay,
    };
  }
  return {
    current: {
      date: today,
      focusTime: currentFocusTime,
      breakTime: focusDay.current!.breakTime + incrementObj.breakTime,
      sessionsCompleted: focusDay.current!.sessionsCompleted + incrementObj.sessionsCompleted,
      tasksCompleted: focusDay.current!.tasksCompleted + incrementObj.tasksCompleted,
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
