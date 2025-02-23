import React from "react";
import styles from "./achievementsSectionCard.module.css";

interface AchievementsSectionCardProps {
  title: string;
  description: string;
}

const AchievementsSectionCard = ({ title, description }: AchievementsSectionCardProps) => {
  return (
    <div className={styles.achievementsSectionCard__container}>
      <p className={styles.achievementsSectionCard__title}>{title}</p>
      <p className={styles.achievementsSectionCard__description}>{description}</p>
    </div>
  );
};

export default AchievementsSectionCard;
