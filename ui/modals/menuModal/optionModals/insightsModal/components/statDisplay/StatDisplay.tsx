import React from "react";
import styles from "./statDisplay.module.css";

interface StatDisplayProps {
  label: string;
  stat: string | number;
}

const StatDisplay = ({ label, stat }: StatDisplayProps) => {
  return (
    <div className={styles.statDisplay__container}>
      <p className={styles.statDisplay__label}>{label}</p>
      <p className={styles.statDisplay__stat}>{stat}</p>
    </div>
  );
};

export default StatDisplay;
