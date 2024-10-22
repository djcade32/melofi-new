import { navigateToMelofi } from "../utils/general";
import "cypress-real-events/support";

describe("Testing Fullscreen", () => {
  before(() => {
    navigateToMelofi();
  });

  it("Should show the fullscreen button", () => {
    cy.get("#fullscreen-button").should("be.visible");
  });

  it("Should be in fullscreen", () => {
    cy.get("#fullscreen-button").realClick();
    cy.get(".fullscreen-enabled").should("exist");
  });

  it("Should exit fullscreen", () => {
    cy.get("#fullscreen-button").click();
    cy.get("body").should("not.have.class", "fullscreen-enabled");
  });
});
