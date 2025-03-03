import React from "react";
import { PiCrownSimpleFill } from "react-icons/pi";
import styles from "./premiumBadge.module.css";

interface PremiumBadgeProps {
  onClick?: () => void;
}

const PremiumBadge = ({ onClick }: PremiumBadgeProps) => {
  return (
    <div className={styles.premiumBadge__container} onClick={onClick}>
      <PiCrownSimpleFill color="var(--color-effect-opacity" size={15} />
      <p>PREMIUM</p>
    </div>
  );
};

export default PremiumBadge;
