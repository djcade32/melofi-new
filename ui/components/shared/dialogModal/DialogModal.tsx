import React, { useEffect, useState } from "react";
import styles from "./dialogModal.module.css";
import Button from "../button/Button";
import { DialogModalActions } from "@/types/general";
import { set } from "lodash";

interface DialogModalProps {
  id: string;
  dialogProps: DialogModalActions | null;

  modalStyle?: React.CSSProperties;
  modalClassName?: string;
}

const DialogModal = ({ id, dialogProps, modalStyle, modalClassName }: DialogModalProps) => {
  const [isOpenState, setIsOpenState] = useState(false);

  useEffect(() => {
    setIsOpenState((prev) => !prev);
  }, [dialogProps?.toggleOpen]);
  return (
    <div
      className={styles.dialogModal__backdrop}
      style={{
        opacity: isOpenState ? 1 : 0,
        zIndex: isOpenState ? 100 : -1,
      }}
    >
      <div
        id={id}
        className={`${modalClassName} ${styles.dialogModal__modal}`}
        style={{
          ...modalStyle,
          width: modalStyle?.width ?? "70%",
          height: modalStyle?.height ?? 175,
        }}
      >
        <div className={styles.dialogModal__header}>
          <h2>{dialogProps?.title}</h2>
        </div>
        <div className={styles.dialogModal__content}>
          <p>{dialogProps?.message}</p>
        </div>
        <div className={styles.dialogModal__footer}>
          <Button
            id="dialogModal-cancel-button"
            text="Cancel"
            onClick={() => {
              dialogProps?.cancel();
              setIsOpenState(false);
            }}
            containerClassName={styles.dialogModal__action_button}
            style={{
              backgroundColor: "transparent",
            }}
          />
          <Button
            id="dialogModal-confirm-button"
            text="Confirm"
            onClick={() => {
              dialogProps?.confirm();
              setIsOpenState(false);
            }}
            containerClassName={styles.dialogModal__action_button}
            style={{
              backgroundColor: "var(--color-effect-opacity)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DialogModal;
