import React, { useState } from "react";
import styles from "./toaster.module.css";
import { Slide, Snackbar, SnackbarCloseReason, SnackbarContent } from "@mui/material";
import { IoCloseOutline, MdError, IoCheckmarkCircle } from "@/imports/icons";

interface ToasterProps {
  message: string;
  type?: "success" | "error" | "normal";
  title?: string;
  icon?: React.ReactNode;
}

function SlideTransition(props: any) {
  return <Slide {...props} direction="up" />;
}

const Toaster = ({ message, type = "normal", title, icon }: ToasterProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const chooseIcon = () => {
    if (icon) {
      return icon;
    } else if (type === "success") {
      return <IoCheckmarkCircle size={25} color="var(--color-secondary-white)" />;
    } else if (type === "error") {
      return <MdError size={25} color="var(--color-secondary-white)" />;
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
          color="var(--color-secondary-white)"
          onClick={() => {}}
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
      return "var(--color-primary)";
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
      onClick={() => console.log("clicked achievement")}
    >
      <SnackbarContent
        style={{ backgroundColor: backgroundColor() }}
        classes={{ message: styles.toaster__message_container, root: styles.toaster__container }}
        message={messageContent()}
      />
    </Snackbar>
  );
};

export default Toaster;
