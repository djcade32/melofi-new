import React, { useEffect, useRef, useState } from "react";
import styles from "./pomodoroTimer.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import usePomodoroTimerStore from "@/stores/widgets/pomodoro-timer-store";
import { IoCloseOutline, FiMinimize2, FiPlus, FiMaximize2 } from "@/imports/icons";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";

import AddPomodoroTaskModal from "./components/addPomodoroTaskModal/AddPomodoroTaskModal";
import { convertSecsToHrMinsSec } from "@/utils/time";
import { getPomodoroTimerWorkerUrl } from "@/lib/web-workers/pomodoro-timer-worker";
import { single_bell, double_bell, triple_bell } from "@/imports/effects";
import PomodoroTimerExpanded from "./views/PomodoroTimerExpanded";
import PomodoroTimerCollapsed from "./views/PomodoroTimerCollapsed";
import DialogModal from "@/ui/components/shared/dialogModal/DialogModal";
import { DialogModalActions } from "@/types/general";
import useAppStore from "@/stores/app-store";

const PomodoroTimer = () => {
  // const worker = new Worker(getPomodoroTimerWorkerUrl());
  const singleBellAudioRef = useRef<HTMLAudioElement>(null);
  const doubleBellAudioRef = useRef<HTMLAudioElement>(null);
  const tripleBellAudioRef = useRef<HTMLAudioElement>(null);

  const {
    isPomodoroTimerOpen,
    setIsPomodoroTimerOpen,
    activePomodoroTimerTask,
    fetchPomodoroTimerTasks,
    stopTimer,
    isTimerRunning,
    timerDone,
  } = usePomodoroTimerStore();
  const { appSettings } = useAppStore();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [resetTimerDialog, setResetDialogTimer] = useState<DialogModalActions | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timerTime, setTimerTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      await fetchPomodoroTimerTasks();
    };
    fetchTasks();
    setWorker(new Worker(getPomodoroTimerWorkerUrl()));
  }, []);

  useEffect(() => {
    if (activePomodoroTimerTask) {
      stopTimer();
      worker?.postMessage({ turn: "off", timeInput: timerTime });
      // If this doesn't work, try using wait function from utils/general.ts
      process.nextTick(() => {
        if (activePomodoroTimerTask.completed) {
          setProgress(100);
        } else {
          const { focusTime, breakTime, currentMode } = activePomodoroTimerTask;
          setProgress(0);
          setTimerTime(currentMode === "Focus" ? focusTime : breakTime);
        }
      });
    }
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
      timerIsDone();
    }
  }, [timerTime]);

  useEffect(() => {
    if (!worker) {
      return;
    }
    worker.onmessage = ({ data: { time } }) => {
      setTimerTime(time);
    };
  }, [worker]);

  useEffect(() => {
    if (isTimerRunning) {
      worker?.postMessage({ turn: "on", timeInput: timerTime });
    } else {
      worker?.postMessage({ turn: "off", timeInput: timerTime });
    }
  }, [isTimerRunning]);

  const timerIsDone = async () => {
    await timerDone(setTimerTime);
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
      appSettings.pomodoroTimerSoundEnabled && tripleBellAudioRef.current?.play();
    } else if (activePomodoroTimerTask.currentMode === "Focus") {
      doubleBellAudioRef.current?.play();
    } else {
      singleBellAudioRef.current?.play();
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

  return (
    <Modal
      id={`pomodoro-timer-widget`}
      isOpen={isPomodoroTimerOpen}
      className={`${styles.pomodoroTimer__container} ${
        isCollapsed
          ? styles.pomodoroTimer__container_collapse
          : styles.pomodoroTimer__container_expand
      }`}
      draggable
      showCloseIcon={false}
      isWidget
      name="pomodoro-timer"
    >
      <audio ref={singleBellAudioRef} src={single_bell} typeof="audio/mpeg" />
      <audio ref={doubleBellAudioRef} src={double_bell} typeof="audio/mpeg" />
      <audio ref={tripleBellAudioRef} src={triple_bell} typeof="audio/mpeg" />

      <div className={styles.pomodoroTimer__header}>
        <div>
          {!isCollapsed && (
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
              iconContainerClassName={styles.pomodoroTimer__add_task_button}
            />
          )}
        </div>
        <div className={styles.pomodorTimer__header_right_side}>
          {isCollapsed ? (
            <FiMaximize2
              id="pomodoro-timer-expand-button"
              size={20}
              color="var(--color-secondary)"
              onClick={() => setIsCollapsed((prev) => !prev)}
              style={{
                cursor: "pointer",
                zIndex: 1,
              }}
            />
          ) : (
            <FiMinimize2
              id="pomodoro-timer-collapse-button"
              size={20}
              color="var(--color-secondary)"
              onClick={() => setIsCollapsed((prev) => !prev)}
              style={{
                cursor: "pointer",
                zIndex: 1,
              }}
            />
          )}
          <IoCloseOutline
            id="pomodoro-timer-widget-close-icon"
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
      <div
        style={{
          position: "relative",
          height: "100%",
        }}
      >
        <PomodoroTimerExpanded
          isShown={!isCollapsed}
          playSound={playSound}
          activePomodoroTimerTask={activePomodoroTimerTask}
          sessionCountString={getSessionCountString()}
          timeString={getTimeString(timerTime)}
          setDialogProps={setResetDialogTimer}
          timerTime={timerTime}
          setTimerTime={setTimerTime}
          worker={worker}
          progress={progress}
          setProgress={setProgress}
        />
        <PomodoroTimerCollapsed
          isShown={isCollapsed}
          activePomodoroTimerTask={activePomodoroTimerTask}
          sessionCountString={getSessionCountString()}
          timeString={getTimeString(timerTime)}
          taskProgress={activePomodoroTimerTask?.percentCompleted || 0}
        />
      </div>

      <AddPomodoroTaskModal isOpen={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} />
      <DialogModal
        id="pomodoroTimer__stop_modal"
        dialogProps={resetTimerDialog}
        modalStyle={{
          transform: "translateY(-100px)",
        }}
      />
    </Modal>
  );
};

export default PomodoroTimer;
