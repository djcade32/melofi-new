import useTimerStore from "@/stores/widgets/timer-store";
import Modal from "@/ui/components/shared/modal/Modal";
import React, { useEffect, useRef, useState } from "react";
import styles from "./timer.module.css";
import { isNumber } from "@/utils/number";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import { FaPause, FaPlay, VscDebugRestart, IoCloseOutline, MdTimer } from "@/imports/icons";
import { getTimerWorkerUrl } from "@/lib/web-workers/timer-worker";
import { convertSecsToHrMinsSec } from "@/utils/time";
import { timer_alarm } from "@/imports/effects/index";
import useNotificationProviderStore from "@/stores/notification-provider-store";
import { NotificationType } from "@/types/general";

const TimerButton = (text: string, bgColor: string) => {
  return (
    <div
      className={styles.timer__timer_button}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <p>{text}</p>
    </div>
  );
};

const Timer = () => {
  const timerRef = useRef<HTMLAudioElement | null>(null);
  const {
    isTimerOpen,
    setIsTimerOpen,
    startTimer,
    isTimerRunning,
    stopTimer,
    resetTimer,
    originalTime,
    timerIsDone,
    setOriginalTime,
  } = useTimerStore();

  const [isHovered, setIsHovered] = useState(false);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isDone, setIsDone] = useState(false);

  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    setWorker(new Worker(getTimerWorkerUrl()));
  }, []);

  useEffect(() => {
    if (!worker) return;
    worker.onmessage = ({ data: { time } }) => {
      changeTimeDisplay(time);
      if (time <= 0) {
        setIsDone(true);
      }
    };
  }, [worker]);

  useEffect(() => {
    if (isDone && originalTime) {
      setIsDone(false);
      timerRef.current?.play();
      useNotificationProviderStore.getState().addNotification({
        message: `${getOriginalTimeDisplay()} timer is done!`,
        type: "alarm",
        icon: MdTimer,
        actions: [
          {
            element: TimerButton("Repeat", "var(--color-secondary)"),
            onClick: () => {
              resetAudio();
              worker && startTimer(worker, originalTime);
            },
          },
          {
            element: TimerButton("Stop", "var(--color-effect-opacity)"),
            onClick: () => {
              resetAudio();
              setOriginalTime(null);
            },
          },
        ],
      } as NotificationType);
      worker && timerIsDone(worker);
    }
  }, [isDone]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isNumber(value)) return;
    let formattedValue = value.length === 1 ? `0${value}` : value;
    formattedValue = formattedValue.length > 2 ? formattedValue.slice(1) : formattedValue;
    formattedValue =
      (name === "minutes" || name === "seconds") && Number(formattedValue) > 59
        ? "59"
        : formattedValue;

    if (name === "hours") {
      setHours(!formattedValue.length ? "00" : formattedValue);
    }
    if (name === "minutes") {
      setMinutes(!formattedValue.length ? "00" : formattedValue);
    }
    if (name === "seconds") {
      setSeconds(!formattedValue.length ? "00" : formattedValue);
    }
  };

  const convertTimeToSeconds = (hours: string, minutes: string, seconds: string) => {
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  };

  const changeTimeDisplay = (time: number) => {
    const { hr, min, sec } = convertSecsToHrMinsSec(time);
    setHours(hr.toString().padStart(2, "0"));
    setMinutes(min.toString().padStart(2, "0"));
    setSeconds(sec.toString().padStart(2, "0"));
  };

  const handlePlayPauseClick = () => {
    if (!worker) return;
    if (isTimerRunning) {
      stopTimer(worker);
    } else {
      startTimer(worker, convertTimeToSeconds(hours, minutes, seconds));
    }
  };

  const handleResetTimerClick = () => {
    if (!worker) return;
    resetTimer(worker);
    changeTimeDisplay(originalTime || 0);
  };

  const getOriginalTimeDisplay = () => {
    if (!originalTime) return null;
    const { hr, min, sec } = convertSecsToHrMinsSec(originalTime);
    let string = "";
    if (hr) string += `${hr}h `;
    if (min) string += `${min}m `;
    if (sec) string += `${sec}s`;
    return string;
  };

  const resetAudio = () => {
    if (!timerRef.current) return;
    timerRef.current.pause();
    timerRef.current.currentTime = 0;
  };

  return (
    <Modal
      id="timer-widget"
      isOpen={isTimerOpen}
      className={styles.timer__container}
      draggable
      close={() => setIsTimerOpen(!isTimerOpen)}
      isWidget
      name="timer"
      showCloseIcon={false}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <audio id="timer-audio" ref={timerRef} src={timer_alarm} loop typeof="audio/mpeg" />
      <div className={styles.timer__content}>
        <IoCloseOutline
          id="timer-widget-close-button"
          size={25}
          color="var(--color-secondary)"
          onClick={() => setIsTimerOpen(false)}
          style={{
            cursor: "pointer",
            zIndex: 1,
            position: "absolute",
            top: -10,
            right: -10,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
        <div className={styles.timer__time_container}>
          <div className={styles.timer__time_input_container}>
            <input
              id="timer-input-hours"
              type="text"
              value={hours}
              name="hours"
              onChange={(e) => handleTimeChange(e)}
              placeholder="00"
              disabled={isTimerRunning}
            />
            <p>h</p>
          </div>

          <span>:</span>
          <div className={styles.timer__time_input_container}>
            <input
              id="timer-input-minutes"
              type="text"
              value={minutes}
              name="minutes"
              onChange={(e) => handleTimeChange(e)}
              placeholder="00"
              disabled={isTimerRunning}
            />
            <p>m</p>
          </div>
          <span>:</span>
          <div className={styles.timer__time_input_container}>
            <input
              id="timer-input-seconds"
              type="text"
              value={seconds}
              name="seconds"
              onChange={(e) => handleTimeChange(e)}
              placeholder="00"
              disabled={isTimerRunning}
            />
            <p>s</p>
          </div>
        </div>
        <div className={styles.timer__action_buttons_container}>
          <HoverIcon
            id="timer-start-pause-button"
            iconContainerClassName={styles.timer__play_button}
            icon={isTimerRunning ? FaPause : FaPlay}
            size={20}
            showTooltip
            tooltipText={isTimerRunning ? "Pause" : "Start"}
            inverted
            color="var(--color-white)"
            invertedHoverColor="var(--color-secondary)"
            invertedBackgroundColor="var(--color-secondary-opacity)"
            onClick={handlePlayPauseClick}
            disabled={hours === "00" && minutes === "00" && seconds === "00"}
          />
          <HoverIcon
            id="timer-reset-button"
            iconContainerClassName={styles.timer__restart_button}
            icon={VscDebugRestart}
            size={20}
            showTooltip
            tooltipText={"Reset"}
            inverted
            color="var(--color-white)"
            invertedHoverColor="var(--color-secondary)"
            invertedBackgroundColor="transparent"
            onClick={handleResetTimerClick}
            disabled={hours === "00" && minutes === "00" && seconds === "00"}
          />
        </div>
        <div className={styles.timer__original_time_container}>
          <p>{getOriginalTimeDisplay()}</p>
        </div>
      </div>
    </Modal>
  );
};

export default Timer;
