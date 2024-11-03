import React, { useState } from "react";
import styles from "./signin.module.css";
import Input from "@/ui/components/shared/input/Input";
import Button from "@/ui/components/shared/button/Button";
import { AuthViewProps } from "@/types/interfaces";

const Signin = ({ setOnboardingStep }: AuthViewProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);

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
            placeholder="Email Address"
            className={styles.signin__credentials_input}
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Create Password"
            className={styles.signin__credentials_input}
            type="password"
            onFocus={() => setShowPasswordRules(true)}
            onBlur={() => setShowPasswordRules(false)}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        <div className={styles.signin__credentials_button_checkbox_container}>
          <Button
            id="sign-up-button"
            text="Dive In"
            onClick={() => {}}
            containerClassName={styles.signin__continue_button}
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
