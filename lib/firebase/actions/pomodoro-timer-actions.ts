import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { PomodoroTimerTask } from "@/types/interfaces";

const db = getFirebaseDB();

// Add a new pomodoro timer task to the database
export const addPomodoroTimerTaskToDb = async (email: string, task: PomodoroTimerTask) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }

  try {
    const tasksDoc = doc(db, `widget_data/${email}`);
    const docSnapshot = await getDoc(tasksDoc);

    if (docSnapshot.exists()) {
      // If the document exists, append the task to the array
      await updateDoc(tasksDoc, {
        pomodoroTasks: arrayUnion(task),
      });
    } else {
      // If the document does not exist, create it with the task
      await setDoc(tasksDoc, { pomodoroTasks: [task] });
    }
  } catch (error) {
    console.log("Error adding pomodoro timer task to db: ", error);
    throw error;
  }
};

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
