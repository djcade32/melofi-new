import React from "react";
import styles from "./calendarsListView.module.css";
import useCalendarStore from "@/stores/widgets/calendar-store";
import CalendarListItem from "@/ui/components/calendar/calendarListItem/CalendarListItem";
import CalendarEventsView from "../calendarEventsView/CalendarEventsView";

const CalendarsListView = () => {
  const { calendarsList, selectedCalendar, setSelectedCalendar } = useCalendarStore();

  return (
    <>
      {!selectedCalendar ? (
        <div className={styles.calendarsListView__container}>
          {calendarsList?.map((calendar) => (
            <CalendarListItem key={calendar.id} item={calendar} onClick={setSelectedCalendar} />
          ))}
        </div>
      ) : (
        <CalendarEventsView calendar={selectedCalendar} />
      )}
    </>
  );
};

export default CalendarsListView;
