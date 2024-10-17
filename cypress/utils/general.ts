/// <reference types="cypress" />

export const navigateToMelofi = () => {
  cy.clearLocalStorage();
  cy.visit("/");
  // If you get failed test. Try code below
  //   cy.wait(8000);
};

export const pressSceneButton = () => cy.get("#actionBarButton-Scenes").click({ timeout: 8000 });
export const pressMixerButton = () => cy.get("#actionBarButton-Mixer").click({ timeout: 8000 });
