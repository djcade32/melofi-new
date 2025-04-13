import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { AppSettings } from "@/types/general";
import { Logger } from "@/classes/Logger";
import { getLocalDb } from "@/lib/localDb";
const db = getFirebaseDB();

// Update AppSettings in db
export const updateAppSettings = async (uid: string, appSettings: AppSettings) => {
  //Check if online
  if (!navigator.onLine) {
    Logger.getInstance().info("Offline, updating app settings in indexedDB");
    const indexedDB = await getLocalDb();
    if (indexedDB) {
      Logger.getInstance().info("IndexedDB updated");
      await indexedDB.put("appSettings", appSettings, uid);
    } else {
      Logger.getInstance().error("IndexedDB is not initialized");
      throw new Error("IndexedDB is not initialized");
    }
    return;
  }
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
