import { navigateToMelofi } from "../utils/general";
import "cypress-real-events/support";

describe("Testing Rotating Logo", () => {
  beforeEach(() => {
    navigateToMelofi();
  });
  it("Should see logo rotating clockwise", () => {
    cy.get("#rotating-logo").should("have.class", "rotatingLogo_header_logo_clockwise__Z3NMS");
  });

  it("Should see logo stop on hover", () => {
    cy.get("#rotating-logo")
      .realHover()
      .should("have.css", "animation", "0s ease 0s 1 reverse none running none");
  });

  it("Should see logo rotating counter clockwise", () => {
    cy.get("#rotating-logo")
      .click()
      .should("have.class", "rotatingLogo_header_logo_counter_clockwise__UmD0H");
  });
});
