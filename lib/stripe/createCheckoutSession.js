import { Logger } from "@/classes/Logger";
import getStripe from "./initializeStripe";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const MONTHLY = "price_1R3vYYDwmieLVZlhvhCOwg2o";
const YEARLY = "price_1R3vZsDwmieLVZlhcvg9G6BS";

export async function createCheckoutSession(uid, model, page) {
  const param = page ? page : "";
  const db = getFirestore();
  const id = uuidv4();
  let currentModel = MONTHLY;
  if (model === "yearly") {
    currentModel = YEARLY;
  }
  try {
    const checkoutSessionDoc = doc(db, `users/${uid}/checkout_sessions/${id}`);
    const checkoutSessionData = {
      price: currentModel,
      success_url: `${window.location.origin}/${param}`,
      cancel_url: `${window.location.origin}/${param}`,
    };
    await setDoc(checkoutSessionDoc, checkoutSessionData);
  } catch (error) {
    console.log("Error creating checkout session");
    console.log(error);
    return false;
  }
  onSnapshot(doc(db, `users/${uid}/checkout_sessions/${id}`), async (doc) => {
    const { sessionId } = doc.data();
    if (sessionId) {
      try {
        const stripe = await getStripe();
        stripe.redirectToCheckout({ sessionId });
        return true;
      } catch (error) {
        Logger.error("Error redirecting to Stripe: ", error);
        return false;
      }
    }
  });
}
