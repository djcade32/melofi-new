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
      seedWithUser: true,
      skipOnboarding: false,
      loggedIn: true,
    });
    cy.clearFirestoreEmulator();
  });

  after(() => {
    cy.clearAuthEmulator();
    cy.wait(2000);
    cy.clearFirestoreEmulator();
  });

  describe("Testing Expanded Pomodoro Timer", () => {
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

    it("Should add task", () => {
      pressToolsButton();
      pressToolbarButton("pomodoro-timer");
      cy.wait(1000);
      getElementWithClassName("pomodoroTimer__empty_tasks_container").contains("No tasks added");
      getElementWithClassName("pomodoroTimer__add_task_button").realClick();
      getElementWithClassName("addPomodoroTaskModal__title_input").type("Task 1");
      cy.get("#add-pomodoro-task-button").realClick();
      getElementWithClassName("pomoTimerSessionCard__container").contains("Task 1");
    });

    it("Should show selected task", () => {
      cy.wait(1000);
      getElementWithClassName("pomoTimerSessionCard__container").realClick();
      getElementWithClassName("pomodoroTimer__active_task_title_container").contains("Task 1");
      getElementWithClassName("pomodoroTimer__timer_info_time_display").contains("0h 25m 0s");
      getElementWithClassName("pomodoroTimer__timer_info_container").contains("0 of 3 sessions");
      getElementWithClassName("pomodoroTimer__timer_info_container").contains("Focus");
    });

    it("Should start the timer", () => {
      cy.get("#pomodoro-timer-play-pause-button").realClick();
      getElementWithClassName("pomodoroTimer__timer_info_time_display").contains("0h 24m 59s");
    });

    it("Should pause the timer", () => {
      cy.get("#pomodoro-timer-play-pause-button").realClick();
      getElementWithClassName("pomodoroTimer__timer_info_time_display").contains("0h 24m 59s");
    });

    it("Should reset the timer", () => {
      cy.get("#pomodoro-timer-reset-button").realClick();
      getElementWithClassName("pomodoroTimer__timer_info_time_display").contains("0h 25m 0s");
    });

    it("Should show stop modal", () => {
      cy.get("#pomodoro-timer-play-pause-button").realClick();
      cy.get("#pomodoro-timer-stop-button").realClick();
      cy.wait(1000);
      cy.get("#pomodoroTimer__stop_modal").should("exist");
    });

    it("Should close stop modal", () => {
      cy.get("#dialogModal-confirm-button").realClick();
      // opacity should be 0 after closing
      getElementWithClassName("dialogModal__backdrop").should("have.css", "opacity", "0");
      cy.wait(1000);
      getElementWithClassName("pomodoroTimer__timer_info_time_display").contains("0h 25m 0s");
    });
  });

  describe("Testing Collapsed Pomodoro Timer", () => {
    it("Should collapse timer", () => {
      cy.get("#pomodoro-timer-collapse-button").realClick();
      cy.wait(1000);
      getElementWithClassName("pomodoroTimer__collapsed_container").should("exist");
    });

    it("Should show selected task title", () => {
      getElementWithClassName("pomodoroTimer__collapsed_header").contains("Task 1");
    });

    it("Should show timer info", () => {
      getElementWithClassName("pomodoroTimer__collapsed_timer_info_container").contains(
        "0h 25m 0s"
      );
      getElementWithClassName("pomodoroTimer__collapsed_timer_info_container").contains(
        "0 of 3 sessions"
      );
      getElementWithClassName("pomodoroTimer__collapsed_header").contains("Focus");
    });

    it("Should delete task", () => {
      cy.get("#pomodoro-timer-expand-button").realClick();
      cy.wait(1000);
      getElementWithClassName("pomoTimerSessionCard__active__delete_button").realClick({
        force: true,
      });
      getElementWithClassName("pomodoroTimer__empty_tasks_container").contains("No tasks added");
    });
  });
});
