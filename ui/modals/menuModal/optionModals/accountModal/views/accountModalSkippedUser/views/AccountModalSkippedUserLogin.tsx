import React, { useState } from "react";
import styles from "../accountModalSkippedUser.module.css";
import Input from "@/ui/components/shared/input/Input";
import { ERROR_MESSAGES } from "@/enums/general";
import Button from "@/ui/components/shared/button/Button";
import { login, sendEmailVerification } from "@/lib/firebase/actions/auth-actions";
import useUserStore from "@/stores/user-store";
import useMenuStore from "@/stores/menu-store";
import { RxCaretLeft } from "@/imports/icons";
import useNotificationProviderStore from "@/stores/notification-provider-store";
import { Logger } from "@/classes/Logger";

interface AccountModalSkippedUserLoginProps {
  setCurrentView: React.Dispatch<React.SetStateAction<string[]>>;
}

const AccountModalSkippedUserLogin = ({ setCurrentView }: AccountModalSkippedUserLoginProps) => {
  const { setCurrentUser, setIsUserLoggedIn, resetUserPassword } = useUserStore();
  const { setSelectedOption } = useMenuStore();
  const { addNotification } = useNotificationProviderStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorState, setErrorState] = useState<Error[] | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLoginClick = async () => {
    if (!checkInputsValid()) {
      return;
    }

    try {
      const user = await login(email, password, true);
      if (user) {
        const emailVerified = user.authUser?.emailVerified;
        if (!emailVerified) {
          setCurrentView(["signup", "emailVerification"]);
          await sendEmailVerification();
          return;
        }
        Logger.getInstance().info(`User logged in: ${user}`);
        setCurrentUser(user);
        setIsUserLoggedIn(true);
        addNotification({
          type: "success",
          message: "Logged in successfully",
        });
        setSelectedOption(null);
      }
    } catch (error: any) {
      Logger.getInstance().error(`Error logging in: ${error}`);
      const formErrorMessage =
        error.message === ERROR_MESSAGES.NO_INTERNET_CONNECTION
          ? ERROR_MESSAGES.NO_INTERNET_CONNECTION
          : ERROR_MESSAGES.INVALID_CREDENTIALS;
      setErrorState([
        {
          name: "email-input",
          message: "",
        },
        {
          name: "password-input",
          message: "",
        },
        {
          name: "form-input",
          message: formErrorMessage,
        },
      ]);
    }
  };

  const checkInputsValid = () => {
    let errors: Error[] = [];

    if (email === "") {
      errors.push({
        name: "email-input",
        message: ERROR_MESSAGES.EMAIL_REQUIRED,
      });
    }

    if (password === "") {
      errors.push({
        name: "password-input",
        message: ERROR_MESSAGES.PASSWORD_REQUIRED,
      });
    }

    setErrorState(errors);

    return errors.length === 0;
  };

  const removeError = (field: string) => {
    if (!errorState) return;
    if (field === "form-input") {
      setErrorState(null);
      return;
    }
    setErrorState(errorState.filter((error) => error.name !== field));
  };

  const handleForgotPasswordClick = async () => {
    try {
      await resetUserPassword(email);
      addNotification({
        type: "success",
        message: "Password reset email sent",
      });
      setShowForgotPassword(false);
      setEmail("");
      Logger.getInstance().info("Password reset email sent");
    } catch (error: any) {
      Logger.getInstance().error(`Error sending password reset email: ${error}`);
      addNotification({
        type: "error",
        message: "Error sending password reset email",
      });
    }
  };

  return (
    <>
      {!showForgotPassword ? (
        <div className={styles.accountModalSkippedUser__container}>
          <div>
            <p className={styles.accountModalSkippedUser__title}>Welcome Back!</p>
            <p className={styles.accountModalSkippedUser__subTitle}>
              Log in to tune into your personalized lo-fi focus space.
            </p>
          </div>

          <div className={styles.accountModalSkippedUser__inputs_container}>
            <Input
              name="email-input"
              placeholder="Email Address"
              className={styles.accountModalSkippedUser__input}
              type="text"
              onChange={(e) => {
                removeError("email-input");
                removeError("form-input");
                setEmail(e.target.value);
              }}
              errorState={errorState}
              value={email}
              transparentBackground
            />

            <Input
              name="password-input"
              placeholder="Password"
              className={styles.accountModalSkippedUser__input}
              type="password"
              onChange={(e) => {
                removeError("password-input");
                removeError("form-input");
                setPassword(e.target.value);
              }}
              errorState={errorState}
              value={password}
              transparentBackground
            />
            {errorState && errorState.find((error) => error.name === "form-input") && (
              <p className={styles.signin__form_error_text}>
                {errorState.find((error) => error.name === "form-input")?.message}
              </p>
            )}
          </div>

          <Button
            id="account-modal-sign-in-button"
            text="Dive In"
            onClick={handleLoginClick}
            containerClassName={styles.accountModalSkippedUser__continue_button}
            showLoadingState={true}
          />

          <p
            className={styles.accountModalSkippedUser__have_account_text}
            style={{
              marginTop: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot your password?
          </p>
          <div>
            <p
              style={{
                marginTop: 30,
              }}
              className={styles.accountModalSkippedUser__have_account_text}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onClick={() => setCurrentView(["signup"])}
            >
              Don't have an Account? Sign up for Free!
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.accountModalSkippedUser__container} style={{ position: "relative" }}>
          <div
            className={styles.accountModalSkippedUser__back_button}
            onClick={() => setShowForgotPassword(false)}
          >
            <RxCaretLeft size={25} color="var(--color-white)" />
            <p>Back</p>
          </div>
          <p className={styles.accountModalSkippedUser__title}>
            Forgot Your <br />
            Password?
          </p>
          <p className={styles.accountModalSkippedUser__subTitle} style={{ width: "32ch" }}>
            No worries! Drop your email and we’ll send you a link to reset your password.
          </p>
          <form
            autoComplete="off"
            className={styles.forgotPassword__inputs_container}
            style={{ marginTop: 20 }}
          >
            <Input
              name="email-input"
              placeholder="Email Address"
              className={styles.accountModalSkippedUser__input}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              transparentBackground
            />
          </form>
          <Button
            id="send-reset-link-button"
            text="Send Reset Link"
            onClick={handleForgotPasswordClick}
            containerClassName={styles.accountModalSkippedUser__continue_button}
            disable={email === ""}
            showLoadingState={true}
            style={{ width: 250 }}
          />
        </div>
      )}
    </>
  );
};

export default AccountModalSkippedUserLogin;
