import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { AppSettings } from "@/types/general";
import { Logger } from "@/classes/Logger";
import { IDBPDatabase } from "idb";
import { IndexedDBAppSettings } from "@/types/interfaces/indexedDb";
const db = getFirebaseDB();

// Update AppSettings in db
export const updateAppSettings = async (
  uid: string,
  appSettings: AppSettings,
  indexedDB?: IDBPDatabase | null
) => {
  if (indexedDB) {
    Logger.getInstance().info("IndexedDB updated");
    const newAppSettings: IndexedDBAppSettings = {
      alarm: { alarmSoundEnabled: appSettings.alarmSoundEnabled },
      calendar: { calendarHoverEffectEnabled: appSettings.calendarHoverEffectEnabled },
      inActivityThreshold: { inActivityThreshold: appSettings.inActivityThreshold },
      pomodoro: { pomodoroTimerSoundEnabled: appSettings.pomodoroTimerSoundEnabled },
      quote: { showDailyQuote: appSettings.showDailyQuote },
      todo: { todoListHoverEffectEnabled: appSettings.todoListHoverEffectEnabled },
      sceneRoulette: { sceneRouletteEnabled: appSettings.sceneRouletteEnabled },
      userUid: uid,
      _lastSynced: new Date().toISOString(),
    };
    await indexedDB.put("appSettings", newAppSettings, uid);
  }

  if (!navigator.onLine) {
    return {
      result: true,
      message: "App settings updated in IndexedDB",
    };
  }

  if (!db) {
    return {
      result: false,
      message: "Firebase DB is not initialized",
    };
  }
  try {
    const userDoc = doc(db, `users/${uid}`);
    await setDoc(userDoc, { appSettings }, { merge: true });
    return { result: true, message: "App settings updated successfully" };
  } catch (error) {
    Logger.getInstance().error(`Error updating app settings in db: ${error}`);
    return { result: false, message: error };
  }
};
