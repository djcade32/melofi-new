import React from "react";
import styles from "./aboutMelofiModal.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import useMenuStore from "@/stores/menu-store";
import { MdEmail, AiFillInstagram } from "@/imports/icons";

const AboutMelofiModal = () => {
  const { selectedOption, setSelectedOption, copyToClipboard } = useMenuStore();
  const isOpenState = selectedOption === "About Melofi";

  const handleEmailToClipboard = () => {
    copyToClipboard("welcome@melofi.app");
  };
  return (
    <Modal
      id="about-melofi-modal"
      className={styles.aboutMelofiModal__container}
      isOpen={isOpenState}
      close={() => setSelectedOption(null)}
      title="About Melofi"
      titleClassName={styles.aboutMelofiModal__title}
    >
      <div className={styles.aboutMelofiModal__content}>
        <p className={styles.aboutMelofiModal__text}>
          Melofi was created with students, professionals, and creative individuals in mind. It
          understands the need for a focused and tranquil setting during study, work, or creative
          pursuits. Whether you're tackling complex tasks or seeking a calming ambiance, Melofi
          caters to your desire for a productive atmosphere. Find solace in the soothing sounds of
          lofi music, as Melofi is designed to enhance your experience and elevate your productivity
          to new heights.
        </p>

        <div className={styles.aboutMelofiModal__footer}>
          <div className={styles.aboutMelofiModal__legal_links}>
            <div className={styles.aboutMelofiModal__legal_link}>
              <p>Privacy Policy</p>
            </div>
            <div className={styles.aboutMelofiModal__footer_separator} />

            <div className={styles.aboutMelofiModal__legal_link}>
              <p>Terms & Conditions</p>
            </div>
          </div>

          <div className={styles.aboutMelofiModal__contact} onClick={handleEmailToClipboard}>
            <MdEmail size={20} color="var(--color-secondary)" />
            <p>welcome@melofi.app</p>
          </div>
          <div className={styles.aboutMelofiModal__contact}>
            <AiFillInstagram size={20} color="var(--color-secondary)" />
            <a href="https://www.instagram.com/melofi.app/" target="_blank">
              <p>Instagram</p>
            </a>
          </div>

          <div className={styles.aboutMelofiModal__version}>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AboutMelofiModal;
