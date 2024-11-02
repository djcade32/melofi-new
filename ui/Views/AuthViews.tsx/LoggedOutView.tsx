import React from "react";
import styles from "./loggedOutView.module.css";
import Signup from "./signup/Signup";

const LoggedOutView = () => {
  return (
    <div className={styles.loggedOutView__container}>
      <div className={styles.loggedOutView__login_signup_modal}>
        <Signup />
      </div>
    </div>
  );
};

export default LoggedOutView;
