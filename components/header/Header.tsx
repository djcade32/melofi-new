import React from "react";
import ActionBar from "./actionBar/ActionBar";
import styles from "./header.module.css";
import logo from "@/public/assets/logos/melofi-logo.png";
import Image from "next/image";

const Header = () => {
  return (
    <nav className={styles.header__container} id="header">
      <div className={styles.header_logo}>
        <Image src={logo} alt="melofi logo" width={122} height={122} priority />
      </div>
      <ActionBar />
    </nav>
  );
};

export default Header;
