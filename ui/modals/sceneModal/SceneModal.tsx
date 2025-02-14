"use client";

import React from "react";
import Modal from "@/ui/components/shared/modal/Modal";
import useSceneStore from "@/stores/scene-store";
import styles from "./sceneModal.module.css";
import Carousel from "@/ui/components/shared/carousel/Carousel";
import SceneThumbnail from "./sceneThumbnail/SceneThumbnail";
import useWidgetsStore from "@/stores/widgets-store";

const SceneModal = () => {
  const { sceneModalOpen, allScenes, setCurrentScene } = useSceneStore();
  const { zIndexForFocus } = useWidgetsStore();

  return (
    <Modal
      className={styles.sceneModal__container}
      isOpen={sceneModalOpen}
      id="scene-modal"
      showCloseIcon={false}
      zIndex={zIndexForFocus()}
    >
      <Carousel
        orientation="vertical"
        itemsContainer={styles.sceneModal__carousel_itemsContainer}
        id="scene-modal-carousel"
      >
        {allScenes.map((scene) => (
          <SceneThumbnail key={scene.id} scene={scene} setSelectedScene={setCurrentScene} />
        ))}
      </Carousel>
    </Modal>
  );
};

export default SceneModal;
