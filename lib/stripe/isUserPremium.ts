import { UserMembership } from "@/enums/general";
import { getFirebaseAuth } from "../firebase/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";

const auth = getFirebaseAuth();

export default function isUserPremium(): Promise<UserMembership> {
  return new Promise((resolve) => {
    if (process.env.NEXT_PUBLIC_IS_CYPRESS) {
      return resolve("premium");
    }
    if (!auth) return resolve("free");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Cleanup the listener to avoid memory leaks

      if (!user) {
        return resolve("free");
      }

      try {
        await user.getIdToken(true);
        const decodedToken = await user.getIdTokenResult();

        // Check Firestore for the user's paymentType
        const db = getFirestore();
        const checkoutSessionsRef = `users/${user.uid}/checkout_sessions`;

        // Query checkout sessions, order by creation date, and filter for one-time payment type
        const sessionsQuery = query(
          collection(db, checkoutSessionsRef),
          orderBy("created", "desc"), // Assuming you have a createdAt field
          where("paymentType", "==", "one-time") // Check for lifetime payment
        );
        const snapshot = await getDocs(sessionsQuery);

        if (!snapshot.empty) {
          // If a "one-time" paymentType exists, this user has lifetime access
          return resolve("lifetime"); // Lifetime access detected
        }

        resolve(decodedToken.claims?.stripeRole as UserMembership | "free");
      } catch (error) {
        console.error("Error getting token:", error);
        resolve("free");
      }
    });
  });
}
