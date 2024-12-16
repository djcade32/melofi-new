"use client";

import useAppStore from "@/stores/app-store";
import React, { useEffect, useRef } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import screenfull from "screenfull";
import styles from "./fullscreenProvider.module.css";

interface FullscreenProviderProps {
  children: React.ReactNode;
}

const FullscreenProvider = ({ children }: FullscreenProviderProps) => {
  const handle = useFullScreenHandle();
  const { isFullscreen, toggleFullscreen } = useAppStore();

  // const handleToggleFullscreen = () => {
  //   if (screenfull.isEnabled) {
  //     screenfull.toggle();
  //   }
  // };

  // useEffect(() => {
  //   if (isFullscreen) {
  //     handleToggleFullscreen();
  //   }
  // }, [isFullscreen]);

  // useEffect(() => {
  //   if (isFullscreen) {
  //     handle.enter();
  //   } else {
  //     handle.exit();
  //   }
  // }, [isFullscreen]);

  // // Handles setting fullscreen button to inactive when esc key is pressed
  // useEffect(() => {
  //   if (!handle.active && isFullscreen) {
  //     toggleFullscreen(false);
  //   }
  // }, [handle]);

  return (
    <div>
      {/* <FullScreen className={styles.fullscreenProvider__container} handle={handle}> */}
      {children}
      {/* </FullScreen> */}
    </div>
  );
};

export default FullscreenProvider;
