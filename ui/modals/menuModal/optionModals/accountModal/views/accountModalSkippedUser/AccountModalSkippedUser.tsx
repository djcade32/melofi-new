import { useState } from "react";
import AccountModalSkippedUserSignup from "./views/AccountModalSkippedUserSignup";
import AccountModalSkippedUserLogin from "./views/AccountModalSkippedUserLogin";

const AccountModalSkippedUser = () => {
  const [currentView, setCurrentView] = useState("signup");

  if (currentView === "signup") {
    return <AccountModalSkippedUserSignup setCurrentView={setCurrentView} />;
  } else if (currentView === "login") {
    return <AccountModalSkippedUserLogin setCurrentView={setCurrentView} />;
  }
};

export default AccountModalSkippedUser;
