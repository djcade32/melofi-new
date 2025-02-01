import Modal from "@/ui/components/shared/modal/Modal";
import React, { useState } from "react";
import styles from "./reauthenticateModal.module.css";
import Input from "@/ui/components/shared/input/Input";
import Button from "@/ui/components/shared/button/Button";
import useUserStore from "@/stores/user-store";

interface ReauthenticateModalProps {
  isOpen: boolean;
  closeModal: () => void;
  data: {
    email: string;
    password: string;
  };
}

const ReauthenticateModal = ({ isOpen, closeModal, data }: ReauthenticateModalProps) => {
  const { reAuthenticateUser, changeUserEmail, changePassword } = useUserStore();
  const [password, setPassword] = useState("");
  const [showVerificationEmailSent, setShowVerificationEmailSent] = useState(false);

  const handleCancel = () => {
    closeModal();
    setPassword("");
  };

  const handleSubmit = async () => {
    if (showVerificationEmailSent) {
      closeModal();
      setPassword("");
      setShowVerificationEmailSent(false);
      return;
    }
    if (data.email) {
      try {
        await reAuthenticateUser(password, async () => changeUserEmail(data.email));
        setShowVerificationEmailSent(true);
      } catch (error) {
        console.log("Error reauthenticating user: ", error);
      }
    } else if (data.password) {
      try {
        await reAuthenticateUser(password, async () => changePassword(data.password));
        closeModal();
        setPassword("");
      } catch (error) {
        console.log("Error reauthenticating user: ", error);
      }
    }
  };

  return (
    <Modal
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              id="reauthenticate-modal-confirm"
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
            disable={password.trim() === ""}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReauthenticateModal;
