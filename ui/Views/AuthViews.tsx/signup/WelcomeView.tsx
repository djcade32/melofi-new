import React from "react";
import styles from "./signup.module.css";
import Button from "@/ui/components/shared/button/Button";

const WelcomeView = () => {
  return (
    <div
      className={styles.signup__container}
      style={{
        justifyContent: "center",
      }}
    >
      <p className={styles.signup__title} style={{ width: "100%" }}>
        Welcome to Melofi, Norman!
      </p>
      <p
        className={styles.signup__subtitle}
        style={{
          width: "35ch",
        }}
      >
        You’re officially part of the Melofi family. Ready to focus up with smooth beats and zero
        distractions?
      </p>

      <Button
        id="get-started-button"
        text="Get Started"
        onClick={() => {}}
        containerClassName={styles.signup__continue_button}
        style={{ marginTop: 30, width: 200 }}
      />
    </div>
  );
};

export default WelcomeView;
