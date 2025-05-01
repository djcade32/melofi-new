import React from "react";
import styles from "./banner.module.css";
import { AnnouncementBanner } from "@/types/general";
import { motion } from "framer-motion";

interface BannerProps {
  announcement: AnnouncementBanner | null;
}

const Banner = ({ announcement }: BannerProps) => {
  const isActive = () => {
    if (!announcement) return false;
    const startDate = announcement?.start.toDate();
    const endDate = announcement?.end.toDate();
    const currentDate = new Date();
    return currentDate >= startDate && currentDate <= endDate;
  };

  const handleClick = () => {
    if (announcement?.ctaLink) {
      window.open(announcement.ctaLink, "_blank");
    }
  };

  return (
    <div className={styles.banner__container} style={{ display: isActive() ? "flex" : "none" }}>
      <p className={styles.banner__text}>{announcement?.text}</p>
      <p onClick={handleClick} className={styles.banner__cta}>
        {announcement?.cta}
      </p>
    </div>
  );
};

export default Banner;
