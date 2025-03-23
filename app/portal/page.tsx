"use client";

import { LuConstruction } from "@/imports/icons";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PortalPage() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-J2YND7L37W", {
        page_path: pathname,
      });
    }
  }, [pathname]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-white)",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 0 10px var(--color-black)",
      }}
    >
      <GoogleAnalytics trackPageViews gaMeasurementId="G-J2YND7L37W" />

      <LuConstruction size={100} color="var(--color-effect-opacity)" />
      <h1
        style={{
          color: "var(--color-secondary)",
          border: "1px solid var(--color-secondary-opacity)",
          padding: 10,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        Coming Soon
      </h1>
    </div>
  );
}
