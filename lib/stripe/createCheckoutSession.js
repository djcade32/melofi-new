import getStripe from "./initializeStripe";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { createLogger } from "@/utils/logger";
const Logger = createLogger("stripe/createCheckoutSession");

const MONTHLY = "price_1R3vYYDwmieLVZlhvhCOwg2o";
const YEARLY = "price_1R3vZsDwmieLVZlhcvg9G6BS";
const LIFETIME = "price_1RHtZqDwmieLVZlhx1pyo9sy";

export async function createCheckoutSession(uid, model, page) {
  const param = page ? page : "";
  const db = getFirestore();
  const id = uuidv4();
  let currentModel = MONTHLY;
  let paymentType = "subscription"; // Default to subscription

  if (model === "yearly") {
    currentModel = YEARLY;
  }
  if (model === "lifetime") {
    currentModel = LIFETIME;
    paymentType = "one-time"; // Mark as one-time payment for lifetime access
  }

  try {
    const checkoutSessionDoc = doc(db, `users/${uid}/checkout_sessions/${id}`);
    const checkoutSessionData = {
      price: currentModel,
      success_url: `${window.location.origin}/${param}`,
      cancel_url: `${window.location.origin}/${param}`,
      mode: model === "lifetime" ? "payment" : "subscription",
      paymentType,
    };
    await setDoc(checkoutSessionDoc, checkoutSessionData);
  } catch (error) {
    Logger.error("Error creating checkout session: ", error);
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
