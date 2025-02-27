"use client";

import React from "react";
import LoggedInView from "@/ui/Views/LoggedInView";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "@/providers/authProvider/AuthProvider";
import NotificationProvider from "@/providers/notificationProvider/NotificationProvider";
import AppContextProvider from "@/contexts/AppContext";

export default function Home() {
  return (
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
  );
}
