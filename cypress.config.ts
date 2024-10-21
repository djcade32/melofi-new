import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000", // Use the port your app runs on
    testIsolation: false,
    viewportHeight: 1012,
    viewportWidth: 1440,
  },
});
