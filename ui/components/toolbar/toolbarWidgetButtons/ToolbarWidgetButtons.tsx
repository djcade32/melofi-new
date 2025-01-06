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
} from "@/imports/icons";
import useToolsStore from "@/stores/tools-store";
import useCalendarStore from "@/stores/widgets/calendar-store";
import useTodoListStore from "@/stores/widgets/todoList-store";
import useNotesStore from "@/stores/widgets/notes-store";
import usePomodoroTimerStore from "@/stores/widgets/pomodoro-timer-store";
import useCalculatorStore from "@/stores/widgets/calculator-store";

const ToolbarWidgetButtons = () => {
  const { isVertical, toggleTools, isUndocked } = useToolsStore();
  const { isCalendarOpen, toggleCalendar } = useCalendarStore();
  const { isTodoListOpen, setIsTodoListOpen } = useTodoListStore();
  const { isNotesOpen, setIsNotesOpen } = useNotesStore();
  const { isPomodoroTimerOpen, setIsPomodoroTimerOpen } = usePomodoroTimerStore();
  const { isCalculatorOpen, setIsCalculatorOpen } = useCalculatorStore();

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
        icon={MdTimer}
        onClick={() => handleWidgetButtonPress(() => setIsPomodoroTimerOpen(!isPomodoroTimerOpen))}
        active={isPomodoroTimerOpen}
      />
      <ToolbarButton
        id="templates"
        label="Templates"
        icon={HiTemplate}
        onClick={() => toggleCalendar(!isCalendarOpen)}
        active={false}
      />
      <ToolbarButton
        id="calculator"
        label="Calculator"
        icon={ImCalculator}
        onClick={() => handleWidgetButtonPress(() => setIsCalculatorOpen(!isCalculatorOpen))}
        active={isCalculatorOpen}
      />
      <ToolbarButton
        id="alarm"
        label="Alarm"
        icon={IoAlarm}
        onClick={() => toggleCalendar(!isCalendarOpen)}
        active={false}
      />
      <ToolbarButton
        id="watch-youtube"
        label="Watch Youtube"
        icon={IoLogoYoutube}
        onClick={() => toggleCalendar(!isCalendarOpen)}
        active={false}
      />
    </div>
  );
};

export default ToolbarWidgetButtons;
