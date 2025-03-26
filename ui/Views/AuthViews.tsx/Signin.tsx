import React, { useState } from "react";
import styles from "./signin.module.css";
import Input from "@/ui/components/shared/input/Input";
import Button from "@/ui/components/shared/button/Button";
import { AuthViewProps } from "@/types/general";
import { login } from "@/lib/firebase/actions/auth-actions";
import useUserStore from "@/stores/user-store";
import { ERROR_MESSAGES } from "@/enums/general";

const Signin = ({ setOnboardingStep }: AuthViewProps) => {
  const { setCurrentUser, setIsUserLoggedIn } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorState, setErrorState] = useState<Error[] | null>(null);

  const handleLoginClick = async () => {
    if (!checkInputsValid()) {
      return;
    }

    try {
      const user = await login(email, password);
      console.log("User logged in: ", user);
      setCurrentUser(user);
      setIsUserLoggedIn(true);
    } catch (error: any) {
      console.log("Error logging in: ", error);
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
          message: "",
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

  return (
    <div className={styles.signin__container}>
      <div className={styles.signin__credentials_content_container}>
        <p className={styles.signin__title}>Welcome Back!</p>
        <p
          className={styles.signin__subtitle}
          style={{
            fontWeight: "normal",
            width: "30ch",
            lineHeight: 1.25,
            fontSize: 18,
          }}
        >
          Log in to tune into your personalized lo-fi focus space.
        </p>
        <form autoComplete="off" className={styles.signin__credentials_inputs_container}>
          <Input
            name="email-input"
            placeholder="Email Address"
            className={styles.signin__credentials_input}
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
            placeholder="Create Password"
            className={styles.signin__credentials_input}
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
            <p className={styles.signin__form_error_text}>{ERROR_MESSAGES.INVALID_CREDENTIALS}</p>
          )}
        </form>
        <div>
          <Button
            id="sign-in-button"
            text="Dive In"
            onClick={handleLoginClick}
            containerClassName={styles.signin__continue_button}
            showLoadingState={true}
          />
          <p
            className={styles.signin__have_account_text}
            style={{
              marginTop: 30,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onClick={() => setOnboardingStep(2)}
          >
            Forgot your password?
          </p>
        </div>

        <p
          className={styles.signin__have_account_text}
          style={{
            position: "absolute",
            bottom: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onClick={() => setOnboardingStep((prev) => prev - 1)}
        >
          Don't have an Account? Sign up for Free!
        </p>
      </div>
    </div>
  );
};

export default Signin;
