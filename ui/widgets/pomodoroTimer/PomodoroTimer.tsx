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
import { convertSecsToHrMinsSec } from "@/utils/time";
import { getPomodoroTimerWorkerUrl } from "@/lib/web-workers/pomodoro-timer-worker";
import { single_bell, double_bell, triple_bell } from "@/imports/effects";
import { use } from "chai";

const PomodoroTimer = () => {
  const worker = new Worker(getPomodoroTimerWorkerUrl());
  const singleBellAudioRef = useRef<HTMLAudioElement>(null);
  const doubleBellAudioRef = useRef<HTMLAudioElement>(null);
  const tripleBellAudioRef = useRef<HTMLAudioElement>(null);

  const {
    isPomodoroTimerOpen,
    setIsPomodoroTimerOpen,
    activePomodoroTimerTask,
    pomodoroTimerTasks,
    fetchPomodoroTimerTasks,
    setActivePomodoroTimerTask,
    startTimer,
    stopTimer,
    timerTime,
    setTimerTime,
    isTimerRunning,
    setWorker,
    timerDone,
    restartTimer,
    progress,
    setProgress,
    resetTimer,
  } = usePomodoroTimerStore();
  const [activeTaskTitle, setActiveTaskTitle] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      await fetchPomodoroTimerTasks();
    };
    fetchTasks();
    setWorker(worker);
  }, []);

  useEffect(() => {
    if (activePomodoroTimerTask) {
      setActiveTaskTitle(activePomodoroTimerTask.title);
      stopTimer();
      // If this doesn't work, try using wait function from utils/general.ts
      process.nextTick(() => {
        if (activePomodoroTimerTask.completed) {
          setProgress(100);
        } else {
          setProgress(0);
        }
      });
    }
    worker.onmessage = ({ data: { time } }) => {
      setTimerTime(time);
    };
  }, [activePomodoroTimerTask]);

  useEffect(() => {
    if (!activePomodoroTimerTask) return;
    if (isTimerRunning && timerTime >= 0) {
      const currentTime =
        activePomodoroTimerTask.currentMode === "Focus"
          ? activePomodoroTimerTask.focusTime
          : activePomodoroTimerTask.breakTime;
      const increment = calculateIncrementPercentage(currentTime);

      setProgress(progress + increment);
    } else if (timerTime <= 0 && isTimerRunning) {
      playSound();
      timerDone();
    }
  }, [timerTime]);

  const handlePomodorTaskClicked = (task: PomodoroTimerTask) => {
    if (activePomodoroTimerTask?.id === task.id) {
      return;
    }
    setActivePomodoroTimerTask(task);
  };

  const getTimeString = (time: number) => {
    const convertedTime = convertSecsToHrMinsSec(time);
    return `${convertedTime.hr}h ${convertedTime.min}m ${convertedTime.sec}s`;
  };

  const getSessionCountString = () => {
    if (!activePomodoroTimerTask) {
      return "";
    }
    const sessions = activePomodoroTimerTask.sessions;
    const sessionsCompleted =
      activePomodoroTimerTask.sessions === activePomodoroTimerTask.sessionsCompleted
        ? activePomodoroTimerTask.sessionsCompleted
        : activePomodoroTimerTask.sessionsCompleted;
    return `${sessionsCompleted} of ${sessions} sessions`;
  };

  const calculateIncrementPercentage = (seconds: number): number => {
    if (seconds <= 0) {
      throw new Error("Seconds must be a positive number.");
    }
    // Calculate the increment as a percentage of 100
    return (1 / seconds) * 100;
  };

  const playSound = () => {
    if (!activePomodoroTimerTask) {
      return;
    }
    if (isFirstSession()) {
      singleBellAudioRef.current?.play();
      return;
    }

    if (wasLastSession()) {
      tripleBellAudioRef.current?.play();
    } else if (activePomodoroTimerTask.currentMode === "Focus") {
      doubleBellAudioRef.current?.play();
    } else {
      singleBellAudioRef.current?.play();
    }
  };

  const startTask = () => {
    if (activePomodoroTimerTask) {
      playSound();
      startTimer();
    }
  };

  const wasLastSession = () => {
    if (!activePomodoroTimerTask) {
      return false;
    }
    return activePomodoroTimerTask.sessions === activePomodoroTimerTask.sessionsCompleted + 1;
  };

  const isFirstSession = () => {
    if (!activePomodoroTimerTask) {
      return false;
    }
    return (
      activePomodoroTimerTask.currentMode === "Focus" &&
      activePomodoroTimerTask.sessionsCompleted === 0 &&
      progress === 0
    );
  };

  return (
    <Modal
      id={`pomodoro-timer-widget`}
      isOpen={isPomodoroTimerOpen}
      className={styles.pomodoroTimer__container}
      draggable
      showCloseIcon={false}
    >
      <audio ref={singleBellAudioRef} src={single_bell} typeof="audio/mpeg" />
      <audio ref={doubleBellAudioRef} src={double_bell} typeof="audio/mpeg" />
      <audio ref={tripleBellAudioRef} src={triple_bell} typeof="audio/mpeg" />

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
              {activePomodoroTimerTask ? getTimeString(timerTime) : "0h 0m 0s"}
            </p>
            {activePomodoroTimerTask && <p>{getSessionCountString()}</p>}
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
          containerClassName={styles.pomodoroTimer__timer_action_button_outline}
          icon={FaStop}
          size={20}
          showTooltip
          tooltipText="Stop"
          inverted
          color="var(--color-secondary-white)"
          onClick={resetTimer}
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
