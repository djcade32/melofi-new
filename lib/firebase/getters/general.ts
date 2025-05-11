import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { createLogger } from "@/utils/logger";
const Logger = createLogger("General Firebase Getters");
const db = getFirebaseDB();

export const fetchFirebaseWidgetData = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `widget_data/${uid}`);
    const fetchedDoc = await getDoc(userDoc);
    const data = fetchedDoc.data();
    return data;
  } catch (error) {
    Logger.error("Error getting widget data from db: ", error);
    throw error;
  }
};
