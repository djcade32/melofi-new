import React, { act, useEffect, useRef, useState } from "react";
import styles from "./pomodoroTimer.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import usePomodoroTimerStore from "@/stores/widgets/pomodoro-timer-store";
import {
  IoCloseOutline,
  FiMinimize2,
  FiPlus,
  FaPlay,
  FaPause,
  FaStop,
  VscDebugRestart,
} from "@/imports/icons";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import { CircularProgress } from "@mui/material";
import PomodoroTimerSessionCard from "./components/pomodoroTimerSessionCard/PomodoroTimerSessionCard";
import AddPomodoroTaskModal from "./components/addPomodoroTaskModal/AddPomodoroTaskModal";
import { PomodoroTimerTask } from "@/types/interfaces";
import { convertMinsToHrMinsSec } from "@/utils/time";

const PomodoroTimer = () => {
  const {
    isPomodoroTimerOpen,
    setIsPomodoroTimerOpen,
    activePomodoroTimerTask,
    pomodoroTimerTasks,
    fetchPomodoroTimerTasks,
    setActivePomodoroTimerTask,
  } = usePomodoroTimerStore();
  const [activeTaskTitle, setActiveTaskTitle] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      await fetchPomodoroTimerTasks();
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    setActiveTaskTitle(activePomodoroTimerTask ? activePomodoroTimerTask.title : "");
  }, [activePomodoroTimerTask]);

  const handlePomodorTaskClicked = (task: PomodoroTimerTask) => {
    if (activePomodoroTimerTask?.id === task.id) {
      return;
    }
    setActivePomodoroTimerTask(task);
  };

  const getTimeString = (time: number) => {
    const convertedTime = convertMinsToHrMinsSec(time);
    return `${convertedTime.hr}h ${convertedTime.min}m ${convertedTime.sec}s`;
  };

  const getSessionCountString = () => {
    const sessions = activePomodoroTimerTask?.sessions || 0;
    const sessionsCompleted = activePomodoroTimerTask?.sessionsCompleted || 0;
    return `${sessionsCompleted} of ${sessions} sessions`;
  };

  return (
    <Modal
      id={`pomodoro-timer-widget`}
      isOpen={isPomodoroTimerOpen}
      className={styles.pomodoroTimer__container}
      draggable
      showCloseIcon={false}
    >
      <div className={styles.pomodoroTimer__header}>
        <HoverIcon
          icon={FiPlus}
          tooltipText="Add Task"
          showTooltip
          size={25}
          color="var(--color-white)"
          hoverColor="var(--color-secondary-white)"
          inverted
          invertedHoverColor="var(--color-secondary)"
          invertedBackgroundColor="var(--color-secondary-opacity)"
          onClick={() => setShowAddTaskModal(true)}
          containerClassName={styles.pomodoroTimer__add_task_button}
        />
        <div className={styles.pomodorTimer__header_right_side}>
          <FiMinimize2
            size={20}
            color="var(--color-secondary)"
            onClick={() => setIsPomodoroTimerOpen(false)}
            style={{
              cursor: "pointer",
              zIndex: 1,
            }}
          />
          <IoCloseOutline
            id={`pomodoro-timer-widget-close-icon`}
            size={25}
            color="var(--color-secondary)"
            onClick={() => setIsPomodoroTimerOpen(false)}
            style={{
              cursor: "pointer",
              zIndex: 1,
            }}
          />
        </div>
      </div>
      <div className={styles.notes__selected_task_title_container}>
        <p>{activeTaskTitle}</p>
      </div>

      <div className={styles.pomodoroTimer__timer_container}>
        <div
          style={{
            position: "relative",
            display: "inline-flex",
          }}
        >
          <CircularProgress
            size={225}
            value={100}
            thickness={1.5}
            variant="determinate"
            sx={{
              color: "var(--color-primary)",
            }}
          />
          <CircularProgress
            size={225}
            value={activePomodoroTimerTask?.percentCompleted || 0}
            thickness={1.5}
            variant="determinate"
            sx={{
              position: "absolute",
              left: 0,
              color: "var(--color-effect-opacity)",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
          <div className={styles.pomodoroTimer__timer_info_container}>
            <p className={styles.pomodoroTimer__timer_info_time_display}>
              {activePomodoroTimerTask
                ? getTimeString(activePomodoroTimerTask?.focusTime)
                : "0h 0m 0s"}
            </p>
            {activePomodoroTimerTask && <p>{getSessionCountString()}</p>}
            {activePomodoroTimerTask && (
              <div className={styles.pomodoroTimer__timer_info_mode_display}>
                <p>{activePomodoroTimerTask.currentMode}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.pomodoroTimer__timer_action_buttons_container}>
        <HoverIcon
          containerClassName={styles.pomodoroTimer__timer_action_button_outline}
          icon={VscDebugRestart}
          size={20}
          showTooltip
          tooltipText="Restart"
          inverted
          color="var(--color-secondary-white)"
          onClick={() => {}}
        />
        <HoverIcon
          containerClassName={styles.pomodoroTimer__timer_action_button_fill}
          icon={FaPlay}
          size={20}
          showTooltip
          tooltipText="Start"
          inverted
          color="var(--color-white)"
          invertedHoverColor="var(--color-secondary)"
          invertedBackgroundColor="var(--color-secondary-opacity)"
          onClick={() => {}}
        />
        <HoverIcon
          containerClassName={styles.pomodoroTimer__timer_action_button_outline}
          icon={FaStop}
          size={20}
          showTooltip
          tooltipText="Stop"
          inverted
          color="var(--color-secondary-white)"
          onClick={() => {}}
        />
      </div>

      <div className={styles.pomodoroTimer__session_cards_container}>
        {pomodoroTimerTasks.length ? (
          <>
            {pomodoroTimerTasks.map((task) => (
              <PomodoroTimerSessionCard
                key={task.id}
                task={task}
                active={task.id === activePomodoroTimerTask?.id}
                onClick={() => handlePomodorTaskClicked(task)}
              />
            ))}
          </>
        ) : (
          <div className={styles.pomodoroTimer__empty_tasks_container}>
            <p>No tasks added</p>
          </div>
        )}
      </div>

      <AddPomodoroTaskModal isOpen={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} />
    </Modal>
  );
};

export default PomodoroTimer;
