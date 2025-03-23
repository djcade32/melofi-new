import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";

const db = getFirebaseDB();

// Get all pomodoro timer tasks from the database
export const getPomodoroTimerTasks = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const tasksDoc = doc(db, `widget_data/${uid}`);
    const tasks = await getDoc(tasksDoc);
    return tasks.data()?.pomodoroTasks;
  } catch (error) {
    console.log("Error getting pomodoro timer tasks from db: ", error);
    throw error;
  }
};
