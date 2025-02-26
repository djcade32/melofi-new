import React, { useEffect, useState } from "react";
import styles from "./pomodoroTimerSessionCard.module.css";
import { RxTimer, BsLightningCharge, BsArrowRepeat, IoClose } from "@/imports/icons";
import { LinearProgress, linearProgressClasses } from "@mui/material";
import usePomodoroTimerStore from "@/stores/widgets/pomodoro-timer-store";
import { convertSecsToHrMinsSec, convertSecsToMins } from "@/utils/time";
import { PomodoroTimerTask } from "@/types/interfaces/pomodoro_timer";

interface PomodoroTimerSessionCardProps {
  task: PomodoroTimerTask;
  active: boolean;
  onClick: () => void;
}

const PomodoroTimerSessionCard = ({ task, active, onClick }: PomodoroTimerSessionCardProps) => {
  const { deletePomodoroTimerTask } = usePomodoroTimerStore();
  const [progress, setProgress] = useState<number>(0);
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    setProgress(task.percentCompleted);
  }, [task.percentCompleted]);

  const getTimeString = (time: number) => {
    if (time < 3600) {
      const min = convertSecsToMins(time);
      return `${min} ${min > 1 ? "mins" : "min"}`;
    } else {
      const { hr } = convertSecsToHrMinsSec(time);
      return `${hr} ${hr > 1 ? "hrs" : "hr"}`;
    }
  };

  return (
    <div
      id={task.id}
      className={`${styles.pomoTimerSessionCard__container} ${
        active && styles.pomoTimerSessionCard__active
      }`}
      onClick={onClick}
      style={{
        opacity: active || hovered ? 1 : 0.5,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.pomoTimerSessionCard__header}>
        <p
          className={styles.pomoTimerSessionCard__title}
          style={{
            textDecoration: task.completed ? "line-through" : "none",
          }}
        >
          {task.title}
        </p>
        {/* <HoverIcon
          containerClassName={styles.pomoTimerSessionCard__trash_icon}
          size={20}
          color="var(--color-secondary)"
          icon={HiTrash}
          hoverColor="var(--color-error)"
          onClick={(e) => {
            e.stopPropagation();
            deletePomodoroTimerTask(task.id);
          }}
        /> */}
        <div
          className={styles.pomoTimerSessionCard__active__delete_button}
          onClick={(e) => {
            e.stopPropagation();
            deletePomodoroTimerTask(task.id);
          }}
        >
          <IoClose size={12} color="var(--color-primary-opacity)" />
        </div>
      </div>
      <div className={styles.pomoTimerSessionCard__linear_progress_container}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            width: "100%",
            borderRadius: 10,
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: "var(--color-primary-opacity)",
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              backgroundColor: "var(--color-effect-opacity)",
            },
          }}
        />
        <p>{task.percentCompleted.toFixed(0)}%</p>
      </div>
      <div className={styles.pomoTimerSessionCard__footer}>
        <div>
          <RxTimer size={20} color="var(--color-effect-opacity)" />
          <p>{getTimeString(task.focusTime)}</p>
        </div>
        <div>
          <BsLightningCharge size={20} color="var(--color-effect-opacity)" />
          <p>{getTimeString(task.breakTime)}</p>
        </div>
        <div>
          <BsArrowRepeat size={20} color="var(--color-effect-opacity)" />
          <p>{task.sessions}</p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimerSessionCard;
