import { create } from "zustand";

export interface ToolsState {
  isToolsOpen: boolean;
  isUndocked: boolean;
  isVertical: boolean;

  toggleTools: (boolean: boolean) => void;
  toggleUndocked: (boolean: boolean) => void;
  toggleVertical: (boolean: boolean) => void;
}

const useToolsStore = create<ToolsState>((set, get) => ({
  isToolsOpen: false,
  isUndocked: false,
  isVertical: false,

  toggleTools: (boolean) => {
    set(() => ({ isToolsOpen: boolean }));
  },
  toggleUndocked: (boolean) => {
    set(() => ({ isUndocked: boolean }));
  },
  toggleVertical: (boolean) => {
    set(() => ({ isVertical: boolean }));
  },
}));

export default useToolsStore;
