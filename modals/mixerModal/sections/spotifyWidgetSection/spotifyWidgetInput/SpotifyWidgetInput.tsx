import { MusicSource } from "@/enums/general";
import useMixerStore from "@/stores/mixer-store";
import React, { useEffect, useRef, useState } from "react";
import styles from "./spotifyWidgetInput.module.css";

interface SpotifyWidgetInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<boolean>;
}

const SpotifyWidgetInput = ({ value, onChange, onSubmit }: SpotifyWidgetInputProps) => {
  const goRef = useRef<HTMLInputElement>(null);

  const { musicSource } = useMixerStore();

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    onChange(event.target.value);
  };

  const handleOnSubmit = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const validLink = await onSubmit();
      setError(!validLink);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
        onChange={handleOnChange}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        style={{ borderColor: error ? "var(--color-error)" : "" }}
      />
      <p
        id="spotify-widget-input-go"
        ref={goRef}
        className={styles.spotifyWidgetInput__input_button}
        onClick={handleOnSubmit}
      >
        Go
      </p>
    </div>
  );
};

export default SpotifyWidgetInput;
