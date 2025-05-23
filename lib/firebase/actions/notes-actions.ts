import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { Note } from "@/types/general";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Notes Actions");
const db = getFirebaseDB();

export const updateNotes = async (uid: string, notes: Note[]) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const notesDoc = doc(db, `widget_data/${uid}`);
    await setDoc(
      notesDoc,
      { notesList: JSON.stringify(notes), selectedNote: JSON.stringify(notes[0] || null) },
      { merge: true }
    );
  } catch (error) {
    Logger.error("Error updating notes in db: ", error);
    throw error;
  }
};

export const updateSelectedNote = async (uid: string, selectedNote: Note) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const notesDoc = doc(db, `widget_data/${uid}`);
    await setDoc(notesDoc, { selectedNote: JSON.stringify(selectedNote) }, { merge: true });
  } catch (error) {
    Logger.error("Error updating selected note in db: ", error);
    throw error;
  }
};
