import React, { useEffect, useState } from "react";
import styles from "./alarmsItem.module.css";
import Switch from "@/ui/components/shared/switch/Switch";
import { Alarm } from "@/types/interfaces/alarms";
import { convertISOTimestamp } from "@/utils/date";
import { IoClose } from "@/imports/icons";
import useAlarmsStore from "@/stores/widgets/alarms-store";

interface AlarmsItemProps {
  alarm: Alarm;
  setEditAlarmModal: React.Dispatch<React.SetStateAction<Alarm | null | Partial<Alarm>>>;
}

const AlarmsItem = ({ alarm, setEditAlarmModal }: AlarmsItemProps) => {
  const { deleteAlarm, updateAlarm } = useAlarmsStore();
  const [isAlarmActive, setIsAlarmActive] = useState(alarm.isActive);

  useEffect(() => {
    setIsAlarmActive(alarm.isActive);
  }, [alarm.isActive]);

  const handleDeleteAlarm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteAlarm(alarm);
  };

  const handleSwitchClicked = async () => {
    await updateAlarm(alarm.id, { isActive: !isAlarmActive });
    setIsAlarmActive(!isAlarmActive);
  };

  return (
    <div
      className={styles.alarmsItem__container}
      style={{ opacity: isAlarmActive ? 1 : 0.5 }}
      onClick={() => setEditAlarmModal(alarm)}
    >
      <div className={styles.alarmsItem__content}>
        <div className={styles.alarmsItem__time}>
          <p>{convertISOTimestamp(alarm.time).slice(0, -2)}</p>
          <p>{convertISOTimestamp(alarm.time).slice(-2)}</p>
        </div>
        <div>
          <p className={styles.alarmsItem__title}>{alarm.title}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Switch checked={isAlarmActive} onChange={handleSwitchClicked} />
      </div>
      <div className={styles.alarmsItem__delete_button} onClick={(e) => handleDeleteAlarm(e)}>
        <IoClose size={12} color="var(--color-primary-opacity)" />
      </div>
    </div>
  );
};

export default AlarmsItem;
