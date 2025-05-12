import React from "react";
import styles from "./usageTrendsSection.module.css";
import StatDisplay from "../../components/statDisplay/StatDisplay";
import useInsightsStore from "@/stores/insights-store";
import useUserStore from "@/stores/user-store";

const UsageTrendsSection = () => {
  const { getStickyNoteStats, getAlarmsExpiredCount, getFavoriteScene } = useInsightsStore();
  const { currentUser } = useUserStore();
  const showAlarmsExpiredCount = () => {
    if (currentUser) {
      if (currentUser.authUser?.uid) {
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <div className={styles.usageTrendsSection__container}>
      <div className={styles.usageTrendsSection__stats}>
        <StatDisplay label="📝 Notes" stat={getStickyNoteStats()} />
        {showAlarmsExpiredCount() && (
          <StatDisplay label="⏰ Alarms Expired" stat={getAlarmsExpiredCount()} />
        )}
        <StatDisplay label="🎬 Favorite Scene" stat={getFavoriteScene() || "none"} />
      </div>
    </div>
  );
};

export default UsageTrendsSection;
