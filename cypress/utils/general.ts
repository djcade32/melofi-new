/// <reference types="cypress" />

interface navigateToMelofiOptions {
  loggedIn?: boolean;
  clearLocalStorage?: boolean;
  seedWithUser?: boolean;
}

export const navigateToMelofi = (options?: navigateToMelofiOptions) => {
  options = options || {
    loggedIn: true,
    clearLocalStorage: false,
    seedWithUser: false,
  };
  cy.visit("/");
  if (options.loggedIn) {
    // Add user key to local storage
    cy.window().then((win) => {
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          name: "John",
          skippedOnboarding: true,
        })
      );
    });
  }
  // Seed the database
  if (options.seedWithUser) {
    cy.clearAuthEmulator();
    cy.signUpUser("test@example.com", "Password123");
  }
  if (options.clearLocalStorage) {
    cy.clearLocalStorage();
  }
  cy.wait(3000);
};

export const pressSceneButton = () => cy.get("#scenes-button").click({ timeout: 8000 });
export const pressMixerButton = () => cy.get("#mixer-button").click({ timeout: 8000 });
export const pressToolsButton = () => cy.get("#tools-button").click({ timeout: 8000 });

export const pressToolbarButton = (id: string) =>
  cy.get(`#${id}-widget-button`).click({ timeout: 8000 });

export const getElementWithClassName = (className: string) => cy.get(`[class*="${className}"]`);

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  INVALID_EMAIL: "Email is invalid",
  PASSWORD_WEAK: "Password must be at least 8 characters, contain uppercase letters, and numbers",
  EMAIL_ALREADY_IN_USE: "Email is already in use",
  INVALID_CREDENTIALS: "Invalid email or password",
};
