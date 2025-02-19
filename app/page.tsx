"use client";

import React from "react";
import LoggedInView from "@/ui/Views/LoggedInView";

export default function Home() {
  return (
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
  );
}
