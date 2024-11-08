import React, { ChangeEvent, CSSProperties, useState } from "react";
import styles from "./signup.module.css";
import Button from "@/ui/components/shared/button/Button";
import { AuthViewProps } from "@/types/interfaces";

interface FirstNameViewProps extends AuthViewProps {
  setAuthViewStep: React.Dispatch<React.SetStateAction<number>>;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  firstName: string;
}

const FirstNameView = ({
  setOnboardingStep,
  setAuthViewStep,
  setFirstName,
  firstName,
}: FirstNameViewProps) => {
  const [align, setAlign] = useState<CSSProperties["textAlign"]>("center"); // Set default alignment to center
  const [width, setWidth] = useState(253);

  const handleFocus = () => {
    if (firstName === "") {
      setAlign("left"); // Align cursor to the left when focused
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setAlign("left"); // Align text to the left if there is text
      setWidth(253);
    } else {
      // Center align if input is empty
      setAlign("center");
      setWidth(400);
    }
    setFirstName(event.target.value);
  };

  return (
    <div className={styles.signup__container}>
      <div style={{ marginTop: 80 }}>
        <p className={styles.signup__title}>Your Lo-fi Journey Begins Here</p>
        <p className={styles.signup__subtitle}>What should we call you?</p>
      </div>
      <div>
        <input
          name="first-name"
          aria-label="First Name"
          className={styles.signup__input}
          type="text"
          placeholder="First Name"
          onFocus={handleFocus}
          onBlur={handleInput} // Check alignment when the input loses focus
          onInput={handleInput} // Check alignment as user types
          style={{ textAlign: align, width: width }}
          value={firstName}
        />
      </div>
      <div style={{ marginTop: 30 }}>
        <Button
          aria-label="Continue"
          id="sign-up-button"
          text="Continue"
          onClick={() => setOnboardingStep((prev: number) => prev + 1)}
          containerClassName={styles.signup__continue_button}
          disable={firstName === ""}
          hoverClassName={styles.signup__continue_button_hover}
        />
      </div>

      <div
        //Align div to bottom of the container
        className={styles.signup__have_account_container}
      >
        <p
          aria-label="Already have an account?"
          className={styles.signup__have_account_text}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onClick={() => setAuthViewStep((prev) => prev + 1)}
        >
          Already have and account?
        </p>
      </div>
    </div>
  );
};

export default FirstNameView;
