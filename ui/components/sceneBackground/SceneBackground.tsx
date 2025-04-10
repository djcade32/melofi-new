"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./sceneBackground.module.css";
import useSceneStore from "../../../stores/scene-store";
import { Scene } from "@/types/general";
import { scenes } from "@/data/scenes";

const SceneBackground = () => {
  const { currentScene, getCurrentScene } = useSceneStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [cachedVideos, setCachedVideos] = useState<Record<string, string>>({});

  useMemo(() => {
    if (currentScene && currentScene.video !== videoSrc) {
      // Trigger fade-in
      setIsFadingIn(true);
      setTimeout(() => {
        setIsFadingIn(false);
        if (videoRef.current) {
          videoRef.current.src = cachedVideos[currentScene.video] || currentScene.video; // Use cached video if available
          videoRef.current.load(); // Ensures it plays from preloaded memory
        }
      }, 600); // This timeout should match the CSS transition duration
    }
  }, [currentScene?.video, videoSrc]);

  useEffect(() => {
    const preload = async () => {
      let videos: Record<string, string> = {};
      try {
        videos = await cacheVideos(scenes);
      } catch (error) {
        console.error("Error preloading videos:", error);
      }
      setCachedVideos(videos);
    };
    getCurrentScene();
    process.env.NODE_ENV === "production" && preload();
  }, []);

  const cacheVideos = async (videoPaths: Scene[]) => {
    const cachedVideos: Record<string, string> = {};
    for (const scene of videoPaths) {
      const response = await fetch(scene.video);
      const blob = await response.blob();
      cachedVideos[scene.video] = URL.createObjectURL(blob);
    }
    return cachedVideos;
  };

  return (
    <div>
      <video
        id="background-video"
        src={
          process.env.NODE_ENV === "production"
            ? currentScene.video
            : cachedVideos[currentScene?.video]
        }
        className={styles.melofi_background_video}
        autoPlay
        loop
        muted
        playsInline
      />
      <video
        ref={videoRef}
        id="background-video"
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
