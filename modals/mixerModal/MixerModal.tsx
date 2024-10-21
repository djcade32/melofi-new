"use client";

import React from "react";
import Modal from "@/components/shared/modal/Modal";
import styles from "./mixerModal.module.css";
import useMixerStore from "@/stores/mixer-store";
import PlaylistSection from "./sections/playlistSection/PlaylistSection";
import MusicSourceSection from "./sections/musicSourceSection/MusicSourceSection";
import MusicVolumeSection from "./sections/musicVolumeSection/MusicVolumeSection";
import SpotifyWidgetSection from "./sections/spotifyWidgetSection/SpotifyWidgetSection";
import { MusicSource } from "@/enums/general";
import SceneSoundsSection from "./sections/sceneSoundsSection/SceneSoundsSection";

const MixerModal = () => {
  const { mixerModalOpen, toggleMixerModal, musicSource } = useMixerStore();

  return (
    <Modal
      id="mixer-modal"
      isOpen={mixerModalOpen}
      close={() => toggleMixerModal(!mixerModalOpen)}
      className={styles.mixerModal__container}
      draggable
      title="SOUNDS"
      titleClassName={styles.mixerModal__title}
    >
      <div className={styles.mixerModal__content_container}>
        <PlaylistSection />
        <MusicSourceSection />
        {musicSource === MusicSource.MELOFI ? <MusicVolumeSection /> : <SpotifyWidgetSection />}
        <SceneSoundsSection />
      </div>
    </Modal>
  );
};

export default MixerModal;
