/// <reference types="cypress" />

export const navigateToMelofi = () => {
  // cy.clearLocalStorage();

  cy.visit("/");
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
  // If you get failed test. Try code below
  //   cy.wait(8000);
};

export const pressSceneButton = () => cy.get("#scenes-button").click({ timeout: 8000 });
export const pressMixerButton = () => cy.get("#mixer-button").click({ timeout: 8000 });
export const pressToolsButton = () => cy.get("#tools-button").click({ timeout: 8000 });

export const pressToolbarButton = (id: string) =>
  cy.get(`#${id}-widget-button`).click({ timeout: 8000 });
