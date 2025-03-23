import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";

const db = getFirebaseDB();

export const getTodoListFromDB = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `widget_data/${uid}`);
    const fetchedDoc = await getDoc(userDoc);
    return fetchedDoc.data()?.todoList ?? [];
  } catch (error) {
    console.log("Error getting todo list from db: ", error);
    throw error;
  }
};
