import React from "react";
import styles from "./usageTrendsSection.module.css";
import StatDisplay from "../../components/statDisplay/StatDisplay";
import useInsightsStore from "@/stores/insights-store";

const UsageTrendsSection = () => {
  const { getStickyNoteStats, getAlarmsExpiredCount, getFavoriteScene } = useInsightsStore();
  return (
    <div className={styles.usageTrendsSection__container}>
      <div className={styles.usageTrendsSection__stats}>
        <StatDisplay label="📝 Sticky Notes" stat={getStickyNoteStats()} />
        <StatDisplay label="⏰ Alarms Expired" stat={getAlarmsExpiredCount()} />
        <StatDisplay label="🎬 Favorite Scene" stat={getFavoriteScene() || "none"} />
      </div>
    </div>
  );
};

export default UsageTrendsSection;
