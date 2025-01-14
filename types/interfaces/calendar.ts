export interface CalendarListItem {
  id: string;
  name: string;
  color: string;
  primary: boolean;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
}
