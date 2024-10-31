/// <reference types="cypress" />

export const navigateToMelofi = () => {
  // cy.clearLocalStorage();

  cy.visit("/");
  // If you get failed test. Try code below
  //   cy.wait(8000);
};

export const pressSceneButton = () => cy.get("#scenes-button").click({ timeout: 8000 });
export const pressMixerButton = () => cy.get("#mixer-button").click({ timeout: 8000 });
export const pressToolsButton = () => cy.get("#tools-button").click({ timeout: 8000 });

export const pressToolbarButton = (id: string) =>
  cy.get(`#${id}-widget-button`).click({ timeout: 8000 });
