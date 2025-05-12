import React, { useEffect, useState } from "react";
import styles from "./usageTrendsSection.module.css";
import StatDisplay from "../../components/statDisplay/StatDisplay";
import useInsightsStore from "@/stores/insights-store";
import useUserStore from "@/stores/user-store";
import { wait } from "@/utils/general";

const UsageTrendsSection = () => {
  const { getStickyNoteStats, getAlarmsExpiredCount, getFavoriteScene } = useInsightsStore();
  const { currentUser } = useUserStore();
  const [notesStats, setNotesStats] = useState(0);
  const [alarmsExpiredCount, setAlarmsExpiredCount] = useState(0);
  const [favoriteScene, setFavoriteScene] = useState("");

  useEffect(() => {
    const notes = getStickyNoteStats();
    const alarms = getAlarmsExpiredCount();
    const scene = getFavoriteScene();

    setNotesStats(notes);
    setAlarmsExpiredCount(alarms);
    setFavoriteScene(scene || "none");
  }, [currentUser]);
  return (
    <div className={styles.usageTrendsSection__container}>
      <div className={styles.usageTrendsSection__stats}>
        <StatDisplay label="📝 Notes" stat={notesStats} />
        <StatDisplay label="⏰ Alarms Expired" stat={alarmsExpiredCount} />
        <StatDisplay label="🎬 Favorite Scene" stat={favoriteScene} />
      </div>
    </div>
  );
};

export default UsageTrendsSection;
