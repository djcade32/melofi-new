import { useEffect, useState } from "react";
import { openDB } from "idb";
import styles from "./welcomeModal.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import Button from "@/ui/components/shared/button/Button";
import useIndexedDBStore from "@/stores/idexedDB-store";

const newFeatures = [
  ["More Playlists & Ambient Sounds", "Curate your perfect work vibe."],
  ["Spotify Integration", "Bring your own music into the mix."],
  ["Focus Stats", "Track your best work sessions."],
  ["Custom Templates", "Save and switch between personalized setups."],
  ["New Widgets", "Notes, Alarms, YouTube, and more!"],
];

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { indexedDB } = useIndexedDBStore();

  useEffect(() => {
    if (indexedDB === null) return;
    const checkModalStatus = async () => {
      const hasSeen = await indexedDB?.get("settings", "hasSeenWelcomeModal");
      if (!hasSeen) {
        setIsOpen(true);
      }
    };

    checkModalStatus();
  }, [indexedDB]);

  const handleClose = async () => {
    setIsOpen(false);
    await indexedDB?.put("settings", true, "hasSeenWelcomeModal");
  };

  return (
    <>
      <div
        className={styles.welcomeModal__backdrop}
        onClick={handleClose}
        style={{
          opacity: isOpen ? 1 : 0,
          zIndex: isOpen ? 100 : -1,
        }}
      >
        <Modal
          id="mixer-modal"
          isOpen={isOpen}
          close={handleClose}
          className={styles.welcomeModal__container}
        >
          <div className={styles.welcomeModal__content}>
            <h1>Welcome to the All-New Melofi! 🎶✨</h1>
            <p className={styles.welcomeModal__text}>
              Hey there, and welcome to your upgraded focus haven! 🚀 Melofi is new and improved,
              designed to help you lock in, tune out distractions, and get more done—all while
              enjoying immersive soundscapes and visuals.
            </p>
            <div>
              <p className={styles.welcomeModal__text}>Here’s what’s fresh:</p>
              <ul>
                {newFeatures.map((feature, index) => (
                  <li className={styles.welcomeModal__feature} key={index}>
                    ✅ <strong>{feature[0]}</strong>
                    {" - "}
                    {feature[1]}
                  </li>
                ))}
              </ul>
            </div>
            <p className={styles.welcomeModal__text}>
              Take a look around, make yourself at home, and get ready to level up your focus. 🚀
            </p>
            <Button
              id="welcome-modal-button"
              text="Let’s Go"
              onClick={handleClose}
              containerClassName={styles.welcomeModal__button}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default WelcomeModal;
