"use client";

import React from "react";
import SceneBackground from "@/ui/components/sceneBackground/SceneBackground";
import LoggedInView from "@/ui/Views/LoggedInView";
import LoggedOutView from "@/ui/Views/AuthViews.tsx/LoggedOutView";
import useUserStore from "@/stores/user-store";

// If performance is a concern, use React.lazy to load the component only when needed
// const SceneModal = React.lazy(() => import("@/modals/sceneModal/SceneModal"));

export default function Home() {
  const { isUserLoggedIn } = useUserStore();

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
