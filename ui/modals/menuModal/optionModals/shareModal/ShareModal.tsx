import React from "react";
import styles from "./shareModal.module.css";
import useMenuStore from "@/stores/menu-store";
import Modal from "@/ui/components/shared/modal/Modal";
import Button from "@/ui/components/shared/button/Button";

const ShareModal = () => {
  const { selectedOption, setSelectedOption, copyToClipboard } = useMenuStore();
  const isOpen = selectedOption === "Share With Friends";

  const handleCopyLink = () => {
    copyToClipboard("https://melofi.app/");
  };
  return (
    <Modal
      id="share-modal"
      className={styles.shareModal__container}
      isOpen={isOpen}
      close={() => setSelectedOption(null)}
    >
      <div className={styles.shareModal__content}>
        <p className={styles.shareModal__title}>
          Good Vibes Are <br /> Better Shared
        </p>
        <p className={styles.shareModal__subtext}>
          Love Melofi? Share it with your friends and help them tune into their perfect focus zone!
        </p>
        <Button
          id="share-modal-button"
          text="Copy Link"
          containerClassName={styles.shareModal__button}
          style={{ backgroundColor: "var(--color-effect-opacity)" }}
          onClick={handleCopyLink}
        />
      </div>
    </Modal>
  );
};

export default ShareModal;
