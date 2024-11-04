import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";

const db = getFirebaseDB();

// Add user to newsletter db
export const addUserToNewsletter = async (email: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `newsletter/${email}`);
    await setDoc(usersDoc, { email, isEmailVerified: false });
  } catch (error) {
    console.log("Error adding user to newsletter db: ", error);
    throw error;
  }
};

// Change user email verification status in newsletter db
export const changeUserEmailVerificationStatus = async (
  email: string,
  isEmailVerified: boolean
) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `newsletter/${email}`);
    await setDoc(usersDoc, { email, isEmailVerified });
  } catch (error) {
    console.log("Error changing user email verification status in newsletter db: ", error);
    throw error;
  }
};
