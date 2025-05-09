import {
  navigateToMelofi,
  pressMixerButton,
  getElementWithClassName,
  pressToolsButton,
  pressToolbarButton,
} from "../../utils/general";
import "cypress-real-events/support";
import { Menu } from "../pages/Menu.page";

describe("Premium Features", () => {
  before(() => {
    navigateToMelofi({
      seedWithUser: true,
      skipOnboarding: true,
      loggedIn: true,
    });
  });

  after(() => {
    cy.clearLocalStorage();
  });

  it("should show premium modal for focus section in insights modal", () => {
    Menu.menuButton().click();
    Menu.options.insights().click();
    Menu.insightsModal.container().should("be.visible");
    Menu.insightsModal.focusSection.container().trigger("mouseover");
    getElementWithClassName("focusStatsSection__premium_button").first().click();
    cy.get("#premium-modal").should("be.visible");
    getElementWithClassName("premiumModal__title").should("contain.text", "Track Your Focus");
    cy.get("#premium-modal-close-icon").click();
    cy.get("#premium-modal").should("not.be.visible");

    // Open premium modal through premium badge
    getElementWithClassName("premiumBadge__container").click();
    cy.get("#premium-modal").should("be.visible");
    getElementWithClassName("premiumModal__title").should("contain.text", "Track Your Focus");
    cy.get("#premium-modal-close-icon").click();
    cy.get("#premium-modal").should("not.be.visible");

    // Close insights modal
    Menu.insightsModal.closeBtn().click();
  });

  it("should show premium modal for showing quotes", () => {
    Menu.menuButton().click();
    Menu.options.generalSettings().click();
    getElementWithClassName("premiumBadge__container").click();
    cy.get("#premium-modal").should("be.visible");
    getElementWithClassName("premiumModal__title").should("contain.text", "Focus with Inspiration");
    cy.get("#premium-modal-close-icon").click();
    cy.get("#premium-modal").should("not.be.visible");

    // Close insights modal
    Menu.generalSettingsModal.closeBtn().click();
  });

  describe("Mixer Modal", () => {
    before(() => {
      pressMixerButton();
    });

    after(() => {
      pressMixerButton();
    });

    it("should show premium modal for changing playlist", () => {
      getElementWithClassName("playListSection__premium_container").realHover();
      getElementWithClassName("playListSection__premium_button").first().click();
      cy.get("#premium-modal").should("be.visible");
      getElementWithClassName("premiumModal__title").should("contain.text", "Mix It Your Way");
      cy.get("#premium-modal-close-icon").click();
      cy.get("#premium-modal").should("not.be.visible");
    });

    it("should show premium modal for using spotify url", () => {
      cy.wait(1000);
      cy.get("#music-source-button-spotify").realClick();
      cy.get("#spotify-widget-search-input-go").realClick();
      cy.get("#premium-modal").should("be.visible");
      getElementWithClassName("premiumModal__title").should(
        "contain.text",
        "Stream Your Soundtrack"
      );
      cy.get("#premium-modal-close-icon").click();
      cy.get("#premium-modal").should("not.be.visible");
    });

    it("should not allow user to use premium sounds", () => {
      cy.get("#Airplane-mixer-slider").trigger("mouseover");
      getElementWithClassName("MuiTooltip-tooltip").should(
        "contain.text",
        "Upgrade to use all sounds"
      );
    });
  });

  describe("Toolbar", () => {
    before(() => {
      pressToolsButton();
    });

    it("should show premium modal for using pomodoro timer widget", () => {
      pressToolbarButton("pomodoro-timer");
      cy.get("#premium-modal").should("be.visible");
      getElementWithClassName("premiumModal__title").should("contain.text", "Power of Focus");
      cy.get("#premium-modal-close-icon").click();
      cy.get("#premium-modal").should("not.be.visible");
    });

    it("should show premium modal for using templates widget", () => {
      pressToolsButton();
      pressToolbarButton("templates");
      cy.get("#premium-modal").should("be.visible");
      getElementWithClassName("premiumModal__title").should("contain.text", "Save the Vibe");
      cy.get("#premium-modal-close-icon").click();
      cy.get("#premium-modal").should("not.be.visible");
    });

    it("should show premium modal for using alarms widget", () => {
      pressToolsButton();
      pressToolbarButton("alarms");
      cy.get("#premium-modal").should("be.visible");
      getElementWithClassName("premiumModal__title").should("contain.text", "Stay on Track");
      cy.get("#premium-modal-close-icon").click();
      cy.get("#premium-modal").should("not.be.visible");
    });

    it("should show premium modal for using watch youtube widget", () => {
      pressToolsButton();
      pressToolbarButton("watch-youtube");
      cy.get("#premium-modal").should("be.visible");
      getElementWithClassName("premiumModal__title").should("contain.text", "Watch, Focus, Repeat");
      cy.get("#premium-modal-close-icon").click();
      cy.get("#premium-modal").should("not.be.visible");
    });

    it("should show premium modal for undocking toolbar", () => {
      pressToolsButton();
      cy.get("#toolbar-more-button").realClick();
      cy.get("#menu-option-1").realClick();
      cy.get("#premium-modal").should("be.visible");
      getElementWithClassName("premiumModal__title").should(
        "contain.text",
        "Customize Your Workflow"
      );
      cy.get("#premium-modal-close-icon").click();
      cy.get("#premium-modal").should("not.be.visible");
    });

    it("should show premium modal for changing toolbar orientation", () => {
      cy.get("#toolbar-more-button").realClick();
      cy.get("#menu-option-2").realClick();
      cy.get("#premium-modal").should("be.visible");
      getElementWithClassName("premiumModal__title").should(
        "contain.text",
        "Customize Your Workflow"
      );
      cy.get("#premium-modal-close-icon").click();
      cy.get("#premium-modal").should("not.be.visible");
    });
  });

  describe("Skipped User", () => {
    before(() => {
      navigateToMelofi({
        seedWithUser: true,
        skipOnboarding: true,
        loggedIn: true,
        createIndexedDB: false,
      });

      pressMixerButton();
      getElementWithClassName("playListSection__premium_container").realHover();
      getElementWithClassName("playListSection__premium_button").first().click();
    });

    it("should show account modal", () => {
      cy.get("#premium-modal").should("be.visible");
      getElementWithClassName("premiumModal__premium_button").first().click();
      cy.get("#account-modal").should("be.visible");
    });
  });
});
