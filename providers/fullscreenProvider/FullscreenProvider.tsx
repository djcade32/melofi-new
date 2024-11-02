"use client";

import useAppStore from "@/stores/app-store";
import React, { useEffect } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import styles from "./fullscreenProvider.module.css";

interface FullscreenProviderProps {
  children: React.ReactNode;
}

const FullscreenProvider = ({ children }: FullscreenProviderProps) => {
  const handle = useFullScreenHandle();
  const { isFullscreen, toggleFullscreen } = useAppStore();

  useEffect(() => {
    if (isFullscreen) {
      handle.enter();
    } else {
      handle.exit();
    }
  }, [isFullscreen]);

  // Handles setting fullscreen button to inactive when esc key is pressed
  useEffect(() => {
    if (!handle.active && isFullscreen) {
      toggleFullscreen(false);
    }
  }, [handle]);

  return (
    <FullScreen className={styles.fullscreenProvider__container} handle={handle}>
      {children}
    </FullScreen>
  );
};

export default FullscreenProvider;
