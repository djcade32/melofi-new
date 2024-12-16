import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";

const db = getFirebaseDB();

// Add user to stats db
export const addUserToStats = async (email: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${email}`);
    await setDoc(usersDoc, {
      totalNotesCreated: 0,
      totalFocusTime: 0,
      totalTasksCompleted: 0,
      totalConsecutiveDays: 0,
      favoriteScene: null,
      lastLogin: new Date().toISOString(),
    });
  } catch (error) {
    console.log("Error adding user to stats db: ", error);
    throw error;
  }
};

// Update notes count in stats db
export const updateTotalNotesCreated = async (email: string, totalNotesCreated: number) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${email}`);
    await setDoc(usersDoc, { totalNotesCreated }, { merge: true });
  } catch (error) {
    console.log("Error updating notes count in stats db: ", error);
    throw error;
  }
};

// Update completed tasks Count in stats db
export const updateTotalTasksCompleted = async (email: string, totalTasksCompleted: number) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${email}`);
    await setDoc(usersDoc, { totalTasksCompleted }, { merge: true });
  } catch (error) {
    console.log("Error updating completed tasks count in stats db: ", error);
    throw error;
  }
};
