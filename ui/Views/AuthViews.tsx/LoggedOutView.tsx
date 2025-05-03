import React, { useEffect, useState } from "react";
import styles from "./loggedOutView.module.css";
import Signup from "./signup/Signup";
import Signin from "./Signin";
import ForgotPassword from "./forgotPassword/ForgotPassword";
import VerifyEmailView from "./signup/VerifyEmailView";
import useAppStore from "@/stores/app-store";

interface LoggedOutViewProps {
  showEmailVerification: boolean;
  setShowEmailVerification: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoggedOutView = ({ showEmailVerification, setShowEmailVerification }: LoggedOutViewProps) => {
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const { isElectron } = useAppStore();

  useEffect(() => {
    if (isElectron()) {
      setOnboardingStep(1);
    }
  }, [isElectron]);

  const content = () => {
    if (showEmailVerification) {
      return (
        <VerifyEmailView
          setAuthViewStep={setOnboardingStep}
          setShowEmailVerification={setShowEmailVerification}
        />
      );
    }
    switch (onboardingStep) {
      case 0:
        return <Signup setOnboardingStep={setOnboardingStep} />;
      case 1:
        return <Signin setOnboardingStep={setOnboardingStep} />;
      case 2:
        return <ForgotPassword setOnboardingStep={setOnboardingStep} />;
      default:
        return <Signup setOnboardingStep={setOnboardingStep} />;
    }
  };
  return (
    <div className={styles.loggedOutView__container}>
      <div className={styles.loggedOutView__login_signup_modal}>{content()}</div>
    </div>
  );
};

export default LoggedOutView;
