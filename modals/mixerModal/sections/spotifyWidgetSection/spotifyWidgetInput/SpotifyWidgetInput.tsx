import { MusicSource } from "@/enums/general";
import useMixerStore from "@/stores/mixer-store";
import React, { useEffect, useRef, useState } from "react";
import styles from "./spotifyWidgetInput.module.css";

interface SpotifyWidgetInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const SpotifyWidgetInput = ({ value, onChange, onSubmit }: SpotifyWidgetInputProps) => {
  const goRef = useRef<HTMLInputElement>(null);

  const { musicSource } = useMixerStore();

  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (musicSource === MusicSource.SPOTIFY) {
      const handleEnter = (event: KeyboardEvent) => {
        if (event.key === "Enter" && goRef.current) {
          goRef.current.click();
        }
      };
      document
        .getElementById("spotify-widget-input")
        ?.addEventListener("keydown", handleEnter, true);
    }
  }, [musicSource]);

  return (
    <div className={styles.spotifyWidgetInput__input_container}>
      <input
        id="spotify-widget-input"
        className={`${styles.spotifyWidgetInput__input} ${
          isInputFocused && styles.spotifyWidgetInput__input_focused
        }`}
        type="text"
        placeholder=" Enter Spotify playlist link"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
      <p ref={goRef} className={styles.spotifyWidgetInput__input_button} onClick={onSubmit}>
        Go
      </p>
    </div>
  );
};

export default SpotifyWidgetInput;
