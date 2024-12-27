import {
  getElementWithClassName,
  pressToolbarButton,
  pressToolsButton,
} from "../../utils/general.ts";
import { navigateToMelofi } from "../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Pomodoro Timer", () => {
  before(() => {
    navigateToMelofi({
      loggedIn: true,
    });
  });

  after(() => {
    cy.clearLocalStorage();
  });

  it("Should open the pomodoro timer widget", () => {
    pressToolsButton();
    pressToolbarButton("pomodoro-timer");
    cy.get("#pomodoro-timer-widget").should("exist");
  });

  it("Should close the pomodoro timer widget using the widget button", () => {
    pressToolsButton();
    pressToolbarButton("pomodoro-timer");
    cy.get("#pomodoro-timer-widget").should("not.be.visible");
  });

  it("Should close the pomodoro timer widget using the close button", () => {
    pressToolsButton();
    pressToolbarButton("pomodoro-timer");
    // Wait for animation to finish
    cy.wait(1000);
    cy.get("#pomodoro-timer-widget-close-icon").realClick();
    cy.get("#pomodoro-timer-widget").should("not.be.visible");
  });

  // it("Should add task", () => {
  //   pressToolsButton();
  //   pressToolbarButton("pomodoro-timer");
  //   cy.wait(1000);
  //   getElementWithClassName("pomodoroTimer__empty_tasks_container").contains("No tasks added");
  //   getElementWithClassName("pomodoroTimer__add_task_button").realClick();
  //   getElementWithClassName("addPomodoroTaskModal__title_input").type("Task 1");
  //   cy.get("#add-pomodoro-task-button").realClick();
  //   cy.mockAddingPomodoroTimerTask();
  //   // getElementWithClassName("pomodoroTimer__task").contains("Task 1");
  // });
});
