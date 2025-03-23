import React from "react";
import styles from "./loadingSpinner.module.css";

interface LoadingSpinnerProps {
  showBackground?: boolean;
}

const LoadingSpinner = ({ showBackground = true }: LoadingSpinnerProps) => {
  return (
    <div style={{ position: "relative", width: 30, height: 30 }}>
      <div
        className={styles.loadingSpinner}
        style={{
          borderRightColor: "orange",
          zIndex: 3,
        }}
      />
      <div
        className={styles.loadingSpinner}
        style={{
          position: "absolute",
          border: showBackground ? "4px solid var(--color-white)" : "4px solid transparent",
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
