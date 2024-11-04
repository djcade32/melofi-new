import React, { useState } from "react";
import FirstNameView from "./FirstNameView";
import styles from "./signup.module.css";
import CredentialsView from "./CredentialsView";
import WelcomeView from "./WelcomeView";
import { AuthViewProps } from "@/types/interfaces";
import VerifyEmailView from "./VerifyEmailView";

const Signup = (props: AuthViewProps) => {
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");

  const content = () => {
    switch (onboardingStep) {
      case 0:
        return (
          <FirstNameView
            setOnboardingStep={setOnboardingStep}
            setAuthViewStep={props.setOnboardingStep}
            setFirstName={setFirstName}
            firstName={firstName}
          />
        );
      case 1:
        return (
          <CredentialsView
            setOnboardingStep={setOnboardingStep}
            setAuthViewStep={props.setOnboardingStep}
            firstName={firstName}
          />
        );
      case 2:
        return (
          <VerifyEmailView
            setAuthViewStep={props.setOnboardingStep}
            setOnboardingStep={setOnboardingStep}
          />
        );
      case 3:
        return <WelcomeView setOnboardingStep={setOnboardingStep} firstName={firstName} />;

      default:
        return (
          <FirstNameView
            setOnboardingStep={setOnboardingStep}
            setAuthViewStep={props.setOnboardingStep}
            setFirstName={setFirstName}
            firstName={firstName}
          />
        );
    }
  };

  return <div className={styles.signup__container}>{content()}</div>;
};

export default Signup;
