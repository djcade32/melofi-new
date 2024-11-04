"use client";

import React from "react";
import Header from "../components/header/Header";
import SceneModal from "../modals/sceneModal/SceneModal";
import MixerModal from "../modals/mixerModal/MixerModal";
import NowPlaying from "../components/nowPlaying/NowPlaying";
import Calendar from "../widgets/calendar/Calendar";
import useMixerStore from "@/stores/mixer-store";
import { MusicSource } from "@/enums/general";

import SceneBackground from "../components/sceneBackground/SceneBackground";

const LoggedInView = () => {
  const { musicSource } = useMixerStore();

  return (
    <div>
      <Header />
      <SceneModal />
      <MixerModal />
      {musicSource === MusicSource.MELOFI && <NowPlaying />}
      <Calendar />
    </div>
  );
};

export default LoggedInView;
