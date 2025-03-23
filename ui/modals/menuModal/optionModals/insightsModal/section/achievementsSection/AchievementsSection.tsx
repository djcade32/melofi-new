import React from "react";
import styles from "./achievementsSection.module.css";
import AchievementsSectionCard from "./components/achievementsSectionCard/AchievementsSectionCard";

const AchievementsSection = () => {
  return (
    <div className={styles.achievementsSection__container}>
      <p
        style={{
          color: "var(--color-secondary)",
          width: "100%",
        }}
      >
        Coming Soon...
      </p>
    </div>
  );
};

export default AchievementsSection;
