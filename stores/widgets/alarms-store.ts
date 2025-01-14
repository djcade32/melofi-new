import { create } from "zustand";

export interface AlarmsState {
  isAlarmsOpen: boolean;

  setIsAlarmsOpen: (value: boolean) => void;
}

const useAlarmsStore = create<AlarmsState>((set, get) => ({
  isAlarmsOpen: true,

  setIsAlarmsOpen: (value) => {
    set({ isAlarmsOpen: value });
  },
}));

export default useAlarmsStore;
