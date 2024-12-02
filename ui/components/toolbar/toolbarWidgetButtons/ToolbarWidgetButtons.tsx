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

const ToolbarWidgetButtons = () => {
  const { isVertical, toggleTools, isUndocked } = useToolsStore();
  const { isCalendarOpen, toggleCalendar } = useCalendarStore();
  const { isTodoListOpen, setIsTodoListOpen } = useTodoListStore();

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
        id="sticky-notes"
        label="Sticky Notes"
        icon={FaStickyNote}
        iconProps={{
          color: "var(--color-secondary-white)",
          size: 30,
        }}
        onClick={() => {}}
      />
      <ToolbarButton
        id="to-do-list"
        label="To - Do List"
        icon={HiClipboardDocumentList}
        iconProps={{
          color: isTodoListOpen ? "var(--color-effect-opacity)" : "var(--color-secondary-white)",
          size: 30,
        }}
        onClick={() => handleWidgetButtonPress(() => setIsTodoListOpen(!isTodoListOpen))}
      />
      <ToolbarButton
        id="calendar"
        label="Calendar"
        icon={BsFillCalendarDateFill}
        iconProps={{
          color: isCalendarOpen ? "var(--color-effect-opacity)" : "var(--color-secondary-white)",
          size: 30,
        }}
        onClick={() => handleWidgetButtonPress(() => toggleCalendar(!isCalendarOpen))}
      />
      <ToolbarButton
        id="timer"
        label="Timer"
        icon={MdTimer}
        iconProps={{ color: "var--secondary-white", size: 30 }}
        onClick={() => toggleCalendar(!isCalendarOpen)}
      />
      <ToolbarButton
        id="templates"
        label="Templates"
        icon={HiTemplate}
        iconProps={{ color: "var--secondary-white", size: 30 }}
        onClick={() => toggleCalendar(!isCalendarOpen)}
      />
      <ToolbarButton
        id="calculator"
        label="Calculator"
        icon={ImCalculator}
        iconProps={{ color: "var--secondary-white", size: 30 }}
        onClick={() => toggleCalendar(!isCalendarOpen)}
      />
      <ToolbarButton
        id="alarm"
        label="Alarm"
        icon={IoAlarm}
        iconProps={{ color: "var--secondary-white", size: 30 }}
        onClick={() => toggleCalendar(!isCalendarOpen)}
      />
      <ToolbarButton
        id="watch-youtube"
        label="Watch Youtube"
        icon={IoLogoYoutube}
        iconProps={{ color: "var--secondary-white", size: 30 }}
        onClick={() => toggleCalendar(!isCalendarOpen)}
      />
    </div>
  );
};

export default ToolbarWidgetButtons;
