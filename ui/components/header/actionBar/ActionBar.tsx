"use client";

import React, { useEffect } from "react";
import styles from "./actionBar.module.css";
import ActionBarButton from "./actionBarButton/ActionBarButton";
import {
  AiFillTool,
  MdLandscape,
  RiFullscreenExitLine,
  RiFullscreenFill,
  RiSoundModuleFill,
  MdOutlineMenu,
} from "@/imports/icons";
import useSceneStore from "@/stores/scene-store";
import TimeDisplay from "@/ui/components/timeDisplay/TimeDisplay";
import MusicControls from "@/ui/components/musicControls/MusicControls";
import useMixerStore from "@/stores/mixer-store";
import { MusicSource } from "@/enums/general";
import useAppStore from "@/stores/app-store";
import ToolsActionBarButton from "./toolsActionBarButton/ToolsActionBarButton";
import useToolsStore from "@/stores/tools-store";
import useMenuStore from "@/stores/menu-store";

const iconProps = { size: 20, color: "var(--color-white)", style: { cursor: "pointer" } };

const ActionBar = () => {
  const { toggleSceneModal, sceneModalOpen } = useSceneStore();
  const { toggleMixerModal, mixerModalOpen, musicSource } = useMixerStore();
  const { toggleFullscreen, isFullscreen, isElectron } = useAppStore();
  const { isMenuOpen, handleClick } = useMenuStore();
  const { isToolsOpen, toggleTools } = useToolsStore();

  // Close scene modal when clicking outside of the modal
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const targetId = (event.target as HTMLElement).id;
      if (targetId === "melofi-app" || targetId === "header" || targetId === "background-video") {
        toggleSceneModal(false);
        toggleTools(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className={styles.actionBar__container}>
      <ActionBarButton
        id="mixer-button"
        icon={<RiSoundModuleFill {...iconProps} />}
        label="Mixer"
        onClick={() => toggleMixerModal(!mixerModalOpen)}
        isActive={mixerModalOpen}
      />
      {musicSource === MusicSource.MELOFI && <MusicControls />}
      <ActionBarButton
        id="scenes-button"
        icon={<MdLandscape {...iconProps} />}
        label="Scenes"
        onClick={() => toggleSceneModal(!sceneModalOpen)}
        isActive={sceneModalOpen}
      />
      <ToolsActionBarButton
        id="tools-button"
        iconProps={iconProps}
        onClick={() => toggleTools(!isToolsOpen)}
        isActive={isToolsOpen}
      />
      {!isElectron() && (
        <ActionBarButton
          id="fullscreen-button"
          icon={
            isFullscreen ? (
              <RiFullscreenExitLine {...iconProps} />
            ) : (
              <RiFullscreenFill {...iconProps} />
            )
          }
          label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          onClick={() => toggleFullscreen(!isFullscreen)}
          isActive={isFullscreen}
        />
      )}
      <TimeDisplay />
      <ActionBarButton
        id="menu-button"
        icon={<MdOutlineMenu {...iconProps} />}
        label=""
        onClick={(e) => {
          e && handleClick(e);
        }}
        isActive={isMenuOpen}
        tooltipShown={false}
      />
    </div>
  );
};

export default ActionBar;
