import { navigateToMelofi } from "../utils/general";
import "cypress-real-events/support";

describe("Testing Tools", () => {
  before(() => {
    navigateToMelofi();
  });
  describe("Testing Toolbar functionality", () => {
    it("Should show the tools button", () => {
      cy.get("#tools-button").should("be.visible");
    });

    it("Should show toolbar", () => {
      cy.get("#tools-button").realClick();
      cy.get("#toolbar").should("exist");
    });

    it("Should undock toolbar", () => {
      // Wait for the toolbar animation to finish
      cy.wait(2000);

      cy.get("#toolbar-more-button").realClick();
      cy.get("#menu-option-1").realClick();
      cy.get("#toolbar-handle").should("exist");
    });
  });
});
