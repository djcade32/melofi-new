import { AuthViewProps } from "@/types/interfaces";
import React from "react";
import styles from "./signup.module.css";
import Button from "@/ui/components/shared/button/Button";

interface VerifyEmailViewProps {
  setAuthViewStep: React.Dispatch<React.SetStateAction<number>>;
}

const VerifyEmailView = ({ setAuthViewStep }: VerifyEmailViewProps) => {
  const handleContinueClicked = () => {
    setAuthViewStep(1);
  };

  return (
    <div className={styles.signup__container}>
      <div className={styles.signup__content_container} style={{ justifyContent: "center" }}>
        <p className={styles.signup__title} style={{ lineHeight: 1.2 }}>
          One Last Step to the Melofi Zone!
        </p>
        <p className={styles.signup__subtitle} style={{ width: "40ch" }}>
          We’ve sent a verification link to your email. Just click the link to confirm, and you’re
          all set to start your lo-fi journey with Melofi!
        </p>

        <Button
          id="send-reset-link-button"
          text="Let’s Get Focused"
          onClick={handleContinueClicked}
          containerClassName={styles.signup__continue_button}
          style={{ width: 250 }}
        />
        <p style={{ position: "absolute", bottom: 0 }}>
          Didn’t receive the email? Check your spam folder or {""}
          <span
            className={styles.signup__have_account_text}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onClick={() => {}}
          >
            resend verification
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailView;
