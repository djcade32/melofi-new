import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { AppSettings } from "@/types/general";
import { IDBPDatabase } from "idb";
import { IndexedDBAppSettings } from "@/types/interfaces/indexedDb";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("App Settings Actions");
const db = getFirebaseDB();

// Update AppSettings in db
export const updateAppSettings = async (
  uid: string,
  appSettings: AppSettings,
  indexedDB?: IDBPDatabase | null
) => {
  if (indexedDB) {
    Logger.debug.info("IndexedDB updated");
    const newAppSettings: IndexedDBAppSettings = {
      alarm: { alarmSoundEnabled: appSettings.alarmSoundEnabled },
      calendar: { calendarHoverEffectEnabled: appSettings.calendarHoverEffectEnabled },
      inActivityThreshold: { inActivityThreshold: appSettings.inActivityThreshold },
      pomodoro: { pomodoroTimerSoundEnabled: appSettings.pomodoroTimerSoundEnabled },
      quote: { showDailyQuote: appSettings.showDailyQuote },
      clock: { showMiddleClock: appSettings.showMiddleClock },
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
    Logger.error(`Error updating app settings in db: ${error}`);
    return { result: false, message: error };
  }
};
