"use client";

import React, { useEffect } from "react";
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
import useAppStore from "@/stores/app-store";

const LoggedInView = () => {
  const { musicSource } = useMixerStore();
  const { setIsSleep, inActivityThreshold } = useAppStore();

  let timeout: NodeJS.Timeout;
  // Detects if the user is idle and sets the isSleep state to true
  useEffect(() => {
    const onMouseMove = () => {
      setIsSleep(false);
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        // if (JSON.parse(localStorage.getItem("settingsConfig")).hideInterface) {
        setIsSleep(true);
        //   return;
        // }
        clearTimeout(timeout);
      }, inActivityThreshold);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseMove);
    };
  }, []);

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
      <Templates />
      <Youtube />
      <MenuModal />
      <QuoteDisplay />
    </div>
  );
};

export default LoggedInView;
