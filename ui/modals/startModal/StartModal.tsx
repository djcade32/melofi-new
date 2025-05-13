import React from "react";
import styles from "./startModal.module.css";
import Button from "@/ui/components/shared/button/Button";
import Link from "next/link";
import useAppStore from "@/stores/app-store";
import useMusicPlayerStore from "@/stores/music-player-store";
import { createLogger } from "@/utils/logger";
import { useOnboardingTourContext } from "@/contexts/OnboardingTourContext";

const Logger = createLogger("Start Modal");

const StartModal = () => {
  const { showStartModal, setShowStartModal } = useAppStore();
  const { startOnboarding } = useOnboardingTourContext();
  const { setIsPlaying } = useMusicPlayerStore();

  const onStartClick = () => {
    setShowStartModal(false);
    setIsPlaying(true);
    askingForPermission();
    startOnboarding();
  };

  const askingForPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          Logger.warn("Notification permission not granted");
        }
      });
    }
  };
  return (
    <>
      {showStartModal && (
        <div className={styles.startModal__container}>
          <div className={styles.startModal__content}>
            <h1>Welcome to Melofi</h1>
            <div className={styles.startModal__text}>
              <p>
                Your peaceful productivity
                <br />
                space is ready.
              </p>
            </div>

            <Button
              id="start-modal-button"
              text="Start"
              containerClassName={styles.startModal__button}
              style={{ backgroundColor: "var(--color-effect-opacity)" }}
              onClick={onStartClick}
            />
            <div className={styles.startModal__terms_and_policy}>
              <p className={styles.startModal__terms_and_policy_text}>
                <Link href="/legal/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </Link>
              </p>
              <p className={styles.startModal__terms_and_policy_text}>
                <Link href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StartModal;
