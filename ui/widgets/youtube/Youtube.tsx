import useYoutubeStore from "@/stores/widgets/youtube-store";
import Modal from "@/ui/components/shared/modal/Modal";
import React, { useEffect, useState } from "react";
import styles from "./youtube.module.css";
import SearchInput from "@/ui/components/shared/searchInput/SearchInput";
import YouTubePlayer from "youtube-player";
import { YouTubePlayer as YouTubePlayerType } from "youtube-player/dist/types";
import { IoCloseOutline } from "@/imports/icons";
import useNotificationProviderStore from "@/stores/notification-provider-store";
const Youtube = () => {
  const { isYoutubeOpen, setIsYoutubeOpen } = useYoutubeStore();
  const { addNotification } = useNotificationProviderStore();

  const [playerRef, setPlayerRef] = useState<YouTubePlayerType | null>(null);
  const [videoId, setVideoId] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (playerRef) {
      playerRef.cueVideoById(videoId);
    } else {
      const player = YouTubePlayer("youtube-player", {
        videoId: videoId,
        playerVars: {
          fs: 0,
        },
      });

      player.on("ready", () => {
        console.log("YouTube player is ready.");
        setPlayerRef(player);
      });

      player.cueVideoById(videoId);
    }
  }, [videoId]);

  useEffect(() => {
    return () => {
      playerRef?.destroy();
    };
  }, [playerRef]);

  const extractYoutubeVideoId = (url: string): string | null => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|embed|shorts)\/|.*[?&]v=)|youtu\.be\/)([^&?/=\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleClose = async () => {
    if (playerRef) {
      try {
        await playerRef.pauseVideo();
      } catch (error) {
        console.error("Error pausing video:", error);
      }
    }
    setIsYoutubeOpen(false); // Close the widget after the video is paused
  };

  const showInput = () => {
    if (inputFocused || isHovered || isDragging) {
      return true;
    }
    return false;
  };

  const handleSubmit = (): Promise<boolean> => {
    const vidId = extractYoutubeVideoId(inputValue);

    if (vidId) {
      setVideoId(vidId);
      setInputValue("");
      return Promise.resolve(true);
    }
    addNotification({
      message: "Invalid Youtube URL",
      type: "error",
    });
    return Promise.resolve(false);
  };

  return (
    <Modal
      id="youtube-widget"
      isOpen={isYoutubeOpen}
      className={`${styles.youtube__container} ${showInput() ? styles.showInput : ""}`}
      draggable
      close={handleClose}
      resizable
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDrag={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
      showCloseIcon={false}
    >
      <div className={`${styles.youtube__input_container} ${showInput() ? styles.showInput : ""}`}>
        <div style={{ width: "100%" }}>
          <SearchInput
            id="youtube-widget"
            placeholder="Enter a Youtube URL"
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <IoCloseOutline
            id="youtube-widget-close-button"
            size={25}
            color="var(--color-secondary)"
            onClick={() => setIsYoutubeOpen(false)}
            style={{
              cursor: "pointer",
              zIndex: 1,
            }}
          />
        </div>
      </div>
      <div id="youtube-player" style={{ width: "100%", height: "100%" }}></div>
    </Modal>
  );
};

export default Youtube;
