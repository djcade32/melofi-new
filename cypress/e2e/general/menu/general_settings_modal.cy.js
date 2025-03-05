import {
  getElementWithClassName,
  navigateToMelofi,
  pressToolbarButton,
  pressToolsButton,
} from "../../../utils/general.ts";
import { Menu } from "../../pages/Menu.page";
import "cypress-real-events/support.js";

const url = "http://localhost:3000";

let localStorage = {
  [url]: {
    app_settings: {
      userUid: "123",
      inActivityThreshold: 15000,
      pomodoroTimerSoundEnabled: true,
      alarmSoundEnabled: true,
      calendarHoverEffectEnabled: true,
      todoListHoverEffectEnabled: true,
      showDailyQuote: true,
    },
  },
};

describe("Testing General Settings", () => {
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

  it("Should open the general settings modal", () => {
    Menu.menuButton().click();
    Menu.menuModal().should("be.visible");
    Menu.options.generalSettings().click();

    // Check if the modal is visible
    Menu.generalSettingsModal.container().should("be.visible");
  });

  it("Should change inactivity delay setting to 5 seconds", () => {
    Menu.generalSettingsModal.delayOptions.container().click();
    Menu.generalSettingsModal.delayOptions.option(0).click();

    // Check if the setting has been changed
    Menu.generalSettingsModal.delayOptions.container().contains("5 seconds");
    // See if the setting is saved in the local storage
    localStorage[url].app_settings.inActivityThreshold = 5000;
    cy.getAllLocalStorage().then((localStorageData) => {
      const stringified = JSON.stringify(localStorageData[url].app_settings);
      const json = JSON.parse(stringified);
      expect(localStorageData[url].app_settings).to.deep.equal(json);
    });
    cy.wait(7000);
    cy.get("#header").should("not.be.visible");
  });

  it("Should change the pomodoro timer sound setting to disabled", () => {
    Menu.generalSettingsModal.settings("Pomodoro Timer").toggle();

    // See if the setting is saved in the local storage
    localStorage[url].app_settings.pomodoroTimerSoundEnabled = false;
    cy.getAllLocalStorage().then((localStorageData) => {
      const stringified = JSON.stringify(localStorageData[url].app_settings);
      const json = JSON.parse(stringified);
      expect(localStorageData[url].app_settings).to.deep.equal(json);
    });
  });

  it("Should change the alarm sound setting to disabled", () => {
    Menu.generalSettingsModal.settings("Alarm").toggle();

    // See if the setting is saved in the local storage
    localStorage[url].app_settings.alarmSoundEnabled = false;
    cy.getAllLocalStorage().then((localStorageData) => {
      const stringified = JSON.stringify(localStorageData[url].app_settings);
      const json = JSON.parse(stringified);
      expect(localStorageData[url].app_settings).to.deep.equal(json);
    });
  });

  it("Should change the calendar hover effect setting to disabled", () => {
    Menu.generalSettingsModal.settings("Calendar").toggle();

    // See if the setting is saved in the local storage
    localStorage[url].app_settings.calendarHoverEffectEnabled = false;
    cy.getAllLocalStorage().then((localStorageData) => {
      const stringified = JSON.stringify(localStorageData[url].app_settings);
      const json = JSON.parse(stringified);
      expect(localStorageData[url].app_settings).to.deep.equal(json);
    });
  });

  it("Should change the to do list hover effect setting to disabled", () => {
    Menu.generalSettingsModal.closeBtn().click();
    pressToolsButton();
    pressToolbarButton("to-do-list");
    cy.get("#to-do-list-widget").should("have.css", "background-color", "rgba(0, 0, 0, 0)");
    pressToolsButton();
    pressToolbarButton("to-do-list");
    Menu.menuButton().click();
    Menu.options.generalSettings().click();
    Menu.generalSettingsModal.settings("To-Do List").toggle();

    // See if the setting is saved in the local storage
    localStorage[url].app_settings.todoListHoverEffectEnabled = false;
    cy.getAllLocalStorage().then((localStorageData) => {
      const stringified = JSON.stringify(localStorageData[url].app_settings);
      const json = JSON.parse(stringified);
      expect(localStorageData[url].app_settings).to.deep.equal(json);
    });

    // Check if calendar background color is changed
    Menu.generalSettingsModal.closeBtn().click();
    pressToolsButton();
    pressToolbarButton("to-do-list");
    cy.get("#to-do-list-widget").should("have.css", "background-color", "rgba(35, 35, 35, 0.88)");

    pressToolsButton();
    pressToolbarButton("to-do-list");
  });

  it("Should change the daily quote setting to disabled", () => {
    Menu.menuButton().click();
    Menu.options.generalSettings().click();
    Menu.generalSettingsModal.settings("Show Daily Quotes").toggle();

    // See if the setting is saved in the local storage
    localStorage[url].app_settings.showDailyQuote = false;
    cy.getAllLocalStorage().then((localStorageData) => {
      const stringified = JSON.stringify(localStorageData[url].app_settings);
      const json = JSON.parse(stringified);
      expect(localStorageData[url].app_settings).to.deep.equal(json);
    });

    // Check if the daily quote is hidden
    getElementWithClassName("quoteDisplay__container").should("not.exist");
  });
});
