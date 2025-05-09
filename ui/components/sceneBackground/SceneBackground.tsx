"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./sceneBackground.module.css";
import useSceneStore from "../../../stores/scene-store";
import useAppStore from "@/stores/app-store";
import useUserStore from "@/stores/user-store";

const SceneBackground = () => {
  const { currentScene, getCurrentScene } = useSceneStore();
  const { appSettings } = useAppStore();
  const { isPremiumUser } = useUserStore();
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isFadingIn, setIsFadingIn] = useState(false);

  useMemo(() => {
    if (currentScene && currentScene.video !== videoSrc) {
      // Trigger fade-in
      setIsFadingIn(true);
      setTimeout(() => {
        setVideoSrc(currentScene.video);
        setIsFadingIn(false);
      }, 600); // This timeout should match the CSS transition duration
    }
  }, [currentScene?.video, videoSrc]);

  useEffect(() => {
    getCurrentScene();
  }, [appSettings.sceneRouletteEnabled, isPremiumUser]);

  return (
    <div>
      <video
        id="background-video"
        src={currentScene?.video}
        className={styles.melofi_background_video}
        autoPlay
        loop
        muted
        playsInline
      />
      <video
        id="background-video"
        src={videoSrc}
        className={`${styles.melofi_background_video} ${isFadingIn ? styles.fade_in : ""}`}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default SceneBackground;
