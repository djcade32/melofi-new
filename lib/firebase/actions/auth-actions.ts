import {
  createUserWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth, getFirebaseDB } from "../firebaseClient";
import { doc, setDoc } from "firebase/firestore";
import { MelofiUser } from "@/types/general";
import { addUserToNewsletter, changeUserEmailVerificationStatus } from "./newsletter-actions";
import { getUserFromUserDb } from "../getters/auth-getters";
import { getUserFromNewsletterDb } from "../getters/newsletter-getters";
import { addUserToStats } from "./stats-actions";

const auth = getFirebaseAuth();
const db = getFirebaseDB();

export const signup = async (
  email: string,
  password: string,
  firstName: string,
  newsLetterChecked: boolean
) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification();
    const user = userCredential.user;
    await updateProfile(user, {
      displayName: firstName,
    });
    newsLetterChecked && (await addUserToNewsletter(email));
    await addUserToStats(email);
    return user;
  } catch (error) {
    throw error;
  }
};

// Send email verification
export const sendEmailVerification = async () => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  if (!auth.currentUser) {
    throw new Error("No user is logged in");
  }
  try {
    await firebaseSendEmailVerification(auth.currentUser);
  } catch (error) {
    throw error;
  }
};

// Login with email and password
export const login = async (email: string, password: string) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userFoundInUserDb = await getUserFromUserDb(email);
    const userFoundInNewsletterDb = await getUserFromNewsletterDb(email);
    if (!userFoundInUserDb) {
      await addUserToUserDb(email, userCredential.user.displayName || "");
      if (userFoundInNewsletterDb) {
        await changeUserEmailVerificationStatus(email, true);
      }
    }

    const user: MelofiUser = {
      name: userCredential.user.displayName || "",
      authUser: userCredential.user,
    };
    // Set user in local storage
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    throw error;
  }
};

// logout
export const logout = async () => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  try {
    await auth.signOut();
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (displayName: string, photoURL: string) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  if (!auth.currentUser) {
    throw new Error("No user is logged in");
  }
  try {
    await updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });
  } catch (error) {
    throw error;
  }
};

// Add user to User db
export const addUserToUserDb = async (email: string, firstName: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `users/${email}`);
    const userData = {
      email,
      firstName,
    };
    await setDoc(usersDoc, userData);
  } catch (error) {
    console.log("Error adding user to user db: ", error);
    throw error;
  }
};
