import { Logger } from "@/classes/Logger";

export const subscribeUser = async (email, source) => {
  let response;
  try {
    response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.NEXT_PUBLIC_BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes: { SOURCE: source },
        listIds: [2],
        updateEnabled: true,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to add subscriber");
    }
    return Promise.resolve(true);
  } catch (error) {
    Logger.error(error);
    return Promise.reject(error);
  }
};
