"use client";

import React, { useEffect } from "react";
import styles from "./actionBar.module.css";
import ActionBarButton from "./actionBarButton/ActionBarButton";
import { MdLandscape, RiSoundModuleFill } from "@/imports/icons";
import useSceneStore from "@/stores/scene-store";
import TimeDisplay from "@/components/timeDisplay/TimeDisplay";
import MusicControls from "@/components/musicControls/MusicControls";
import useMixerStore from "@/stores/mixer-store";
import { MusicSource } from "@/enums/general";

const iconProps = { size: 20, color: "var(--color-secondary-white)", style: { cursor: "pointer" } };

const ActionBar = () => {
  const { toggleSceneModal, sceneModalOpen } = useSceneStore();
  const { toggleMixerModal, mixerModalOpen, musicSource } = useMixerStore();

  // Close scene modal when clicking outside of the modal
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const targetId = (event.target as HTMLElement).id;
      if (targetId === "melofi-app" || targetId === "header") {
        toggleSceneModal(false);
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
        icon={<RiSoundModuleFill {...iconProps} />}
        label="Mixer"
        onClick={() => toggleMixerModal(!mixerModalOpen)}
        isActive={mixerModalOpen}
      />
      {musicSource === MusicSource.MELOFI && <MusicControls />}
      <ActionBarButton
        icon={<MdLandscape {...iconProps} />}
        label="Scenes"
        onClick={() => toggleSceneModal(!sceneModalOpen)}
        isActive={sceneModalOpen}
      />
      <TimeDisplay />
    </div>
  );
};

export default ActionBar;
