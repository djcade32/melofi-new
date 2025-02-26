import React from "react";
import { PiCrownSimpleFill } from "react-icons/pi";
import styles from "./premiumBadge.module.css";

const PremiumBadge = () => {
  return (
    <div className={styles.premiumBadge__container}>
      <PiCrownSimpleFill color="var(--color-effect-opacity" size={15} />
      <p>PREMIUM</p>
    </div>
  );
};

export default PremiumBadge;
