import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { createLogger } from "@/utils/logger";
const Logger = createLogger("Templates Getters");

const db = getFirebaseDB();

export const getTemplatesFromDb = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `widget_data/${uid}`);
    const fetchedDoc = await getDoc(userDoc);
    return fetchedDoc.data()?.templatesList;
  } catch (error) {
    Logger.error("Error getting templates from db: ", error);
    throw error;
  }
};
