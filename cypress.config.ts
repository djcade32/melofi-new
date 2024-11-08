import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // Set environment variables for Cypress
      config.env.NEXT_PUBLIC_IS_CYPRESS = true;
      config.env.IS_CYPRESS = true;
      config.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"; // Firebase Auth Emulator Host

      return config;
    },
    baseUrl: "http://localhost:3000", // Use the port your app runs on
    testIsolation: false,
    viewportHeight: 1012,
    viewportWidth: 1440,
  },
  env: {
    firebaseAuthEmulatorHost: "localhost:9099",
    firebaseFirestoreEmulatorHost: "localhost:8080",
    NEXT_PUBLIC_IS_CYPRESS: true,
    IS_CYPRESS: true,
    FIREBASE_AUTH_EMULATOR_HOST: "localhost:9099",
  },
});
