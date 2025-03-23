import React, { useEffect, useState } from "react";
import styles from "./calendarEventsView.module.css";
import { RxCaretLeft } from "@/imports/icons";
import useCalendarStore from "@/stores/widgets/calendar-store";
import CalendarEventItem from "@/ui/components/calendar/calendarEventItem/CalendarEventItem";
import { CalendarListItem } from "@/types/interfaces/calendar";

interface CalendarEventsViewProps {
  calendar: CalendarListItem;
}

const CalendarEventsView = ({ calendar }: CalendarEventsViewProps) => {
  const {
    setSelectedCalendar,
    getCalendarEvents,
    googleCalendarUser,
    calendarEvents,
    setCalendarEvents,
  } = useCalendarStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getCalendarEvents(googleCalendarUser.access_token, calendar.id);
    return;
  }, []);

  useEffect(() => {
    if (calendarEvents) {
      setIsLoading(false);
    }
  }, [calendarEvents]);

  const goBack = () => {
    setSelectedCalendar(null);
    setCalendarEvents(null);
  };

  const content = () => {
    if (isLoading) {
      return <p>...Loading</p>;
    } else if (calendarEvents && calendarEvents?.length > 0) {
      return calendarEvents?.map((event) => (
        <CalendarEventItem key={event.id} event={event} color={calendar.color} />
      ));
    } else {
      return <p>No events today</p>;
    }
  };

  return (
    <div className={styles.calendarEventsView__container}>
      <div
        className={styles.calendarEventsView__header}
        style={{
          borderBottom: `1px solid ${calendar.color}`,
        }}
      >
        <RxCaretLeft
          size={30}
          color="var(--color-white)"
          style={{ cursor: "pointer" }}
          onClick={goBack}
        />
        <p>{calendar.name}</p>
      </div>
      <div className={styles.calendarEventsView__events_container}>{content()}</div>
    </div>
  );
};

export default CalendarEventsView;
