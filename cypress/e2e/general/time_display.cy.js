import { navigateToMelofi } from "../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Time Display", () => {
  before(() => {
    navigateToMelofi();
  });

  after(() => {
    cy.clearLocalStorage();
  });

  it("Should change time to 24-hour format", () => {
    cy.get("#time-display").click();
    cy.get("#time-display").realHover();
    cy.get("#time-display").should("not.include.text", "PM");
    cy.get("#time-display").should("not.include.text", "AM");
  });
});
