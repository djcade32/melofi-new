import React from "react";
import styles from "../pomodoroTimer.module.css";
import { PomodoroTimerTask } from "@/types/general";
import { LinearProgress, linearProgressClasses } from "@mui/material";

interface PomodoroTimerCollapsedProps {
  isShown: boolean;
  activePomodoroTimerTask: PomodoroTimerTask | null;
  sessionCountString: string;
  timeString: string;
  taskProgress: number;
}

const PomodoroTimerCollapsed = ({
  isShown,
  activePomodoroTimerTask,
  sessionCountString,
  timeString,
  taskProgress,
}: PomodoroTimerCollapsedProps) => {
  return (
    <div
      className={`${styles.pomodoroTimer__collapsed_container} ${
        isShown ? styles.pomodoroTimer__collapsed_fade_in : styles.pomodoroTimer__collapsed_fade_out
      }`}
    >
      <div className={styles.pomodoroTimer__collapsed_header}>
        <p
          style={{
            color: activePomodoroTimerTask ? "var(--color-white)" : "var(--color-secondary)",
          }}
        >
          {activePomodoroTimerTask ? activePomodoroTimerTask.title : "No task selected"}
        </p>
        {activePomodoroTimerTask && (
          <div
            className={styles.pomodoroTimer__collapsed_task_mode}
            style={{
              backgroundColor:
                activePomodoroTimerTask.currentMode === "Focus" || activePomodoroTimerTask.completed
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
      <div className={styles.pomodoroTimer__collapsed_timer_info_container}>
        <div>
          <p>{activePomodoroTimerTask ? timeString : "0h 0m 0s"}</p>
        </div>
        <div>
          {activePomodoroTimerTask && (
            <p
              style={{
                color: "var(--color-secondary)",
                fontSize: "0.8rem",
              }}
            >
              {sessionCountString}
            </p>
          )}
        </div>
      </div>
      <div className={styles.pomodoroTimer__collapsed_progress_container}>
        <LinearProgress
          variant="determinate"
          value={taskProgress}
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
      </div>
    </div>
  );
};

export default PomodoroTimerCollapsed;
