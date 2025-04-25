/// <reference types="cypress" />

interface navigateToMelofiOptions {
  loggedIn?: boolean;
  skipOnboarding?: boolean;
  clearLocalStorage?: boolean;
  seedWithUser?: boolean;
  createIndexedDB?: boolean;
}

export const navigateToMelofi = (options?: navigateToMelofiOptions) => {
  options = {
    loggedIn: true,
    skipOnboarding: true,
    clearLocalStorage: true,
    seedWithUser: false,
    createIndexedDB: true,
    ...options,
  };

  // 1. Visit about:blank first to get a clean window context
  cy.visit("/blank.html");

  // 2. Set up LocalStorage and IndexedDB before visiting the actual app
  if (options.clearLocalStorage) {
    cy.clearLocalStorage();
  }

  if (options.loggedIn) {
    const userObj = options.skipOnboarding
      ? {
          name: "John",
          skippedOnboarding: true,
        }
      : {
          name: "John",
          authUser: {
            uid: "123",
            email: "test@example.com",
            emailVerified: true,
          },
        };

    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(userObj));
    });
  }

  if (options.seedWithUser) {
    cy.clearAuthEmulator();
    cy.clearFirestoreEmulator();
    cy.signUpUser("test@example.com", "Password123");
  }

  if (options.createIndexedDB) {
    cy.seedIndexedDB("melofiDB", "settings", [{ key: "hasSeenWelcomeModal", value: "true" }]);
  }

  // 3. THEN visit the actual app
  cy.visit("/", { timeout: 30000 });

  (options.loggedIn || options.skipOnboarding) && cy.get("#melofi-app").trigger("mouseover");
};

export const pressSceneButton = () => cy.get("#scenes-button").click({ timeout: 8000 });
export const pressMixerButton = () => cy.get("#mixer-button").click({ timeout: 8000 });
export const pressToolsButton = () => {
  cy.get("#tools-button").click({ timeout: 8000, force: true });
  cy.wait(1000);
};

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
