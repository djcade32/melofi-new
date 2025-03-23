import React from "react";
import styles from "./playlistSection.module.css";
import PlaylistButton from "./playlistButton/PlaylistButton";
import { Study, Relax, Sleepy } from "@/data/songs";
import useMusicPlayerStore from "@/stores/music-player-store";
import { Playlist } from "@/types/interfaces/mixer";
import useUserStore from "@/stores/user-store";
import Button from "@/ui/components/shared/button/Button";
import useAppStore from "@/stores/app-store";

const playlist = [Study, Relax, Sleepy];

const PlaylistSection = () => {
  const { setCurrentPlaylist, currentPlaylist, shufflePlaylist } = useMusicPlayerStore();
  const { isPremiumUser } = useUserStore();
  const { setShowPremiumModal } = useAppStore();

  const handlePlayListButtonPress = (playlist: Playlist) => {
    if (currentPlaylist.id === playlist.id) return;
    setCurrentPlaylist(playlist);
    shufflePlaylist();
  };
  return (
    <div className={styles.playListSection__container}>
      <div
        className={`${styles.playListSection__premium_container} ${
          !isPremiumUser && styles.not_premium_user
        }`}
      >
        <Button
          id="go-premium-button"
          text="Go Premium"
          containerClassName={styles.playListSection__premium_button}
          hoverClassName={styles.playListSection__premium_button_hover}
          textClassName={styles.playListSection__premium_button_text}
          onClick={() => setShowPremiumModal("mixer")}
        />
        <p>More moods, more music, more focus. Upgrade now! 🚀</p>
      </div>
      <div
        className={`${styles.playListSection__playlist_buttons} ${
          !isPremiumUser && styles.not_premium_user
        }`}
      >
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
    </div>
  );
};

export default PlaylistSection;
