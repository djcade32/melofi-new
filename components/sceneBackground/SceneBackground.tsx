"use client";

import React from "react";
import styles from "./sceneBackground.module.css";
import useSceneBackgroundStore from "../../stores/scene-background-store";

const SceneBackground = () => {
  const sceneBackgroundStore = useSceneBackgroundStore();
  return (
    <video
      src={sceneBackgroundStore.currentScene}
      className={styles.melofi_background_video}
      autoPlay
      loop
      muted
      playsInline
      //   poster={imgPath}
    />
  );
};

export default SceneBackground;
