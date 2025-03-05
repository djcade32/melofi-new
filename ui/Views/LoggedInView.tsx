"use client";

import React, { lazy } from "react";
import Header from "../components/header/Header";
import MixerModal from "../modals/mixerModal/MixerModal";
import NowPlaying from "../components/nowPlaying/NowPlaying";
import useMixerStore from "@/stores/mixer-store";
import { MusicSource } from "@/enums/general";
import QuoteDisplay from "../components/quoteDisplay/QuoteDisplay";
import ComponentLoader from "../components/shared/componentLoader/ComponentLoader";

// Lazy load the components
const SceneModal = lazy(() => import("@/ui/modals/sceneModal/SceneModal"));
const Alarms = lazy(() => import("@/ui/widgets/alarms/Alarms"));
const Calculator = lazy(() => import("@/ui/widgets/calculator/Calculator"));
const Calendar = lazy(() => import("@/ui/widgets/calendar/Calendar"));
const TodoList = lazy(() => import("@/ui/widgets/todoList/TodoList"));
const Notes = lazy(() => import("@/ui/widgets/notes/Notes"));
const PomodoroTimer = lazy(() => import("@/ui/widgets/pomodoroTimer/PomodoroTimer"));
const Templates = lazy(() => import("@/ui/widgets/templates/Templates"));
const Youtube = lazy(() => import("@/ui/widgets/youtube/Youtube"));

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
