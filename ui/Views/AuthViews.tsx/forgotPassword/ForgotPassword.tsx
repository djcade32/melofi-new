import { AuthViewProps } from "@/types/interfaces";
import React, { useState } from "react";
import styles from "./forgotPassword.module.css";
import { RxCaretLeft } from "react-icons/rx";
import Button from "@/ui/components/shared/button/Button";
import Input from "@/ui/components/shared/input/Input";

const ForgotPassword = ({ setOnboardingStep }: AuthViewProps) => {
  const [email, setEmail] = useState("");

  return (
    <div className={styles.forgotPassword__container}>
      <div className={styles.forgotPassword__header}>
        <div
          className={styles.forgotPassword__back_button}
          onClick={() => setOnboardingStep((prev) => prev - 1)}
        >
          <RxCaretLeft size={25} color="var(--color-secondary-white)" />
          <p>Back</p>
        </div>
      </div>

      <div className={styles.forgotPassword__content_container}>
        <p className={styles.forgotPassword__title}>Forgot Your Password?</p>
        <p className={styles.forgotPassword__subtitle}>
          No worries! Drop your email and we’ll send you a link to reset your password.
        </p>
        <form autoComplete="off" className={styles.forgotPassword__inputs_container}>
          <Input
            placeholder="Email Address"
            className={styles.forgotPassword__input}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </form>
        <Button
          id="send-reset-link-button"
          text="Send Reset Link"
          onClick={() => {}}
          containerClassName={styles.forgotPassword__button}
          disable={email === ""}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
