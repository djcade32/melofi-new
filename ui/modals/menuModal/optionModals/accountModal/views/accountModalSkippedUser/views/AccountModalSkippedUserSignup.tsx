import React, { useEffect, useState } from "react";
import styles from "../accountModalSkippedUser.module.css";
import Input from "@/ui/components/shared/input/Input";
import { ERROR_MESSAGES } from "@/enums/general";
import Button from "@/ui/components/shared/button/Button";
import { sendEmailVerification, signup } from "@/lib/firebase/actions/auth-actions";
import useUserStore from "@/stores/user-store";
import useMenuStore from "@/stores/menu-store";
import { isValidEmail } from "@/utils/general";
import Checkbox from "@/ui/components/shared/checkbox/Checkbox";
import useNotificationProviderStore from "@/stores/notification-provider-store";

interface AccountModalSkippedUserSignupProps {
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const AccountModalSkippedUserSignup = ({ setCurrentView }: AccountModalSkippedUserSignupProps) => {
  const { setCurrentUser, setIsUserLoggedIn } = useUserStore();
  const { setSelectedOption, selectedOption } = useMenuStore();
  const { addNotification } = useNotificationProviderStore();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorState, setErrorState] = useState<Error[] | null>(null);
  const [newsletterChecked, setNewsletterChecked] = useState(true);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);

  useEffect(() => {
    if (selectedOption === "Account") {
      setFirstName("");
      setEmail("");
      setPassword("");
      setErrorState(null);
    }
  }, [selectedOption]);

  const handleSignupPress = async () => {
    if (!checkInputsValid()) {
      return false;
    }
    try {
      const user = await signup(email, password, firstName, newsletterChecked);
      console.log("User created: ", user);
      user && setShowVerifyEmail(true);
      return true;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setErrorState([
          {
            name: "email-input",
            message: ERROR_MESSAGES.EMAIL_ALREADY_IN_USE,
          },
        ]);
      }
      console.log("Error creating account: ", error);
      return false;
    }
  };

  const checkInputsValid = () => {
    const errors = getErrorMessage();
    setErrorState(errors.length ? errors : null);
    return errors.length === 0;
  };

  const getErrorMessage = (): Error[] => {
    let errors: Error[] = [];

    if (firstName === "") {
      errors.push({
        name: "firstName-input",
        message: ERROR_MESSAGES.FIRST_NAME_REQUIRED,
      });
    }

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

    if (!isValidEmail(email)) {
      errors.push({
        name: "email-input",
        message: ERROR_MESSAGES.INVALID_EMAIL,
      });
    }

    // Check if password is invalid
    if (password === "") {
      errors.push({
        name: "password-input",
        message: ERROR_MESSAGES.PASSWORD_REQUIRED,
      });
    } else if (password.length < 8 || !password.match(/[A-Z]/) || !password.match(/[0-9]/)) {
      errors.push({
        name: "password-input",
        message: ERROR_MESSAGES.PASSWORD_WEAK,
      });
    }
    return errors;
  };

  const removeError = (field: string) => {
    if (!errorState) return;

    setErrorState(errorState.filter((error) => error.name !== field));
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
    <>
      {!showVerifyEmail ? (
        <div className={styles.accountModalSkippedUser__container}>
          <div>
            <p className={styles.accountModalSkippedUser__title}>Join Melofi & Stay in Flow</p>
            <p className={styles.accountModalSkippedUser__subTitle}>
              Work Smarter, Stay Relaxed, and Get More Done with Melofi.
            </p>
          </div>

          <div className={styles.accountModalSkippedUser__inputs_container}>
            <Input
              name="firstName-input"
              placeholder="First Name"
              className={styles.accountModalSkippedUser__input}
              type="text"
              onChange={(e) => {
                removeError("firstName-input");
                setFirstName(e.target.value);
              }}
              errorState={errorState}
              value={firstName}
            />

            <Input
              name="email-input"
              placeholder="Email Address"
              className={styles.accountModalSkippedUser__input}
              type="text"
              onChange={(e) => {
                removeError("email-input");
                setEmail(e.target.value);
              }}
              errorState={errorState}
              value={email}
            />

            <Input
              name="password-input"
              placeholder="Create Password"
              className={styles.accountModalSkippedUser__input}
              type="password"
              onChange={(e) => {
                removeError("password-input");
                setPassword(e.target.value);
              }}
              onFocus={() => {
                !errorState?.find((error) => error.name === "password-input") &&
                  setShowPasswordRules(true);
              }}
              onBlur={() => setShowPasswordRules(false)}
              errorState={errorState}
              value={password}
              autoComplete="new-password"
            />
            {showPasswordRules && (
              <p className={styles.accountModalSkippedUser__credentials_input_rules}>
                Password should be at least 8 characters, contain uppercase letters, and numbers.
              </p>
            )}
          </div>

          <div className={styles.accountModalSkippedUser__credentials_button_checkbox_container}>
            <Checkbox
              aria-label="credentials-newsletter-checkbox"
              id="credentials-newsletter-checkbox"
              text="Subscribe to our weekly newsletter to receive productivity tips."
              onClick={() => setNewsletterChecked((prev) => !prev)}
              textClassName={styles.accountModalSkippedUser__credentials_checkbox}
              value={newsletterChecked}
            />
            <Button
              id="account-modal-sign-up-button"
              text="Let's Go!"
              onClick={handleSignupPress}
              containerClassName={styles.accountModalSkippedUser__continue_button}
              showLoadingState={true}
            />
            <p
              className={
                styles.accountModalSkippedUser__credentials_checkbox__terms_and_policy_text
              }
            >
              By proceeding, you agree to our{" "}
            </p>

            <p
              className={
                styles.accountModalSkippedUser__credentials_checkbox__terms_and_policy_text
              }
              style={{ marginTop: -5 }}
            >
              <span>Terms of Service</span> and <span>Privacy Policy</span>
            </p>
          </div>

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
              onClick={() => setCurrentView("login")}
            >
              Already have and account?
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.accountModalSkippedUser__container} style={{ position: "relative" }}>
          <p
            className={styles.accountModalSkippedUser__title}
            style={{ lineHeight: 1.2, fontSize: 32, marginBottom: 10 }}
          >
            One Last Step to <br />
            the Melofi Zone!
          </p>
          <p className={styles.accountModalSkippedUser__subTitle} style={{ width: "30ch" }}>
            We’ve sent a verification link to your email. Just click the link to confirm, and you’re
            all set to start your lo-fi journey with Melofi!
          </p>

          <Button
            id="verify-email-button"
            text="Let’s Get Focused"
            onClick={() => setCurrentView("login")}
            containerClassName={styles.accountModalSkippedUser__continue_button}
            style={{ width: 250 }}
          />
          <p
            style={{
              position: "absolute",
              bottom: 0,
              textAlign: "center",
              fontSize: 14,
              width: "70%",
            }}
          >
            Didn’t receive the email? Check your spam folder or {""}
            <span
              className={styles.accountModalSkippedUser__have_account_text}
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
      )}
    </>
  );
};

export default AccountModalSkippedUserSignup;
