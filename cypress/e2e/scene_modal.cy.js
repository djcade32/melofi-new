/// <reference types="cypress" />
import { pressSceneButton, navigateToMelofi } from "../utils/general";

describe("Testing Scene Modal", () => {
  beforeEach(() => {
    navigateToMelofi();
  });

  it("should open and close Scene Modal", () => {
    pressSceneButton();
    cy.get("#scene-modal").should("be.visible");

    pressSceneButton();
    cy.get("#scene-modal").should("not.be.visible");

    pressSceneButton();
    cy.get("#scene-modal").should("be.visible");
    cy.get("#background-video").click();
    cy.get("#scene-modal").should("not.be.visible");
  });

  it("should have scene thumbnails showing", () => {
    pressSceneButton();
    cy.get("#scene-modal-carousel")
      .find("#carousel-item")
      .should(($items) => {
        expect($items.length).to.be.greaterThan(0);
      });
  });

  it("should change background on scene tumbnail click", () => {
    pressSceneButton();
    cy.get("#background-video").should("have.attr", "src").and("include", "girl-in-cafe");
    cy.get("#scene-modal-carousel").find("#carousel-item").siblings().first().click();
    cy.get("#background-video").should("have.attr", "src").and("include", "neighborhood-cafe");
  });
});
