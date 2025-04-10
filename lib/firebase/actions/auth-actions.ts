import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  sendEmailVerification as firebaseSendEmailVerification,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateEmail as firebaseUpdateEmail,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  onAuthStateChanged,
} from "firebase/auth";
import { db, getFirebaseAuth } from "../firebaseClient";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { MelofiUser, PromiseResolveType, UserStats } from "@/types/general";
import { addUserToNewsletter, changeUserEmailVerificationStatus } from "./newsletter-actions";
import { getUserFromUserDb } from "../getters/auth-getters";
import { getUserFromNewsletterDb } from "../getters/newsletter-getters";
import { addUserToStats } from "./stats-actions";
import { ERROR_MESSAGES } from "@/enums/general";

const auth = getFirebaseAuth();

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
    newsLetterChecked && (await addUserToNewsletter(user, email));
    await addUserToStats(user);
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
export const login = async (email: string, password: string, fromDashboard?: boolean) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }

  try {
    console.log("Logging in...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User credential: ", userCredential);
    // Save the user's token locally for offline access
    if (typeof window !== "undefined" && window.electronAPI) {
      const token = await userCredential.user.getIdToken();
      console.log("Token: ", token);
      storeAuthToken(email, token);
    }

    const uid = userCredential.user.uid;
    const isEmailVerified = userCredential.user.emailVerified;
    const userFoundInUserDb = await getUserFromUserDb(uid);
    const userFoundInNewsletterDb = await getUserFromNewsletterDb(uid);
    if (!userFoundInUserDb && isEmailVerified) {
      await addUserToUserDb(uid, email, userCredential.user.displayName || "");
    }
    if (userFoundInNewsletterDb && isEmailVerified) {
      console.log("User found in newsletter db");
      await changeUserEmailVerificationStatus(uid, email, true);
    }

    const user: MelofiUser = {
      name: userCredential.user.displayName || "",
      authUser: {
        uid: userCredential.user.uid,
        email: userCredential.user.email || "",
        emailVerified: userCredential.user.emailVerified,
        displayName: userCredential.user.displayName || "",
      },
    };

    fromDashboard && (user.skippedOnboarding = true);

    // Set user in local storage
    localStorage.setItem("user", JSON.stringify(user));
    saveUserData(email, user);

    return user;
  } catch (error: any) {
    if (error.code === "auth/network-request-failed") {
      const user = await tryLoginWithOfflineToken(email, fromDashboard);
      if (user) {
        console.log("User logged in with offline token: ", user);
        return user;
      } else {
        console.log("No offline token found");
        throw new Error(ERROR_MESSAGES.NO_INTERNET_CONNECTION);
      }
    }
    throw error;
  }
};

const tryLoginWithOfflineToken = async (email: string, fromDashboard?: boolean) => {
  const offlineToken = await retrieveAuthToken(email);
  if (offlineToken) {
    console.log("Offline token found: ", offlineToken);
    storeAuthToken(email, offlineToken);
    const user = await getUserData(email);
    fromDashboard && user && (user.skippedOnboarding = true);

    // Set user in local storage
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }
  return null;
};

// Login with offline token

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
export const updateUserProfile = async (displayName: string) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  if (!auth.currentUser) {
    throw new Error("No user is logged in");
  }
  try {
    await updateProfile(auth.currentUser, {
      displayName,
    });
  } catch (error) {
    console.log("Error updating user profile: ", error);
    throw error;
  }
};

// Add user to User db
export const addUserToUserDb = async (uid: string, email: string, firstName: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `users/${uid}`);
    const userData = {
      id: uid,
      email,
      firstName,
    };
    await setDoc(usersDoc, userData);
  } catch (error) {
    console.log("Error adding user to user db: ", error);
    throw error;
  }
};

interface UserInfo {
  email?: string;
  firstName?: string;
}

// Change user email or full name in User db
export const changeUserEmailOrFullNameInDb = async (uid: string, userInfo: UserInfo) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `users/${uid}`);
    await setDoc(usersDoc, userInfo, { merge: true });
  } catch (error) {
    console.log("Error changing user email or full name: ", error);
    throw error;
  }
};

