import React, { useState } from "react";
import styles from "./signup.module.css";
import { RxCaretLeft, RxCaretRight } from "@/imports/icons";
import Input from "@/ui/components/shared/input/Input";
import Button from "@/ui/components/shared/button/Button";
import Checkbox from "@/ui/components/shared/checkbox/Checkbox";
import { AuthViewProps, Error } from "@/types/interfaces";
import useUserStore from "@/stores/user-store";
import { signup } from "@/lib/firebase/actions/auth-actions";
import { isValidEmail } from "@/utils/general";
import { ERROR_MESSAGES } from "@/enums/general";

interface CredentialsViewProps extends AuthViewProps {
  setAuthViewStep: React.Dispatch<React.SetStateAction<number>>;
  firstName: string;
}

const CredentialsView = ({
  setOnboardingStep,
  setAuthViewStep,
  firstName,
}: CredentialsViewProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [errorState, setErrorState] = useState<Error[] | null>(null);
  const [newsletterChecked, setNewsletterChecked] = useState(true);

  const { setCurrentUser } = useUserStore();

  const handleSignupPress = async () => {
    if (!checkInputsValid()) {
      return false;
    }
    try {
      const user = await signup(email, password, firstName, newsletterChecked);
      console.log("User created: ", user);
      setOnboardingStep((prev) => prev + 1);
      return true;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setErrorState([
          {
            name: "email",
            message: ERROR_MESSAGES.EMAIL_ALREADY_IN_USE,
          },
        ]);
      }
      console.log("Error creating account: ", error);
      return false;
    }
  };

  const getErrorMessage = (): Error[] => {
    let errors: Error[] = [];

    if (email === "") {
      errors.push({
        name: "email",
        message: ERROR_MESSAGES.EMAIL_REQUIRED,
      });
    }
    if (password === "") {
      errors.push({
        name: "password",
        message: ERROR_MESSAGES.PASSWORD_REQUIRED,
      });
    }

    if (!isValidEmail(email)) {
      errors.push({
        name: "email",
        message: ERROR_MESSAGES.INVALID_EMAIL,
      });
    }

    // Check if password is invalid
    if (password === "") {
      errors.push({
        name: "password",
        message: ERROR_MESSAGES.PASSWORD_REQUIRED,
      });
    } else if (password.length < 8 || !password.match(/[A-Z]/) || !password.match(/[0-9]/)) {
      errors.push({
        name: "password",
        message: ERROR_MESSAGES.PASSWORD_WEAK,
      });
    }
    return errors;
  };

  const checkInputsValid = () => {
    const errors = getErrorMessage();
    setErrorState(errors.length ? errors : null);
    return errors.length === 0;
  };

  const removeError = (field: string) => {
    if (!errorState) return;
    setErrorState(errorState.filter((error) => error.name !== field));
  };

  return (
    <div className={styles.signup__container}>
      <div className={styles.signup__header}>
        <div
          id="back-button"
          className={styles.signup__back_button}
          onClick={() => setOnboardingStep((prev) => prev - 1)}
          aria-label="back-button"
        >
          <RxCaretLeft size={25} color="var(--color-white)" />
          <p>Back</p>
        </div>
      </div>
      <div className={styles.signup__content_container}>
        <p className={styles.signup__title}>Your Access to Lo-fi Focus Awaits</p>
        <p
          className={styles.signup__subtitle}
          style={{
            fontWeight: "normal",
            width: "30ch",
            lineHeight: 1.25,
            fontSize: 18,
          }}
        >
          Almost there! Drop your email and a solid password to secure your spot in the Melofi zone.
        </p>
        <form autoComplete="off" className={styles.signup__credentials_inputs_container}>
          <Input
            aria-label="email"
            name="email"
            placeholder="Email Address"
            className={styles.signup__credentials_input}
            type="text"
            onChange={(e) => {
              removeError("email");
              setEmail(e.target.value);
            }}
            value={email}
            errorState={errorState}
          />
          <Input
            aria-label="password"
            name="password"
            placeholder="Create Password"
            className={styles.signup__credentials_input}
            type="password"
            onFocus={() => {
              !errorState?.find((error) => error.name === "password") && setShowPasswordRules(true);
            }}
            onBlur={() => setShowPasswordRules(false)}
            onChange={(e) => {
              removeError("password");
              setPassword(e.target.value);
            }}
            value={password}
            errorState={errorState}
          />
          {showPasswordRules && (
            <p className={styles.signup__credentials_input_rules}>
              Password should be at least 8 characters, contain uppercase letters, and numbers.
            </p>
          )}
        </form>
        <div
          className={styles.signup__credentials_button_checkbox_container}
          style={{
            marginTop: errorState?.find((error) => error.name === "password") ? 35 : 65,
          }}
        >
          <Checkbox
            aria-label="credentials-newsletter-checkbox"
            id="credentials-newsletter-checkbox"
            text="Subscribe to our weekly newsletter to receive productivity tips."
            onClick={() => setNewsletterChecked((prev) => !prev)}
            textClassName={styles.signup__credentials_checkbox}
            value={newsletterChecked}
          />
          <Button
            aria-label="sign-up-button"
            id="sign-up-button"
            text="Let's Go!"
            onClick={handleSignupPress}
            containerClassName={styles.signup__continue_button}
            hoverClassName={styles.signup__continue_button_hover}
            showLoadingState={true}
          />

          <p className={styles.signup__terms_and_policy_text}>By proceeding, you agree to our </p>

          <p className={styles.signup__terms_and_policy_text} style={{ marginTop: -5 }}>
            <span>Terms of Service</span> and <span>Privacy Policy</span>
          </p>
        </div>

        <div className={styles.signup__credentials_footer}>
          <p
            className={styles.signup__have_account_text}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onClick={() => setAuthViewStep(1)}
            aria-label="Already have an account?"
          >
            Already have an account?
          </p>
          <div>
            <p
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
              onClick={() =>
                setCurrentUser({
                  name: firstName,
                  skippedOnboarding: true,
                })
              }
              className={`${styles.signup__have_account_text} ${styles.signup__skip_and_continue_text}`}
              aria-label="Skip and continue as guest"
              id="skip-and-continue"
            >
              Skip and continue as guest
              <RxCaretRight size={25} color="var(--color-white)" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredentialsView;
