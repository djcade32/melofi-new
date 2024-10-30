import React from "react";
import ActionBar from "./actionBar/ActionBar";
import styles from "./header.module.css";
import RotatingLogo from "../rotatingLogo/RotatingLogo";

const Header = () => {
  return (
    <nav className={styles.header__container} id="header">
      <RotatingLogo />
      <ActionBar />
    </nav>
  );
};

export default Header;
