import { create } from "zustand";
import { Coordinates, ToolbarSettings } from "@/types/general";

export interface ToolsState {
  isToolsOpen: boolean;
  isUndocked: boolean;
  isVertical: boolean;
  toolbarPosition: Coordinates;
  originalDockedPosition: Coordinates;

  toggleTools: (boolean: boolean) => void;
  toggleUndocked: (boolean: boolean) => void;
  toggleVertical: (boolean: boolean) => void;
  fetchToolbarSettings: () => void;
  onToolbarDragEnd: (position: Coordinates) => void;
  setToolbarPosition: (position: Coordinates) => void;
  resetToolbarSettings: () => void;
  setOriginalDockedPosition: (position: Coordinates) => void;
}

const useToolsStore = create<ToolsState>((set, get) => ({
  isToolsOpen: false,
  isUndocked: false,
  isVertical: false,
  toolbarPosition: { x: 0, y: -35 },
  originalDockedPosition: { x: 0, y: -35 },

  toggleTools: (boolean) => {
    if (get().isUndocked) return;
    set(() => ({ isToolsOpen: boolean }));
  },

  toggleUndocked: (boolean) => {
    const newSettings: ToolbarSettings = {
      isVertical: get().isVertical,
      isUndocked: boolean,
      position: get().toolbarPosition,
    };
    localStorage.setItem("toolbarSettings", JSON.stringify(newSettings));
    set(() => ({ isUndocked: boolean }));
  },

  toggleVertical: (boolean) => {
    const newSettings: ToolbarSettings = {
      isVertical: boolean,
      isUndocked: get().isUndocked,
      position: get().toolbarPosition,
    };
    localStorage.setItem("toolbarSettings", JSON.stringify(newSettings));
    set(() => ({ isVertical: boolean }));
  },

  fetchToolbarSettings: () => {
    const toolbarSettings = localStorage.getItem("toolbarSettings");
    if (toolbarSettings) {
      const settings = JSON.parse(toolbarSettings);
      process.nextTick(() => {
        set(() => ({
          isUndocked: settings.isUndocked,
          isVertical: settings.isVertical,
          toolbarPosition: settings.position,
          isToolsOpen: settings.isUndocked ? true : false,
        }));
      });
    }
  },

  onToolbarDragEnd: (position) => {
    const newSettings: ToolbarSettings = {
      isVertical: get().isVertical,
      isUndocked: get().isUndocked,
      position,
    };
    localStorage.setItem("toolbarSettings", JSON.stringify(newSettings));
    set(() => ({ toolbarPosition: position }));
  },

  setToolbarPosition: (position) => {
    const newSettings: ToolbarSettings = {
      isVertical: get().isVertical,
      isUndocked: get().isUndocked,
      position,
    };
    localStorage.setItem("toolbarSettings", JSON.stringify(newSettings));
    set(() => ({ toolbarPosition: position }));
  },

  resetToolbarSettings: () => {
    localStorage.removeItem("toolbarSettings");
    set(() => ({
      isUndocked: false,
      isVertical: false,
      toolbarPosition: get().originalDockedPosition,
    }));
  },

  setOriginalDockedPosition: (position) => {
    set(() => ({ originalDockedPosition: position }));
  },
}));

export default useToolsStore;
