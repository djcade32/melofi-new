import React from "react";
import styles from "./musicSourceSection.module.css";
import MusicSourceButton from "./musicSourceButton/MusicSourceButton";
import melofiLogo from "@/public/assets/logos/logo-white.png";
import { BsSpotify } from "@/imports/icons";
import useMixerStore from "@/stores/mixer-store";
import { MusicSource } from "@/enums/general";
import useMusicPlayerStore from "@/stores/music-player-store";

const MusicSourceSection = () => {
  const { musicSource, setMusicSource } = useMixerStore();
  const { setIsPlaying } = useMusicPlayerStore();
  return (
    <div className={styles.musicSourceSection__container}>
      <MusicSourceButton
        id={`music-source-button-${MusicSource.MELOFI}`}
        label="Melofi"
        imgSrc={melofiLogo}
        isActive={musicSource === MusicSource.MELOFI}
        onClick={() => setMusicSource(MusicSource.MELOFI)}
      />
      <MusicSourceButton
        id={`music-source-button-${MusicSource.SPOTIFY}`}
        label="Spotify"
        icon={BsSpotify}
        isActive={musicSource === MusicSource.SPOTIFY}
        onClick={() => {
          setIsPlaying(false);
          setMusicSource(MusicSource.SPOTIFY);
        }}
        showInfo={true}
      />
    </div>
  );
};

export default MusicSourceSection;
