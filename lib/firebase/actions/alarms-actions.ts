import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { Alarm } from "@/types/interfaces/alarms";

const db = getFirebaseDB();

// Add alarm to db
export const updateAlarmsInDB = async (uid: string, alarms: Alarm[]) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const tasksDoc = doc(db, `widget_data/${uid}`);
    await setDoc(tasksDoc, { alarmsList: alarms }, { merge: true });
  } catch (error) {
    console.log("Error adding alarm to db: ", error);
    throw error;
  }
};
