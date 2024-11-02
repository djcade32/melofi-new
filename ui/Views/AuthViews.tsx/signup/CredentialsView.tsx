import React, { useState } from "react";
import styles from "./signup.module.css";
import { RxCaretLeft, RxCaretRight } from "@/imports/icons";
import Input from "@/ui/components/shared/input/Input";
import Button from "@/ui/components/shared/button/Button";
import Checkbox from "@/ui/components/shared/checkbox/Checkbox";

const CredentialsView = () => {
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  return (
    <div className={styles.signup__container}>
      <div className={styles.signup__header}>
        <div className={styles.signup__back_button} onClick={() => {}}>
          <RxCaretLeft size={25} color="var(--color-secondary-white)" />
          <p>Back</p>
        </div>
      </div>
      <div className={styles.signup__credentials_content_container}>
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
            placeholder="Email Address"
            className={styles.signup__credentials_input}
            type="text"
          />
          <Input
            placeholder="Create Password"
            className={styles.signup__credentials_input}
            type="password"
            onFocus={() => setShowPasswordRules(true)}
            onBlur={() => setShowPasswordRules(false)}
          />
          {showPasswordRules && (
            <p className={styles.signup__credentials_input_rules}>
              Password should be at least 8 characters, contain uppercase letters, and numbers.
            </p>
          )}
        </form>
        <div className={styles.signup__credentials_button_checkbox_container}>
          <Checkbox
            id="credentials-newsletter-checkbox"
            text="Subscribe to our weekly newsletter to receive productivity tips."
            onClick={() => {}}
            textClassName={styles.signup__credentials_checkbox}
          />
          <Button
            id="sign-up-button"
            text="Let's Go!"
            onClick={() => {}}
            containerClassName={styles.signup__continue_button}
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
            onClick={() => {}}
          >
            Already have and account?
          </p>
          <div>
            <p
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
              onClick={() => {}}
              className={`${styles.signup__have_account_text} ${styles.signup__skip_and_continue_text}`}
            >
              Skip and continue as guest
              <RxCaretRight size={25} color="var(--color-secondary-white)" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredentialsView;
