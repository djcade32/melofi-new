import React, { useState } from "react";
import styles from "../authModal.module.css";
import Button from "@/ui/components/shared/button/Button";
import { RxCaretLeft } from "@/imports/icons";
import Input from "@/ui/components/shared/input/Input";
import useUserStore from "@/stores/user-store";
import useNotificationProviderStore from "@/stores/notification-provider-store";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Forgot Password");
interface ForgotPasswordProps {
  handleViewChange: (view: "login" | "signup" | "forgotPassword" | "emailVerification") => void;
}

const ForgotPassword = ({ handleViewChange }: ForgotPasswordProps) => {
  const { resetUserPassword } = useUserStore();
  const { addNotification } = useNotificationProviderStore();

  const [email, setEmail] = useState("");

  const handleForgotPasswordClick = async () => {
    try {
      await resetUserPassword(email);
      addNotification({
        type: "success",
        message: "Password reset email sent",
      });
      handleViewChange("login");
      setEmail("");
      Logger.info("Password reset email sent");
    } catch (error: any) {
      Logger.error(`Error sending password reset email: ${error}`);
      addNotification({
        type: "error",
        message: "Error sending password reset email",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
        flex: 1,
      }}
    >
      <div className={styles.authModal__back_button} onClick={() => handleViewChange("login")}>
        <RxCaretLeft size={25} color="var(--color-primary)" />
        <p>Back</p>
      </div>
      <h1 style={{ textAlign: "center", marginTop: 20 }}>
        Forgot Your <br />
        Password?
      </h1>
      <p style={{ width: "32ch", textAlign: "center" }}>
        No worries! Drop your email and we’ll send you a link to reset your password.
      </p>
      <form
        autoComplete="off"
        className={styles.authModal__form_input_container}
        style={{ marginTop: 20 }}
      >
        <Input
          name="email-input"
          placeholder="Email Address"
          className={styles.authModal__input}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          transparentBackground
          variant="secondary"
        />
      </form>
      <Button
        id="send-reset-link-button"
        text="Send Reset Link"
        onClick={handleForgotPasswordClick}
        containerClassName={styles.authModal__button}
        textClassName={styles.authModal__button_text}
        disable={email === ""}
        showLoadingState={true}
        style={{ width: 250 }}
      />
    </div>
  );
};

export default ForgotPassword;
