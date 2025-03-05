import { defineConfig } from "cypress";
const isCI = process.env.CI === "true";
// Have to run these tests locally

const testToSkip = ["**/auth/*.cy.js", "**/general/rotating_logo.cy.js"];
// const testToSkip = [
//   "**/auth/*.cy.js",
//   "**/widgets/*.cy.js",
//   "**/widgets/*.cy.ts",
//   "**/general/menu/about_melofi_modal.cy.js",
//   "**/general/menu/account_modal.cy.js",
//   "**/general/menu/share_modal.cy.js",
//   // "**/general/menu/*.cy.js",
//   "**/features/*.cy.ts",
//   "**/general/mixer_modal.cy.js",
//   "**/general/rotating_logo.cy.js",
//   "**/general/scene_modal.cy.js",
//   "**/general/tools.cy.js",
//   "**/general/time_display.cy.js",
//   "**/general/now_playing.cy.js",
//   "**/general/music_controls.cy.js",
//   "**/general/quote_display.cy.js",
// ];

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
