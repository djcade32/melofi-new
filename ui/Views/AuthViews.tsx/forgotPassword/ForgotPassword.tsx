import { AuthViewProps } from "@/types/general";
import React, { useState } from "react";
import styles from "./forgotPassword.module.css";
import { RxCaretLeft, IoCheckmarkCircleSharp } from "@/imports/icons";
import Button from "@/ui/components/shared/button/Button";
import Input from "@/ui/components/shared/input/Input";
import useUserStore from "@/stores/user-store";

const ForgotPassword = ({ setOnboardingStep }: AuthViewProps) => {
  const { resetUserPassword } = useUserStore();

  const [email, setEmail] = useState("");
  const [sentResetLink, setSentResetLink] = useState(false);

  const handleForgotPasswordClick = async () => {
    try {
      await resetUserPassword(email);
      setSentResetLink(true);
      console.log("Password reset email sent");
    } catch (error: any) {
      console.log("Error sending password reset email: ", error);
    }
  };

  const handleBackButtonClick = () => {
    setOnboardingStep((prev) => prev - 1);
    setSentResetLink(false);
  };

  return (
    <div className={styles.forgotPassword__container}>
      <div className={styles.forgotPassword__header}>
        <div className={styles.forgotPassword__back_button} onClick={handleBackButtonClick}>
          <RxCaretLeft size={25} color="var(--color-white)" />
          <p>Back</p>
        </div>
      </div>

      <div className={styles.forgotPassword__content_container}>
        {!sentResetLink ? (
          <>
            <p className={styles.forgotPassword__title}>Forgot Your Password?</p>
            <p className={styles.forgotPassword__subtitle}>
              No worries! Drop your email and we’ll send you a link to reset your password.
            </p>
            <form autoComplete="off" className={styles.forgotPassword__inputs_container}>
              <Input
                name="email-input"
                placeholder="Email Address"
                className={styles.forgotPassword__input}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                transparentBackground
              />
            </form>
            <Button
              id="send-reset-link-button"
              text="Send Reset Link"
              onClick={handleForgotPasswordClick}
              containerClassName={styles.forgotPassword__button}
              disable={email === ""}
              showLoadingState={true}
            />
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 10,
            }}
          >
            <IoCheckmarkCircleSharp size={60} color="var(--color-success)" />
            <p
              className={styles.forgotPassword__subtitle}
              style={{ textAlign: "left", marginTop: 0 }}
            >
              If the email you entered is associated with an account, you will receive a password
              reset link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
