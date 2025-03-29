"use client";

import { GoogleAnalytics } from "nextjs-google-analytics";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AuthModal from "@/portal_src/authModal/AuthModal";
import Image from "next/image";
import NotificationProvider from "@/providers/notificationProvider/NotificationProvider";
import useUserStore from "@/stores/user-store";
import { MelofiUser } from "@/types/general";
import UserAccount from "@/portal_src/userAccount/UserAccount";
import checkPremiumStatus from "@/lib/stripe/checkPremiumStatus";

export default function PortalPage() {
  const { setIsUserLoggedIn, setCurrentUser, currentUser, isUserLoggedIn, setIsPremiumUser } =
    useUserStore();
  const [grantAccess, setGrantAccess] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-J2YND7L37W", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  useEffect(() => {
    if (!currentUser) {
      // Check if localStorage has user key
      const user = localStorage.getItem("user");
      if (user) {
        const MelofiUser = JSON.parse(user) as MelofiUser;
        setCurrentUser(MelofiUser);
        setIsUserLoggedIn(MelofiUser.authUser ? true : false);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser?.authUser) {
      setGrantAccess(currentUser.authUser.emailVerified && isUserLoggedIn);
    } else {
      setGrantAccess(false);
    }
    setUserPremium();
  }, [currentUser]);

  const setUserPremium = async () => {
    const isPremiumUser = await checkPremiumStatus();
    setIsPremiumUser(isPremiumUser);
  };

  return (
    <NotificationProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GoogleAnalytics trackPageViews gaMeasurementId="G-J2YND7L37W" />

        <Image
          src="/assets/logos/logo-black.png"
          alt="Melofi logo"
          width={122}
          height={122}
          style={{
            position: "absolute",
            top: 10,
            left: 28,
          }}
        />

        {grantAccess ? <UserAccount /> : <AuthModal />}
      </div>
    </NotificationProvider>
  );
}
