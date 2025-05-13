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
import useMixerStore from "./mixer-store";
import useTimerStore from "./widgets/timer-store";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Widgets Store");

export interface WidgetsState {
  openWidgets: Widget[];

  fetchOpenWidgets: () => Widget[];
  addToOpenWidgets: (widget: Widget) => void;
  removeFromOpenWidgets: (widget: Widget) => void;
  clearOpenWidgets: () => void;
  onDragEnd: (name: string, position: { x: number; y: number }) => void;
  onResizeEnd: (name: string, dimensions: { width: number; height: number }) => void;
  toggleOpenWidgets: (widgets: Widget[]) => void;
  getWidgetZIndex: (name: string) => number;
  isWidgetOpen: (name: string) => boolean;
  focusWidget: (name: string) => void;
  zIndexForFocus: () => number;
  closePremiumWidgets: () => void;
  closeAllWidgets: () => Promise<void>;
}

const useWidgetsStore = create<WidgetsState>((set, get) => ({
  openWidgets: [],

  fetchOpenWidgets: () => {
    const widgets = JSON.parse(localStorage.getItem("open_widgets") || "[]") as Widget[];
    if (widgets) {
      set(() => ({ openWidgets: widgets }));
    }
    return widgets;
  },

  addToOpenWidgets: (widget) => {
    localStorage.setItem("open_widgets", JSON.stringify([...get().openWidgets, widget]));
    set((state) => {
      return { openWidgets: [...state.openWidgets, widget] };
    });
  },

  removeFromOpenWidgets: (widget) => {
    const newOpenWidgets = get().openWidgets.filter((w) => w.name !== widget.name);
    localStorage.setItem("open_widgets", JSON.stringify(newOpenWidgets));
    set(() => ({ openWidgets: newOpenWidgets }));
  },

  clearOpenWidgets: () => {
    localStorage.removeItem("open_widgets");
    set(() => ({ openWidgets: [] }));
  },

  onDragEnd: (name, position) => {
    const newOpenWidgets = get().openWidgets.map((w) => {
      if (w.name === name) {
        return { ...w, position };
      }
      return w;
    });
    localStorage.setItem("open_widgets", JSON.stringify(newOpenWidgets));
    set(() => ({ openWidgets: newOpenWidgets }));
  },

  onResizeEnd: (name, dimensions) => {
    const newOpenWidgets = get().openWidgets.map((w) => {
      if (w.name === name) {
        return { ...w, dimensions };
      }
      return w;
    });
    localStorage.setItem("open_widgets", JSON.stringify(newOpenWidgets));
    set(() => ({ openWidgets: newOpenWidgets }));
  },

  toggleOpenWidgets: (widgets: Widget[]) => {
    widgets.length > 0 && Logger.debug.info("Opening Widgets: ", widgets);
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
        case "mixer":
          useMixerStore.getState().toggleMixerModal(true);
          break;
        case "timer":
          useTimerStore.getState().setIsTimerOpen(true);
          break;
        default:
          Logger.debug.warn("Widget not found to open");
          break;
      }
    });
  },

  // Close all premium widgets
  closePremiumWidgets: () => {
    usePomodoroTimerStore.getState().setIsPomodoroTimerOpen(false);
    useAlarmsStore.getState().setIsAlarmsOpen(false);
    useYoutubeStore.getState().setIsYoutubeOpen(false);
  },

  closeAllWidgets: async () => {
    useCalendarStore.getState().toggleCalendar(false);
    useTodoListStore.getState().setIsTodoListOpen(false);
    useNotesStore.getState().setIsNotesOpen(false);
    usePomodoroTimerStore.getState().setIsPomodoroTimerOpen(false);
    useCalculatorStore.getState().setIsCalculatorOpen(false);
    useAlarmsStore.getState().setIsAlarmsOpen(false);
    useTemplatesStore.getState().setIsTemplatesOpen(false);
    useYoutubeStore.getState().setIsYoutubeOpen(false);
    useMixerStore.getState().toggleMixerModal(false);
    useTimerStore.getState().setIsTimerOpen(false);
  },

  getWidgetZIndex: (name) => {
    let idx = get().openWidgets.findIndex((w) => {
      if (w.name === name) {
        return true;
      }
      return false;
    });

    return idx > -1 ? idx + 1 : 1;
  },

  isWidgetOpen: (name) => {
    return get().openWidgets.some((w) => w.name === name);
  },

  focusWidget: (name) => {
    const openWidgets = get().openWidgets;
    const widget = openWidgets.find((w) => w.name === name);
    if (widget && openWidgets[openWidgets.length - 1].name !== name) {
      const newOpenWidgets = get().openWidgets.filter((w) => w.name !== name);
      localStorage.setItem("open_widgets", JSON.stringify([...newOpenWidgets, widget]));
      set(() => ({ openWidgets: [...newOpenWidgets, widget] }));
    }
  },

  zIndexForFocus: () => {
    return get().openWidgets.length + 1;
  },
}));

export default useWidgetsStore;
