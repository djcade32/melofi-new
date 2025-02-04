import { useEffect, useState } from "react";
import AccountModalSkippedUserSignup from "./views/AccountModalSkippedUserSignup";
import AccountModalSkippedUserLogin from "./views/AccountModalSkippedUserLogin";
import useMenuStore from "@/stores/menu-store";

const AccountModalSkippedUser = () => {
  const [currentView, setCurrentView] = useState<string[]>(["signup"]);
  const { selectedOption } = useMenuStore();

  useEffect(() => {
    if (selectedOption !== "Account") {
      setCurrentView(["signup"]);
    }
  }, [selectedOption]);

  if (currentView[0] === "signup") {
    return (
      <AccountModalSkippedUserSignup currentView={currentView} setCurrentView={setCurrentView} />
    );
  } else if (currentView[0] === "login") {
    return <AccountModalSkippedUserLogin setCurrentView={setCurrentView} />;
  }
};

export default AccountModalSkippedUser;
