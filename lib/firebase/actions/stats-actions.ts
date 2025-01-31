import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { UserStats } from "@/types/general";
import { PomodoroTimerStats } from "@/types/interfaces/pomodoro_timer";
import { Auth, User } from "firebase/auth";

const db = getFirebaseDB();

// Add user to stats db
export const addUserToStats = async (user: User) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  const uid = user.uid;

  try {
    const usersDoc = doc(db, `stats/${uid}`);
    await setDoc(usersDoc, {
      pomodoroTimer: {
        totalFocusTime: 0,
        totalBreakTime: 0,
        totalSessionsCompleted: 0,
        totalTasksCompleted: 0,
      },
      totalNotesCreated: 0,
      totalFocusTime: 0,
      totalTasksCompleted: 0,
      totalConsecutiveDays: 0,
      favoriteScene: null,
      lastLogin: new Date().toISOString(),
    } as UserStats);
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

// Update Pomodoro Timer stats in stats db
export const updatePomodoroTimerStats = async (email: string, stats: PomodoroTimerStats) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${email}`);
    await setDoc(usersDoc, { pomodoroTimer: stats }, { merge: true });
  } catch (error) {
    console.log("Error updating Pomodoro Timer stats in stats db: ", error);
    throw error;
  }
};

// Update alarms expired count in stats db
export const updateAlarmsExpiredCount = async (email: string, alarmsExpiredCount: number) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${email}`);
    await setDoc(usersDoc, { alarmsExpiredCount }, { merge: true });
  } catch (error) {
    console.log("Error updating alarms expired count in stats db: ", error);
    throw error;
  }
};
