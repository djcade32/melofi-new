import admin from "firebase-admin";
// "test:e2e": "concurrently \"firebase emulators:start\" \"wait-on http://localhost:9099 && node ./scripts/seedAuthUsers.js\" \"NODE_ENV=test start-server-and-test dev http://localhost:3000 cy:open\"",

// Initialize the app with the Auth emulator URL
admin.initializeApp({
  projectId: "melofi-v2",
});

process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

// Configure to use the Auth emulator
async function seedUsers() {
  console.log("Seeding users...");

  const auth = admin.auth();

  try {
    // Create a test user
    await auth.createUser({
      uid: "test-user",
      email: "test@example.com",
      emailVerified: true,
      password: "password123",
      displayName: "Test User",
    });
    console.log("Test user created.");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}

seedUsers()
  .then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
