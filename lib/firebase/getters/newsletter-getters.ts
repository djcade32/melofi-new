import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { createLogger } from "@/utils/logger";
const Logger = createLogger("Newsletter Getters");

const db = getFirebaseDB();

// Get user from User from newsletter db
export const getUserFromNewsletterDb = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  Logger.debug.info("checking user in newsletter db with uid: ", uid);
  try {
    const userDoc = doc(db, `newsletter/${uid}`);
    const user = await getDoc(userDoc);
    return user.exists() ? user.data() : null;
  } catch (error) {
    Logger.error("Error getting user from newsletter db: ", error);
    throw error;
  }
};
