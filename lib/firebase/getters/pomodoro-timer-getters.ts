import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";

const db = getFirebaseDB();

// Get all pomodoro timer tasks from the database
export const getPomodoroTimerTasks = async (email: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const tasksDoc = doc(db, `widget_data/${email}`);
    const tasks = await getDoc(tasksDoc);
    return tasks.data();
  } catch (error) {
    console.log("Error getting pomodoro timer tasks from db: ", error);
    throw error;
  }
};
