"use client";

import React from "react";
import styles from "./nowPlaying.module.css";
import useMusicPlayerStore from "@/stores/music-player-store";

const NowPlaying = () => {
  const { currentSong } = useMusicPlayerStore();
  return (
    <div id="now-playing" className={styles.nowPlaying__container}>
      <p className={styles.nowPlaying__header_title}>Now Playing</p>
      <p
        id="now-playing-song-title"
        className={styles.nowPlaying__song_title}
      >{`${currentSong.title} by ${currentSong.artist}`}</p>
      <div>
        <p className={styles.nowPlaying__song_provider}>
          <a href={currentSong.providerUrl} target="_blank">
            Provided by <span style={{ fontWeight: 700 }}>{currentSong.provider}</span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default NowPlaying;
