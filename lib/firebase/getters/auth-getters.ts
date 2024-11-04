import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";

const db = getFirebaseDB();

// Get user from User db
export const getUserFromUserDb = async (email: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `users/${email}`);
    const user = await getDoc(userDoc);
    return user.exists() ? user.data() : null;
  } catch (error) {
    console.log("Error getting user from user db: ", error);
    throw error;
  }
};
