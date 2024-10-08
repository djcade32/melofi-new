"use client";

import SceneModal from "@/modals/sceneModal/SceneModal";
import React from "react";
// If performance is a concern, use React.lazy to load the component only when needed
// const SceneModal = React.lazy(() => import("@/modals/sceneModal/SceneModal"));

export default function Home() {
  return (
    <div>
      <SceneModal />
    </div>
  );
}
