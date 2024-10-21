import React, { useEffect, useRef, useState } from "react";
import styles from "./mixerSlider.module.css";
import { Slider, SliderThumb, styled } from "@mui/material";
import { FaLock } from "@/imports/icons";
import { IconType } from "react-icons";
import useMixerStore from "@/stores/mixer-store";

const StyledSlider = styled(Slider)({
  color: "var(--color-effect-opacity)",
  height: 20,

  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    height: 30,
    width: 30,
    position: "absolute",
    left: 30,
    backgroundColor: "var(--color-secondary)",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.25,
    backgroundColor: "rgb(112,108,111)",
  },
});

interface MixerSliderProps {
  soundPath: string;
  soundName: string;
  soundVolume: number;
  soundIcon: IconType;
  premium: boolean;
}

const MixerSlider = ({
  soundName,
  soundPath,
  soundVolume,
  soundIcon,
  premium,
}: MixerSliderProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const { changeSoundVolume } = useMixerStore();

  const [volume, setVolume] = useState(soundVolume);
  const [thumbClicked, setThumbClicked] = useState(false); // Track if the thumb is clicked

  useEffect(() => {
    if (!audioRef.current) return;
    setVolume(soundVolume * 100);
    if (soundVolume <= 0 && thumbClicked) {
      audioRef.current.pause();
      setThumbClicked(false);
    }
  }, [soundVolume]);

  function IconThumb(iconThumbProps: any) {
    const { children, ...other } = iconThumbProps;
    const mixerSliderIconProps = {
      size: 20,
      color: thumbClicked ? "var(--color-secondary-white)" : "#343338",
    };
    return (
      <SliderThumb {...other}>
        {children}
        {premium ? (
          <FaLock {...mixerSliderIconProps} />
        ) : (
          React.createElement(soundIcon, mixerSliderIconProps)
        )}
      </SliderThumb>
    );
  }

  const handleLevelChange = (e: Event, newValue: number | number[]) => {
    if (!audioRef.current) return;
    setThumbClicked(true);
    let event = e as unknown as React.ChangeEvent<HTMLInputElement>;
    const targetValue = Number(event.target.value);
    if (targetValue > 0) {
      audioRef.current.play();
    } else if (targetValue <= 0) {
      audioRef.current.pause();
    }
    audioRef.current.volume = targetValue / 100;

    setVolume(targetValue);
  };

  return (
    <div id={`${soundName}-mixer-slider`} className={styles.mixerSlider__container}>
      <audio id={`${soundName}-audio`} ref={audioRef} src={soundPath} typeof="audio/mpeg" loop />

      <div className={styles.mixerSlider__label}>
        <p>{soundName}</p>
      </div>
      <div className={styles.mixerSlider__slider_container}>
        <StyledSlider
          disabled={premium}
          sx={{
            "& .MuiSlider-thumb": {
              transition: "all 0.3s",
              backgroundColor: thumbClicked
                ? "var(--color-effect-opacity)"
                : "var(--color-secondary)",
              "& svg": {
                transition: "all 0.3s",
                color: thumbClicked ? "var(--color-secondary-white)" : "#343338",
              },
            },
          }}
          slots={{
            thumb: IconThumb,
          }}
          defaultValue={0}
          max={75}
          onChange={handleLevelChange}
          value={volume}
          onChangeCommitted={(_, newValue) => {
            changeSoundVolume(soundName, Number(newValue) / 100);
            newValue === 0 && setThumbClicked(false);
          }}
        />
      </div>
    </div>
  );
};

export default MixerSlider;
