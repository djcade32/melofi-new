import { create } from "zustand";
import { Widget } from "@/types/general";
import useCalendarStore from "./widgets/calendar-store";
import useTodoListStore from "./widgets/todoList-store";
import useNotesStore from "./widgets/notes-store";
import usePomodoroTimerStore from "./widgets/pomodoro-timer-store";
import useCalculatorStore from "./widgets/calculator-store";
import useAlarmsStore from "./widgets/alarms-store";
import useTemplatesStore from "./widgets/templates-store";
import useYoutubeStore from "./widgets/youtube-store";

export interface WidgetsState {
  openWidgets: Widget[];

  fetchOpenWidgets: () => void;
  addToOpenWidgets: (widget: Widget) => void;
  removeFromOpenWidgets: (widget: Widget) => void;
  clearOpenWidgets: () => void;
  onDragEnd: (name: string, position: { x: number; y: number }) => void;
  onResizeEnd: (name: string, dimensions: { width: number; height: number }) => void;
  toggleOpenWidgets: () => void;
  getWidgetZIndex: (name: string) => number;
  updateZIndexOnFocus: (name: string) => void;
  isWidgetOpen: (name: string) => boolean;
}

const useWidgetsStore = create<WidgetsState>((set, get) => ({
  openWidgets: [],

  fetchOpenWidgets: () => {
    const widgets = localStorage.getItem("openWidgets");
    console.log("widgets: ", widgets);
    if (widgets) {
      set(() => ({ openWidgets: JSON.parse(widgets) }));
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

  toggleOpenWidgets: () => {
    const widgets = get().openWidgets;
    widgets.forEach((widget) => {
      switch (widget.name) {
        case "calendar":
          useCalendarStore.getState().toggleCalendar(true);
          break;
        case "to-do-list":
          useTodoListStore.getState().setIsTodoListOpen(true);
          break;
        case "notes":
          useNotesStore.getState().setIsNotesOpen(true);
          break;
        case "pomodoro-timer":
          usePomodoroTimerStore.getState().setIsPomodoroTimerOpen(true);
          break;
        case "calculator":
          useCalculatorStore.getState().setIsCalculatorOpen(true);
          break;
        case "alarms":
          useAlarmsStore.getState().setIsAlarmsOpen(true);
          break;
        case "templates":
          useTemplatesStore.getState().setIsTemplatesOpen(true);
          break;
        case "youtube":
          useYoutubeStore.getState().setIsYoutubeOpen(true);
          break;
        default:
          console.log("Widget not found to open");
          break;
      }
    });
  },

  getWidgetZIndex: (name) => {
    const widget = get().openWidgets.find((w) => w.name === name);
    if (widget) {
      return widget.zIndex;
    }
    return 1;
  },

  updateZIndexOnFocus: (name) => {
    const newOpenWidgets = get().openWidgets.map((w) => {
      if (w.name === name) {
        return { ...w, zIndex: get().openWidgets.length + 2 };
      }
      return w;
    });
    localStorage.setItem("openWidgets", JSON.stringify(newOpenWidgets));
    set(() => ({ openWidgets: newOpenWidgets }));
  },

  isWidgetOpen: (name) => {
    return get().openWidgets.some((w) => w.name === name);
  },
}));

export default useWidgetsStore;
