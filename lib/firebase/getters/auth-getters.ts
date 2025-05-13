import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { createLogger } from "@/utils/logger";
const Logger = createLogger("Auth Getters");

const db = getFirebaseDB();

// Get user from User db
export const getUserFromUserDb = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `users/${uid}`);
    const user = await getDoc(userDoc);
    return user.exists() ? user.data() : null;
  } catch (error) {
    Logger.error("Error getting user from user db: ", error);
    throw error;
  }
};
