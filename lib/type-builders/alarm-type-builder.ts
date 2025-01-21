import { Alarm } from "@/types/interfaces/alarms";

export const buildAlarmList = (alarm: any[]): Alarm[] => {
  return alarm.map((a) => {
    return {
      id: a.id,
      time: a.time,
      title: a.title,
      isActive: a.isActive,
    };
  });
};
