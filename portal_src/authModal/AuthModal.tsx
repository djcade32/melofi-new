import React, { useEffect, useState } from "react";
import styles from "./authModal.module.css";
import Login from "./views/Login";
import Signup from "./views/Signup";
import EmailVerification from "./views/EmailVerification";
import ForgotPassword from "./views/ForgotPassword";

type Views = "login" | "signup" | "forgotPassword" | "emailVerification";

const AuthModal = () => {
  const [currentView, setCurrentView] = useState<Views>("signup");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [modalHeight, setModalHeight] = useState<string>("500px");

  useEffect(() => {
    setModalContent(getModalContent());
    setModalHeight(getModalHeight());
  }, [currentView]);

  const handleViewChange = (view: Views) => {
    setCurrentView(view);
  };

  const getModalHeight = () => {
    switch (currentView) {
      case "signup":
        return "600px";
      case "emailVerification":
        return "350px";
      default:
        return "500px";
    }
  };

  // May need to call this in a useEffect to actually change the view
  const getModalContent = () => {
    switch (currentView) {
      case "login":
        return <Login handleViewChange={handleViewChange} />;
      case "signup":
        return <Signup handleViewChange={handleViewChange} />;
      case "forgotPassword":
        return <ForgotPassword handleViewChange={handleViewChange} />;
      case "emailVerification":
        return <EmailVerification handleViewChange={handleViewChange} />;
      default:
        return <Signup handleViewChange={handleViewChange} />;
    }
  };
  return (
    <div
      className={styles.authModal__container}
      style={{
        height: modalHeight,
      }}
    >
      {modalContent}
    </div>
  );
};

export default AuthModal;
