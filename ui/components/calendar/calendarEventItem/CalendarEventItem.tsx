import React, { useEffect, useState } from "react";
import styles from "./calendarEventItem.module.css";
import { convertISOTimestamp, dateInPast } from "@/utils/date";
import { CalendarEvent } from "@/types/interfaces/calendar";

interface CalendarEventItemProps {
  event: CalendarEvent;
  color: string | undefined;
}

const CalendarEventItem = ({ event, color }: CalendarEventItemProps) => {
  const [isPast, setIsPast] = useState(false);
  //After every minute, check if the event is in the past
  useEffect(() => {
    setIsPast(dateInPast(event.end));

    const interval = setInterval(() => {
      if (dateInPast(event.end)) {
        clearInterval(interval);
        setIsPast(true);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [event.end]);

  return (
    <div
      className={styles.calendarEventItem__container}
      style={{ opacity: isPast ? "50%" : "100%" }}
    >
      <div style={{ display: "flex", columnGap: 10, width: "80%", alignItems: "center" }}>
        <div
          className={styles.calendarEventItem__indicator}
          style={{
            backgroundColor: isPast ? "var(--color-secondary-opacity)" : color,
          }}
        />
        <p className={styles.calendarEventItem__title}>{event.summary}</p>
      </div>
      <div className={styles.calendarEventItem__time_container}>
        <p>{convertISOTimestamp(event.start)}</p>
        <p>{convertISOTimestamp(event.end)}</p>
      </div>
    </div>
  );
};

export default CalendarEventItem;
