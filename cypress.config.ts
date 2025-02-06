import { defineConfig } from "cypress";
const isCI = process.env.CI === "true";
// Have to run these tests locally

// const testToSkip = ["**/auth/*.cy.js", "**/general/rotating_logo.cy.js"];
const testToSkip = [
  "**/auth/*.cy.js",
  "**/general/*.cy.js",
  "**/widgets/alarms.cy.js",
  "**/widgets/calculator.cy.js",
  "**/widgets/calendar.cy.js",
  "**/widgets/notes.cy.js",
  "**/widgets/pomodoro_timer.cy.js",
  "**/widgets/todoList.cy.js",
  "**/widgets/watch_youtube.cy.js",
  "**/general/*.cy.js",
];

export default defineConfig({
  projectId: "ci9g2u",
  e2e: {
    excludeSpecPattern: isCI ? [...testToSkip] : [],
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
