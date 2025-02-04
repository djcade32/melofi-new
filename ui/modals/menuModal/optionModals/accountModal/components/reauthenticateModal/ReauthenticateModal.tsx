import Modal from "@/ui/components/shared/modal/Modal";
import React, { useState } from "react";
import styles from "./reauthenticateModal.module.css";
import Input from "@/ui/components/shared/input/Input";
import Button from "@/ui/components/shared/button/Button";
import useUserStore from "@/stores/user-store";
import { DialogModalActions } from "@/types/general";

interface ReauthenticateModalProps {
  isOpen: boolean;
  closeModal: () => void;
  data: {
    email?: string;
    password?: string;
    deleteAccount?: boolean;
  };
  handleDeleteAccount?: () => void;
}

const ReauthenticateModal = ({
  isOpen,
  closeModal,
  data,
  handleDeleteAccount,
}: ReauthenticateModalProps) => {
  const { reAuthenticateUser, changeUserEmail, changePassword } = useUserStore();
  const [passwordInput, setPasswordInput] = useState("");
  const [showVerificationEmailSent, setShowVerificationEmailSent] = useState(false);

  const handleCancel = () => {
    closeModal();
    setPasswordInput("");
  };

  const handleSubmit = async () => {
    if (showVerificationEmailSent) {
      closeModal();
      setPasswordInput("");
      setShowVerificationEmailSent(false);
      return;
    }
    const { password, email, deleteAccount } = data;
    if (email) {
      try {
        await reAuthenticateUser(passwordInput, async () => changeUserEmail(email));
        setShowVerificationEmailSent(true);
      } catch (error) {
        console.log("Error reauthenticating user: ", error);
      }
    } else if (password) {
      try {
        await reAuthenticateUser(password, async () => changePassword(password));
        closeModal();
        setPasswordInput("");
      } catch (error) {
        console.log("Error reauthenticating user: ", error);
      }
    } else if (deleteAccount) {
      try {
        await reAuthenticateUser(passwordInput, async () => {
          handleDeleteAccount && handleDeleteAccount();
        });
        closeModal();
        setPasswordInput("");
      } catch (error) {
        console.log("Error reauthenticating user: ", error);
      }
    }
  };

  return (
    <Modal
      id="reauthenticate-modal"
      isOpen={isOpen}
      close={closeModal}
      className={styles.reauthenticateModal__container}
      showCloseIcon={false}
      style={{
        zIndex: isOpen ? 100 : -1,
      }}
    >
      <div className={styles.reauthenticateModal__content}>
        <p className={styles.reauthenticateModal__text}>
          {showVerificationEmailSent
            ? `Verification email sent to ${data.email}. Please verify your email to continue.`
            : "Enter your password to make changes to your account."}
        </p>
        {!showVerificationEmailSent && (
          <Input
            name="password-input"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className={styles.reauthenticateModal__input}
            placeholder="Enter Password"
            passwordIconSize={20}
          />
        )}
        <div
          className={styles.reauthenticateModal__buttons_container}
          style={{ justifyContent: showVerificationEmailSent ? "center" : "space-between" }}
        >
          {!showVerificationEmailSent && (
            <Button
              id="reauthenticate-modal-cancel"
              text="Cancel"
              containerClassName={styles.reauthenticateModal__button}
              onClick={handleCancel}
            />
          )}
          <Button
            id="reauthenticate-modal-confirm"
            text={showVerificationEmailSent ? "Continue" : "Submit"}
            containerClassName={styles.reauthenticateModal__button}
            onClick={handleSubmit}
            style={{ backgroundColor: "var(--color-effect-opacity)" }}
            disable={passwordInput.trim() === ""}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReauthenticateModal;
