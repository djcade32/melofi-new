import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { AppSettings } from "@/types/general";
import { Logger } from "@/classes/Logger";

const db = getFirebaseDB();

// Update AppSettings in db
export const updateAppSettings = async (uid: string, appSettings: AppSettings) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `users/${uid}`);
    await setDoc(userDoc, { appSettings }, { merge: true });
  } catch (error) {
    Logger.getInstance().error(`Error updating app settings in db: ${error}`);
    throw error;
  }
};
