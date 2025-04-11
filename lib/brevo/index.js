"use server";

export const subscribeUser = async (email, source) => {
  let response;
  try {
    response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes: { SOURCE: source },
        listIds: [2],
        updateEnabled: true,
      }),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: err.message || "Something went wrong" };
  }
};
