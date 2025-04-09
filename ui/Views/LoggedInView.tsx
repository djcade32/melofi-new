"use client";

import React from "react";
import Header from "../components/header/Header";
import MixerModal from "../modals/mixerModal/MixerModal";
import NowPlaying from "../components/nowPlaying/NowPlaying";
import useMixerStore from "@/stores/mixer-store";
import { MusicSource } from "@/enums/general";
import QuoteDisplay from "../components/quoteDisplay/QuoteDisplay";
import ComponentLoader from "../components/shared/componentLoader/ComponentLoader";

import dynamic from "next/dynamic";
const SceneModal = dynamic(() => import("@/ui/modals/sceneModal/SceneModal"), { ssr: false });
const Alarms = dynamic(() => import("@/ui/widgets/alarms/Alarms"), { ssr: false });
const Calculator = dynamic(() => import("@/ui/widgets/calculator/Calculator"), { ssr: false });
const Calendar = dynamic(() => import("@/ui/widgets/calendar/Calendar"), { ssr: false });
const TodoList = dynamic(() => import("@/ui/widgets/todoList/TodoList"), { ssr: false });
const Notes = dynamic(() => import("@/ui/widgets/notes/Notes"), { ssr: false });
const PomodoroTimer = dynamic(() => import("@/ui/widgets/pomodoroTimer/PomodoroTimer"), {
  ssr: false,
});
const Templates = dynamic(() => import("@/ui/widgets/templates/Templates"), { ssr: false });
const Youtube = dynamic(() => import("@/ui/widgets/youtube/Youtube"), { ssr: false });

import useCalendarStore from "@/stores/widgets/calendar-store";
import usePomodoroTimerStore from "@/stores/widgets/pomodoro-timer-store";
import useAlarmsStore from "@/stores/widgets/alarms-store";
import useCalculatorStore from "@/stores/widgets/calculator-store";
import useTodoListStore from "@/stores/widgets/todoList-store";
import useNotesStore from "@/stores/widgets/notes-store";
import useTemplatesStore from "@/stores/widgets/templates-store";
import useYoutubeStore from "@/stores/widgets/youtube-store";
import Toolbar from "../components/toolbar/Toolbar";
import useSceneStore from "@/stores/scene-store";
import MenuModal from "../modals/menuModal/MenuModal";
import SupportCreatorBanner from "../components/supportCreatorBanner/SupportCreatorBanner";
import PremiumModal from "../modals/premiumModal/PremiumModal";
import Timer from "../widgets/timer/Timer";
import useTimerStore from "@/stores/widgets/timer-store";
import WelcomeModal from "../modals/welcomeModal/WelcomeModal";

const LoggedInView = () => {
  const { musicSource } = useMixerStore();
  const { isAlarmsOpen } = useAlarmsStore();
  const { isCalculatorOpen } = useCalculatorStore();
  const { isPomodoroTimerOpen } = usePomodoroTimerStore();
  const { isCalendarOpen } = useCalendarStore();
  const { isTodoListOpen } = useTodoListStore();
  const { isNotesOpen } = useNotesStore();
  const { isTemplatesOpen } = useTemplatesStore();
  const { isYoutubeOpen } = useYoutubeStore();
  const { sceneModalOpen } = useSceneStore();
  const { isTimerOpen } = useTimerStore();

  return (
    <div>
      <Header />
      <Toolbar />
      <ComponentLoader component={<SceneModal />} isComponentOpen={sceneModalOpen} />
      <MenuModal />
      <MixerModal />
      {musicSource === MusicSource.MELOFI && <NowPlaying />}
      <QuoteDisplay />
      <SupportCreatorBanner />
      <PremiumModal />
      <WelcomeModal />

      {/* Widgets */}
      <ComponentLoader component={<Alarms />} isComponentOpen={isAlarmsOpen} />
      <ComponentLoader component={<Calculator />} isComponentOpen={isCalculatorOpen} />
      <ComponentLoader component={<Calendar />} isComponentOpen={isCalendarOpen} />
      <ComponentLoader component={<TodoList />} isComponentOpen={isTodoListOpen} />
      <ComponentLoader component={<Notes />} isComponentOpen={isNotesOpen} />
      <ComponentLoader component={<PomodoroTimer />} isComponentOpen={isPomodoroTimerOpen} />
      <ComponentLoader component={<Templates />} isComponentOpen={isTemplatesOpen} />
      <ComponentLoader component={<Youtube />} isComponentOpen={isYoutubeOpen} />
      <ComponentLoader component={<Timer />} isComponentOpen={isTimerOpen} />
    </div>
  );
};

export default LoggedInView;
