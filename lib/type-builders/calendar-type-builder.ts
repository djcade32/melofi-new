import { CalendarEvent, CalendarListItem } from "@/types/interfaces";

export const buildCalendarListItem = (calendars: any[]): CalendarListItem[] => {
  return calendars.map((calendar) => ({
    id: calendar.id,
    name: calendar.summary,
    color: calendar.backgroundColor,
    primary: calendar.primary || false,
  }));
};

export const buildCalendarEventList = (events: any[]): CalendarEvent[] => {
  return events.map((event) => ({
    id: event.id,
    summary: event.summary,
    start: event.start.dateTime ? event.start.dateTime : event.start.date,
    end: event.end.dateTime ? event.end.dateTime : event.end.date,
  }));
};
