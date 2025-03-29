import { ERROR_MESSAGES } from "@/enums/general";
import { signup } from "@/lib/firebase/actions/auth-actions";
import Input from "@/ui/components/shared/input/Input";
import { isValidEmail } from "@/utils/general";
import React, { useEffect, useState } from "react";
import styles from "../authModal.module.css";
import Checkbox from "@/ui/components/shared/checkbox/Checkbox";
import Button from "@/ui/components/shared/button/Button";

interface SignupProps {
  handleViewChange: (view: "login" | "signup" | "forgotPassword" | "emailVerification") => void;
}

const Signup = ({ handleViewChange }: SignupProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorState, setErrorState] = useState<Error[] | null>(null);
  const [newsletterChecked, setNewsletterChecked] = useState(true);
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const handleSignupPress = async () => {
    if (!checkInputsValid()) {
      return false;
    }
    try {
      const user = await signup(email, password, firstName, newsletterChecked);
      console.log("User created: ", user);
      user && handleViewChange("emailVerification");
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

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          flex: 1,
        }}
      >
        <div>
          <h1>Join Melofi</h1>
        </div>

        <form autoComplete="off" className={styles.authModal__form}>
          <div className={styles.authModal__form_input_container}>
            <Input
              name="firstName-input"
              placeholder="First Name"
              className={styles.authModal__input}
              type="text"
              onChange={(e) => {
                removeError("firstName-input");
                setFirstName(e.target.value);
              }}
              errorState={errorState}
              value={firstName}
              transparentBackground
            />
          </div>

          <div className={styles.authModal__form_input_container}>
            <Input
              name="email-input"
              placeholder="Email Address"
              className={styles.authModal__input}
              type="text"
              onChange={(e) => {
                removeError("email-input");
                setEmail(e.target.value);
              }}
              errorState={errorState}
              value={email}
              transparentBackground
            />
          </div>

          <div className={styles.authModal__form_input_container}>
            <Input
              name="password-input"
              placeholder="Create Password"
              className={styles.authModal__input}
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
              transparentBackground
              variant="secondary"
            />
          </div>
          {showPasswordRules && (
            <p className={styles.authModal__password_rules}>
              Password should be at least 8 characters, contain uppercase letters, and numbers.
            </p>
          )}
        </form>

        <div className={styles.authModal__checkbox_container}>
          <Checkbox
            aria-label="credentials-newsletter-checkbox"
            id="credentials-newsletter-checkbox"
            text="Subscribe to our weekly newsletter to receive productivity tips."
            onClick={() => setNewsletterChecked((prev) => !prev)}
            textClassName={styles.authModal__checkbox}
            value={newsletterChecked}
          />
          <Button
            id="account-modal-sign-up-button"
            text="Let's Go!"
            onClick={handleSignupPress}
            containerClassName={styles.authModal__button}
            textClassName={styles.authModal__button_text}
            showLoadingState={true}
          />
          <p className={styles.authModal__terms_and_policy_text}>By proceeding, you agree to our</p>

          <p className={styles.authModal__terms_and_policy_text} style={{ marginTop: -5 }}>
            <span onClick={() => window.open("/legal/terms-and-conditions")}>
              Terms & Conditions
            </span>{" "}
            and <span onClick={() => window.open("/legal/privacy-policy")}>Privacy Policy</span>
          </p>
        </div>

        <div>
          <p
            style={{
              marginTop: 30,
            }}
            className={styles.authModal__link_text}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onClick={() => handleViewChange("login")}
          >
            Already have an Account?
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
