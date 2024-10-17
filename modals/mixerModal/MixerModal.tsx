"use client";

import React from "react";
import Modal from "@/components/shared/modal/Modal";
import styles from "./mixerModal.module.css";
import useMixerStore from "@/stores/mixer-store";
import PlaylistButton from "./playlistButton/PlaylistButton";
import { Study, Relax, Sleepy } from "@/data/songs";
import useMusicPlayerStore from "@/stores/music-player-store";
import { Playlist } from "@/types/interfaces";

const playlist = [Study, Relax, Sleepy];

const MixerModal = () => {
  const { setCurrentPlaylist, currentPlaylist, shufflePlaylist } = useMusicPlayerStore();
  const { mixerModalOpen, toggleMixerModal } = useMixerStore();

  const handlePlayListButtonPress = (playlist: Playlist) => {
    if (currentPlaylist.id === playlist.id) return;
    setCurrentPlaylist(playlist);
    shufflePlaylist();
  };

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
        <div className={styles.mixerModal__content_playlist_container}>
          {playlist.map((playlist) => (
            <PlaylistButton
              id={`playlist-button-${playlist.name}`}
              key={playlist.id}
              icon={playlist.icon}
              label={playlist.name}
              onClick={() => handlePlayListButtonPress(playlist)}
              isActive={currentPlaylist.id === playlist.id}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default MixerModal;
