"use client";

import React from "react";
import LoggedInView from "@/ui/Views/LoggedInView";

// If performance is a concern, use React.lazy to load the component only when needed
// const SceneModal = React.lazy(() => import("@/modals/sceneModal/SceneModal"));

export default function Home() {
  return (
    <div
      id="melofi-app"
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <LoggedInView />
    </div>
  );
}
