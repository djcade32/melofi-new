import React from "react";
import styles from "./loadingScreen.module.css";
import RotatingLogo from "@/ui/components/rotatingLogo/RotatingLogo";

interface LoadingScreenProps {
  loading: boolean;
}

const LoadingScreen = ({ loading }: LoadingScreenProps) => {
  return (
    <div
      style={{ zIndex: loading ? 1000 : -1 }}
      className={`${styles.loadingScreen__container} ${
        !loading && styles.loadingScreen__container_fade_out
      }`}
    >
      <div className={styles.loadingScreen__content}>
        <p>Loading...</p>
        <RotatingLogo />
      </div>
    </div>
  );
};

export default LoadingScreen;
