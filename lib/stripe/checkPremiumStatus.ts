import isUserPremium from "./isUserPremium";

export default async function checkPremiumStatus() {
  return await isUserPremium();
}
