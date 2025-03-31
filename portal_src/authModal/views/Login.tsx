import React, { useState } from "react";
import styles from "../authModal.module.css";
import Input from "@/ui/components/shared/input/Input";
import { ERROR_MESSAGES } from "@/enums/general";
import { login, sendEmailVerification } from "@/lib/firebase/actions/auth-actions";
import useUserStore from "@/stores/user-store";
import Button from "@/ui/components/shared/button/Button";

interface LoginProps {
  handleViewChange: (view: "login" | "signup" | "forgotPassword" | "emailVerification") => void;
}

const Login = ({ handleViewChange }: LoginProps) => {
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
      const emailVerified = user.authUser?.emailVerified;
      if (!emailVerified) {
        handleViewChange("emailVerification");
        await sendEmailVerification();
        return;
      }
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        flex: 1,
      }}
    >
      <h1 style={{ marginBottom: 15 }}>Welcome Back!</h1>
      <form autoComplete="off" className={styles.authModal__form}>
        <div className={styles.authModal__form_input_container}>
          <Input
            name="email-input"
            placeholder="Email Address"
            className={styles.authModal__input}
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
        </div>
        <div className={styles.authModal__form_input_container}>
          <Input
            name="password-input"
            placeholder="Password"
            className={styles.authModal__input}
            type="password"
            onChange={(e) => {
              removeError("password-input");
              removeError("form-input");
              setPassword(e.target.value);
            }}
            errorState={errorState}
            value={password}
            transparentBackground
            variant="secondary"
          />
        </div>
        {errorState && errorState.find((error) => error.name === "form-input") && (
          <p className={styles.authModal__form_error_text}>{ERROR_MESSAGES.INVALID_CREDENTIALS}</p>
        )}
      </form>
      <div>
        <Button
          id="portal-login-in-button"
          text="Sign In"
          onClick={handleLoginClick}
          containerClassName={styles.authModal__button}
          textClassName={styles.authModal__button_text}
          showLoadingState={true}
        />
        <p
          className={styles.authModal__link_text}
          style={{
            marginTop: 30,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onClick={() => handleViewChange("forgotPassword")}
        >
          Forgot your password?
        </p>
      </div>

      <p
        className={styles.authModal__link_text}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecoration = "none";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = "underline";
        }}
        onClick={() => handleViewChange("signup")}
      >
        Don't have an Account? Sign up for Free!
      </p>
    </div>
  );
};

export default Login;
