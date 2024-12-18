import React from "react";
import styles from "./pomodoroTimerSessionCard.module.css";
import { RxTimer, BsLightningCharge, BsArrowRepeat, HiTrash } from "@/imports/icons";
import { LinearProgress, linearProgressClasses } from "@mui/material";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import { PomodoroTimerTask } from "@/types/interfaces";
import usePomodoroTimerStore from "@/stores/widgets/pomodoro-timer-store";
import { convertMinsToHrAndMins, convertMinsToHr } from "@/utils/time";

interface PomodoroTimerSessionCardProps {
  task: PomodoroTimerTask;
  active: boolean;
  onClick: () => void;
}

const PomodoroTimerSessionCard = ({ task, active, onClick }: PomodoroTimerSessionCardProps) => {
  const { deletePomodoroTimerTask } = usePomodoroTimerStore();

  const getTimeString = (time: number) => {
    if (time < 60) {
      return `${time} mins`;
    } else {
      const { hr } = convertMinsToHrAndMins(time);
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
        opacity: active ? 1 : 0.5,
      }}
    >
      <div className={styles.pomoTimerSessionCard__header}>
        <p className={styles.pomoTimerSessionCard__title}>{task.title}</p>
        <HoverIcon
          containerClassName={styles.pomoTimerSessionCard__trash_icon}
          size={20}
          color="var(--color-secondary)"
          icon={HiTrash}
          hoverColor="var(--color-error)"
          onClick={(e) => {
            e.stopPropagation();
            deletePomodoroTimerTask(task.id);
          }}
        />
      </div>
      <div className={styles.pomoTimerSessionCard__linear_progress_container}>
        <LinearProgress
          variant="determinate"
          value={task.percentCompleted}
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
        <p>{task.percentCompleted}%</p>
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
