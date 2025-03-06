import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { Task } from "@/types/general";
import { Logger } from "@/classes/Logger";

const db = getFirebaseDB();

export const updateTodoList = async (uid: string, todoList: Task[]) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const tasksDoc = doc(db, `widget_data/${uid}`);
    await setDoc(tasksDoc, { todoList }, { merge: true });
  } catch (error) {
    Logger.getInstance().error("Error adding task to db: ", error);
    throw error;
  }
};
