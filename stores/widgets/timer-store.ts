import { create } from "zustand";

export interface TimerState {
  isTimerOpen: boolean;
  isTimerRunning: boolean;
  originalTime: number | null;

  setIsTimerOpen: (isOpen: boolean) => void;
  startTimer: (worker: Worker, time: number) => void;
  stopTimer: (worker: Worker) => void;
  resetTimer: (worker: Worker) => void;
  timerIsDone: (worker: Worker) => void;
  setOriginalTime: (time: number | null) => void;
}

const useTimerStore = create<TimerState>((set, get) => ({
  isTimerOpen: false,
  isTimerRunning: false,
  originalTime: null,

  setIsTimerOpen: (isOpen) => set({ isTimerOpen: isOpen }),

  startTimer: (worker, time) => {
    const { originalTime } = get();
    worker.postMessage({ turn: "on", timeInput: time });
    set({ isTimerRunning: true });
    !originalTime && set({ originalTime: time });
  },

  stopTimer: (worker) => {
    worker.postMessage({ turn: "off" });
    set({ isTimerRunning: false });
  },

  resetTimer: (worker) => {
    worker.postMessage({ turn: "off" });
    set({ isTimerRunning: false });
    get().originalTime && set({ originalTime: null });
  },

  timerIsDone: (worker) => {
    worker.postMessage({ turn: "off" });
    set({ isTimerRunning: false });
  },

  setOriginalTime: (time) => set({ originalTime: time }),
}));

export default useTimerStore;
