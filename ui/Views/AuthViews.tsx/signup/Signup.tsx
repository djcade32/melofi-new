import React from "react";
import FirstNameView from "./FirstNameView";
import styles from "./signup.module.css";
import CredentialsView from "./CredentialsView";
import WelcomeView from "./WelcomeView";

const Signup = () => {
  return (
    <div className={styles.signup__container}>
      {/* <FirstNameView /> */}
      {/* <CredentialsView /> */}
      <WelcomeView />
    </div>
  );
};

export default Signup;
