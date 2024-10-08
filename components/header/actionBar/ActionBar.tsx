"use client";

import React, { useEffect } from "react";
import styles from "./actionBar.module.css";
import ActionBarButton from "./actionBarButton/ActionBarButton";
import { MdLandscape } from "@/imports/icons";
import useSceneStore from "@/stores/scene-store";

const iconProps = { size: 20, color: "white", style: { cursor: "pointer" } };

const ActionBar = () => {
  const { toggleSceneModal, sceneModalOpen } = useSceneStore();

  // Close scene modal when clicking outside of the modal
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const targetId = (event.target as HTMLElement).id;
      if (targetId === "background-video" || targetId === "header") {
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
        icon={<MdLandscape {...iconProps} />}
        label="Scenes"
        onClick={() => toggleSceneModal(!sceneModalOpen)}
        isActive={sceneModalOpen}
      />
    </div>
  );
};

export default ActionBar;
