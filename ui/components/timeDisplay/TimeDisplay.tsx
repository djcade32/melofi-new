import React, { useEffect, useState } from "react";
import styles from "./timeDisplay.module.css";
import Tooltip from "../shared/tooltip/Tooltip";
import useAppStore from "@/stores/app-store";

enum TimeFormat {
  TWELVE = "12",
  TWENTY_FOUR = "24",
}

const TimeDisplay = () => {
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(TimeFormat.TWELVE);
  const [displayInMiddle, setDisplayInMiddle] = useState<boolean>(false);
  const [time, setTime] = useState<string>("");
  const { appSettings } = useAppStore();

  useEffect(() => {
    // get localStorage
    let clockFormat = localStorage.getItem("clockFormat");
    if (clockFormat) {
      setTimeFormat(clockFormat as TimeFormat);
    } else {
      clockFormat = TimeFormat.TWELVE;
    }

    const updateTime = () => {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: clockFormat === TimeFormat.TWELVE,
      };
      setTime(date.toLocaleTimeString(undefined, options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timeFormat]);

  useEffect(() => {
    if (appSettings) {
      setDisplayInMiddle(appSettings.showMiddleClock);
    }
  }, [appSettings]);

  const toggleTimeFormat = () => {
    setTimeFormat((prev) =>
      prev === TimeFormat.TWELVE ? TimeFormat.TWENTY_FOUR : TimeFormat.TWELVE
    );
    // set localStorage
    localStorage.setItem(
      "clockFormat",
      timeFormat === TimeFormat.TWELVE ? TimeFormat.TWENTY_FOUR : TimeFormat.TWELVE
    );
  };

  return (
    <>
      {displayInMiddle ? (
        <div
          style={{
            display: "flex",
            width: "fit-content",
            alignSelf: "center",
            justifySelf: "center",
            position: "absolute",
            top: "50%",
            left: " 50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <p
            style={{
              fontSize: "12rem",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {time.split(/([AP]M)/)[0]}
          </p>
        </div>
      ) : (
        <div
          id="time-display"
          className={styles.timeDisplay__container}
          onClick={toggleTimeFormat}
          aria-label={`Switch to ${
            timeFormat === TimeFormat.TWELVE ? "24-hour" : "12-hour"
          } format`}
          role="button"
          tabIndex={0}
        >
          <Tooltip
            text={`Switch to ${timeFormat === TimeFormat.TWELVE ? "24-hour" : "12-hour"} format`}
          >
            <p>{time}</p>
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default TimeDisplay;
