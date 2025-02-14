"use client";

import React from "react";
import Header from "../components/header/Header";
import SceneModal from "../modals/sceneModal/SceneModal";
import MixerModal from "../modals/mixerModal/MixerModal";
import NowPlaying from "../components/nowPlaying/NowPlaying";
import Calendar from "../widgets/calendar/Calendar";
import useMixerStore from "@/stores/mixer-store";
import { MusicSource } from "@/enums/general";

import TodoList from "../widgets/todoList/TodoList";
import Notes from "../widgets/notes/Notes";
import PomodoroTimer from "../widgets/pomodoroTimer/PomodoroTimer";
import Calculator from "../widgets/calculator/Calculator";
import Alarms from "../widgets/alarms/Alarms";
import Templates from "../widgets/templates/Templates";
import Youtube from "../widgets/youtube/Youtube";
import MenuModal from "../modals/menuModal/MenuModal";
import QuoteDisplay from "../components/quoteDisplay/QuoteDisplay";
import Toolbar from "../components/toolbar/Toolbar";

const LoggedInView = () => {
  const { musicSource } = useMixerStore();

  return (
    <div>
      <Header />
      <Toolbar />
      <SceneModal />
      <MixerModal />
      {musicSource === MusicSource.MELOFI && <NowPlaying />}
      <Calendar />
      <TodoList />
      <Notes />
      <PomodoroTimer />
      <Calculator />
      <Alarms />
      <Templates />
      <Youtube />
      <MenuModal />
      <QuoteDisplay />
    </div>
  );
};

export default LoggedInView;
