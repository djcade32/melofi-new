"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  const isProduction = process.env.NODE_ENV === "production";
  useEffect(() => {
    if ("serviceWorker" in navigator && isProduction) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[PWA] Service worker registered:", reg);
          })
          .catch((err) => {
            console.error("[PWA] Service worker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
// This component registers the service worker when the component mounts.
// It uses the useEffect hook to ensure that the registration happens only once when the component is mounted.
// The service worker is registered with the path '/sw.js', which should be the path to your service worker file.
// The console logs will help you debug the registration process.
