import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { PomodoroTimerTask } from "@/types/interfaces";

const db = getFirebaseDB();

// Update pomodoro timer task list in the database
export const updatePomodoroTimerTaskInDb = async (email: string, tasks: PomodoroTimerTask[]) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }

  try {
    const tasksDoc = doc(db, `widget_data/${email}`);
    await setDoc(tasksDoc, { pomodoroTasks: tasks });
  } catch (error) {
    console.log("Error updating pomodoro timer task in db: ", error);
    throw error;
  }
};
