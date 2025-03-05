import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebaseClient";

const auth = getAuth(app);

export default async function isUserPremium() {
  if (process.env.NEXT_PUBLIC_IS_CYPRESS) return true;
  await auth.currentUser?.getIdToken(true);
  const decodedToken = await auth.currentUser?.getIdTokenResult();
  return decodedToken?.claims?.stripeRole ? true : false;
}
