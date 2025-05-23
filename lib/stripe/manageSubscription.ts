import { getFunctions, httpsCallableFromURL } from "firebase/functions";
import { createLogger } from "@/utils/logger";
const Logger = createLogger("Manage Subscription");

export async function manageSubscription(page?: string): Promise<boolean> {
  const param = page ? page : "";
  const functions = getFunctions();
  const customerPortal = httpsCallableFromURL(
    functions,
    "https://us-east4-melofi-v2.cloudfunctions.net/ext-firestore-stripe-payments-createPortalLink"
  );

  try {
    const { data } = (await customerPortal({
      returnUrl: `${window.location.origin}/${param}`,
    })) as {
      data: { url: string };
    };
    window.location.assign(data.url);
    return true;
  } catch (error) {
    Logger.error("Error retrieving billing subscription information: ", error);
    return false;
  }
}
