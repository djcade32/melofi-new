import React, { useEffect, useState } from "react";
import useMusicPlayerStore from "@/stores/music-player-store";
import styles from "./spotifyWidgetSection.module.css";
import useNotificationProviderStore from "@/stores/notification-provider-store";
import SearchInput from "@/ui/components/shared/searchInput/SearchInput";
import useUserStore from "@/stores/user-store";
import useAppStore from "@/stores/app-store";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Spotify Widget Section");

const SpotifyWidgetSection = () => {
  const { currentPlaylist } = useMusicPlayerStore();
  const { addNotification } = useNotificationProviderStore();
  const { isPremiumUser } = useUserStore();
  const { setShowPremiumModal } = useAppStore();

  const [spotifyPlaylistId, setSpotifyPlaylistId] = useState("");
  const [spotifyPlaylistInput, setSpotifyPlaylistInput] = useState("");

  useEffect(() => {
    if (currentPlaylist && currentPlaylist.spotifyPlaylistId !== "") {
      setSpotifyPlaylistId(currentPlaylist.spotifyPlaylistId);
    }
  }, [currentPlaylist]);

  const handleSpotifyPlaylistChange = (): Promise<boolean> => {
    if (!isPremiumUser) {
      setShowPremiumModal("spotify");
      return Promise.resolve(true);
    }
    // If the input is empty, do nothing
    if (spotifyPlaylistInput === "") {
      return Promise.resolve(true);
    }

    const id = extractSpotifyPlaylistId(spotifyPlaylistInput);
    // If the id is valid, set the new playlist id
    if (id && id !== "") {
      setSpotifyPlaylistId(id);
      setSpotifyPlaylistInput("");
      return Promise.resolve(true);
    } else {
      // If the id is invalid, show an error
      addNotification({
        message: "Invalid Spotify Playlist Link",
        type: "error",
      });
      return Promise.resolve(false);
    }
  };

  const extractSpotifyPlaylistId = (spotifyPlaylistLink: string) => {
    const regex = /^https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)(?:\?.*)?$/;
    const result = regex.exec(spotifyPlaylistLink);

    if (result && result.length > 1) {
      const extractedValue = result[1];
      return extractedValue;
    } else {
      Logger.debug.info("Invalid Spotify Playlist Link");
      return "";
    }
  };

  return (
    <div className={styles.spotifyWidgetSection__container}>
      <SearchInput
        id="spotify-widget"
        placeholder="Enter a Spotify Playlist Link"
        value={spotifyPlaylistInput}
        onChange={setSpotifyPlaylistInput}
        onSubmit={handleSpotifyPlaylistChange}
      />
      <iframe
        id="mixer-modal-spotify-widget"
        src={`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}?utm_source=generator`}
        allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture;"
        className={styles.spotifyWidgetSection__spotify_widget}
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyWidgetSection;
