import { getElementWithClassName, navigateToMelofi } from "../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Quote Display", () => {
  before(() => {
    navigateToMelofi({
      seedWithUser: true,
      skipOnboarding: false,
      loggedIn: true,
    });
  });

  after(() => {
    cy.clearLocalStorage();
  });

  it("should display the quote", () => {
    getElementWithClassName("quoteDisplay__container").should("be.visible");
    getElementWithClassName("quoteDisplay__text").should("be.visible");
  });

  it("should blur background when hovering over quote", () => {
    getElementWithClassName("quoteDisplay__container").realHover();
    getElementWithClassName("quoteDisplay__container").should(
      "have.css",
      "backdrop-filter",
      "blur(10px)"
    );
  });
});
