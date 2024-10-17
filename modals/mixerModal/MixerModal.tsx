"use client";

import React from "react";
import Modal from "@/components/shared/modal/Modal";
import styles from "./mixerModal.module.css";
import useMixerStore from "@/stores/mixer-store";
import PlaylistSection from "./sections/PlaylistSection";

const MixerModal = () => {
  const { mixerModalOpen, toggleMixerModal } = useMixerStore();

  return (
    <Modal
      isOpen={mixerModalOpen}
      close={() => toggleMixerModal(!mixerModalOpen)}
      className={styles.mixerModal__container}
      draggable
      title="SOUNDS"
      titleClassName={styles.mixerModal__title}
    >
      <div className={styles.mixerModal__content_container}>
        <PlaylistSection />
      </div>
    </Modal>
  );
};

export default MixerModal;
