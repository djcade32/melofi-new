import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";

const db = getFirebaseDB();

// Get user from User from newsletter db
export const getUserFromNewsletterDb = async (email: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  console.log("checking user in newsletter db");
  try {
    const userDoc = doc(db, `newsletter/${email}`);
    const user = await getDoc(userDoc);
    return user.exists() ? user.data() : null;
  } catch (error) {
    console.log("Error getting user from newsletter db: ", error);
    throw error;
  }
};
