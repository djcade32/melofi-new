import { getFunctions, httpsCallableFromURL } from "firebase/functions";

export async function manageSubscription(): Promise<boolean> {
  const functions = getFunctions();
  const customerPortal = httpsCallableFromURL(
    functions,
    "https://us-east4-melofi-v2.cloudfunctions.net/ext-firestore-stripe-payments-createPortalLink"
  );

  try {
    const { data } = (await customerPortal({ returnUrl: window.location.origin })) as {
      data: { url: string };
    };
    window.location.assign(data.url);
    return true;
  } catch (error) {
    console.log("Error retrieving billing subscription information: ", error);
    return false;
  }
}
