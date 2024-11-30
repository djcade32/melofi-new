import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { auth } from "firebase-functions/v1";

initializeApp();

export const sendVerificationLink = auth.user().onCreate(async (user) => {
  console.log(`New user created: ${user.email}`);
  try {
    // Generate a verification link for the new user
    const verificationLink = await getAuth().generateEmailVerificationLink(user.email);

    // Log the link to be captured by Cypress
    console.log(`Email verification link for ${user.email}: ${verificationLink}`);
  } catch (error) {
    console.error("Error generating email verification link:", error);
  }
});
