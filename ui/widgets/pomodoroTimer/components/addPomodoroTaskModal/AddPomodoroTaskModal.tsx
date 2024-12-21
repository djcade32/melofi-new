import React, { useEffect, useRef, useState } from "react";
import styles from "./addPomodoroTaskModal.module.css";
import Input from "@/ui/components/shared/input/Input";
import { RxTimer, BsLightningCharge, BsArrowRepeat } from "@/imports/icons";
import Button from "@/ui/components/shared/button/Button";
import { isNumber } from "@/utils/number";
import usePomodoroTimerStore from "@/stores/widgets/pomodoro-timer-store";
import { PomodoroTimerTaskPayload } from "@/types/interfaces";
import { convertMinsToSecs } from "@/utils/time";

interface AddPomodoroTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPomodoroTaskModal = ({ onClose, isOpen }: AddPomodoroTaskModalProps) => {
  const inputTitleRef = useRef<HTMLInputElement>(null);

  const { addPomodoroTimerTask } = usePomodoroTimerStore();

  const [taskName, setTaskName] = useState("");
  const [focusTime, setFocusTime] = useState({ hr: 0, min: 25 });
  const [breakTime, setBreakTime] = useState({ hr: 0, min: 5 });
  const [sessions, setSessions] = useState(3);
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (isOpen) {
      inputTitleRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setFormIsValid(validateInputs());
  }, [taskName, focusTime, breakTime, sessions]);

  const handleAddTask = async () => {
    if (!formIsValid) {
      return;
    }
    const newTask: PomodoroTimerTaskPayload = {
      title: taskName,
      focusTime: convertMinsToSecs(focusTime.hr * 60 + focusTime.min),
      breakTime: convertMinsToSecs(breakTime.hr * 60 + breakTime.min),
      sessions,
    };
    await addPomodoroTimerTask(newTask);
    onClose();
    resetInputs();
  };

  const validateInputs = () => {
    return (
      taskName.length > 0 &&
      (focusTime.hr > 0 || focusTime.min > 0) &&
      (breakTime.hr > 0 || breakTime.min > 0)
    );
  };

  const handleCancel = () => {
    resetInputs();
    onClose();
  };

  const resetInputs = () => {
    setTaskName("");
    setFocusTime({ hr: 0, min: 25 });
    setBreakTime({ hr: 0, min: 5 });
    setSessions(3);
  };

  return (
    <div
      className={styles.addPomodoroTaskModal__backdrop}
      style={{
        opacity: isOpen ? 1 : 0,
        zIndex: isOpen ? 100 : -1,
      }}
    >
      <div className={styles.addPomodoroTaskModal__container}>
        <div>
          <p className={styles.addPomodoroTaskModal__title}>Task name</p>
          <Input
            ref={inputTitleRef}
            className={styles.addPomodoroTaskModal__title_input}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <RxTimer size={15} color="var(--color-effect-opacity)" />
            <p className={styles.addPomodoroTaskModal__title}>Focus time</p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "3px",
            }}
          >
            <div className={styles.addPomodoroTaskModal__time_input_container}>
              <Input
                className={styles.addPomodoroTaskModal__time_input}
                value={focusTime.hr}
                onChange={(e) => {
                  if (e.target.value.length <= 0) {
                    setFocusTime((prev) => ({ ...prev, hr: 0 }));
                    return;
                  }
                  if (isNumber(e.target.value) && parseInt(e.target.value) > 4) {
                    setFocusTime((prev) => ({ ...prev, hr: 4 }));
                    return;
                  }
                  setFocusTime((prev) => ({ ...prev, hr: parseInt(e.target.value) }));
                }}
                onBlur={() => {
                  const totalMinutes = focusTime.hr * 60 + focusTime.min;
                  if (totalMinutes > 240) {
                    setFocusTime({ hr: 4, min: 0 });
                  }
                }}
              />
              <p>hrs</p>
            </div>
            <div className={styles.addPomodoroTaskModal__time_input_container}>
              <Input
                className={styles.addPomodoroTaskModal__time_input}
                value={focusTime.min}
                onChange={(e) => {
                  if (e.target.value.length <= 0) {
                    setFocusTime((prev) => ({ ...prev, min: 0 }));
                    return;
                  }
                  if (isNumber(e.target.value) && parseInt(e.target.value) > 240) {
                    setFocusTime((prev) => ({ ...prev, min: 240 }));
                    return;
                  }
                  isNumber(e.target.value) &&
                    setFocusTime((prev) => ({ ...prev, min: parseInt(e.target.value) }));
                }}
                onBlur={() => {
                  const totalMinutes = focusTime.hr * 60 + focusTime.min;
                  if (totalMinutes > 240) {
                    setFocusTime({ hr: 4, min: 0 });
                  }
                }}
              />
              <p>mins</p>
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <BsLightningCharge size={15} color="var(--color-effect-opacity)" />
            <p className={styles.addPomodoroTaskModal__title}>Break time</p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "3px",
            }}
          >
            <div className={styles.addPomodoroTaskModal__time_input_container}>
              <Input
                className={styles.addPomodoroTaskModal__time_input}
                value={breakTime.hr}
                onChange={(e) => {
                  if (e.target.value.length <= 0) {
                    setBreakTime((prev) => ({ ...prev, hr: 0 }));
                    return;
                  }
                  if (isNumber(e.target.value) && parseInt(e.target.value) > 4) {
                    setBreakTime((prev) => ({ ...prev, hr: 4 }));
                    return;
                  }
                  setBreakTime((prev) => ({ ...prev, hr: parseInt(e.target.value) }));
                }}
                onBlur={() => {
                  const totalMinutes = breakTime.hr * 60 + breakTime.min;
                  if (totalMinutes > 240) {
                    setBreakTime({ hr: 4, min: 0 });
                  }
                }}
              />
              <p>hrs</p>
            </div>
            <div className={styles.addPomodoroTaskModal__time_input_container}>
              <Input
                className={styles.addPomodoroTaskModal__time_input}
                value={breakTime.min}
                onChange={(e) => {
                  if (e.target.value.length <= 0) {
                    setBreakTime((prev) => ({ ...prev, min: 0 }));
                    return;
                  }
                  if (isNumber(e.target.value) && parseInt(e.target.value) > 240) {
                    setBreakTime((prev) => ({ ...prev, min: 240 }));
                    return;
                  }
                  setBreakTime((prev) => ({ ...prev, min: parseInt(e.target.value) }));
                }}
                onBlur={() => {
                  const totalMinutes = breakTime.hr * 60 + breakTime.min;
                  if (totalMinutes > 240) {
                    setBreakTime({ hr: 4, min: 0 });
                  }
                }}
              />
              <p>mins</p>
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <BsArrowRepeat size={15} color="var(--color-effect-opacity)" />
            <p className={styles.addPomodoroTaskModal__title}>Sessions</p>
          </div>
          <div
            className={styles.addPomodoroTaskModal__time_input_container}
            style={{
              width: 40,
              marginTop: "3px",
            }}
          >
            <Input
              value={sessions}
              onChange={(e) => {
                if (e.target.value.length <= 0) {
                  setSessions(0);
                  return;
                }
                if (isNumber(e.target.value) && parseInt(e.target.value) > 10) {
                  setSessions(10);
                  return;
                }
                setSessions(parseInt(e.target.value));
              }}
              className={styles.addPomodoroTaskModal__time_input}
              style={{
                textAlign: "center",
              }}
            />
          </div>
        </div>

        <div className={styles.addPomodoroTaskModal__action_buttons_container}>
          <Button
            id="add-pomodoro-task-button"
            text="Cancel"
            onClick={handleCancel}
            containerClassName={styles.addPomodoroTaskModal__add_task_button}
            style={{
              backgroundColor: "transparent",
            }}
            textClassName={styles.addPomodoroTaskModal__cancel_button_text}
          />
          <Button
            disable={!formIsValid}
            id="add-pomodoro-task-button"
            text="Add"
            onClick={handleAddTask}
            containerClassName={styles.addPomodoroTaskModal__add_task_button}
          />
        </div>
      </div>
    </div>
  );
};

export default AddPomodoroTaskModal;
