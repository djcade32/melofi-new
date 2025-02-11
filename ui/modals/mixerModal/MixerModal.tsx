"use client";

import React from "react";
import Modal from "@/ui/components/shared/modal/Modal";
import styles from "./mixerModal.module.css";
import useMixerStore from "@/stores/mixer-store";
import PlaylistSection from "./sections/playlistSection/PlaylistSection";
import MusicSourceSection from "./sections/musicSourceSection/MusicSourceSection";
import MusicVolumeSection from "./sections/musicVolumeSection/MusicVolumeSection";
import SpotifyWidgetSection from "./sections/spotifyWidgetSection/SpotifyWidgetSection";
import { MusicSource } from "@/enums/general";
import SceneSoundsSection from "./sections/sceneSoundsSection/SceneSoundsSection";
import AllSoundsSection from "./sections/allSoundsSection/AllSoundsSection";

const MixerModal = () => {
  const { mixerModalOpen, toggleMixerModal, musicSource, resetSoundVolumes } = useMixerStore();

  return (
    <Modal
      id="mixer-modal"
      isOpen={mixerModalOpen}
      close={() => toggleMixerModal(!mixerModalOpen)}
      className={styles.mixerModal__container}
      draggable
      title="Sounds"
      titleClassName={styles.mixerModal__title}
      isWidget
      name="mixer"
    >
      <div className={styles.mixerModal__content_container}>
        <PlaylistSection />
        <MusicSourceSection />
        {musicSource === MusicSource.MELOFI ? <MusicVolumeSection /> : <SpotifyWidgetSection />}
        <SceneSoundsSection />
        <AllSoundsSection />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p
            id="mixer-reset-button"
            className={styles.mixerModal__reset_button}
            onClick={() => resetSoundVolumes()}
          >
            Reset
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default MixerModal;
