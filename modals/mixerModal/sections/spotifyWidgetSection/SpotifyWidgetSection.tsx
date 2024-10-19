import React, { useEffect, useState } from "react";
import useMusicPlayerStore from "@/stores/music-player-store";
import styles from "./spotifyWidgetSection.module.css";
import SpotifyWidgetInput from "./spotifyWidgetInput/SpotifyWidgetInput";

const SpotifyWidgetSection = () => {
  const { currentPlaylist } = useMusicPlayerStore();

  const [spotifyPlaylistId, setSpotifyPlaylistId] = useState("");
  const [spotifyPlaylistInput, setSpotifyPlaylistInput] = useState("");

  useEffect(() => {
    if (currentPlaylist && currentPlaylist.spotifyPlaylistId !== "") {
      setSpotifyPlaylistId(currentPlaylist.spotifyPlaylistId);
    }
  }, [currentPlaylist]);

  const handleSpotifyPlaylistChange = () => {
    if (spotifyPlaylistInput === "") {
      return;
    }
    const id = extractSpotifyPlaylistId(spotifyPlaylistInput);
    if (id && id !== "") {
      setSpotifyPlaylistId(id);
      setSpotifyPlaylistInput("");
    }
  };

  const extractSpotifyPlaylistId = (spotifyPlaylistLink: string) => {
    const url = spotifyPlaylistLink;
    const regex = /(?:playlist\/)?([^/?]+)(?:\?.*)?$/;
    const result = regex.exec(url);

    if (result && result.length > 1 && result[0].includes("playlist")) {
      const extractedValue = result[1];
      return extractedValue;
    } else {
      return "";
    }
  };

  return (
    <div className={styles.spotifyWidgetSection__container}>
      <SpotifyWidgetInput
        value={spotifyPlaylistInput}
        onChange={setSpotifyPlaylistInput}
        onSubmit={handleSpotifyPlaylistChange}
      />
      <iframe
        src={`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}?utm_source=generator`}
        allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture;"
        className={styles.spotifyWidgetSection__spotify_widget}
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyWidgetSection;
