import { navigateToMelofi } from "../../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Tools", () => {
  before(() => {
    navigateToMelofi();
  });

  after(() => {
    cy.clearLocalStorage();
  });

  describe("Testing Toolbar functionality", () => {
    it("Should show the tools button", () => {
      cy.get("#tools-button").should("be.visible");
    });

    it("Should show toolbar", () => {
      cy.get("#tools-button").realClick();
      cy.get("#toolbar").should("exist");
    });

    it("Should undock and dock toolbar", () => {
      // Wait for the toolbar animation to finish
      cy.wait(2000);

      // Undock toolbar
      cy.get("#toolbar-more-button").realClick();
      cy.get("#menu-option-1").realClick();
      cy.get("#toolbar-handle").should("exist");

      // Dock toolbar
      cy.get("#toolbar-more-button").realClick();
      cy.get("#menu-option-1").realClick();
      cy.get("#toolbar-handle").should("not.exist");
    });

    it("Should set toolbar vertical", () => {
      // Wait for the toolbar animation to finish
      cy.wait(2000);

      cy.get("#toolbar-more-button").realClick();
      cy.get("#menu-option-2").realClick();
      cy.get("#toolbar").should("have.class", "toolbar_vertical__DqMHv");
    });
  });
});
