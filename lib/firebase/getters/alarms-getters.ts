import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { createLogger } from "@/utils/logger";
const Logger = createLogger("Alarms Getters");

const db = getFirebaseDB();

// Get alarms from db
export const getAlarmsFromDB = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `widget_data/${uid}`);
    const fetchedDoc = await getDoc(userDoc);
    return fetchedDoc.data()?.alarmsList ?? [];
  } catch (error) {
    Logger.error("Error getting alarms from db: ", error);
    throw error;
  }
};
