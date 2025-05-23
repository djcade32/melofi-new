import { Alarm } from "@/types/interfaces/alarms";

const alarmsWorker = () => {
  let alarms: Alarm[] = []; // Array of alarms
  let intervalId: NodeJS.Timeout | null = null; // Track the interval ID

  // Function to start the interval if alarms exist and not already running
  const startInterval = () => {
    if (!intervalId && alarms.length > 0) {
      intervalId = setInterval(() => {
        const now = new Date().toLocaleString();

        alarms.forEach((alarm) => {
          const alarmTime = new Date(alarm.time).toLocaleString();

          if (alarmTime === now) {
            // Notify the main thread about the triggered alarm
            self.postMessage({ type: "ALARM_TRIGGERED", alarm: alarm });
            // Remove the triggered alarm to avoid repetitive notifications
            alarms = alarms.filter((a) => a.time !== alarm.time);
          }
        });

        // If all alarms are processed, stop the interval
        if (alarms.length === 0) {
          stopInterval();
        }
      }, 1000);
    }
  };

  // Function to stop the interval when no alarms remain
  const stopInterval = (id?: string) => {
    if (intervalId || id) {
      clearInterval(intervalId || id);
      intervalId = null;
    }
  };

  // Function to manage interval dynamically
  const manageInterval = () => {
    if (alarms.length === 0) {
      stopInterval(); // Stop if no alarms exist
    } else {
      startInterval(); // Start if alarms exist
    }
  };

  // Handle messages from the main thread
  self.onmessage = (e: MessageEvent<{ type: string; data: Alarm }>) => {
    const { type, data } = e.data;

    if (type === "ADD_ALARM") {
      alarms.push(data); // Add a new alarm
      manageInterval(); // Start or maintain interval
    } else if (type === "REMOVE_ALARM") {
      alarms = alarms.filter((alarm) => alarm.id !== data.id); // Remove the alarm
      manageInterval(); // Stop or maintain interval
    } else if (type === "CLEAR_ALARMS") {
      alarms = []; // Clear all alarms
      manageInterval(); // Stop the interval
    }
  };
};

const getAlarmsWorkerUrl = () => {
  let code = alarmsWorker.toString();
  code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

  const blob = new Blob([code], { type: "application/javascript" });
  return URL.createObjectURL(blob);
};

export { getAlarmsWorkerUrl };
