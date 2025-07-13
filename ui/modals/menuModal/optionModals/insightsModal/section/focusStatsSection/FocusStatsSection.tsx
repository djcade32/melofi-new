import React, { useEffect, useMemo, useState } from "react";
import styles from "./focusStatsSection.module.css";
import useInsightsStore from "@/stores/insights-store";
import { FocusDay } from "@/types/interfaces/pomodoro_timer";
import Button from "@/ui/components/shared/button/Button";
import { convertSecsToHrMinsSec } from "@/utils/time";
import StatDisplay from "../../components/statDisplay/StatDisplay";
import { firestoreTimestampToDate } from "@/utils/date";
import MostProductiveDayChart from "../../components/charts/mostProductiveDayChart/MostProductiveDayChart";
import useUserStore from "@/stores/user-store";
import PremiumBadge from "@/ui/components/premiumBadge/PremiumBadge";
import useAppStore from "@/stores/app-store";
import useMenuStore from "@/stores/menu-store";

const dummyFocusStats = {
  focusTime: "62h 45m",
  breakTime: "10h 30m",
  sessionsCompleted: 41,
  tasksCompleted: 25,
  bestFocusDay: "3h 10m - Fri, Sept 27 2024",
};

const FocusStatsSection = () => {
  const { getTodaysFocusStats, getAllFocusStats, getBestFocusDay } = useInsightsStore();
  // const { setShowPremiumModal } = useAppStore();
  const { isPremiumUser, isUserLoggedIn } = useUserStore();
  const { selectedOption, setSelectedOption } = useMenuStore();
  const [focusTimePeriod, setFocusTimePeriod] = useState("Today");
  const [focusStats, setFocusStats] = useState<Partial<FocusDay> | null>(null);
  const [bestFocusDay, setBestFocusDay] = useState<string>("");
  const isOpenState = selectedOption === "Insights";

  useMemo(() => {
    if (!isUserLoggedIn) return;
    if (!isOpenState) return;
    const fetchFocusStats = () => {
      const stats = getTodaysFocusStats();
      setFocusStats(stats);
    };
    fetchFocusStats();
  }, [isOpenState, isUserLoggedIn]);

  useEffect(() => {
    setBestFocusDay(getBestFocusDayString() || "No best focus day");
  }, [focusStats]);

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

  const getBestFocusDayString = () => {
    if (!isUserLoggedIn) return dummyFocusStats.bestFocusDay;
    const day = getBestFocusDay();
    if (!day) return "No best focus day";
    const { date, focusTime } = day;
    const convertedToDate = firestoreTimestampToDate(date);
    // convert date to ie. Thu, 1 Jan 2021
    const dateToString = convertedToDate.toDateString();
    return `${getFocusStatTimeString(focusTime)} - ${dateToString}`;
  };
  return (
    <div className={styles.focusStatsSection__container}>
      {!isUserLoggedIn && (
        <div className={styles.focusStatsSection__premium_container}>
          <PremiumBadge
            id="premium-badge-focus-stats"
            onClick={() => setSelectedOption("Account")}
            // onClick={() => setShowPremiumModal("focus_stats")}
          />
          <p className={styles.focusStatsSection__premium_text}>
            Total focus time, best days, and more—upgrade to see it all. 🔥
          </p>
          <Button
            id="go-premium-button"
            text="Go Premium"
            containerClassName={styles.focusStatsSection__premium_button}
            hoverClassName={styles.focusStatsSection__premium_button_hover}
            textClassName={styles.focusStatsSection__premium_button_text}
            onClick={() => setSelectedOption("Account")}
            // onClick={() => setShowPremiumModal("focus_stats")}
          />
        </div>
      )}
      <div>
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
          <StatDisplay
            label="Focus"
            stat={
              isUserLoggedIn
                ? getFocusStatTimeString(focusStats?.focusTime)
                : dummyFocusStats.focusTime
            }
          />
          <StatDisplay
            label="Break"
            stat={
              isUserLoggedIn
                ? getFocusStatTimeString(focusStats?.breakTime)
                : dummyFocusStats.breakTime
            }
          />
          <StatDisplay
            label="Sessions"
            stat={
              isUserLoggedIn
                ? focusStats?.sessionsCompleted || 0
                : dummyFocusStats.sessionsCompleted
            }
          />
          <StatDisplay
            label="Tasks"
            stat={
              isUserLoggedIn
                ? focusStats?.tasksCompleted?.length || 0
                : dummyFocusStats.tasksCompleted
            }
          />
        </div>
        <div className={styles.focusStatsSection_stats_container}>
          <StatDisplay label="🔥 Best Focus Day" stat={bestFocusDay} />
        </div>
        <div>
          <MostProductiveDayChart />
        </div>
      </div>
    </div>
  );
};

export default FocusStatsSection;
