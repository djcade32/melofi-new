import React, { useEffect, useRef, useState } from "react";
import styles from "./alarmModal.module.css";
import { Alarm } from "@/types/interfaces/alarms";
import { convertISOTimestamp } from "@/utils/date";
import Toggle from "@/ui/components/shared/toggle/Toggle";
import Input from "@/ui/components/shared/input/Input";
import Button from "@/ui/components/shared/button/Button";
import useAlarmsStore from "@/stores/widgets/alarms-store";

interface AlarmModalProps {
  alarm: Alarm | null | Partial<Alarm>;
  close: () => void;
}

const alarmModal = ({ alarm, close }: AlarmModalProps) => {
  const hourInputRef = useRef<HTMLInputElement>(null);
  const { addAlarm, updateAlarm } = useAlarmsStore();

  const [isOpen, setIsOpen] = useState(!!alarm);
  const [timeH, setTimeH] = useState("00");
  const [prevTimeH, setPrevTimeH] = useState("00");
  const [timeM, setTimeM] = useState("00");
  const [ampm, setAmpm] = useState("AM");
  const [label, setLabel] = useState(alarm?.title || "");
  const [addingAlarm, setAddingAlarm] = useState(false);

  useEffect(() => {
    setIsOpen(!!alarm);
    if (!alarm) return;
    setAddingAlarm(alarm?.id ? false : true);
    hourInputRef.current?.focus();

    setLabel(alarm.title || "");
    setTimeH(getConvertedTime(alarm?.time).h);
    setTimeM(getConvertedTime(alarm?.time).m);
    setAmpm(getConvertedTime(alarm?.time).ampm);
  }, [alarm]);

  const getConvertedTime = (
    timeStamp: string | undefined
  ): { h: string; m: string; ampm: string } => {
    if (!timeStamp) return { h: "00", m: "00", ampm: "AM" };
    const localTime = convertISOTimestamp(timeStamp);
    const h = localTime.slice(0, -2).split(":")[0];
    const m = localTime.slice(0, -2).split(":")[1];
    const ampm = localTime.slice(-2);

    return { h, m, ampm };
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const inputEl = e.target as HTMLInputElement;
    inputEl.setSelectionRange(0, 3);
  };

  const updateHour = (value: string) => {
    setPrevTimeH(timeH);
    const isNumber = value.match(/[0-9]/g);

    if (isNumber?.length !== value.length) {
      return;
    }
    if (value.length > 2) {
      if (Number(value[2]) === 0) return;
      setTimeH(value[2]);
      return;
    }
    if (Number(value) > 12) {
      if (Number(value[1]) === 0) return;
      setTimeH(value[1]);
      return;
    }
    setTimeH(value);
  };

  const updateMinute = (value: string) => {
    const valueNum = Number(value).toString();
    if (valueNum.length > 2) {
      setTimeM("0" + valueNum[2]);
      return;
    }
    if (Number(valueNum) > 59) {
      setTimeM("0" + valueNum[1]);
      return;
    }
    if (valueNum.length === 1) {
      setTimeM("0" + valueNum);
      return;
    }
    setTimeM(valueNum);
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeH === "" || Number(e.target.value) === 0) {
      setTimeH(prevTimeH);
    }
  };

  const handleConfirm = async () => {
    if (addingAlarm) {
      // Convert time to iso string
      const time = new Date();
      time.setHours(parseInt(timeH) + (ampm === "PM" ? 12 : 0));
      time.setMinutes(parseInt(timeM));
      time.setSeconds(0);
      await addAlarm(label, time.toISOString());
    } else {
      if (!alarm?.id) return;

      const time = new Date();
      time.setHours(parseInt(timeH) + (ampm === "PM" ? 12 : 0));
      time.setMinutes(parseInt(timeM));
      time.setSeconds(0);
      await updateAlarm(alarm.id, { title: label, time: time.toISOString(), isActive: true });
    }
    close();
  };

  return (
    <div
      className={styles.alarmModal__container}
      style={{
        opacity: isOpen ? 1 : 0,
        zIndex: isOpen ? 100 : -1,
      }}
    >
      <div className={styles.alarmModal__content}>
        <div className={styles.alarmModal__time}>
          <input
            ref={hourInputRef}
            type="text"
            value={timeH}
            onClick={(e) => handleInputClick(e)}
            onChange={(e) => updateHour(e.target.value)}
            onBlur={handleOnBlur}
          />
          <p>:</p>
          <input
            type="text"
            value={timeM}
            onClick={(e) => handleInputClick(e)}
            onChange={(e) => updateMinute(e.target.value)}
          />
        </div>
        <div>
          <Toggle
            values={["AM", "PM"]}
            selected={ampm}
            onChange={setAmpm}
            toggleContainerStyle={{
              backgroundColor: "var(--color-black)",
            }}
            toggleButtonStyle={{
              backgroundColor: "var(--color-secondary)",
            }}
          />
        </div>
        <div>
          <Input
            placeholder="Alarm"
            className={styles.alarmModal__label_input}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.alarmModal__buttons}>
        <Button
          id="alarm-modal-cancel-button"
          text="Cancel"
          onClick={() => close()}
          containerClassName={styles.alarmModal__button}
          textClassName={styles.alarmModal__button_text}
        />

        <Button
          id="alarm-modal-confirm-button"
          text={addingAlarm ? "Add" : "Save"}
          onClick={handleConfirm}
          containerClassName={styles.alarmModal__button}
          textClassName={styles.alarmModal__button_text}
          style={{
            backgroundColor: "var(--color-effect-opacity)",
          }}
        />
      </div>
    </div>
  );
};

export default alarmModal;
