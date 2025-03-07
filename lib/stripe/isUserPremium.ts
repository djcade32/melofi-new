import { getFirebaseAuth } from "../firebase/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";

const auth = getFirebaseAuth();

export default function isUserPremium(): Promise<boolean> {
  return new Promise((resolve) => {
    if (process.env.NEXT_PUBLIC_IS_CYPRESS) {
      return resolve(true);
    }
    if (!auth) return resolve(false);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Cleanup the listener to avoid memory leaks

      if (!user) {
        return resolve(false);
      }

      try {
        await user.getIdToken(true);
        const decodedToken = await user.getIdTokenResult();
        resolve(!!decodedToken.claims?.stripeRole);
      } catch (error) {
        console.error("Error getting token:", error);
        resolve(false);
      }
    });
  });
}
