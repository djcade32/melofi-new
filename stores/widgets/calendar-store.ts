import { fetchCalendarEvents, fetchCalendarsList } from "@/lib/requests/calendar-request";
import {
  buildCalendarEventList,
  buildCalendarListItem,
} from "@/lib/type-builders/calendar-type-builder";
import { CalendarEvent, CalendarListItem } from "@/types/general";
import { create } from "zustand";

export interface CalendarState {
  googleCalendarUser: any;
  isCalendarOpen: boolean;
  calendarsList: CalendarListItem[] | null;
  selectedCalendar: CalendarListItem | null;
  calendarEvents: CalendarEvent[] | null;

  setGoogleCalendarUser: (user: any) => void;
  toggleCalendar: (bool: boolean) => void;
  getCalendarsList: (accessToken: string) => void;
  setSelectedCalendar: (calendar: CalendarListItem | null) => void;
  getCalendarEvents: (accessToken: string, calendarId: string) => void;
  setCalendarEvents: (events: CalendarEvent[] | null) => void;
  resetCalendarState: () => void;
}

const useCalendarStore = create<CalendarState>((set, get) => ({
  googleCalendarUser: null,
  isCalendarOpen: false,
  calendarsList: null,
  selectedCalendar: null,
  calendarEvents: null,

  setGoogleCalendarUser: (googleCalendarUser) => {
    set({ googleCalendarUser });
    localStorage.setItem("google_calendar_user", JSON.stringify(googleCalendarUser));
  },
  toggleCalendar: (bool) => set({ isCalendarOpen: bool }),
  getCalendarsList: async (accessToken) => {
    try {
      // Fetch the list of calendars. Check if in indexDb, if not fetch from API
      const calendarsList = await fetchCalendarsList(accessToken);
      // Save calendars list to indexedDb, if not already saved
      if (calendarsList) {
        const calendarListItems = buildCalendarListItem(calendarsList.items);
        set({ calendarsList: calendarListItems });
      }
    } catch (error: any) {
      console.error("Error getting calendars list:", error.response?.data || error.message);
    }
  },
  setSelectedCalendar: (calendar) => set({ selectedCalendar: calendar }),
  getCalendarEvents: async (accessToken, calendarId) => {
    try {
      const events = await fetchCalendarEvents(accessToken, calendarId);
      if (events) {
        const calendarEvents = buildCalendarEventList(events.items);
        set({ calendarEvents });
      }
    } catch (error: any) {
      console.error("Error getting calendar events:", error.response?.data || error);
    }
  },
  setCalendarEvents: (events) => set({ calendarEvents: events }),
  resetCalendarState: () => {
    set({ googleCalendarUser: null });
    set({ calendarsList: null });
    set({ selectedCalendar: null });
    set({ calendarEvents: null });
    localStorage.removeItem("google_calendar_user");
  },
}));

export default useCalendarStore;
