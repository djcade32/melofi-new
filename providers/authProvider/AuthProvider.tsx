"use client";

import React, { ReactNode, useEffect, useState } from "react";
import styles from "./authProvider.module.css";
import { getFirebaseAuth } from "@/lib/firebase/firebaseClient";
import useUserStore from "@/stores/user-store";
import LoggedOutView from "@/ui/Views/AuthViews.tsx/LoggedOutView";
import { MelofiUser } from "@/types/interfaces";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const { setCurrentUser, currentUser, isUserLoggedIn } = useUserStore();

  useEffect(() => {
    // Check if localStorage has user key
    const user = localStorage.getItem("user");
    if (user) {
      const MelofiUser = JSON.parse(user) as MelofiUser;
      // Check if user is email verified
      if (MelofiUser.authUser) {
        MelofiUser.authUser.emailVerified
          ? setCurrentUser(MelofiUser)
          : setShowEmailVerification(true);
      }
    }
  }, []);

  return (
    <div className={styles.authProvider__container}>
      {isUserLoggedIn ? (
        children
      ) : (
        <LoggedOutView
          showEmailVerification={showEmailVerification}
          setShowEmailVerification={setShowEmailVerification}
        />
      )}
    </div>
  );
};

export default AuthProvider;
