"use client";

import React, { useEffect, useState } from "react";
import styles from "./toaster.module.css";
import { Slide, Snackbar, SnackbarCloseReason, SnackbarContent } from "@mui/material";
import { IoCloseOutline, MdError, IoCheckmarkCircle } from "@/imports/icons";

interface ToasterProps {
  message: string;
  show: boolean;
  type?: "success" | "error" | "normal";
  icon?: React.ReactNode;
}

function SlideTransition(props: any) {
  return <Slide {...props} direction="up" />;
}

const Toaster = ({ message, type = "normal", icon, show }: ToasterProps) => {
  const [open, setOpen] = useState(show);

  useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    setOpen(false);
  };

  const chooseIcon = () => {
    if (icon) {
      return icon;
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

        <IoCloseOutline
          size={25}
          color="var(--color-white)"
          onClick={handleClose}
          style={{ cursor: "pointer", zIndex: 1 }}
        />
      </div>
    );
  };

  const backgroundColor = () => {
    if (type === "success") {
      return "var(--color-success)";
    } else if (type === "error") {
      return "var(--color-error)";
    } else {
      return "var(--color-primary-opacity)";
    }
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      key={"bottom" + "right"}
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
