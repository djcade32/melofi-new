import { navigateToMelofi, pressToolbarButton, pressToolsButton } from "../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing To - Do List Widget", () => {
  before(() => {
    navigateToMelofi();
  });

  it("Should open To - Do List widget", () => {
    pressToolsButton();
    pressToolbarButton("to-do-list");
    cy.get("#to-do-list-widget").should("exist");
  });

  it("Should close To - Do List widget using widget button", () => {
    pressToolsButton();
    pressToolbarButton("to-do-list");
    cy.get("#to-do-list-widget").should("not.be.visible");
  });

  it("Should close To - Do List widget using close button", () => {
    pressToolsButton();
    pressToolbarButton("to-do-list");
    cy.get("#to-do-list-widget-close-icon").realClick();
    cy.get("#to-do-list-widget").should("not.be.visible");
  });

  it("Should add a new task", () => {
    pressToolsButton();
    pressToolbarButton("to-do-list");
    cy.get("#to-do-list-widget").should("exist");
    cy.get('[class*="todoList__task_container"]').children().should("have.length", 0);

    // Add task using enter key
    cy.get("#to-do-list-widget-input").type("New task{enter}");
    cy.get('[class*="todoList__task_container"]').children().should("have.length", 1);

    // Add task using button
    cy.get("#to-do-list-widget-input").type("Another task");
    cy.get("#to-do-list-widget-add-task-button").realClick();
    cy.get('[class*="todoList__task_container"]').children().should("have.length", 2);
  });

  it("Should complete task", () => {
    cy.get('[class*="todoList__task_container"]')
      .children()
      .first()
      .find('[id*="to-do-list-item-checkbox"]')
      .realClick();
    cy.get('[class*="todoListItem__task_complete"]').should("exist");
  });

  it("Should delete task", () => {
    cy.get('[class*="todoList__task_container"]')
      .children()
      .first()
      .find("svg")
      .then(($svg) => {
        cy.wrap($svg[1]).realClick();
      });
    cy.get('[class*="todoList__task_container"]').children().should("have.length", 1);
  });
});
