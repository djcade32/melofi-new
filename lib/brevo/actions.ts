import { subscribeUser } from ".";

export const subscribeToNewsletter = async (email: string, source: string) => {
  const res = await subscribeUser(email, source);
  return res;
};
