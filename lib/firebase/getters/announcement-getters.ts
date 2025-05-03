import { collection, getDocs, query, where } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { AnnouncementBanner } from "@/types/general";

const db = getFirebaseDB();

export const getAnnouncements = async (): Promise<AnnouncementBanner | null> => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    // Query checkout sessions, order by creation date, and filter for one-time payment type
    const sessionsQuery = query(collection(db, "announcements"), where("isActive", "==", true));
    const snapshot = await getDocs(sessionsQuery);
    if (snapshot.empty) {
      return null;
    }
    const announcements: AnnouncementBanner[] = snapshot.docs.map((doc) => ({
      text: doc.data().text,
      start: doc.data().start,
      end: doc.data().end,
      cta: doc.data().cta,
      ctaLink: doc.data().ctaLink,
    }));
    // Sort the announcements by start date
    if (announcements.length > 1) {
      announcements.sort((a, b) => {
        return a.start.seconds - b.start.seconds;
      });
    }
    const currentDate = new Date();
    if (
      currentDate >= announcements[0].start.toDate() &&
      currentDate <= announcements[0].end.toDate()
    ) {
      return announcements[0];
    }
    return null;
  } catch (error) {
    console.log("Error getting announcements from db: ", error);
    throw error;
  }
};
