import {
  addPomodoroTimerTaskToDb,
  updatePomodoroTimerTaskInDb,
} from "@/lib/firebase/actions/pomodoro-timer-actions";
import { getPomodoroTimerTasks } from "@/lib/firebase/getters/pomodoro-timer-getters";
import { PomodoroTimerTask, PomodoroTimerTaskPayload } from "@/types/interfaces";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import useUserStore from "../user-store";
import { buildPomodoroTimerTasks } from "@/lib/type-builders/pomodoro-task-type-builder";

export interface PomodoroTimerState {
  isPomodoroTimerOpen: boolean;
  pomodoroTimerTasks: PomodoroTimerTask[];
  activePomodoroTimerTask: PomodoroTimerTask | null;

  setIsPomodoroTimerOpen: (isOpen: boolean) => void;
  fetchPomodoroTimerTasks: () => Promise<void>;
  setActivePomodoroTimerTask: (task: PomodoroTimerTask) => void;
  addPomodoroTimerTask: (task: PomodoroTimerTaskPayload) => Promise<void>;
  deletePomodoroTimerTask: (taskId: string) => void;
}

const usePomodoroTimerStore = create<PomodoroTimerState>((set, get) => ({
  isPomodoroTimerOpen: true,
  pomodoroTimerTasks: [],
  activePomodoroTimerTask: null,

  setIsPomodoroTimerOpen: (isOpen: boolean) => set({ isPomodoroTimerOpen: isOpen }),
  fetchPomodoroTimerTasks: async () => {
    const email = useUserStore.getState().currentUser?.authUser?.email;
    if (!email) {
      return;
    }
    const fetchedTasks = await getPomodoroTimerTasks(email);
    if (fetchedTasks) {
      const builtTasks = buildPomodoroTimerTasks(fetchedTasks.pomodoroTasks);
      set({ pomodoroTimerTasks: builtTasks });
      builtTasks.length > 0 && set({ activePomodoroTimerTask: builtTasks[0] });
    }
  },
  setActivePomodoroTimerTask: (task: PomodoroTimerTask) => set({ activePomodoroTimerTask: task }),
  addPomodoroTimerTask: async (task: PomodoroTimerTaskPayload) => {
    const email = useUserStore.getState().currentUser?.authUser?.email;
    if (!email) {
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
      await addPomodoroTimerTaskToDb(email, newTask);
      set({
        pomodoroTimerTasks: [newTask, ...get().pomodoroTimerTasks],
        activePomodoroTimerTask: newTask,
      });
    } catch (error) {
      console.log("Error adding pomodoro timer task: ", error);
      return;
    }
  },
  deletePomodoroTimerTask: (taskId: string) => {
    const newTasksList = get().pomodoroTimerTasks.filter((t) => t.id !== taskId);
    const email = useUserStore.getState().currentUser?.authUser?.email;
    if (!email) {
      return;
    }
    try {
      updatePomodoroTimerTaskInDb(email, newTasksList);
      set({
        pomodoroTimerTasks: newTasksList,
        activePomodoroTimerTask: newTasksList.length > 0 ? newTasksList[0] : null,
      });
    } catch (error) {
      console.log("Error deleting pomodoro timer task: ", error);
    }
  },
}));

export default usePomodoroTimerStore;
