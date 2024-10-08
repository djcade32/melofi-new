"use client";

import React from "react";
import styles from "./sceneBackground.module.css";
import useSceneStore from "../../stores/scene-store";

//TODO: When scene is changed, fade out the video and fade in the new video

const SceneBackground = () => {
  const { currentScene } = useSceneStore();
  return (
    <video
      id="background-video"
      src={currentScene.video}
      className={styles.melofi_background_video}
      autoPlay
      loop
      muted
      playsInline
    />
  );
};

export default SceneBackground;