// Link email and password to existing account
export const updateEmail = async (email: string) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  if (!auth.currentUser) {
    throw new Error("No user is logged in");
  }
  try {
    await changeUserEmailOrFullNameInDb(auth.currentUser.uid, {
      email,
    });
    await firebaseUpdateEmail(auth.currentUser, email);
    await sendEmailVerification();
    await changeUserEmailVerificationStatus(auth.currentUser.uid, email, false);
  } catch (error: any) {
    if (error.message.includes("auth/email-already-in-use")) {
      return new Promise((resolve) =>
        resolve({ success: false, message: "Email is already in use. Please try again." })
      );
    }
    if (error.message.includes("auth/operation-not-allowed")) {
      sendEmailVerification();
    }
    console.log("Error updating email: ", error);
    throw error;
  }
};

// Reauthenticate user
export const reauthenticateUser = async (
  email: string,
  password: string
): Promise<PromiseResolveType> => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  if (!auth.currentUser) {
    throw new Error("No user is logged in");
  }
  try {
    const credential = EmailAuthProvider.credential(email, password);
    const userCred = await reauthenticateWithCredential(auth.currentUser, credential);
    if (userCred) {
      return { success: true };
    }
  } catch (error: any) {
    console.log("Error reauthenticating user: ", error);
    if (error.message.includes("auth/invalid-credential")) {
      return { success: false, message: "Invalid password" };
    }
    throw error;
  }
  return { success: false, message: "Reauthentication failed" };
};

// Update user password
export const updatePassword = async (password: string) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  if (!auth.currentUser) {
    throw new Error("No user is logged in");
  }
  try {
    await firebaseUpdatePassword(auth.currentUser, password);
  } catch (error) {
    console.log("Error updating password: ", error);
    throw error;
  }
};

// Remove user document from firebase db
export const removeUserFromDb = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDocRef = doc(db, "users", uid);
    await deleteDoc(usersDocRef);
    const newsletterDocRef = doc(db, "newsletter", uid);
    await deleteDoc(newsletterDocRef);
    const statsDocRef = doc(db, "stats", uid);
    await deleteDoc(statsDocRef);
    console.info(`User document with UID ${uid} removed successfully.`);
  } catch (error) {
    console.log("Error removing user from db: ", error);
    throw error;
  }
};

// Delete user account
export const deleteAccount = async (uid: string) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  if (!auth.currentUser) {
    throw new Error("No user is logged in");
  }
  try {
    await removeUserFromDb(uid);
    await auth.currentUser.delete();
  } catch (error) {
    console.log("Error deleting account: ", error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }
  try {
    await auth.signOut();
  } catch (error) {
    console.log("Error signing out: ", error);
    throw error;
  }
};

export async function storeAuthToken(email: string, token: string) {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.saveAuthToken(email, token);
    console.log("Token stored successfully");
  }
}

export async function retrieveAuthToken(email: string): Promise<string | null> {
  if (typeof window !== "undefined" && window.electronAPI) {
    console.log("Retrieving token...");
    return window.electronAPI.getAuthToken(email);
  }
  return null;
}

export async function clearAuthToken(email: string) {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.clearAuthToken(email);
  }
}

export function refreshAuthToken(email: string) {
  if (!navigator.onLine) return;

  if (auth) {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const newToken = await user.getIdToken(true);
        storeAuthToken(email, newToken);
      } else {
        window.electronAPI.clearAuthToken(email);
      }
    });
  } else {
    console.error("Firebase Auth is not initialized");
  }
}

export async function saveUserData(email: string, user: MelofiUser) {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.saveUser(email, user);
    console.log("User data stored successfully");
  }
}

export async function getUserData(email: string): Promise<MelofiUser | null> {
  if (typeof window !== "undefined" && window.electronAPI) {
    return window.electronAPI.getUser(email);
  }
  return null;
}

export async function clearAllAuthTokens() {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.clearAllAuthTokens();
    console.log("All tokens cleared successfully");
  }
}

export async function saveUserStats(email: string, userStats: UserStats) {
  if (typeof window !== "undefined" && window.electronAPI) {
    window.electronAPI.saveUserStats(email, userStats);
    console.log("User stats stored successfully");
  }
}
export async function getUserStats(email: string): Promise<UserStats | null> {
  if (typeof window !== "undefined" && window.electronAPI) {
    return window.electronAPI.getUserStats(email);
  }
  return null;
}
