import React from "react";
import { PiCrownSimpleFill } from "react-icons/pi";
import styles from "./premiumBadge.module.css";

interface PremiumBadgeProps {
  id?: string;
  onClick?: () => void;
}

const PremiumBadge = ({ id, onClick }: PremiumBadgeProps) => {
  return (
    <div id={id} className={styles.premiumBadge__container} onClick={onClick}>
      <PiCrownSimpleFill color="var(--color-effect-opacity" size={15} />
      <p>PREMIUM</p>
    </div>
  );
};

export default PremiumBadge;
