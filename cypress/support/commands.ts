/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      mockIndexedDB(): Chainable<void>;
      mockGetCalendarList(): Chainable<void>;
      mockGetCalendarEvents(): Chainable<void>;
    }
  }
}

// cypress/support/commands.js

import * as calendarRequest from "../../lib/requests/calendar-request";

// Define a mock database object
const mockDB = {
  store: {} as Record<string, any>,
  get(storeName: string, key: any) {
    console.log(`Mock get called for store: ${storeName}, key: ${key}`);
    return Promise.resolve(this.store[key] || null);
  },
  put(storeName: string, value: any) {
    console.log(`Mock put called for store: ${storeName}, value:`, value);
    this.store[value.id] = value;
    return Promise.resolve();
  },
};

// Create a function that returns the mockDB object
const mockGetDb = async () => ({
  transaction() {
    return {
      objectStore() {
        return {
          get: mockDB.get.bind(mockDB),
          put: mockDB.put.bind(mockDB),
        };
      },
    };
  },
});

Cypress.Commands.add("mockIndexedDB", () => {
  cy.stub(calendarRequest, "getDb").returns(mockGetDb);
});

// Mocking the Google Calendar API request to return a list of calendars
Cypress.Commands.add("mockGetCalendarList", () => {
  cy.intercept("GET", "https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    fixture: "mockCalendarList.json",
  }).as("getCalendarList");
});

// Mocking the Google Calendar API request to return a list of events
Cypress.Commands.add("mockGetCalendarEvents", () => {
  cy.intercept(
    "GET",
    "https://www.googleapis.com/calendar/v3/calendars/1/events?orderBy=startTime&singleEvents=true&timeMax=**&timeMin=**",
    {
      fixture: "mockCalendarEvents.json",
    }
  ).as("getCalendarEvents");
});
