import { navigateToMelofi } from "../utils/general";
import "cypress-real-events/support";

describe("Testing Rotating Logo", () => {
  before(() => {
    navigateToMelofi();
  });
  it("Should see logo rotating clockwise", () => {
    cy.get('[class*="header_logo_clockwise"]').should("exist");
  });

  it("Should see logo stop on hover", () => {
    cy.get("#rotating-logo")
      .realHover()
      .should("have.css", "animation", "0s ease 0s 1 reverse none running none");
  });

  it("Should see logo rotating counter clockwise", () => {
    cy.get("#rotating-logo").click();
    cy.get('[class*="header_logo_counter_clockwise"]').should("exist");
  });
});
