import React from "react";
import styles from "./playlistSection.module.css";
import PlaylistButton from "./playlistButton/PlaylistButton";
import { Study, Relax, Sleepy } from "@/data/songs";
import { Playlist } from "@/types/interfaces";
import useMusicPlayerStore from "@/stores/music-player-store";

const playlist = [Study, Relax, Sleepy];

const PlaylistSection = () => {
  const { setCurrentPlaylist, currentPlaylist, shufflePlaylist } = useMusicPlayerStore();

  const handlePlayListButtonPress = (playlist: Playlist) => {
    if (currentPlaylist.id === playlist.id) return;
    setCurrentPlaylist(playlist);
    shufflePlaylist();
  };
  return (
    <div className={styles.playListSection__container}>
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
  );
};

export default PlaylistSection;
