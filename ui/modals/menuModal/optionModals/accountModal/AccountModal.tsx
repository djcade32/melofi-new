import useMenuStore from "@/stores/menu-store";
import React, { useEffect, useState } from "react";
import styles from "./accountModal.module.css";
import { IoCloseOutline } from "@/imports/icons";
import Input from "@/ui/components/shared/input/Input";
import useUserStore from "@/stores/user-store";
import Button from "@/ui/components/shared/button/Button";
import { DialogModalActions, Error } from "@/types/general";
import { ERROR_MESSAGES } from "@/enums/general";
import Modal from "@/ui/components/shared/modal/Modal";
import ReauthenticateModal from "./components/reauthenticateModal/ReauthenticateModal";
import { isValidEmail } from "@/utils/general";
import DialogModal from "@/ui/components/shared/dialogModal/DialogModal";

const AccountModal = () => {
  const { selectedOption, setSelectedOption } = useMenuStore();
  const { currentUser, changeFullName, clearUserData, deleteUserAccount } = useUserStore();

  const [fullname, setFullname] = useState(currentUser?.name);
  const [email, setEmail] = useState(currentUser?.authUser?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusNewPassword, setFocusNewPassword] = useState(false);
  const [errorState, setErrorState] = useState<Error[] | null>(null);
  const [showReauthenticateModal, setShowReauthenticateModal] = useState(false);
  const [reauthenticateData, setReauthenticateData] = useState<{
    email?: string;
    password?: string;
    deleteAccount?: boolean;
  }>({});
  const [showDialog, setShowDialog] = useState(0);
  const [dialopProps, setDialogProps] = useState<DialogModalActions | null>(null);

  const isOpenState = selectedOption === "Account";

  useEffect(() => {
    if (isOpenState) {
      setFullname(currentUser?.name);
      setEmail(currentUser?.authUser?.email || "");
      setNewPassword("");
      setConfirmPassword("");
      setErrorState(null);
      setShowReauthenticateModal(false);
    }
  }, [isOpenState]);

  const handleBackDropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.target === e.currentTarget && !showReauthenticateModal && setSelectedOption(null);
  };

  const handlePersonalInfoSave = async () => {
    if (fullname && fullname !== currentUser?.name) {
      await changeFullName(fullname);
    }
    if (email && email !== currentUser?.authUser?.email) {
      setShowReauthenticateModal(true);
      setReauthenticateData({ email, password: newPassword });
    }
  };

  const isValidPassword = (): boolean => {
    const errors: Error[] = [];

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      errors?.push({
        name: "newPassword",
        message: "Password must be at least 8 characters, contain uppercase letters, and numbers",
      });
    }
    if (newPassword !== confirmPassword) {
      errors?.push({
        name: "confirmPassword",
        message: "Passwords do not match",
      });
    }
    setErrorState(errors);

    return errors.length === 0;
  };

  const handleChangePassword = () => {
    if (!isValidPassword()) {
      return;
    }

    setShowReauthenticateModal(true);
    setReauthenticateData({ password: newPassword });
    setNewPassword("");
    setConfirmPassword("");
  };

  const removeError = (field: string) => {
    if (!errorState) return;
    setErrorState(errorState.filter((error) => error.name !== field));
  };

  const showPasswordRules = () => {
    const hasError = errorState?.find((error) => error.name === "newPassword");
    return hasError ? false : focusNewPassword;
  };

  const disableSavePersonalInfo = () => {
    return (
      (fullname?.toLocaleLowerCase().trim() === currentUser?.name.toLocaleLowerCase().trim() &&
        email.trim() === currentUser?.authUser?.email) ||
      !fullname ||
      !email ||
      !isValidEmail(email)
    );
  };

  const handleClearData = () => {
    setShowDialog((prev) => prev + 1);
    setDialogProps({
      toggleOpen: showDialog + 1,
      title: "Clear Data",
      message: "Are you sure you want to clear all data and insight stats?",
      confirm: () => {
        const func = async () => await clearUserData();
        func();
      },
      cancel: () => {},
    });
  };

  const handleDeleteAccount = () => {
    setShowDialog((prev) => prev + 1);
    setDialogProps({
      toggleOpen: showDialog + 1,
      title: "Delete Account",
      message: "Are you sure you want to delete your profile?",
      confirm: async () => {
        await deleteUserAccount();
      },
      cancel: () => {},
    });
  };

  return (
    <div
      id="account-modal-backdrop"
      onClick={handleBackDropClick}
      className={styles.accountModal__backdrop}
      style={{
        opacity: isOpenState ? 1 : 0,
        zIndex: isOpenState ? 100 : -1,
      }}
    >
      <Modal
        id="account-modal"
        className={styles.accountModal__container}
        isOpen={isOpenState}
        close={() => setSelectedOption(null)}
        showCloseIcon={false}
        showBackdrop={showReauthenticateModal}
      >
        <div className={styles.accountModal__header}>
          <p
            style={{
              fontSize: 21,
              fontWeight: 500,
            }}
          >
            Account
          </p>
          <IoCloseOutline
            id="youtube-widget-close-button"
            size={25}
            color="var(--color-secondary)"
            onClick={() => setSelectedOption(null)}
            style={{
              cursor: "pointer",
              zIndex: 1,
              display: "flex",
              justifySelf: "flex-end",
            }}
          />
        </div>
        <div className={styles.accountModal__content}>
          <div className={styles.accountModal__section}>
            <div>
              <p>Full name</p>
              <Input
                className={styles.accountModal__input}
                placeholder="Full name"
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
              />
            </div>
            <div>
              <p>Email</p>
              <Input
                className={styles.accountModal__input}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                id="account-modal-save-button"
                text="Save"
                containerClassName={styles.accountModal__button}
                style={{ backgroundColor: "var(--color-effect-opacity)" }}
                onClick={handlePersonalInfoSave}
                disable={disableSavePersonalInfo()}
              />
            </div>
          </div>

          <div className={styles.accountModal__section}>
            <div>
              <p>New Password</p>
              {/* Prevent autofill with dummy input*/}
              <input type="password" style={{ display: "none" }} autoComplete="off" />
              <Input
                name="newPassword"
                className={styles.accountModal__input}
                placeholder="New Password"
                value={newPassword}
                type="password"
                passwordIconSize={20}
                onFocus={() => setFocusNewPassword(true)}
                onBlur={() => setFocusNewPassword(false)}
                errorState={errorState}
                onChange={(e) => {
                  removeError("newPassword");
                  setNewPassword(e.target.value);
                }}
              />
              {showPasswordRules() && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-secondary)",
                    marginTop: 3,
                  }}
                >
                  {ERROR_MESSAGES.PASSWORD_WEAK}
                </p>
              )}
            </div>
            <div>
              <p>Confirm Password</p>
              <Input
                name="confirmPassword"
                className={styles.accountModal__input}
                placeholder="Confirm Password"
                value={confirmPassword}
                type="password"
                passwordIconSize={20}
                errorState={errorState}
                onChange={(e) => {
                  removeError("confirmPassword");
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                id="account-modal-change-button"
                text="Change"
                containerClassName={styles.accountModal__button}
                style={{ backgroundColor: "var(--color-effect-opacity)" }}
                onClick={handleChangePassword}
                disable={newPassword === "" || confirmPassword === ""}
              />
            </div>
          </div>

          <div
            className={`${styles.accountModal__section} ${styles.accountModal__danger_zone}`}
            style={{ gap: 0 }}
          >
            <p
              style={{
                fontWeight: 500,
              }}
            >
              Danger Zone
            </p>
            <div style={{ display: "flex", gap: 5, flexDirection: "column" }}>
              <div style={{ display: "flex", marginTop: 10, justifyContent: "space-between" }}>
                <p
                  style={{
                    fontSize: 12,
                    width: "50%",
                  }}
                >
                  Clear all data and insight stats
                </p>
                <Button
                  id="account-modal-clear-account-button"
                  text="Clear"
                  containerClassName={styles.accountModal__button}
                  style={{ backgroundColor: "var(--color-secondary)" }}
                  onClick={handleClearData}
                />
              </div>

              <div style={{ display: "flex", marginTop: 10, justifyContent: "space-between" }}>
                <p
                  style={{
                    fontSize: 12,
                    width: "50%",
                  }}
                >
                  Permanently delete your profile
                </p>
                <Button
                  id="account-modal-delete-account-button"
                  text="Delete"
                  containerClassName={styles.accountModal__button}
                  style={{ backgroundColor: "var(--color-error)" }}
                  onClick={() => {
                    setReauthenticateData({ deleteAccount: true });
                    setShowReauthenticateModal(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <ReauthenticateModal
          isOpen={showReauthenticateModal}
          closeModal={() => setShowReauthenticateModal(false)}
          data={reauthenticateData}
          handleDeleteAccount={handleDeleteAccount}
        />
        <DialogModal
          id="account-modal-dialog"
          dialogProps={dialopProps}
          modalStyle={{
            width: 300,
            height: 175,
          }}
        />
      </Modal>
    </div>
  );
};

export default AccountModal;
