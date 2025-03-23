import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { PomodoroTimerTask } from "@/types/interfaces/pomodoro_timer";

const db = getFirebaseDB();

// Update pomodoro timer task list in the database
export const updatePomodoroTimerTaskInDb = async (uid: string, tasks: PomodoroTimerTask[]) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }

  try {
    const tasksDoc = doc(db, `widget_data/${uid}`);
    await setDoc(tasksDoc, { pomodoroTasks: tasks }, { merge: true });
  } catch (error) {
    console.log("Error updating pomodoro timer task in db: ", error);
    throw error;
  }
};
