import React, { useState } from "react";
import styles from "../accountModalSkippedUser.module.css";
import Input from "@/ui/components/shared/input/Input";
import { ERROR_MESSAGES } from "@/enums/general";
import Button from "@/ui/components/shared/button/Button";
import { login } from "@/lib/firebase/actions/auth-actions";
import useUserStore from "@/stores/user-store";
import useMenuStore from "@/stores/menu-store";

interface AccountModalSkippedUserLoginProps {
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const AccountModalSkippedUserLogin = ({ setCurrentView }: AccountModalSkippedUserLoginProps) => {
  const { setCurrentUser, setIsUserLoggedIn } = useUserStore();
  const { setSelectedOption, selectedOption } = useMenuStore();

  const [firstName, setFirstName] = useState("");
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
          name: "firstName",
          message: "",
        },
        {
          name: "email",
          message: "",
        },
        {
          name: "password",
          message: "",
        },
        {
          name: "form",
          message: "",
        },
      ]);
    }
  };

  const checkInputsValid = () => {
    let errors: Error[] = [];

    if (firstName === "") {
      errors.push({
        name: "firstName",
        message: ERROR_MESSAGES.FIRST_NAME_REQUIRED,
      });
    }

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

    setErrorState(errors);

    return errors.length === 0;
  };

  const removeError = (field: string) => {
    if (!errorState) return;
    if (field === "form") {
      setErrorState(null);
      return;
    }
    setErrorState(errorState.filter((error) => error.name !== field));
  };

  const closeAccountModal = () => {
    setSelectedOption(null);
  };

  return (
    <div className={styles.accountModalSkippedUser__container}>
      {/* TODO: Add close icon */}
      <div>
        <p className={styles.accountModalSkippedUser__title}>Join Melofi & Stay in Flow</p>
        <p className={styles.accountModalSkippedUser__subTitle}>
          Work Smarter, Stay Relaxed, and Get More Done with Melofi.
        </p>
      </div>

      <div className={styles.accountModalSkippedUser__inputs_container}>
        <Input
          name="firstName"
          placeholder="First Name"
          className={styles.accountModalSkippedUser__input}
          type="text"
          onChange={(e) => {
            removeError("firstName");
            removeError("form");
            setFirstName(e.target.value);
          }}
          errorState={errorState}
          value={firstName}
        />

        <Input
          name="email"
          placeholder="Email Address"
          className={styles.accountModalSkippedUser__input}
          type="text"
          onChange={(e) => {
            removeError("email");
            removeError("form");
            setEmail(e.target.value);
          }}
          errorState={errorState}
          value={email}
        />

        <Input
          name="password"
          placeholder="Create Password"
          className={styles.accountModalSkippedUser__input}
          type="password"
          onChange={(e) => {
            removeError("password");
            removeError("form");
            setPassword(e.target.value);
          }}
          errorState={errorState}
          value={password}
        />
        {errorState && errorState.find((error) => error.name === "form") && (
          <p className={styles.signin__form_error_text}>{ERROR_MESSAGES.INVALID_CREDENTIALS}</p>
        )}
      </div>

      <Button
        id="account-modal-sign-up-button"
        text="Let's Go!"
        onClick={handleLoginClick}
        containerClassName={styles.accountModalSkippedUser__continue_button}
        showLoadingState={true}
      />
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
          onClick={() => {}}
        >
          Already have and account?
        </p>
      </div>
    </div>
  );
};

export default AccountModalSkippedUserLogin;
