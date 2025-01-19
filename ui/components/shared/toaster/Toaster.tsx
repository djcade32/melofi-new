"use client";

import React, { ReactNode, useEffect, useState } from "react";
import styles from "./toaster.module.css";
import { Slide, Snackbar, SnackbarCloseReason, SnackbarContent } from "@mui/material";
import { IoCloseOutline, MdError, IoCheckmarkCircle } from "@/imports/icons";
import { IconType } from "react-icons";
import { NotificationTypes } from "@/enums/general";
import useNotificationProviderStore from "@/stores/notification-provider-store";

interface ToasterProps {
  message: string;
  show: boolean;
  type?: NotificationTypes;
  icon?: IconType;
  action?: { element: ReactNode; onClick: () => void };
}

function SlideTransition(props: any) {
  return <Slide {...props} direction="up" />;
}

const Toaster = ({ message, type = "normal", icon, show, action }: ToasterProps) => {
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
    }
    return;
  };

  const messageContent = () => {
    return (
      <div className={styles.toaster__message_content}>
        <div style={{ display: "flex", columnGap: 5, alignItems: "center" }}>
          {chooseIcon()}
          <p>{message}</p>
        </div>

        {action ? (
          React.cloneElement(action.element as React.ReactElement, {
            onClick: () => {
              action?.onClick;
              handleClose();
            },
          })
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
    if (type === "success") {
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
