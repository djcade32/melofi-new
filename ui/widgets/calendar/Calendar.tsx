import React, { useEffect } from "react";
import styles from "./calendar.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import useCalendarStore from "@/stores/widgets/calendar-store";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import CalendarAuthView from "./views/calendarAuthView/CalendarAuthView";
import CalendarsListView from "./views/calendarsListView/CalendarsListView";
import useAppStore from "@/stores/app-store";
import { addSecondsToCurrentTime } from "@/utils/time";
import { dateInPast } from "@/utils/date";

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
  const { appSettings } = useAppStore();

  useEffect(() => {
    setGoogleCalendarUser(JSON.parse(localStorage.getItem("google_calendar_user") || "null"));
  }, []);

  useEffect(() => {
    const fetchCalendarsList = async () => {
      await getCalendarsList(googleCalendarUser.access_token);
    };

    if (googleCalendarUser) {
      // If the token is expired or the date is in the past, log out
      if (!googleCalendarUser.expired_at || dateInPast(googleCalendarUser.expired_at)) {
        logOut();
        return;
      }
      setTokenExpiration(googleCalendarUser.expires_in);
      fetchCalendarsList();
    }
  }, [googleCalendarUser]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      const { expires_in } = codeResponse;
      const googleCalendarUser = {
        ...codeResponse,
        expired_at: addSecondsToCurrentTime(expires_in),
      };
      setGoogleCalendarUser(googleCalendarUser);
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
      isWidget
      name="calendar"
      fadeBackground={appSettings.calendarHoverEffectEnabled}
    >
      {googleCalendarUser ? <CalendarsListView /> : <CalendarAuthView login={login} />}
    </Modal>
  );
};

export default Calendar;
