import { navigateToMelofi, pressToolbarButton, pressToolsButton } from "../../utils/general";
import "cypress-real-events/support";

describe("Calendar Widget Tests", () => {
  before(() => {
    // Mock indexedDB before each test
    cy.mockIndexedDB();
    cy.mockGetCalendarList();
    // Mock Google OAuth
    localStorage.setItem(
      "google_calendar_user",
      JSON.stringify({
        access_token: "mocked_access_token",
        expires_in: 3600,
        token_type: "Bearer",
      })
    );
    navigateToMelofi();
  });

  it("Should open and close Calendar Widget", () => {
    // open the calendar widget
    pressToolsButton();
    pressToolbarButton("calendar");
    cy.get("#calendar-widget").should("exist");
    // close the calendar widget using widget button
    pressToolsButton();
    pressToolbarButton("calendar");
    cy.get("#calendar-widget").should("not.be.visible");
    // open the calendar widget
    pressToolsButton();
    pressToolbarButton("calendar");
    // close the calendar widget using close button
    cy.get("#calendar-widget-close-icon").realClick();
  });

  it("Should show correct date", () => {
    const date = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: timezone,
    };

    pressToolsButton();
    pressToolbarButton("calendar");
    // Check for the current date
    cy.get(".calendar_calendar__current_date__1Ldhk").should(
      "have.text",
      date.toLocaleDateString("en-US", options)
    );
  });

  it("Should show 4 calendars in calendar List", () => {
    // Check for 4 calendars
    cy.get(".calendarsListView_calendarsListView__container__jVO_1")
      .children()
      .should("have.length", 4);
  });

  it("Should show 6 events in the calendar", () => {
    // Have to mock Google Calendar API again because the previous mock is not persisting across tests
    cy.mockGetCalendarEvents();

    // Click on the first calendar
    cy.get(".calendarListItem_calendarListItem__container__6u0uO").first().click();
    // Check for 2 events
    cy.get(".calendarEventsView_calendarEventsView__events_container__2cw0P")
      .children()
      .should("have.length", 6);
  });

  it("Should show calendar name", () => {
    // Check for the calendar name
    cy.get(".calendarEventsView_calendarEventsView__header__1Ps5A").should(
      "have.text",
      "Work Calendar"
    );
  });

  after(() => {
    pressToolsButton();
    pressToolbarButton("calendar");
    cy.deleteCalendarDB();
  });
});
