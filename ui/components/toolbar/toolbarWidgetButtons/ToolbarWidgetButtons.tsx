import React from "react";
import styles from "./toolbarWidgetButtons.module.css";
import ToolbarButton from "../toolbarButton/ToolbarButton";
import {
  BsFillCalendarDateFill,
  FaStickyNote,
  HiClipboardDocumentList,
  HiTemplate,
  ImCalculator,
  IoAlarm,
  IoLogoYoutube,
  MdTimer,
  GiTomato,
} from "@/imports/icons";
import useToolsStore from "@/stores/tools-store";
import useCalendarStore from "@/stores/widgets/calendar-store";
import useTodoListStore from "@/stores/widgets/todoList-store";
import useNotesStore from "@/stores/widgets/notes-store";
import usePomodoroTimerStore from "@/stores/widgets/pomodoro-timer-store";
import useCalculatorStore from "@/stores/widgets/calculator-store";
import useTemplatesStore from "@/stores/widgets/templates-store";
import useAlarmsStore from "@/stores/widgets/alarms-store";
import useYoutubeStore from "@/stores/widgets/youtube-store";
import useTimerStore from "@/stores/widgets/timer-store";

const ToolbarWidgetButtons = () => {
  const { isVertical, toggleTools, isUndocked } = useToolsStore();
  const { isCalendarOpen, toggleCalendar } = useCalendarStore();
  const { isTodoListOpen, setIsTodoListOpen } = useTodoListStore();
  const { isNotesOpen, setIsNotesOpen } = useNotesStore();
  const { isPomodoroTimerOpen, setIsPomodoroTimerOpen } = usePomodoroTimerStore();
  const { isCalculatorOpen, setIsCalculatorOpen } = useCalculatorStore();
  const { isTemplatesOpen, setIsTemplatesOpen } = useTemplatesStore();
  const { isAlarmsOpen, setIsAlarmsOpen } = useAlarmsStore();
  const { isYoutubeOpen, setIsYoutubeOpen } = useYoutubeStore();
  const { isTimerOpen, setIsTimerOpen } = useTimerStore();

  const handleWidgetButtonPress = (toggleWidgetFunction: Function) => {
    toggleWidgetFunction();
    // Do not close the tools if the toolbar is undocked
    !isUndocked && toggleTools(false);
  };
  return (
    <div
      className={styles.toolbarWidgetButtons__container}
      style={{
        flexDirection: isVertical ? "column" : "row",
        margin: isVertical ? "0px 0px 10px 0px" : "0px 10px 0px 0px",
      }}
    >
      <ToolbarButton
        id="notes"
        label="Notes"
        icon={FaStickyNote}
        onClick={() => handleWidgetButtonPress(() => setIsNotesOpen(!isNotesOpen))}
        active={isNotesOpen}
      />
      <ToolbarButton
        id="to-do-list"
        label="To - Do List"
        icon={HiClipboardDocumentList}
        onClick={() => handleWidgetButtonPress(() => setIsTodoListOpen(!isTodoListOpen))}
        active={isTodoListOpen}
      />
      <ToolbarButton
        id="calendar"
        label="Calendar"
        icon={BsFillCalendarDateFill}
        onClick={() => handleWidgetButtonPress(() => toggleCalendar(!isCalendarOpen))}
        active={isCalendarOpen}
      />
      <ToolbarButton
        id="pomodoro-timer"
        label="Pomodoro Timer"
        icon={GiTomato}
        onClick={() => handleWidgetButtonPress(() => setIsPomodoroTimerOpen(!isPomodoroTimerOpen))}
        active={isPomodoroTimerOpen}
        premiumWidget
      />
      <ToolbarButton
        id="templates"
        label="Templates"
        icon={HiTemplate}
        onClick={() => handleWidgetButtonPress(() => setIsTemplatesOpen(!isTemplatesOpen))}
        active={isTemplatesOpen}
        premiumWidget
      />
      <ToolbarButton
        id="calculator"
        label="Calculator"
        icon={ImCalculator}
        onClick={() => handleWidgetButtonPress(() => setIsCalculatorOpen(!isCalculatorOpen))}
        active={isCalculatorOpen}
      />
      <ToolbarButton
        id="timer"
        label="Timer"
        icon={MdTimer}
        onClick={() => handleWidgetButtonPress(() => setIsTimerOpen(!isTimerOpen))}
        active={isTimerOpen}
      />
      <ToolbarButton
        id="alarms"
        label="Alarms"
        icon={IoAlarm}
        onClick={() => handleWidgetButtonPress(() => setIsAlarmsOpen(!isAlarmsOpen))}
        active={isAlarmsOpen}
      />
      <ToolbarButton
        id="watch-youtube"
        label="Watch Youtube"
        icon={IoLogoYoutube}
        onClick={() => handleWidgetButtonPress(() => setIsYoutubeOpen(!isYoutubeOpen))}
        active={isYoutubeOpen}
        premiumWidget
      />
    </div>
  );
};

export default ToolbarWidgetButtons;
