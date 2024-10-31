import React from "react";
import VolumeSlider from "@/ui/components/shared/volumeSlider/VolumeSlider";
import styles from "./musicVolumeSection.module.css";
import { IoVolumeMedium, IoVolumeOff } from "@/imports/icons";
import useMusicPlayerStore from "@/stores/music-player-store";

const MusicVolumeSection = () => {
  const { musicVolume, setMusicVolume } = useMusicPlayerStore();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMusicVolume(Number(e.target.value)); // Ensure value is a number
  };
  return (
    <div className={styles.musicVolumeSection__container}>
      <p className={styles.musicVolumeSection__title}>MUSIC VOLUME</p>
      <div className={styles.musicVolumeSection__volume_container}>
        <IoVolumeOff size={40} color="var(--color-secondary)" />
        <VolumeSlider
          id="mixer-modal-volume-slider"
          onChange={handleVolumeChange}
          value={musicVolume}
        />
        <IoVolumeMedium size={40} color="var(--color-secondary)" />
      </div>
    </div>
  );
};

export default MusicVolumeSection;
