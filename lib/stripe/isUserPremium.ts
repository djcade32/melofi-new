import { UserMembership } from "@/enums/general";
import { getFirebaseAuth } from "../firebase/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";

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
        console.log("Decoded token:", decodedToken.claims);
        resolve(decodedToken.claims?.stripeRole as UserMembership | "free");
      } catch (error) {
        console.error("Error getting token:", error);
        resolve("free");
      }
    });
  });
}
