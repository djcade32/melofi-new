import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { Logger } from "@/classes/Logger";

const db = getFirebaseDB();

// Get user stats from stats db
export const getUserStats = async (uid: string) => {
  Logger.getInstance().info(`Getting user stats from stats db for user: ${uid}`);
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${uid}`);
    const userStats = await getDoc(usersDoc);
    return userStats.data();
  } catch (error) {
    Logger.getInstance().error(`Error getting user stats from stats db: ${error}`);
    throw error;
  }
};
