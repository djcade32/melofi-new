"use client";

import React from "react";
import Header from "../components/header/Header";
import SceneModal from "../modals/sceneModal/SceneModal";
import MixerModal from "../modals/mixerModal/MixerModal";
import NowPlaying from "../components/nowPlaying/NowPlaying";
import Calendar from "../widgets/calendar/Calendar";
import useMixerStore from "@/stores/mixer-store";
import { MusicSource } from "@/enums/general";
import useUserStore from "@/stores/user-store";
import SceneBackground from "../components/sceneBackground/SceneBackground";

const LoggedInView = () => {
  const { musicSource } = useMixerStore();
  const { isUserLoggedIn } = useUserStore();

  return (
    <div>
      <Header />
      <SceneModal />
      <MixerModal />
      {musicSource === MusicSource.MELOFI && <NowPlaying />}
      <Calendar />
      <SceneBackground />
    </div>
  );
};

export default LoggedInView;
