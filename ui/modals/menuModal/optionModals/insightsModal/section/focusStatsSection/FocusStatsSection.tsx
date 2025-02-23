import React, { useEffect, useState } from "react";
import styles from "./focusStatsSection.module.css";
import useInsightsStore from "@/stores/insights-store";
import { FocusDay } from "@/types/interfaces/pomodoro_timer";
import Button from "@/ui/components/shared/button/Button";
import { convertSecsToHrMinsSec } from "@/utils/time";
import StatDisplay from "../../components/statDisplay/StatDisplay";
import { firestoreTimestampToDate } from "@/utils/date";
import MostProductiveDayChart from "../../components/charts/mostProductiveDayChart/MostProductiveDayChart";

const FocusStatsSection = () => {
  const { getTodaysFocusStats, getAllFocusStats, getBestFocusDay } = useInsightsStore();
  const [focusTimePeriod, setFocusTimePeriod] = useState("Today");
  const [focusStats, setFocusStats] = useState<Partial<FocusDay> | null>(null);

  useEffect(() => {
    const fetchFocusStats = () => {
      const stats = getTodaysFocusStats();
      setFocusStats(stats);
    };
    fetchFocusStats();
  }, []);

  const handleFocusTimePeriodChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const buttonId = event.currentTarget.id;
    if (buttonId === "focus-stats-button-today") {
      setFocusTimePeriod("Today");
      const stats = getTodaysFocusStats();
      setFocusStats(stats);
    } else if (buttonId === "focus-stats-button-all") {
      setFocusTimePeriod("All");
      const stats = getAllFocusStats();
      setFocusStats(stats);
    }
  };

  const getFocusStatTimeString = (focusTime: number | undefined) => {
    if (!focusTime) return "0h 0m";
    const { hr, min } = convertSecsToHrMinsSec(focusTime);
    return `${hr}h ${min}m`;
  };

  const getBestFocusDayString = (day: FocusDay | null) => {
    if (!day) return "No best focus day";
    const { date, focusTime } = day;
    const convertedToDate = firestoreTimestampToDate(date);
    // convert date to ie. Thu, 1 Jan 2021
    const dateToString = convertedToDate.toDateString();
    return `${getFocusStatTimeString(focusTime)} - ${dateToString}`;
  };
  return (
    <>
      <div className={styles.focusStatsSection_button_container}>
        <Button
          id="focus-stats-button-today"
          className={`${styles.focusStatsSection_button} ${
            focusTimePeriod === "Today" && styles.active
          }`}
          text="Today"
          onClick={(e) => e && handleFocusTimePeriodChange(e)}
          hoverClassName={styles.focusStatsSection_button_hover}
          textClassName={styles.focusStatsSection_button_text}
        />
        <Button
          id="focus-stats-button-all"
          className={`${styles.focusStatsSection_button} ${
            focusTimePeriod === "All" && styles.active
          }`}
          text="All"
          onClick={(e) => e && handleFocusTimePeriodChange(e)}
          hoverClassName={styles.focusStatsSection_button_hover}
          textClassName={styles.focusStatsSection_button_text}
        />
      </div>
      <div className={styles.focusStatsSection_stats_container}>
        <StatDisplay label="Focus" stat={getFocusStatTimeString(focusStats?.focusTime)} />
        <StatDisplay label="Break" stat={getFocusStatTimeString(focusStats?.breakTime)} />
        <StatDisplay label="Sessions" stat={focusStats?.sessionsCompleted || 0} />
        <StatDisplay label="Tasks" stat={focusStats?.tasksCompleted || 0} />
      </div>
      <div className={styles.focusStatsSection_stats_container}>
        <StatDisplay label="🔥 Best Focus Day" stat={getBestFocusDayString(getBestFocusDay())} />
      </div>
      <div>
        <MostProductiveDayChart />
      </div>
    </>
  );
};

export default FocusStatsSection;
