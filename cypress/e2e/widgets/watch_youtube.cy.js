import { navigateToMelofi } from "../../utils/general.ts";
import { pressToolbarButton, pressToolsButton } from "../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Watch Youtube Widget", () => {
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

  it("Should open and close watch youtube widget", () => {
    // open the calendar widget
    pressToolsButton();
    pressToolbarButton("watch-youtube");
    cy.get("#youtube-widget").should("exist");
    // close the calendar widget using widget button
    pressToolsButton();
    pressToolbarButton("watch-youtube");
    cy.get("#youtube-widget").should("not.be.visible");
    // open the calendar widget
    pressToolsButton();
    pressToolbarButton("watch-youtube");
    // close the calendar widget using close button
    cy.get("#youtube-widget-close-button").realClick();
  });

  it("Should show input when hovering over the widget", () => {
    pressToolsButton();
    pressToolbarButton("watch-youtube");

    cy.get("#youtube-widget").trigger("mouseover");
    cy.get("#youtube-widget-search-input").should("be.visible");
  });

  it("Should show video", () => {
    cy.get("#youtube-widget-search-input").type(
      "https://www.youtube.com/watch?v=57pGarTBJrU{enter}"
    );
    // Check iframe for youtube url
    cy.wait(5000);
    cy.get("#youtube-player").should(
      "have.attr",
      "title",
      "Dave Chappelle Stand-Up Monologue 2025 - SNL"
    );
  });

  it("Should show error for invalid video url", () => {
    cy.get("#youtube-widget-search-input").type("https://www.youtube.com/watch?vinvalid{enter}");
    cy.get("#melofi-toaster").should("be.visible");
  });
});
