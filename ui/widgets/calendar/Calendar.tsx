import React, { useEffect } from "react";
import styles from "./calendar.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import useCalendarStore from "@/stores/widgets/calendar-store";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import CalendarAuthView from "./views/calendarAuthView/CalendarAuthView";
import CalendarsListView from "./views/calendarsListView/CalendarsListView";

const Calendar = () => {
  const date = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  let timeout: NodeJS.Timeout | undefined = undefined;
  let options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  };

  const {
    isCalendarOpen,
    toggleCalendar,
    setGoogleCalendarUser,
    googleCalendarUser,
    getCalendarsList,
    resetCalendarState,
  } = useCalendarStore();

  useEffect(() => {
    setGoogleCalendarUser(JSON.parse(localStorage.getItem("google_calendar_user") || "null"));
  }, []);

  useEffect(() => {
    if (googleCalendarUser) {
      setTokenExpiration(googleCalendarUser.expires_in);
      getCalendarsList(googleCalendarUser.access_token);
    }
  }, [googleCalendarUser]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setGoogleCalendarUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
    scope:
      "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
  });

  const logOut = () => {
    googleLogout();
    resetCalendarState();
    clearTimeout(timeout);
  };

  const setTokenExpiration = (expires_in: number) => {
    timeout = setTimeout(() => {
      logOut();
    }, expires_in * 1000);
  };

  return (
    <Modal
      id="calendar-widget"
      isOpen={isCalendarOpen}
      className={styles.calendar__container}
      title={date.toLocaleDateString("en-US", options)}
      draggable
      titleClassName={styles.calendar__current_date}
      fadeCloseIcon
      close={() => toggleCalendar(!isCalendarOpen)}
    >
      {googleCalendarUser ? <CalendarsListView /> : <CalendarAuthView login={login} />}
    </Modal>
  );
};

export default Calendar;
