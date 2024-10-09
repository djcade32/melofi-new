import { navigateToMelofi } from "../utils/general";
import "cypress-real-events/support";

describe("Testing Time Display", () => {
  beforeEach(() => {
    navigateToMelofi();
  });
  it("Should change time to 24-hour format", () => {
    cy.get("#time-display").click();
    cy.get("#time-display").realHover();
    cy.get("#time-display").should("not.include.text", "PM");
    cy.get("#time-display").should("not.include.text", "AM");
  });
});
