import React from "react";
import styles from "./signup.module.css";
import Button from "@/ui/components/shared/button/Button";
import { AuthViewProps } from "@/types/general";

interface WelcomeViewProps extends AuthViewProps {
  firstName: string;
}

const WelcomeView = ({ setOnboardingStep, firstName }: WelcomeViewProps) => {
  return (
    <div
      className={styles.signup__container}
      style={{
        justifyContent: "center",
      }}
    >
      <p className={styles.signup__title} style={{ width: "100%" }}>
        Welcome to Melofi, {firstName}!
      </p>
      <p
        className={styles.signup__subtitle}
        style={{
          width: "35ch",
          lineHeight: 1.2,
        }}
      >
        You’re officially part of the Melofi family. Ready to focus up with lo-fi beats and zero
        distractions?
      </p>

      <Button
        id="get-started-button"
        text="Get Started"
        onClick={() => setOnboardingStep((prev) => prev + 1)}
        containerClassName={styles.signup__continue_button}
        style={{ marginTop: 30, width: 200 }}
        hoverClassName={styles.signup__continue_button_hover}
      />
    </div>
  );
};

export default WelcomeView;
