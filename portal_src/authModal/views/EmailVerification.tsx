import React from "react";
import styles from "../authModal.module.css";
import Button from "@/ui/components/shared/button/Button";
import { sendEmailVerification } from "@/lib/firebase/actions/auth-actions";
import useNotificationProviderStore from "@/stores/notification-provider-store";

interface EmailVerificationProps {
  handleViewChange: (view: "login" | "signup" | "forgotPassword" | "emailVerification") => void;
}

const EmailVerification = ({ handleViewChange }: EmailVerificationProps) => {
  const { addNotification } = useNotificationProviderStore();

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <h1
        style={{
          marginBottom: 10,
        }}
      >
        Verify Email
      </h1>
      <p style={{ width: "30ch", textAlign: "center" }}>
        We’ve sent a verification link to your email. Just click the link to confirm
      </p>

      <Button
        id="verify-email-button"
        text="Back to Login"
        onClick={() => handleViewChange("login")}
        containerClassName={styles.authModal__button}
        textClassName={styles.authModal__button_text}
        style={{ width: 250 }}
      />
      <p
        style={{
          position: "absolute",
          bottom: 20,
          textAlign: "center",
          fontSize: 14,
          width: "70%",
        }}
      >
        Didn’t receive the email? Check your spam folder or {""}
        <span
          className={styles.authModal__link_text}
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
  );
};

export default EmailVerification;
