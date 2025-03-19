"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (command: string, id: string, config: { page_path: string }) => void;
  }
}
import LoggedInView from "@/ui/Views/LoggedInView";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "@/providers/authProvider/AuthProvider";
import NotificationProvider from "@/providers/notificationProvider/NotificationProvider";
import AppContextProvider from "@/contexts/AppContext";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "nextjs-google-analytics";

export default function Home() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-J2YND7L37W", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return (
    <>
      <GoogleAnalytics trackPageViews gaMeasurementId="G-J2YND7L37W" />

      <GoogleOAuthProvider clientId="922776747697-hbq7p19u2jmjjb1ksf4s0h95mmiu4pht.apps.googleusercontent.com">
        <AuthProvider>
          <NotificationProvider>
            <AppContextProvider>
              <div
                id="melofi-app"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  // Could cause issues. Added to prevent unwanted scrollbars
                  overflow: "hidden",
                }}
              >
                <LoggedInView />
              </div>
            </AppContextProvider>
          </NotificationProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}
