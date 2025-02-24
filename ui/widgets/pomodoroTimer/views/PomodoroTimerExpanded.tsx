import React from "react";
import styles from "../pomodoroTimer.module.css";
import { FaPlay, FaPause, FaStop, VscDebugRestart } from "@/imports/icons";
import { CircularProgress } from "@mui/material";
import PomodoroTimerSessionCard from "../components/pomodoroTimerSessionCard/PomodoroTimerSessionCard";
import usePomodoroTimerStore from "@/stores/widgets/pomodoro-timer-store";
import { DialogModalActions } from "@/types/general";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import { PomodoroTimerTask } from "@/types/interfaces/pomodoro_timer";

interface PomodoroTimerExpandedProps {
  isShown: boolean;
  activePomodoroTimerTask: PomodoroTimerTask | null;
  playSound: () => void;
  timeString: string;
  sessionCountString: string;
  setDialogProps: React.Dispatch<React.SetStateAction<DialogModalActions | null>>;
  timerTime: number;
  setTimerTime: React.Dispatch<React.SetStateAction<number>>;
  worker: Worker | null;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const PomodoroTimerExpanded = ({
  isShown,
  activePomodoroTimerTask,
  playSound,
  timeString,
  sessionCountString,
  setDialogProps,
  timerTime,
  setTimerTime,
  worker,
  progress,
  setProgress,
}: PomodoroTimerExpandedProps) => {
  const {
    pomodoroTimerTasks,
    stopTimer,
    isTimerRunning,
    restartTimer,
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
      worker?.postMessage({ turn: "on", timeInput: timerTime });
    }
  };

  const handleStopTimerClick = () => {
    setDialogProps &&
      setDialogProps(
        (prev) =>
          ({
            toggleOpen: prev?.toggleOpen === 0 ? 1 : 0,
            cancel: () => {},
            confirm: handleResetTimerClick,
            title: "Are you sure?",
            message: "Task and all progress will be reset.",
          } as DialogModalActions)
      );
  };

  const handleRestartTimerClick = () => {
    if (!activePomodoroTimerTask) return;
    restartTimer();
    const { focusTime, breakTime, currentMode } = activePomodoroTimerTask;
    worker?.postMessage({ turn: "off", timeInput: timerTime });
    setTimerTime(currentMode === "Focus" ? focusTime : breakTime);
    const newValue = progress - (progress % 100);
    setProgress(newValue);
  };

  const handleResetTimerClick = () => {
    worker?.postMessage({ turn: "off", timeInput: 0 });
    setProgress(0);
    resetTimer();
  };

  const handlePlayPauseClick = () => {
    if (isTimerRunning) {
      stopTimer();
    } else {
      startTask();
    }
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
          iconContainerClassName={styles.pomodoroTimer__timer_action_button_outline}
          icon={VscDebugRestart}
          size={20}
          showTooltip
          tooltipText="Restart"
          inverted
          color="var(--color-secondary-white)"
          onClick={handleRestartTimerClick}
          disabled={!activePomodoroTimerTask || activePomodoroTimerTask?.completed}
        />
        <HoverIcon
          id="pomodoro-timer-play-pause-button"
          iconContainerClassName={styles.pomodoroTimer__timer_action_button_fill}
          icon={isTimerRunning ? FaPause : FaPlay}
          size={20}
          showTooltip
          tooltipText={isTimerRunning ? "Pause" : "Start"}
          inverted
          color="var(--color-white)"
          invertedHoverColor="var(--color-secondary)"
          invertedBackgroundColor="var(--color-secondary-opacity)"
          onClick={handlePlayPauseClick}
          disabled={!activePomodoroTimerTask || activePomodoroTimerTask?.completed}
        />
        <HoverIcon
          id="pomodoro-timer-stop-button"
          iconContainerClassName={styles.pomodoroTimer__timer_action_button_outline}
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
