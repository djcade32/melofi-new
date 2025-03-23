import React from "react";
import styles from "./signup.module.css";
import Button from "@/ui/components/shared/button/Button";
import { sendEmailVerification } from "@/lib/firebase/actions/auth-actions";
import useNotificationProviderStore from "@/stores/notification-provider-store";

interface VerifyEmailViewProps {
  setAuthViewStep: React.Dispatch<React.SetStateAction<number>>;
  setShowEmailVerification?: React.Dispatch<React.SetStateAction<boolean>>;
  setOnboardingStep?: React.Dispatch<React.SetStateAction<number>>;
}

const VerifyEmailView = ({
  setAuthViewStep,
  setShowEmailVerification,
  setOnboardingStep,
}: VerifyEmailViewProps) => {
  const { addNotification } = useNotificationProviderStore();

  const handleContinueClicked = () => {
    setShowEmailVerification && setShowEmailVerification(false);
    setOnboardingStep && setOnboardingStep(0);
    setAuthViewStep(1);
  };

  const handleResendVerificationClicked = async () => {
    try {
      await sendEmailVerification();
      addNotification({
        type: "success",
        message: "Verification email sent",
      });
      console.log("Verification email sent");
    } catch (error: any) {
      console.log("Error sending verification email: ", error);
    }
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
          id="verify-email-button"
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
            onClick={handleResendVerificationClicked}
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
