import React, { useEffect, useState } from "react";
import ActionBar from "./actionBar/ActionBar";
import styles from "./header.module.css";
import RotatingLogo from "../rotatingLogo/RotatingLogo";
import useAppStore from "@/stores/app-store";

const Header = () => {
  const { isSleep } = useAppStore();

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
