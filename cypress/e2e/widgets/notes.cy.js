import "cypress-real-events/support.js";
import { navigateToMelofi, pressToolbarButton, pressToolsButton } from "../../utils/general.ts";

describe("Testing Notes Widget", () => {
  before(() => {
    navigateToMelofi({
      loggedIn: true,
      clearLocalStorage: false,
    });
  });

  it("Should open and close Notes Widget", () => {
    // Close using widget button
    pressToolsButton();
    pressToolbarButton("notes");
    cy.get("#notes-widget").should("exist");
    pressToolsButton();
    pressToolbarButton("notes");
    cy.get("#notes-widget").should("not.be.visible");

    // Close using close button
    pressToolsButton();
    pressToolbarButton("notes");
    cy.get("#notes-widget-close-icon").click();
    cy.get("#notes-widget").should("not.be.visible");
  });

  it("Should add a note", () => {
    pressToolsButton();
    pressToolbarButton("notes");
    cy.get("#notes-widget").find("#create-note-button").click();
    cy.get('[class*="notes__sidebar_action_buttons_container"]')
      .find("p")
      .should("have.text", "1 Note");
    cy.get('[class*="notes__notesCard_container"]').children().should("have.length", 1);
  });

  it("Should delete a note", () => {
    // Use general trash icon
    cy.get('[class*="notes__sidebar_action_buttons_container"]')
      .get("#delete-note-button")
      .realClick();
    cy.get('[class*="notes__notesCard_container"]').children().should("have.length", 0);

    // Use trash icon on note card
    cy.get("#notes-widget").find("#create-note-button").click();
    cy.get("#notes-widget")
      .get('[class*="noteCard__container"]')
      .find('[class*="noteCard__title_container"]')
      .find('[class*="noteCard__trash_icon"]')
      .realClick();

    cy.get('[class*="notes__notesCard_container"]').children().should("have.length", 0);
  });

  it("Should edit note title", () => {
    cy.get("#notes-widget").find("#create-note-button").click();
    cy.get("#notes-widget").get("#notes-title-input").type("Test Title");
    // Click anywhere to remove focus from input
    cy.get("#notes-widget").click();

    cy.get("#notes-widget")
      .get('[class*="noteCard__container"]')
      .get('[class*="noteCard__title_container"]')
      .get("h3")
      .contains("Test Title");

    cy.get("#notes-widget").get("#notes-title-input").click().type("{backspace}");
    cy.get("#notes-widget").click();
    cy.get("#notes-widget")
      .get('[class*="noteCard__container"]')
      .get('[class*="noteCard__title_container"]')
      .get("h3")
      .contains("Test Title");
  });

  it("Should edit note content", () => {
    cy.get("#notes-widget").get("[class*='slateEditor__editable']").realClick();
    cy.get("#notes-widget").get("[class*='slateEditor__editable']").type("Test Content");

    cy.get("#notes-widget")
      .get('[class*="noteCard__container"]')
      .get('[class*="noteCard__content"]')
      .get("p")
      .contains("Test Content");
  });

  after(() => {
    cy.clearLocalStorage("selected_notes");
    cy.clearLocalStorage("notes");
  });
});
