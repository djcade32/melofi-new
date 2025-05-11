"use client";

import { useEffect } from "react";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Register SW");

export default function RegisterSW() {
  const isProduction = process.env.NODE_ENV === "production";
  useEffect(() => {
    if ("serviceWorker" in navigator && isProduction) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            Logger.debug.info("[PWA] Service worker registered:", reg);
          })
          .catch((err) => {
            Logger.error("[PWA] Service worker registration failed:", err);
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
