import {
  navigateToMelofi,
  pressToolsButton,
  pressToolbarButton,
  getElementWithClassName,
} from "../../utils/general.ts";
import "cypress-real-events/support.js";

describe("Testing Alarms Widget", () => {
  before(() => {
    navigateToMelofi({
      seedWithUser: true,
      skipOnboarding: false,
      loggedIn: true,
      clearLocalStorage: true,
    });
  });

  after(() => {
    cy.clearLocalStorage();

    // iterate through alarmsItem__container and delete all alarms
    getElementWithClassName("alarms__content")
      .children()
      .each(($el) => {
        if ($el) {
          getElementWithClassName("alarmsItem__delete_button").first().click({ force: true });
        }
      });
  });

  it("Should open and close Alarms widget", () => {
    // open the alarms widget
    pressToolsButton();
    pressToolbarButton("alarms");
    cy.get("#alarms-widget").should("exist");
    // close the alarms widget using widget button
    pressToolsButton();
    pressToolbarButton("alarms");
    cy.get("#alarms-widget").should("not.be.visible");
    // open the alarms widget
    pressToolsButton();
    pressToolbarButton("alarms");
    // close the alarms widget using close button
    cy.get("#alarms-widget-close-icon").realClick();
  });

  it("Should add an alarm", () => {
    // open the alarms widget
    pressToolsButton();
    pressToolbarButton("alarms");
    getElementWithClassName("alarms__empty").should("exist").contains("No Alarms Set");

    // add an alarm
    cy.get("#add-alarm-button").click();
    getElementWithClassName("alarmModal__container").should("css", "opacity", "1");
    cy.get("#alarm-modal-minute-input").type("10");
    cy.get("#alarm-modal-minute-input").should("have.value", "10");
    cy.get("#alarm-modal-confirm-button").contains("Add");
    cy.get("#alarm-modal-confirm-button").click();

    // check if the alarm is added
    getElementWithClassName("alarms__empty").should("not.exist");
    cy.wait(1000);
  });

  it("Should edit an alarm", () => {
    // edit the alarm
    getElementWithClassName("alarmsItem__container").click({ force: true });
    getElementWithClassName("alarmModal__container").should("css", "opacity", "1");
    cy.get("#alarm-modal-confirm-button").contains("Save");
    cy.get("#alarm-modal-minute-input").clear().type("15");
    getElementWithClassName("alarmModal__label_input").clear().type("Alarm 1");
    cy.get("#alarm-modal-confirm-button").click();

    // check if the alarm is edited
    getElementWithClassName("alarmsItem__time").contains("15");
    getElementWithClassName("alarmsItem__title").contains("Alarm 1");
  });

  it("Should delete an alarm", () => {
    cy.wait(1000);
    getElementWithClassName("alarmsItem__delete_button").click({ force: true });
    getElementWithClassName("alarms__empty").should("exist").contains("No Alarms Set");
  });

  it("Should add multiple alarms", () => {
    // add multiple alarms
    cy.get("#add-alarm-button").click();
    cy.get("#alarm-modal-minute-input").type("10");
    cy.get("#alarm-modal-confirm-button").click();

    cy.get("#add-alarm-button").click();
    cy.get("#alarm-modal-minute-input").type("20");
    cy.get("#alarm-modal-confirm-button").click();

    cy.get("#add-alarm-button").click();
    cy.get("#alarm-modal-minute-input").type("30");
    cy.get("#alarm-modal-confirm-button").click();

    // check if the alarms are added
    getElementWithClassName("alarms__empty").should("not.exist");
    getElementWithClassName("alarmsItem__container").should("have.length", 3);
  });
});
