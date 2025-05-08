import React from "react";
import styles from "./achievementsSectionCard.module.css";
import { BsCheckCircleFill, BsCircle } from "@/imports/icons";

interface AchievementsSectionCardProps {
  title: string;
  description: string;
  completed?: boolean;
}

const AchievementsSectionCard = ({
  title,
  description,
  completed,
}: AchievementsSectionCardProps) => {
  return (
    <div
      className={`${styles.achievementsSectionCard__container} ${
        completed ? styles.completed : ""
      }`}
    >
      <div className={styles.achievementsSectionCard__icon}>
        {completed ? (
          <BsCheckCircleFill size={20} color="var(--color-effect-opacity)" />
        ) : (
          <BsCircle size={20} color="var(--color-secondary)" />
        )}
      </div>
      <div className={styles.achievementsSectionCard__text_container}>
        <p className={styles.achievementsSectionCard__title}>{title}</p>
        <p className={styles.achievementsSectionCard__description}>{description}</p>
      </div>
    </div>
  );
};

export default AchievementsSectionCard;
