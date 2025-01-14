import React from "react";
import styles from "./alarms.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import useAlarmsStore from "@/stores/widgets/alarms-store";

const Alarms = () => {
  const { isAlarmsOpen, setIsAlarmsOpen } = useAlarmsStore();
  return (
    <Modal
      id="to-do-list-widget"
      isOpen={isAlarmsOpen}
      className={styles.alarms__container}
      title="Alarms"
      titleClassName={styles.alarms__title}
      draggable
      close={() => setIsAlarmsOpen(!isAlarmsOpen)}
    >
      Alarm
    </Modal>
  );
};

export default Alarms;
