import React from "react";
import ActionBar from "./actionBar/ActionBar";
import styles from "./header.module.css";
import RotatingLogo from "../rotatingLogo/RotatingLogo";
import { useAppContext } from "@/contexts/AppContext";

const Header = () => {
  const { isSleep } = useAppContext();

  return (
    <nav
      className={`${styles.header__container} ${isSleep ? styles.slide_up : styles.slide_down}`}
      id="header"
    >
      <RotatingLogo />
      <ActionBar />
    </nav>
  );
};

export default Header;
