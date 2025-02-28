import React from "react";
import styles from "./premiumModal.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import Image from "next/image";
import Button from "@/ui/components/shared/button/Button";

const PremiumModal = () => {
  return (
    <>
      <div className={styles.premiumModal__backdrop} />
      <Modal
        id="premium-modal"
        isOpen={true}
        close={() => {}}
        className={styles.premiumModal__container}
      >
        <div className={styles.premiumModal__content}>
          <p className={styles.premiumModal__title}>Mix It Your Way</p>
          <p className={styles.premiumModal__description}>
            Take full control of your sound with all playlists, ambient layers, and seamless Spotify
            integration.
          </p>
          <Image
            src="/assets/premium-pics/mixer-modal-premium-pic.png"
            alt="Premium Modal"
            width={350}
            height={196.88}
          />
          <div className={styles.premiumModal__pricing_container}>
            <p className={styles.premiumModal__pricing}>
              <span
                style={{
                  fontWeight: 700,
                }}
              >
                $6
              </span>
              /mo or{" "}
              <span
                style={{
                  fontWeight: 700,
                }}
              >
                $4
              </span>
              /mo annually
            </p>
            <Button
              id="go-premium-button"
              text="Go Premium"
              containerClassName={styles.premiumModal__premium_button}
              hoverClassName={styles.premiumModal__premium_button_hover}
              textClassName={styles.premiumModal__premium_button_text}
              onClick={() => {}}
            />
          </div>
          <div className={styles.premiumModal__features_container}>
            <p className={styles.premiumModal__subtitle}>Everything with Premium</p>
            <div className={styles.premiumModal__features_list}>
              <p>📊 Focus stats</p>
              <p>🖼️ Premium Scenes</p>
              <p>🎧 Premium ambient sounds</p>
              <p>🎵 Additional lofi tracks</p>
              <p>🍅 Pomodoro tasks</p>
              <p>📺 Watch Youtube</p>
              <p>📋 Templates</p>
              <p>🎶 Melofi playlist</p>
              <p>🌟 And much more on the way!</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PremiumModal;
