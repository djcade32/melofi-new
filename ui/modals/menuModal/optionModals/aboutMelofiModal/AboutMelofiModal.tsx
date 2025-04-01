import React from "react";
import styles from "./aboutMelofiModal.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import useMenuStore from "@/stores/menu-store";
import { MdEmail, AiFillInstagram, BsGlobe, FaProductHunt } from "@/imports/icons";
import Link from "next/link";

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
              <Link href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>
            </div>
            <div className={styles.aboutMelofiModal__footer_separator} />

            <div className={styles.aboutMelofiModal__legal_link}>
              <Link href="/legal/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                Terms & Conditions
              </Link>
            </div>
          </div>

          <div className={styles.aboutMelofiModal__contacts}>
            <div
              id="about-melofi-modal-email-button"
              className={styles.aboutMelofiModal__contact}
              onClick={handleEmailToClipboard}
            >
              <MdEmail size={30} color="var(--color-secondary)" />
            </div>
            <div id="about-melofi-modal-insta-button" className={styles.aboutMelofiModal__contact}>
              <AiFillInstagram
                size={30}
                color="var(--color-secondary)"
                onClick={() => window.open("https://www.instagram.com/melofi.app/", "_blank")}
              />
            </div>
            <div
              id="about-melofi-modal-website-button"
              className={styles.aboutMelofiModal__contact}
            >
              <BsGlobe
                size={30}
                color="var(--color-secondary)"
                onClick={() => window.open("https://www.melofi.app/home", "_blank")}
              />
            </div>
            <div
              id="about-melofi-modal-product-hunt-button"
              className={styles.aboutMelofiModal__contact}
            >
              <FaProductHunt
                size={30}
                color="var(--color-secondary)"
                onClick={() =>
                  window.open(
                    "https://www.producthunt.com/posts/melofi-2-0/maker-invite?code=AN0YzN",
                    "_blank"
                  )
                }
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <a
              href="https://www.producthunt.com/posts/melofi-2-0?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-melofi&#0045;2&#0045;0"
              target="_blank"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=946095&theme=neutral&t=1742941036955"
                alt="Melofi&#0032;2&#0046;0 - New&#0032;widgets&#0044;&#0032;and&#0032;features&#0032;–&#0032;designed&#0032;for&#0032;peak&#0032;productivity | Product Hunt"
                style={{ width: 208.33, height: 45 }}
                width="208.33"
                height="45"
              />
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
