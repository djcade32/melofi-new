import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";

const db = getFirebaseDB();

export const getTemplatesFromDb = async (email: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `widget_data/${email}`);
    const fetchedDoc = await getDoc(userDoc);
    return fetchedDoc.data()?.templatesList;
  } catch (error) {
    console.log("Error getting templates from db: ", error);
    throw error;
  }
};
