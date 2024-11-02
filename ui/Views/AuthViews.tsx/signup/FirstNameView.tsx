import React, { ChangeEvent, CSSProperties, useState } from "react";
import styles from "./signup.module.css";
import Button from "@/ui/components/shared/button/Button";

const FirstNameView = () => {
  const [align, setAlign] = useState<CSSProperties["textAlign"]>("center"); // Set default alignment to center
  const [width, setWidth] = useState(253);
  const [name, setName] = useState("");

  const handleFocus = () => {
    if (name === "") {
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
    setName(event.target.value);
  };

  return (
    <div className={styles.signup__container}>
      <div style={{ marginTop: 80 }}>
        <p className={styles.signup__title}>Your Lo-fi Journey Begins Here</p>
        <p className={styles.signup__subtitle}>What should we call you?</p>
      </div>
      <div>
        <input
          className={styles.signup__input}
          type="text"
          placeholder="First Name"
          onFocus={handleFocus}
          onBlur={handleInput} // Check alignment when the input loses focus
          onInput={handleInput} // Check alignment as user types
          style={{ textAlign: align, width: width }}
        />
      </div>
      <div style={{ marginTop: 30 }}>
        <Button
          id="sign-up-button"
          text="Continue"
          onClick={() => {}}
          containerClassName={styles.signup__continue_button}
          disable={name === ""}
        />
      </div>

      <div
        //Align div to bottom of the container
        className={styles.signup__have_account_container}
      >
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
      </div>
    </div>
  );
};

export default FirstNameView;
