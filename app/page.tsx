"use client";

import NowPlaying from "@/components/nowPlaying/NowPlaying";
import Toaster from "@/components/shared/toaster/Toaster";
import { MusicSource } from "@/enums/general";
import MixerModal from "@/modals/mixerModal/MixerModal";
import SceneModal from "@/modals/sceneModal/SceneModal";
import useMixerStore from "@/stores/mixer-store";
import React from "react";

// If performance is a concern, use React.lazy to load the component only when needed
// const SceneModal = React.lazy(() => import("@/modals/sceneModal/SceneModal"));

export default function Home() {
  const { musicSource } = useMixerStore();

  return (
    <div>
      <SceneModal />
      <MixerModal />
      {musicSource === MusicSource.MELOFI && <NowPlaying />}
      <Toaster message="test" type="success" />
    </div>
  );
}
