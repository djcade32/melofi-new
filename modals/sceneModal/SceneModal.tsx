"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/shared/modal/Modal";
import useSceneStore from "@/stores/scene-store";
import styles from "./sceneModal.module.css";
import Carousel from "@/components/shared/carousel/Carousel";
import SceneThumbnail from "./sceneThumbnail/SceneThumbnail";
import { Scene } from "@/types/interfaces";

const SceneModal = () => {
  const { sceneModalOpen, allScenes, currentScene, setCurrentScene } = useSceneStore();

  const [selectedScene, setSelectedScene] = useState<Scene>(currentScene);

  useEffect(() => {
    setCurrentScene(selectedScene);
  }, [selectedScene]);

  return (
    <Modal
      className={styles.sceneModal__container}
      isOpen={sceneModalOpen}
      id="scene-modal"
      showCloseIcon={false}
    >
      <Carousel
        orientation="vertical"
        itemsContainer={styles.sceneModal__carousel_itemsContainer}
        id="scene-modal-carousel"
      >
        {allScenes.map((scene) => (
          <SceneThumbnail key={scene.id} scene={scene} setSelectedScene={setSelectedScene} />
        ))}
      </Carousel>
    </Modal>
  );
};

export default SceneModal;
