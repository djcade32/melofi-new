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
      deleteCalendarDB(): Chainable<void>;
      clearAuthEmulator(): Chainable<void>;
      clearFirestoreEmulator(): Chainable<void>;
      signUpUser(email: string, password: string): Chainable<any>;
      signInUser(email: string, password: string): Chainable<any>;
      mockCheckingIfUserIsInDb(): Chainable<void>;
      mockAddingPomodoroTimerTask(): Chainable<void>;
      seedIndexedDB(dbName: string, storeName: string, data: any[]): Chainable<void>;
    }
  }
}

// cypress/support/commands.js

import * as calendarRequest from "../../lib/requests/calendar-request";
import { openDB } from "idb";

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

Cypress.Commands.add("deleteCalendarDB", () => {
  cy.window().then((win) => {
    const request = win.indexedDB.deleteDatabase("calendarDB"); // Replace "calendarDB" with your database name
    request.onsuccess = () => console.log("IndexedDB cleared successfully");
    request.onerror = () => console.error("Error clearing IndexedDB");
  });
});

Cypress.Commands.add("seedIndexedDB", (dbName, storeName, data) => {
  cy.window().then(async (win) => {
    const db = await openDB(dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      },
    });

    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    // Clear existing data
    await store.clear();

    // Insert new data
    for (const item of data) {
      console.log("Inserting item", item);
      await store.put(item.value, item.key);
    }

    await tx.done;
  });
});

Cypress.Commands.add("clearAuthEmulator", () => {
  cy.request("DELETE", "http://localhost:9099/emulator/v1/projects/melofi-v2/accounts").then(
    (response) => {
      expect(response.status).to.eq(200); // Check that the request was successful
      response.status === 200 && console.log("Firebase Auth Emulator cleared successfully");
      cy.wait(2000);
    }
  );
});

Cypress.Commands.add("clearFirestoreEmulator", () => {
  cy.request(
    "DELETE",
    "http://localhost:8080/emulator/v1/projects/melofi-v2/databases/(default)/documents"
  ).then((response) => {
    expect(response.status).to.eq(200); // Check that the request was successful'
    response.status === 200 && console.log("Firestore Emulator cleared successfully");
    cy.wait(2000);
  });
});

Cypress.Commands.add("signUpUser", (email, password) => {
  // Step 1: Sign up the user
  return cy
    .request({
      method: "POST",
      url: "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key",
      body: {
        email,
        password,
        returnSecureToken: true,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
    });
});

Cypress.Commands.add("signInUser", (email, password) => {
  return cy
    .request({
      method: "POST",
      url: "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key",
      body: {
        email,
        password,
        returnSecureToken: true,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);

      const { idToken, localId } = response.body;

      // Store auth info in localStorage to simulate Firebase authentication
      window.localStorage.setItem(
        "firebase:authUser:fake-project-id",
        JSON.stringify({
          uid: localId,
          email,
          stsTokenManager: {
            accessToken: idToken,
          },
        })
      );

      // Set Firebase Auth Emulator user session
      cy.setCookie("authUser", idToken);
    });
});
