import { Toaster } from "../pages/common/Toaster.page";
import {
  getElementWithClassName,
  navigateToMelofi,
  pressToolbarButton,
  pressToolsButton,
} from "../../utils/general";

describe("Timer", () => {
  before(() => {
    navigateToMelofi({ seedWithUser: true, skipOnboarding: false, loggedIn: true });
  });

  after(() => {
    getElementWithClassName("timer__timer_button").contains("Stop").click();
    cy.clearLocalStorage();
  });

  it("should display the timer", () => {
    pressToolsButton();
    pressToolbarButton("timer");

    cy.get("#timer-widget").should("be.visible");
  });

  it("should start the timer", () => {
    cy.get("#timer-widget").within(() => {
      cy.get("#timer-input-seconds").click();
      cy.get("#timer-input-seconds").type("5");
      cy.get("#timer-start-pause-button").click();
    });
    cy.wait(5000);
    cy.get("#timer-widget").within(() => {
      cy.get("#timer-input-seconds").should("have.value", "00");
    });
    // Alarm sound should be played
    cy.get("#timer-audio").then(($audio) => {
      const currentVolume = $audio[0].volume;
      expect(currentVolume).to.be.greaterThan(0);
    });
  });

  it("should stop the timer", () => {
    Toaster.message().contains("5s timer is done!");
    getElementWithClassName("timer__timer_button").contains("Stop").click();
  });

  it("should pause the timer", () => {
    cy.get("#timer-widget").within(() => {
      cy.get("#timer-input-seconds").click();
      cy.get("#timer-input-seconds").type("5");
      cy.get("#timer-start-pause-button").click();
      cy.wait(2000);
      cy.get("#timer-start-pause-button").click();
      cy.wait(3000);
      cy.get("#timer-input-seconds").should("not.have.text", "00");
      cy.get("#timer-start-pause-button").click();
    });
  });

  it("should repeat the timer", () => {
    Toaster.message().contains("5s timer is done!");
    getElementWithClassName("timer__timer_button").contains("Repeat").click();

    cy.wait(5000);
    cy.get("#timer-widget").within(() => {
      cy.get("#timer-input-seconds").should("have.value", "00");
    });
    // Alarm sound should be played
    cy.get("#timer-audio").then(($audio) => {
      const currentVolume = $audio[0].volume;
      expect(currentVolume).to.be.greaterThan(0);
    });
  });

  it("should close timer widget", () => {
    cy.get("#timer-widget-close-button").click();
    cy.get("#timer-widget").should("not.be.visible");
  });
});
