import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { User } from "firebase/auth";
import { subscribeUser } from "@/lib/brevo";

const db = getFirebaseDB();

// Add user to newsletter db
export const addUserToNewsletter = async (user: User, email: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  const uid = user.uid;

  try {
    const usersDoc = doc(db, `newsletter/${uid}`);
    await setDoc(usersDoc, { email, isEmailVerified: false });
  } catch (error) {
    console.log("Error adding user to newsletter db: ", error);
    throw error;
  }
};

// Change user email verification status in newsletter db
export const changeUserEmailVerificationStatus = async (
  uid: string,
  email: string,
  isEmailVerified: boolean
) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `newsletter/${uid}`);
    await setDoc(usersDoc, { email, isEmailVerified });
    isEmailVerified && subscribeUser(email, "melofi_signup");
  } catch (error) {
    console.log("Error changing user email verification status in newsletter db: ", error);
    throw error;
  }
};
