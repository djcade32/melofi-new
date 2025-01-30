import Modal from "@/ui/components/shared/modal/Modal";
import React, { useState } from "react";
import styles from "./reauthenticateModal.module.css";
import Input from "@/ui/components/shared/input/Input";
import Button from "@/ui/components/shared/button/Button";
import useUserStore from "@/stores/user-store";

interface ReauthenticateModalProps {
  isOpen: boolean;
  closeModal: () => void;
  email: string;
}

const ReauthenticateModal = ({ isOpen, closeModal, email }: ReauthenticateModalProps) => {
  const { reAuthenticateUser, changeUserEmail } = useUserStore();
  const [password, setPassword] = useState("");

  const handleCancel = () => {
    closeModal();
    setPassword("");
  };

  const handleSubmit = async () => {
    try {
      await reAuthenticateUser(password, async () => changeUserEmail(email));
      closeModal();
      setPassword("");
    } catch (error) {
      console.log("Error reauthenticating user: ", error);
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
          Enter your password to make changes to your account.
        </p>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.reauthenticateModal__input}
          placeholder="Enter Password"
          passwordIconSize={20}
        />
        <div className={styles.reauthenticateModal__buttons_container}>
          <Button
            id="reauthenticate-modal-confirm"
            text="Cancel"
            containerClassName={styles.reauthenticateModal__button}
            onClick={handleCancel}
          />
          <Button
            id="reauthenticate-modal-confirm"
            text="Submit"
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
