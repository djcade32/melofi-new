import useMenuStore from "@/stores/menu-store";
import React, { useState } from "react";
import styles from "./accountModal.module.css";
import { IoCloseOutline } from "@/imports/icons";
import Input from "@/ui/components/shared/input/Input";
import useUserStore from "@/stores/user-store";
import Button from "@/ui/components/shared/button/Button";

const AccountModal = () => {
  const { selectedOption, setSelectedOption } = useMenuStore();
  const { currentUser } = useUserStore();
  const [fullname, setFullname] = useState(currentUser?.name);
  const [email, setEmail] = useState(currentUser?.authUser?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isOpenState = selectedOption === "Account";

  const handleBackDropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.target === e.currentTarget && setSelectedOption(null);
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
      <div
        className={styles.accountModal__container}
        style={{
          display: selectedOption === "Account" ? "block" : "none",
        }}
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
                onClick={() => {
                  console.log("Save");
                }}
              />
            </div>
          </div>

          <div className={styles.accountModal__section}>
            <div>
              <p>Current Password</p>
              <Input
                className={styles.accountModal__input}
                placeholder="Current Password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
                type="password"
                passwordIconSize={20}
              />
            </div>
            <div>
              <p>New Password</p>
              <Input
                className={styles.accountModal__input}
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                type="password"
                passwordIconSize={20}
              />
            </div>
            <div>
              <p>Confirm Password</p>
              <Input
                className={styles.accountModal__input}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                passwordIconSize={20}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                id="account-modal-change-button"
                text="Change"
                containerClassName={styles.accountModal__button}
                style={{ backgroundColor: "var(--color-effect-opacity)" }}
                onClick={() => {
                  console.log("Save");
                }}
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
                  onClick={() => {
                    console.log("Save");
                  }}
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
                    console.log("Save");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
