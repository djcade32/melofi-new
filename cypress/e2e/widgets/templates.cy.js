import {
  navigateToMelofi,
  pressMixerButton,
  pressToolbarButton,
  pressToolsButton,
  getElementWithClassName,
} from "../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Templates Widget", () => {
  before(() => {
    navigateToMelofi({
      seedWithUser: true,
      skipOnboarding: false,
      loggedIn: true,
    });
    cy.wait(5000);
  });

  after(() => {
    cy.clearAuthEmulator();
    cy.wait(2000);
    cy.clearFirestoreEmulator();
  });

  // This only runs in Github
  it("Should clear all templates before starting", () => {
    pressToolsButton();
    pressToolbarButton("templates");
    cy.wait(2000);

    // Must do this because the templates persist wen the tests are ran through Github
    getElementWithClassName("templates__content").then(($el) => {
      if ($el.find("[class*='templatesListItem__container']").length) {
        getElementWithClassName("templatesListItem__container").then(($elements) => {
          cy.wrap($elements).each(($el) => {
            cy.wrap($el).find("[class*='templatesListItem__trash_icon']").click({ force: true });
            cy.wait(1000);
          });
        });
      }
    });
    getElementWithClassName("templates__empty").contains("No Templates");

    pressToolsButton();
    pressToolbarButton("templates");
  });

  it("Should open and close Templates widget", () => {
    // open the templates widget
    pressToolsButton();
    pressToolbarButton("templates");
    cy.get("#templates-widget").should("exist");
    // close the templates widget using widget button
    pressToolsButton();
    pressToolbarButton("templates");
    cy.get("#templates-widget").should("not.be.visible");
    // open the templates widget
    pressToolsButton();
    pressToolbarButton("templates");
    // close the templates widget using close button
    cy.get("#templates-widget-close-icon").realClick();
  });

  it("Should save a template", () => {
    pressToolsButton();
    pressToolbarButton("templates");
    cy.wait(1000);

    getElementWithClassName("templates__empty").contains("No Templates");
    getElementWithClassName("templates__add_template_button_container").realClick();
    getElementWithClassName("addTemplate__container").should("have.css", "opacity", "1");
    getElementWithClassName("addTemplate__title_input").type("Template 1");
    cy.get("#add-template-button").realClick();
    cy.wait(1000);
    getElementWithClassName("templates__container").contains("Template 1");
    getElementWithClassName("templatesListItem__settingsContainer").contains("Study");
    getElementWithClassName("templatesListItem__settingsContainer").contains("Girl in Cafe");
    cy.get("#templatesListItem-icons").children().should("have.length", 0);
  });

  it("Should delete a template", () => {
    getElementWithClassName("templatesListItem__trash_icon").click({ force: true });
    getElementWithClassName("templates__empty").contains("No Templates");
  });

  it("Should change mixer settings and save template", () => {
    // Close templates widget
    pressToolsButton();
    pressToolbarButton("templates");

    // Change mixer settings
    pressMixerButton();

    cy.get("#playlist-button-Relax").realClick();
    cy.get("#Rain-mixer-slider").find(".MuiSlider-rail").realClick();

    // Close mixer modal
    pressMixerButton();

    // Open templates widget
    pressToolsButton();
    pressToolbarButton("templates");

    // Save template
    getElementWithClassName("templates__add_template_button_container").realClick();
    getElementWithClassName("addTemplate__container").should("have.css", "opacity", "1");
    getElementWithClassName("addTemplate__title_input").type("Template 1");
    cy.get("#add-template-button").realClick();

    // Check if template was saved
    getElementWithClassName("templates__container").contains("Template 1");
    getElementWithClassName("templatesListItem__settingsContainer").contains("Relax");
    getElementWithClassName("templatesListItem__settingsContainer").contains("Girl in Cafe");
    cy.get("#templatesListItem-icons").children().should("have.length", 1);
  });

  it("Should load a template", () => {
    // Close templates widget
    pressToolsButton();
    pressToolbarButton("templates");

    // Change mixer settings
    pressMixerButton();

    // Reset mixer settings
    cy.get("#playlist-button-Study").realClick();
    cy.get("#mixer-reset-button").realClick();

    // Close mixer settings
    pressMixerButton();

    // Open templates widget
    pressToolsButton();
    pressToolbarButton("templates");

    // Select template
    getElementWithClassName("templatesListItem__container").click();

    // Check for notification
    getElementWithClassName("toaster__message_content").contains("Template 1 template selected");

    // Close templates widget
    pressToolsButton();
    pressToolbarButton("templates");

    // Open mixer settings
    pressMixerButton();

    // Check if mixer settings were changed
    cy.get("#playlist-button-Relax").should(
      "have.css",
      "background-color",
      "rgba(254, 165, 57, 0.88)"
    );
    cy.get("#Rain-mixer-slider")
      .find("input")
      .invoke("attr", "value")
      .then((value) => {
        expect(value).to.not.equal("0");
      });
  });

  it("Should delete all templates", () => {
    pressToolsButton();
    pressToolbarButton("templates");

    // Iterate through all templates and delete them
    getElementWithClassName("templates__content")
      .children()
      .each(($el) => {
        cy.wrap($el).find("[class*=templatesListItem__trash_icon]").click({ force: true });
      });
    getElementWithClassName("templates__empty").contains("No Templates");
  });
});
