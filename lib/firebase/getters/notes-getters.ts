import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { createLogger } from "@/utils/logger";
const Logger = createLogger("Notes Getters");

const db = getFirebaseDB();

// Get alarms from db
export const getNotesFromDB = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `widget_data/${uid}`);
    const fetchedDoc = await getDoc(userDoc);
    const stringifiedList = fetchedDoc.data()?.notesList;
    const stringifiedSelectedNote = fetchedDoc.data()?.selectedNote;
    if (!stringifiedList) return { notesList: [], selectedNote: null };
    return {
      notesList: JSON.parse(stringifiedList),
      selectedNote: JSON.parse(stringifiedSelectedNote),
    };
  } catch (error) {
    Logger.error("Error getting notes from db: ", error);
    throw error;
  }
};
