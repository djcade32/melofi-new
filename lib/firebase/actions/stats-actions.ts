import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { SceneCounts, UserStats } from "@/types/general";
import { PomodoroTimerStats } from "@/types/interfaces/pomodoro_timer";
import { User } from "firebase/auth";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Stats Actions");
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
        tasksCompleted: [] as PomodoroTimerStats["tasksCompleted"],
      } as PomodoroTimerStats,
      totalNotesCreated: 0,
      alarmsExpiredCount: 0,
      sceneCounts: null,
      achievements: [],
    } as UserStats);
  } catch (error) {
    Logger.error(`Error adding user to stats db: ${error}`);
    throw error;
  }
};

// Update notes count in stats db
export const updateTotalNotesCreated = async (uid: string, totalNotesCreated: number) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${uid}`);
    await setDoc(usersDoc, { totalNotesCreated }, { merge: true });
  } catch (error) {
    Logger.error(`Error updating notes count in stats db: ${error}`);
    throw error;
  }
};

// Update completed tasks Count in stats db
export const updateTasksCompleted = async (uid: string, tasksCompleted: number) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${uid}`);
    await setDoc(usersDoc, { tasksCompleted }, { merge: true });
  } catch (error) {
    Logger.error(`Error updating completed tasks in stats db: ${error}`);
    throw error;
  }
};

// Update Pomodoro Timer stats in stats db
export const updatePomodoroTimerStats = async (uid: string, stats: PomodoroTimerStats) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${uid}`);
    await setDoc(usersDoc, { pomodoroTimer: stats }, { merge: true });
  } catch (error) {
    Logger.error(`Error updating pomodoro timer stats in stats db: ${error}`);
    throw error;
  }
};

// Update alarms expired count in stats db
export const updateAlarmsExpiredCount = async (uid: string, alarmsExpiredCount: number) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${uid}`);
    await setDoc(usersDoc, { alarmsExpiredCount }, { merge: true });
  } catch (error) {
    Logger.error(`Error updating alarms expired count in stats db: ${error}`);
    throw error;
  }
};

// Update scene counts in stats db
export const updateSceneCounts = async (uid: string, sceneCounts: SceneCounts) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${uid}`);
    await setDoc(usersDoc, { sceneCounts }, { merge: true });
  } catch (error) {
    Logger.error(`Error updating scene counts in stats db: ${error}`);
    throw error;
  }
};

// Reset user stats data in stats db
export const resetUserStats = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const usersDoc = doc(db, `stats/${uid}`);
    await setDoc(usersDoc, {
      pomodoroTimer: {
        totalFocusTime: 0,
        totalBreakTime: 0,
        totalSessionsCompleted: 0,
        tasksCompleted: [] as PomodoroTimerStats["tasksCompleted"],
      } as PomodoroTimerStats,
      totalNotesCreated: 0,
      sceneCounts: null,
      alarmsExpiredCount: 0,
      achievements: [],
    } as UserStats);
  } catch (error) {
    Logger.error(`Error resetting user stats in stats db: ${error}`);
    throw error;
  }
};

// Update user stats in stats db
/**
 *
 * @param uid
 * @param stats
 * @returns { result: boolean; message: string }
 * @description Updates user stats in the stats database. If the database is not initialized, it returns an error message.
 */
export const updateUserStats = async (uid: string, stats: Partial<UserStats>) => {
  if (!db) {
    return { result: false, message: "Firebase DB is not initialized" };
  }
  try {
    const usersDoc = doc(db, `stats/${uid}`);
    await setDoc(usersDoc, stats, { merge: true });
    return { result: true, message: "User stats updated successfully" };
  } catch (error) {
    Logger.error(`Error updating user stats in stats db: ${error}`);
    return { result: false, message: error };
  }
};
