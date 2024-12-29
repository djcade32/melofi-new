import React from "react";
import styles from "../pomodoroTimer.module.css";
import { FaPlay, FaPause, FaStop, VscDebugRestart } from "@/imports/icons";
import { CircularProgress } from "@mui/material";
import PomodoroTimerSessionCard from "../components/pomodoroTimerSessionCard/PomodoroTimerSessionCard";
import usePomodoroTimerStore from "@/stores/widgets/pomodoro-timer-store";
import { DialogModalActions, PomodoroTimerTask } from "@/types/interfaces";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";

interface PomodoroTimerExpandedProps {
  isShown: boolean;
  activePomodoroTimerTask: PomodoroTimerTask | null;
  playSound: () => void;
  timeString: string;
  sessionCountString: string;
  setDialogProps: React.Dispatch<React.SetStateAction<DialogModalActions | null>>;
}

const PomodoroTimerExpanded = ({
  isShown,
  activePomodoroTimerTask,
  playSound,
  timeString,
  sessionCountString,
  setDialogProps,
}: PomodoroTimerExpandedProps) => {
  const {
    pomodoroTimerTasks,
    stopTimer,
    isTimerRunning,
    restartTimer,
    progress,
    resetTimer,
    setActivePomodoroTimerTask,
    startTimer,
  } = usePomodoroTimerStore();

  const handlePomodorTaskClicked = (task: PomodoroTimerTask) => {
    if (activePomodoroTimerTask?.id === task.id) {
      return;
    }
    setActivePomodoroTimerTask(task);
  };

  const startTask = () => {
    if (activePomodoroTimerTask) {
      playSound();
      startTimer();
    }
  };

  const handleStopTimerClick = () => {
    setDialogProps &&
      setDialogProps(
        (prev) =>
          ({
            toggleOpen: prev?.toggleOpen === 0 ? 1 : 0,
            cancel: () => {},
            confirm: resetTimer,
            title: "Are you sure?",
            message: "Task and all progress will be reset.",
          } as DialogModalActions)
      );
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      className={`${
        isShown ? styles.pomodoroTimer__expanded_fade_in : styles.pomodoroTimer__expanded_fade_out
      }`}
    >
      <div className={styles.pomodoroTimer__active_task_title_container}>
        <p>{activePomodoroTimerTask?.title}</p>
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
            value={progress}
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
              {activePomodoroTimerTask ? timeString : "0h 0m 0s"}
            </p>
            {activePomodoroTimerTask && (
              <p style={{ color: "var(--color-secondary)" }}>{sessionCountString}</p>
            )}
            {activePomodoroTimerTask && (
              <div
                className={styles.pomodoroTimer__timer_info_mode_display}
                style={{
                  backgroundColor:
                    activePomodoroTimerTask.currentMode === "Focus" ||
                    activePomodoroTimerTask.completed
                      ? "var(--color-effect-opacity)"
                      : "var(--color-primary-opacity)",
                }}
              >
                <p
                  style={{
                    color:
                      activePomodoroTimerTask.currentMode === "Focus" ||
                      activePomodoroTimerTask.completed
                        ? "var(--color-primary-opacity)"
                        : "var(--color-secondary-white)",
                  }}
                >
                  {activePomodoroTimerTask.completed
                    ? "Completed"
                    : activePomodoroTimerTask.currentMode}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.pomodoroTimer__timer_action_buttons_container}>
        <HoverIcon
          id="pomodoro-timer-reset-button"
          containerClassName={styles.pomodoroTimer__timer_action_button_outline}
          icon={VscDebugRestart}
          size={20}
          showTooltip
          tooltipText="Restart"
          inverted
          color="var(--color-secondary-white)"
          onClick={restartTimer}
          disabled={!activePomodoroTimerTask || activePomodoroTimerTask?.completed}
        />
        <HoverIcon
          id="pomodoro-timer-play-pause-button"
          containerClassName={styles.pomodoroTimer__timer_action_button_fill}
          icon={isTimerRunning ? FaPause : FaPlay}
          size={20}
          showTooltip
          tooltipText="Start"
          inverted
          color="var(--color-white)"
          invertedHoverColor="var(--color-secondary)"
          invertedBackgroundColor="var(--color-secondary-opacity)"
          onClick={() => (isTimerRunning ? stopTimer() : startTask())}
          disabled={!activePomodoroTimerTask || activePomodoroTimerTask?.completed}
        />
        <HoverIcon
          id="pomodoro-timer-stop-button"
          containerClassName={styles.pomodoroTimer__timer_action_button_outline}
          icon={FaStop}
          size={20}
          showTooltip
          tooltipText="Stop"
          inverted
          color="var(--color-secondary-white)"
          onClick={handleStopTimerClick}
          disabled={!activePomodoroTimerTask}
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
    </div>
  );
};

export default PomodoroTimerExpanded;
