import React from "react";
import styles from "./supportCreatorBanner.module.css";
import { useAppContext } from "@/contexts/AppContext";
import useUserStore from "@/stores/user-store";
import { SiBuymeacoffee } from "@/imports/icons";

const SupportCreatorBanner = () => {
  const { isPremiumUser } = useUserStore();

  return (
    <>
      {!isPremiumUser && (
        <div className={styles.supportCreatorBanner__container}>
          <a
            className={styles.supportCreatorBanner__text}
            href="https://buymeacoffee.com/normancade"
            target="_blank"
          >
            <span>
              <SiBuymeacoffee />
            </span>
            SUPPORT THE CREATOR
          </a>
        </div>
      )}
    </>
  );
};

export default SupportCreatorBanner;
