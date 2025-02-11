import React, { useEffect, useRef, useState } from "react";
import styles from "./alarms.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import useAlarmsStore from "@/stores/widgets/alarms-store";
import AlarmsItem from "./components/alarmsItem/AlarmsItem";
import { Alarm } from "@/types/interfaces/alarms";
import EditAlarmModal from "./components/alarmModal/AlarmModal";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import { FiPlus, IoAlarm } from "@/imports/icons";
import { getAlarmsWorkerUrl } from "@/lib/web-workers/alarms-worker";
import useNotificationProviderStore from "@/stores/notification-provider-store";
import { NotificationType } from "@/types/general";
import { timer_alarm } from "@/imports/effects/index";
import useUserStatsStore from "@/stores/user-stats-store";

const AlarmButton = (text: string, bgColor: string) => {
  return (
    <div
      className={styles.alarms__button}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <p>{text}</p>
    </div>
  );
};

const Alarms = () => {
  const alarmsWorker = new Worker(getAlarmsWorkerUrl());
  const timerAudioRef = useRef<HTMLAudioElement>(null);

  const {
    isAlarmsOpen,
    setIsAlarmsOpen,
    alarmList,
    updateAlarm,
    setAlarmsWorker,
    snoozeAlarm,
    fetchAlarms,
  } = useAlarmsStore();
  const { addNotification } = useNotificationProviderStore();
  const { incrementExpiredAlarmsCount } = useUserStatsStore();
  const [editAlarmModal, setEditAlarmModal] = useState<Alarm | null | Partial<Alarm>>(null);

  useEffect(() => {
    setAlarmsWorker(alarmsWorker);
    const getAlarms = async () => {
      await fetchAlarms();
    };
    getAlarms();
  }, []);

  const showBackdrop = () => {
    return !!editAlarmModal;
  };

  const handleAddAlarm = () => {
    setEditAlarmModal({ time: new Date().toISOString() });
  };

  const stopAndResetAudio = () => {
    if (timerAudioRef.current) {
      timerAudioRef.current?.pause();
      timerAudioRef.current.currentTime = 0;
    }
  };

  // Handle messages from the worker
  alarmsWorker.onmessage = (e: MessageEvent<{ type: string; alarm: Alarm }>) => {
    const { type, alarm } = e.data;

    if (type === "ALARM_TRIGGERED") {
      console.log(`Alarm triggered for: ${alarm}`);
      timerAudioRef.current?.play();
      addNotification({
        message: `${alarm.title}`,
        type: "alarm",
        icon: IoAlarm,
        actions: [
          {
            element: AlarmButton("Snooze", "var(--color-secondary)"),
            onClick: () => {
              stopAndResetAudio();
              snoozeAlarm(alarm);
            },
          },
          {
            element: AlarmButton("Dismiss", "var(--color-effect-opacity)"),
            onClick: async () => {
              stopAndResetAudio();
              await updateAlarm(alarm.id, { isActive: false });
              await incrementExpiredAlarmsCount();
            },
          },
        ],
      } as NotificationType);
    }
  };

  return (
    <Modal
      id="alarms-widget"
      isOpen={isAlarmsOpen}
      className={styles.alarms__container}
      title="Alarms"
      titleClassName={styles.alarms__title}
      draggable
      close={() => setIsAlarmsOpen(!isAlarmsOpen)}
      showBackdrop={showBackdrop()}
      isWidget
      name="alarms"
    >
      <audio ref={timerAudioRef} src={timer_alarm} typeof="audio/mpeg" loop />
      <div className={styles.alarms__content}>
        {alarmList.length ? (
          alarmList.map((alarm) => (
            <AlarmsItem key={alarm.id} alarm={alarm} setEditAlarmModal={setEditAlarmModal} />
          ))
        ) : (
          <div className={styles.alarms__empty}>
            <p>No Alarms Set</p>
          </div>
        )}
      </div>
      <HoverIcon
        id="add-alarm-button"
        icon={FiPlus}
        tooltipText="Add Alarm"
        showTooltip
        size={25}
        color="var(--color-white)"
        hoverColor="var(--color-secondary-white)"
        inverted
        invertedHoverColor="var(--color-secondary)"
        invertedBackgroundColor="#413F41"
        onClick={handleAddAlarm}
        iconContainerClassName={styles.alarms__add_button}
        containerClassName={styles.alarms__add_button_container}
      />

      <EditAlarmModal alarm={editAlarmModal} close={() => setEditAlarmModal(null)} />
    </Modal>
  );
};

export default Alarms;
