import React from "react";
import ActionBar from "./actionBar/ActionBar";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.header__container} id="header">
      <h1>Melofi logo</h1>
      <ActionBar />
    </div>
  );
};

export default Header;
