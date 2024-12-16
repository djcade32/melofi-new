import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";

const db = getFirebaseDB();

// Get user stats from stats db
export const getUserStats = async (email: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${email}`);
    const userStats = await getDoc(usersDoc);
    return userStats.data();
  } catch (error) {
    console.log("Error getting user stats from stats db: ", error);
    throw error;
  }
};
