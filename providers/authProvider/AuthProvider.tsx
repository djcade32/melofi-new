"use client";

import React, { ReactNode, useEffect, useState } from "react";
import styles from "./authProvider.module.css";
import useUserStore from "@/stores/user-store";
import LoggedOutView from "@/ui/Views/AuthViews.tsx/LoggedOutView";
import { MelofiUser } from "@/types/interfaces";
import { logout } from "@/lib/firebase/actions/auth-actions";
import SceneBackground from "@/ui/components/sceneBackground/SceneBackground";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [grantAccess, setGrantAccess] = useState(false);

  const { setCurrentUser, currentUser, checkIfUserIsInDb, isUserLoggedIn } = useUserStore();

  // Check if user is logged in
  useEffect(() => {
    // Check if localStorage has user key
    const user = localStorage.getItem("user");
    if (user) {
      const MelofiUser = JSON.parse(user) as MelofiUser;
      setCurrentUser(MelofiUser);
    }
  }, []);

  // Check if user's email is verified and if user is in db
  useEffect(() => {
    // Get current user
    if (currentUser?.authUser && isUserLoggedIn) {
      // Check if user's email is verified
      if (!currentUser.authUser.emailVerified) {
        setShowEmailVerification(true);
      } else if (currentUser?.authUser?.email) {
        // Check if user is in db
        checkIfUserIsInDb(currentUser.authUser?.email).then((isInDb) => {
          if (isInDb) {
            setGrantAccess(true);
          } else {
            logout();
            // Remove user from localStorage
            localStorage.removeItem("user");
          }
        });
      }
    } else if (currentUser?.skippedOnboarding) {
      setGrantAccess(true);
    }
  }, [currentUser]);

  return (
    <div className={styles.authProvider__container}>
      {grantAccess ? (
        children
      ) : (
        <LoggedOutView
          showEmailVerification={showEmailVerification}
          setShowEmailVerification={setShowEmailVerification}
        />
      )}
      <SceneBackground />
    </div>
  );
};

export default AuthProvider;
