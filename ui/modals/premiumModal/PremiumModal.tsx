import React, { useEffect, useState } from "react";
import styles from "./premiumModal.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import Image from "next/image";
import Button from "@/ui/components/shared/button/Button";
import useAppStore from "@/stores/app-store";

const featuresList = [
  "📊 Focus stats",
  "🖼️ Premium Scenes",
  "🎧 Premium ambient sounds",
  "🎵 Additional lofi tracks",
  "🍅 Pomodoro tasks",
  "📺 Watch Youtube",
  "📋 Templates",
  "🎶 Melofi playlist",
  "🌟 And much more on the way!",
];

const PremiumModal = () => {
  const { showPremiumModal, setShowPremiumModal } = useAppStore();
  const [content, setContent] = useState<React.ReactNode>(null);
  useEffect(() => {
    setContent(getContent());
  }, [showPremiumModal]);

  const getContent = () => {
    switch (showPremiumModal) {
      case "mixer":
        return (
          <>
            <p className={styles.premiumModal__title}>Mix It Your Way</p>
            <p className={styles.premiumModal__description}>
              Take full control of your sound with all playlists, ambient layers, and seamless
              Spotify integration.
            </p>
            <Image
              src="/assets/premium-pics/mixer-modal-premium-pic.png"
              alt="Premium Modal"
              width={350}
              height={196.88}
            />
          </>
        );
      case "pomodoro_timer":
        return (
          <>
            <p className={styles.premiumModal__title}>Power of Focus</p>
            <p className={styles.premiumModal__description}>
              Unlock the Pomodoro timer to stay focused, manage breaks, and get more
              done—distraction-free.
            </p>
            <Image
              src="/assets/premium-pics/pomodoro-timer-premium-pic.png"
              alt="Premium Modal"
              width={261.33}
              height={196}
            />
          </>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <div
        className={styles.premiumModal__backdrop}
        style={{
          opacity: showPremiumModal ? 1 : 0,
          zIndex: showPremiumModal ? 100 : -1,
        }}
      >
        <Modal
          id="premium-modal"
          isOpen={showPremiumModal !== null}
          close={() => setShowPremiumModal(null)}
          className={styles.premiumModal__container}
        >
          <div className={styles.premiumModal__content}>
            {content}
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
                {featuresList.map((feature, index) => (
                  <p
                    style={{
                      color: index % 2 === 0 ? "var(--color-secondary)" : "var(--color-white)",
                    }}
                    key={index}
                  >
                    {feature}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PremiumModal;
