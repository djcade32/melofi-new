import React, { useEffect, useRef, useState } from "react";
import styles from "./musicControls.module.css";
import {
  BsFillSkipBackwardFill,
  BsSkipForwardFill,
  FaPause,
  FaPlay,
  IoVolumeMedium,
  IoVolumeMute,
} from "@/imports/icons";
import HoverIcon from "../shared/hoverIcon/HoverIcon";
import VolumeSlider from "../shared/volumeSlider/VolumeSlider";
import useMusicPlayerStore from "@/stores/music-player-store";

const iconProps = {
  size: 20,
  style: { cursor: "pointer" },
};

const MusicControls = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volumePressed, setVolumePressed] = useState(false);

  const {
    shufflePlaylist,
    goToPreviousSong,
    currentSong,
    goToNextSong,
    musicVolume,
    setMusicVolume,
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
  } = useMusicPlayerStore();

  // Shuffle playlist on component mount
  useEffect(() => {
    shufflePlaylist();
  }, []);

  // Handle spacebar press to play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        const isTodoListOpen =
          document.getElementById("to-do-list-widget")?.style.display !== "none";
        if (isTodoListOpen) return; // Prevent spacebar from toggling play/pause when typing in input
        e.preventDefault(); // Prevent default spacebar behavior (scrolling)
        handleTogglePlay();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying]);

  // Play/pause audio when isPlaying changes
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current?.play();
    } else if (!isPlaying && audioRef.current) {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSong]);

  // Set volume when musicVolume changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = musicVolume / 100;
  }, [musicVolume]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying); // Toggle playing state.
  };

  const handleMuteAllClick = () => {
    setIsMuted(!isMuted);
    const audioElement = document.querySelector("#main-audio") as HTMLAudioElement;
    if (!audioElement) return;
    audioElement.muted = !isMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMusicVolume(Number(e.target.value)); // Ensure value is a number
  };

  const handleSkipBackward = () => {
    goToPreviousSong();
  };

  const handleSkipForward = () => {
    goToNextSong();
  };

  const toggleVolumeDisplay = () => {
    setVolumePressed((prev) => !prev);
  };

  return (
    <div
      id="music-controls"
      className={styles.musicControls__container}
      style={
        volumePressed
          ? {
              animation: "unround-corners 300ms forwards",
              boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.25)",
            }
          : { borderRadius: "10px" }
      }
    >
      {currentSong && (
        <audio
          id="main-audio"
          ref={audioRef}
          src={currentSong.mp3Path}
          onEnded={handleSkipForward}
          typeof="audio/mpeg"
        />
      )}
      <div className={styles.musicControls__container_buttons}>
        <HoverIcon
          id="music-controls-previous"
          showTooltip
          tooltipText="Previous"
          icon={BsFillSkipBackwardFill}
          size={iconProps.size}
          iconStyle={iconProps.style}
          onClick={handleSkipBackward}
          hoverColor="var(--color-effect-opacity)"
        />

        {isPlaying ? (
          <HoverIcon
            id="music-controls-pause"
            showTooltip
            tooltipText="Pause"
            icon={FaPause}
            size={iconProps.size}
            iconStyle={iconProps.style}
            onClick={handleTogglePlay}
            hoverColor="var(--color-effect-opacity)"
          />
        ) : (
          <HoverIcon
            id="music-controls-play"
            showTooltip
            tooltipText="Play"
            icon={FaPlay}
            size={iconProps.size}
            iconStyle={iconProps.style}
            onClick={handleTogglePlay}
            hoverColor="var(--color-effect-opacity)"
          />
        )}

        <HoverIcon
          id="music-controls-next"
          showTooltip
          tooltipText="Next"
          icon={BsSkipForwardFill}
          size={iconProps.size}
          iconStyle={iconProps.style}
          onClick={handleSkipForward}
          hoverColor="var(--color-effect-opacity)"
        />

        <HoverIcon
          id="music-controls-volume"
          showTooltip
          tooltipText={volumePressed ? "Hide volume" : "Show volume"}
          icon={IoVolumeMedium}
          size={iconProps.size}
          iconStyle={{
            ...iconProps.style,
            color: volumePressed ? "var(--color-effect-opacity)" : "",
          }}
          onClick={toggleVolumeDisplay}
          hoverColor="var(--color-effect-opacity)"
        />

        <HoverIcon
          id="music-controls-mute-all"
          showTooltip
          tooltipText={isMuted ? "Unmute all" : "Mute all"}
          icon={IoVolumeMute}
          size={iconProps.size}
          hoverColor="var(--color-effect-opacity)"
          iconStyle={{
            ...iconProps.style,
            color: isMuted ? "var(--color-effect-opacity)" : "",
          }}
          onClick={handleMuteAllClick}
        />
      </div>

      {volumePressed && (
        <div
          id="music-controls-volume-slider-container"
          className={styles.musicControls__volumeSlider}
        >
          <div style={{ width: "75%" }}>
            <VolumeSlider
              id="music-controls-volume-slider"
              onChange={handleVolumeChange}
              value={musicVolume}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicControls;
