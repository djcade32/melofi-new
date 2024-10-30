import React, { useEffect, useState } from "react";
import styles from "./timeDisplay.module.css";
import Tooltip from "../shared/tooltip/Tooltip";

enum TimeFormat {
  TWELVE = "12",
  TWENTY_FOUR = "24",
}

const TimeDisplay = () => {
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(TimeFormat.TWELVE);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: timeFormat === TimeFormat.TWELVE,
      };
      setTime(date.toLocaleTimeString(undefined, options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timeFormat]);

  const toggleTimeFormat = () => {
    setTimeFormat((prev) =>
      prev === TimeFormat.TWELVE ? TimeFormat.TWENTY_FOUR : TimeFormat.TWELVE
    );
  };

  return (
    <div
      id="time-display"
      className={styles.timeDisplay__container}
      onClick={toggleTimeFormat}
      aria-label={`Switch to ${timeFormat === TimeFormat.TWELVE ? "24-hour" : "12-hour"} format`}
      role="button"
      tabIndex={0}
    >
      <Tooltip
        text={`Switch to ${timeFormat === TimeFormat.TWELVE ? "24-hour" : "12-hour"} format`}
      >
        <p>{time}</p>
      </Tooltip>
    </div>
  );
};

export default TimeDisplay;
