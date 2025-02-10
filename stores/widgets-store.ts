import { create } from "zustand";
import { Widget } from "@/types/general";

export interface WidgetsState {
  openWidgets: Widget[];

  getOpenWidgets: () => void;
  addToOpenWidgets: (widget: Widget) => void;
  removeFromOpenWidgets: (widget: Widget) => void;
  clearOpenWidgets: () => void;
  onDragEnd: (name: string, position: { x: number; y: number }) => void;
  onResizeEnd: (name: string, dimensions: { width: number; height: number }) => void;
}

const useWidgetsStore = create<WidgetsState>((set, get) => ({
  openWidgets: [],

  getOpenWidgets: () => {
    const widgets = localStorage.getItem("openWidgets");
    if (widgets) {
      set(() => ({ openWidgets: JSON.parse(widgets) }));
    } else {
      set(() => ({ openWidgets: [] }));
    }
  },

  addToOpenWidgets: (widget) => {
    localStorage.setItem("openWidgets", JSON.stringify([...get().openWidgets, widget]));
    set((state) => {
      return { openWidgets: [...state.openWidgets, widget] };
    });
  },

  removeFromOpenWidgets: (widget) => {
    const newOpenWidgets = get().openWidgets.filter((w) => w.name !== widget.name);
    localStorage.setItem("openWidgets", JSON.stringify(newOpenWidgets));
    set(() => ({ openWidgets: newOpenWidgets }));
  },

  clearOpenWidgets: () => {
    localStorage.removeItem("openWidgets");
    set(() => ({ openWidgets: [] }));
  },

  onDragEnd: (name, position) => {
    const newOpenWidgets = get().openWidgets.map((w) => {
      if (w.name === name) {
        return { ...w, position };
      }
      return w;
    });
    localStorage.setItem("openWidgets", JSON.stringify(newOpenWidgets));
    set(() => ({ openWidgets: newOpenWidgets }));
  },

  onResizeEnd: (name, dimensions) => {
    const newOpenWidgets = get().openWidgets.map((w) => {
      if (w.name === name) {
        return { ...w, dimensions };
      }
      return w;
    });
    localStorage.setItem("openWidgets", JSON.stringify(newOpenWidgets));
    set(() => ({ openWidgets: newOpenWidgets }));
  },
}));

export default useWidgetsStore;
