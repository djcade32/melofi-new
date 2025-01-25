import useYoutubeStore from "@/stores/widgets/youtube-store";
import Modal from "@/ui/components/shared/modal/Modal";
import React from "react";
import styles from "./youtube.module.css";
import SearchInput from "@/ui/components/shared/searchInput/SearchInput";

const Youtube = () => {
  const { isYoutubeOpen, setIsYoutubeOpen } = useYoutubeStore();
  return (
    <Modal
      id="youtube-widget"
      isOpen={isYoutubeOpen}
      className={styles.youtube__container}
      draggable
      close={() => setIsYoutubeOpen(!isYoutubeOpen)}
    >
      <SearchInput
        id="youtube-widget"
        placeholder="Enter a Youtube URL"
        value=""
        onChange={() => {}}
        onSubmit={async () => {
          return true;
        }}
      />
    </Modal>
  );
};

export default Youtube;
