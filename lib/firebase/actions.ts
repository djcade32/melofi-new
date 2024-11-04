import {
  createUserWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth, getFirebaseDB } from "./firebaseClient";
import { collection, doc, setDoc } from "firebase/firestore";
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
    return userCredential.user;
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

// Add user to newsletter Collection
export const addUserToNewsletter = async (email: string) => {
  // Add user to newsletter collection
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
