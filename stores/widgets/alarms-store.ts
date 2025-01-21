import { Alarm } from "@/types/interfaces/alarms";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { updateAlarmsInDB } from "@/lib/firebase/actions/alarms-actions";
import useUserStore from "../user-store";
import { getAlarmsFromDB } from "@/lib/firebase/getters/alarms-getters";
import { buildAlarmList } from "@/lib/type-builders/alarm-type-builder";

export interface AlarmsState {
  alarmsWorker: Worker | null;
  isAlarmsOpen: boolean;
  alarmList: Alarm[];

  setIsAlarmsOpen: (value: boolean) => void;
  setAlarmList: (value: Alarm[]) => void;
  deleteAlarm: (alarm: Alarm) => Promise<void>;
  addAlarm: (label: string, time: string) => Promise<void>;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => Promise<void>;
  setAlarmsWorker: (worker: Worker) => void;
  snoozeAlarm: (alarm: Alarm) => void;
  fetchAlarms: () => Promise<void>;
}

const useAlarmsStore = create<AlarmsState>((set, get) => ({
  alarmsWorker: null,
  isAlarmsOpen: false,
  alarmList: [],

  setIsAlarmsOpen: (value) => {
    set({ isAlarmsOpen: value });
  },

  setAlarmList: (value) => {
    set({ alarmList: value });
  },

  deleteAlarm: async (alarm) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser?.authUser?.email) return;

    try {
      const { id } = alarm;
      const { alarmList, alarmsWorker } = get();
      const newAlarmList = alarmList.filter((alarm) => alarm.id !== id);
      await updateAlarmsInDB(currentUser.authUser.email, newAlarmList);
      set({ alarmList: newAlarmList });
      alarmsWorker?.postMessage({ type: "REMOVE_ALARM", data: alarm });
    } catch (error) {
      console.error("Error deleting alarm", error);
    }
  },

  addAlarm: async (label, time) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser?.authUser?.email) return;

    const alarm: Alarm = {
      id: uuidv4(),
      time,
      title: label || "Alarm",
      isActive: true,
    };
    try {
      const { alarmList, alarmsWorker } = get();
      const newAlarmList = [...alarmList, alarm];
      await updateAlarmsInDB(currentUser.authUser.email, newAlarmList);
      set({ alarmList: newAlarmList });
      alarmsWorker?.postMessage({ type: "ADD_ALARM", data: alarm });
    } catch (error) {
      console.error("Error adding alarm", error);
    }
  },

  updateAlarm: async (id, newAlarm) => {
    const { currentUser } = useUserStore.getState();
    if (!currentUser?.authUser?.email) return;

    try {
      const { alarmList, alarmsWorker } = get();
      const newAlarmList = alarmList.map((a) => {
        if (a.id === id) {
          const updatedAlarm = { ...a, ...newAlarm };
          console.log("Updated alarm: ", updatedAlarm);
          alarmsWorker?.postMessage({ type: "REMOVE_ALARM", data: a });
          updatedAlarm.isActive &&
            alarmsWorker?.postMessage({ type: "ADD_ALARM", data: updatedAlarm });
          return updatedAlarm;
        }
        return a;
      });
      await updateAlarmsInDB(currentUser.authUser.email, newAlarmList);
      set({ alarmList: newAlarmList });
    } catch (error) {
      console.error("Error updating alarm", error);
    }
  },

  setAlarmsWorker: (worker) => {
    set({ alarmsWorker: worker });
  },

  snoozeAlarm: (alarm) => {
    const { alarmsWorker } = get();
    const time = new Date();
    time.setMinutes(time.getMinutes() + 10);
    time.setSeconds(0);
    const updatedAlarm = { ...alarm, time: time.toISOString() };
    alarmsWorker?.postMessage({ type: "ADD_ALARM", data: updatedAlarm });
  },

  fetchAlarms: async () => {
    try {
      const email = useUserStore.getState().currentUser?.authUser?.email;
      if (!email) return;

      const templates = await getAlarmsFromDB(email);
      const builtAlarmList = buildAlarmList(templates);

      set({ alarmList: builtAlarmList });
      const { alarmsWorker } = get();
      alarmsWorker && (await addAlarmsToWorker(alarmsWorker, builtAlarmList));
    } catch (error) {
      console.log("Error fetching templates: ", error);
    }
  },
}));

// Helper functions

const addAlarmsToWorker = async (worker: Worker, alarms: Alarm[]) => {
  try {
    alarms.forEach((alarm) => {
      alarm.isActive && worker.postMessage({ type: "ADD_ALARM", data: alarm });
    });
  } catch (error) {
    console.error("Error adding alarms to worker", error);
  }
};

export default useAlarmsStore;
