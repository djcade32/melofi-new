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

const LoggedInView = () => {
  const { musicSource } = useMixerStore();

  return (
    <div>
      <Header />
      <SceneModal />
      <MixerModal />
      {musicSource === MusicSource.MELOFI && <NowPlaying />}
      <Calendar />
      <TodoList />
      <Notes />
      <PomodoroTimer />
      <Calculator />
      <Alarms />
    </div>
  );
};

export default LoggedInView;
