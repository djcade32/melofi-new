"use client";

import React, { ReactNode, useEffect, useState } from "react";
import styles from "./toaster.module.css";
import { Slide, Snackbar, SnackbarCloseReason, SnackbarContent } from "@mui/material";
import { IoCloseOutline, MdError, IoCheckmarkCircle, IoCopy } from "@/imports/icons";
import { IconType } from "react-icons";
import { NotificationTypes } from "@/enums/general";
import useNotificationProviderStore from "@/stores/notification-provider-store";

interface ToasterProps {
  message: string;
  show: boolean;
  type?: NotificationTypes;
  icon?: IconType;
  actions?: { element: ReactNode; onClick: () => void }[];
}

function SlideTransition(props: any) {
  return <Slide {...props} direction="up" />;
}

const Toaster = ({ message, type = "normal", icon, show, actions }: ToasterProps) => {
  const [open, setOpen] = useState(show);
  const [isAlarm, setIsAlarm] = useState(false);
  const { setShowNotification, removeNotification } = useNotificationProviderStore();

  useEffect(() => {
    setOpen(show);
    setIsAlarm(type === "alarm");
  }, [show]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway" && isAlarm) {
      // Ignore clickaway behavior
      return;
    }
    setOpen(false);
    if (isAlarm) {
      removeNotification();
      setShowNotification(false);
    }
  };

  const chooseIcon = () => {
    if (icon) {
      return React.createElement(icon, {
        size: 25,
        color: "var(--color-white)",
      });
    } else if (type === "success") {
      return <IoCheckmarkCircle size={25} color="var(--color-white)" />;
    } else if (type === "error") {
      return <MdError size={25} color="var(--color-white)" />;
    } else if (type === "copy_to_clipboard") {
      return <IoCopy size={25} color="var(--color-white)" />;
    }
    return;
  };

  const messageContent = () => {
    return (
      <div
        className={styles.toaster__message_content}
        style={{ flexDirection: actions && actions?.length > 1 ? "column" : "row" }}
      >
        <div style={{ display: "flex", columnGap: 5, alignItems: "center" }}>
          {chooseIcon()}
          <p style={{ color: "var(--color-white)" }}>{message}</p>
        </div>

        {actions?.length ? (
          <div
            className={styles.toaster__action_container}
            style={{
              justifyContent: actions.length > 1 ? "space-between" : "flex-end",
            }}
          >
            {actions.map((action) =>
              React.cloneElement(action.element as React.ReactElement, {
                key: Math.random(),
                onClick: () => {
                  action?.onClick();
                  handleClose();
                },
              })
            )}
          </div>
        ) : (
          <IoCloseOutline
            size={25}
            color="var(--color-white)"
            onClick={handleClose}
            style={{ cursor: "pointer", zIndex: 1 }}
          />
        )}
      </div>
    );
  };

  const backgroundColor = () => {
    if (type === "success" || type === "copy_to_clipboard") {
      return "var(--color-success)";
    } else if (type === "error") {
      return "var(--color-error)";
    } else if (type === "normal" || isAlarm) {
      return "var(--color-primary-opacity)";
    }
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      autoHideDuration={isAlarm ? null : 3000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      key={"bottom" + "right"}
      disableWindowBlurListener={isAlarm ? true : false}
    >
      <SnackbarContent
        id="melofi-toaster"
        style={{ backgroundColor: backgroundColor() }}
        classes={{ message: styles.toaster__message_container, root: styles.toaster__container }}
        message={messageContent()}
      />
    </Snackbar>
  );
};

export default Toaster;
