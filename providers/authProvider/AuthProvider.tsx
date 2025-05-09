"use client";

import React, { ReactNode, useEffect, useMemo, useState } from "react";
import styles from "./authProvider.module.css";
import useUserStore from "@/stores/user-store";
import LoggedOutView from "@/ui/Views/AuthViews.tsx/LoggedOutView";
import { logout } from "@/lib/firebase/actions/auth-actions";
import SceneBackground from "@/ui/components/sceneBackground/SceneBackground";
import LoadingScreen from "@/ui/Views/loadingScreen/LoadingScreen";
import useUserStatsStore from "@/stores/user-stats-store";
import { MelofiUser, UserStats } from "@/types/general";
import SmallerScreenView from "@/ui/Views/SmallerScreenView";
import NoInternetView from "@/ui/Views/NoInternetView";
import checkPremiumStatus from "@/lib/stripe/checkPremiumStatus";
import useAppStore from "@/stores/app-store";
import useMusicPlayerStore from "@/stores/music-player-store";

interface AuthProviderProps {
  children: ReactNode;
}
const MOBILE_SCREEN_WIDTH = 900;
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [grantAccess, setGrantAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onMobileDevice, setOnMobileDevice] = useState(false);
  const [showNotInternetMessage, setShowNotInternetMessage] = useState(false);
  const [localStorageLogin, setLocalStorageLogin] = useState(false);
  const { setIsPlaying } = useMusicPlayerStore();

  const { setIsOnline, isOnline, isElectron } = useAppStore();
  const {
    setCurrentUser,
    currentUser,
    checkIfUserIsInDb,
    isUserLoggedIn,
    setIsUserLoggedIn,
    setIsPremiumUser,
  } = useUserStore();
  const { setUserStats, setStats } = useUserStatsStore();

  // Check if user is logged in
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const user = localStorage.getItem("user");
    if (user) {
      const MelofiUser = JSON.parse(user) as MelofiUser;
      setCurrentUser(MelofiUser);
      setIsUserLoggedIn(!!MelofiUser.authUser);
      setLocalStorageLogin(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useMemo(() => {
    setShowNotInternetMessage(!isOnline && !isElectron());
  }, [isOnline]);

  // Check if user's email is verified and if user is in db
  useEffect(() => {
    // Get current user
    if (currentUser?.skippedOnboarding) {
      if (currentUser.authUser) {
        setUserStats();
        setUserPremium();
      }
      setGrantAccess(true);
      !localStorageLogin && setIsPlaying(true);
    } else if (currentUser?.authUser && isUserLoggedIn) {
      // Check if user's email is verified
      if (!currentUser.authUser.emailVerified) {
        setShowEmailVerification(true);
      } else if (currentUser?.authUser?.email) {
        // Check if user is in db if Melofi is online
        if (navigator.onLine) {
          checkIfUserIsInDb(currentUser.authUser?.uid).then((isInDb) => {
            if (isInDb) {
              setUserStats();
              setGrantAccess(true);
              setUserPremium();
              !localStorageLogin && setIsPlaying(true);
            } else {
              logout();
              // Remove user from localStorage
              localStorage.removeItem("user");
            }
          });
        } else {
          setUserPremium();
          setUserStatsOffline();
          setGrantAccess(true);
        }
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

  const setUserPremium = async () => {
    const isPremiumUser = isElectron() ? "lifetime" : await checkPremiumStatus();
    setIsPremiumUser(isPremiumUser);
  };

  const setUserStatsOffline = async () => {
    const email = currentUser?.authUser?.email;
    if (email) {
      const userStats: UserStats = await window.electronAPI.getUserStats(email);
      console.log("User stats offline: ", userStats);
      userStats && setStats(userStats);
    }
  };

  return (
    <div className={styles.authProvider__container}>
      {showNotInternetMessage ? (
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
