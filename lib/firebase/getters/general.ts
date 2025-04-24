import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
const db = getFirebaseDB();

export const fetchFirebaseWidgetData = async (uid: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `widget_data/${uid}`);
    const fetchedDoc = await getDoc(userDoc);
    const data = fetchedDoc.data();
    return data;
  } catch (error) {
    console.log("Error getting widget data from db: ", error);
    throw error;
  }
};
