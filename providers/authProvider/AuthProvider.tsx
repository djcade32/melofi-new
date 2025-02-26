"use client";

import React, { ReactNode, useEffect, useState } from "react";
import styles from "./authProvider.module.css";
import useUserStore from "@/stores/user-store";
import LoggedOutView from "@/ui/Views/AuthViews.tsx/LoggedOutView";
import { logout } from "@/lib/firebase/actions/auth-actions";
import SceneBackground from "@/ui/components/sceneBackground/SceneBackground";
import LoadingScreen from "@/ui/Views/loadingScreen/LoadingScreen";
import useUserStatsStore from "@/stores/user-stats-store";
import { MelofiUser } from "@/types/general";
import SmallerScreenView from "@/ui/Views/SmallerScreenView";
import NoInternetView from "@/ui/Views/NoInternetView";
import { Logger } from "@/classes/Logger";

interface AuthProviderProps {
  children: ReactNode;
}
const MOBILE_SCREEN_WIDTH = 900;
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [grantAccess, setGrantAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onMobileDevice, setOnMobileDevice] = useState(false);

  const { setCurrentUser, currentUser, checkIfUserIsInDb, isUserLoggedIn, setIsUserLoggedIn } =
    useUserStore();
  const { setUserStats } = useUserStatsStore();
  const [isOnline, setIsOnline] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    // Check if user is online
    window.addEventListener("online", () => {
      Logger.getInstance().info("Melofi is online.");
      setIsOnline(true);
    });

    window.addEventListener("offline", () => {
      Logger.getInstance().error("Melofi is offline.");
      setIsOnline(false);
    });

    // Check if localStorage has user key
    const user = localStorage.getItem("user");
    if (user) {
      const MelofiUser = JSON.parse(user) as MelofiUser;
      setCurrentUser(MelofiUser);
      setIsUserLoggedIn(MelofiUser.authUser ? true : false);
    }

    return () => {
      window.removeEventListener("online", () => {});

      window.removeEventListener("offline", () => {});
    };
  }, []);

  // Check if user's email is verified and if user is in db
  useEffect(() => {
    // Get current user
    if (currentUser?.skippedOnboarding) {
      currentUser.authUser && setUserStats();
      setGrantAccess(true);
    } else if (currentUser?.authUser && isUserLoggedIn) {
      // Check if user's email is verified
      if (!currentUser.authUser.emailVerified) {
        setShowEmailVerification(true);
      } else if (currentUser?.authUser?.email) {
        // Check if user is in db
        checkIfUserIsInDb(currentUser.authUser?.uid).then((isInDb) => {
          if (isInDb) {
            setUserStats();
            setGrantAccess(true);
          } else {
            logout();
            // Remove user from localStorage
            localStorage.removeItem("user");
          }
        });
      }
    } else if (!currentUser) {
      setGrantAccess(false);
    }
    // Give time for data to load
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, [currentUser]);

  // Determines when show 'Melofi is not available on Mobile'
  useEffect(() => {
    const updateDimension = () => {
      if (window.innerWidth < MOBILE_SCREEN_WIDTH) {
        setOnMobileDevice(true);
      } else if (window.innerWidth > MOBILE_SCREEN_WIDTH) {
        setOnMobileDevice(false);
      }
    };
    if (window) {
      updateDimension();
    }
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, []);

  return (
    <div className={styles.authProvider__container}>
      {!isOnline ? (
        <NoInternetView />
      ) : (
        <>
          {grantAccess ? (
            <>{onMobileDevice ? <SmallerScreenView /> : children}</>
          ) : (
            <>
              {onMobileDevice ? (
                <SmallerScreenView />
              ) : (
                <LoggedOutView
                  showEmailVerification={showEmailVerification}
                  setShowEmailVerification={setShowEmailVerification}
                />
              )}
            </>
          )}
        </>
      )}
      <SceneBackground />
      <LoadingScreen loading={loading} />
    </div>
  );
};

export default AuthProvider;
