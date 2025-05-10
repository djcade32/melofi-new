import React from "react";
import styles from "./changeLogCard.module.css";

interface ChangeLogCardProps {
  version: string;
  date: string;
  newFeatures?: string[];
  improvements?: string[];
  bugFixes?: string[];
}

const changeLogCard = ({
  version,
  date,
  newFeatures,
  improvements,
  bugFixes,
}: ChangeLogCardProps) => {
  return (
    <div className={styles.changeLogCard__card}>
      <div className={styles.changeLogCard__card_circle} />
      <div className={styles.changeLogCard__version}>
        <h1>v {version}</h1>
        <p>{date}</p>
      </div>

      <div className={styles.changeLogCard__card_content}>
        {newFeatures && (
          <>
            <h3>New Features</h3>
            <ul className={styles.changeLogCard__list}>
              {newFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </>
        )}
        {improvements && (
          <>
            <h3>Improvements</h3>
            <ul className={styles.changeLogCard__list}>
              {improvements.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </>
        )}
        {bugFixes && (
          <>
            <h3>Bug Fixes</h3>
            <ul className={styles.changeLogCard__list}>
              {bugFixes.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default changeLogCard;
