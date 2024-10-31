"use client";

import NowPlaying from "@/ui/components/nowPlaying/NowPlaying";
import { MusicSource } from "@/enums/general";
import MixerModal from "@/ui/modals/mixerModal/MixerModal";
import SceneModal from "@/ui/modals/sceneModal/SceneModal";
import useMixerStore from "@/stores/mixer-store";
import React from "react";
import Calendar from "@/ui/widgets/calendar/Calendar";

// If performance is a concern, use React.lazy to load the component only when needed
// const SceneModal = React.lazy(() => import("@/modals/sceneModal/SceneModal"));

export default function Home() {
  const { musicSource } = useMixerStore();

  return (
    <div>
      <SceneModal />
      <MixerModal />
      {musicSource === MusicSource.MELOFI && <NowPlaying />}
      <Calendar />
    </div>
  );
}
