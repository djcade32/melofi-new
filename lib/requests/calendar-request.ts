import axios from "axios";
import { openDB } from "idb";

let dbPromise = null;

// Conditionally initialize `idb` only if `indexedDB` is available
if (typeof indexedDB !== "undefined") {
  dbPromise = openDB("calendarDB", 1, {
    upgrade(db) {
      db.createObjectStore("calendar", { keyPath: "id" });
    },
  });
} else {
  console.warn(
    "IndexedDB is not supported in this environment. Database functions will be unavailable."
  );
}

// This is only for testing purposes
export const getDb = async () => {
  if (!dbPromise) {
    console.warn(
      "IndexedDB is not supported in this environment. Database functions will be unavailable."
    );
    return null;
  }

  return await dbPromise;
};

export const fetchCalendarsList = async (token: string) => {
  if (!dbPromise) {
    console.warn(
      "IndexedDB is not supported in this environment. Database functions will be unavailable."
    );
    return null;
  }

  const db = await dbPromise;
  const calendarsList = await db.get("calendar", "user_calendar_list");

  try {
    // Check if data more than 5 minutes old
    if (calendarsList && Date.now() - calendarsList.lastFetched < 5 * 60 * 1000) {
      // Load from IndexedDB if data is fresh
      console.log("Loading calendars list from IndexedDB");
      return calendarsList.data;
    }
    console.log("Fetching calendars list from API");
    // Fetch from API if data is stale
    const response = await axios.get(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    // Save to IndexedDB
    const data = {
      id: "user_calendar_list",
      data: response.data,
      lastFetched: Date.now(),
    };
    await db.put("calendar", data);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching calendars list:", error.response?.data || error.message);
    return null;
  }
};

export const fetchCalendarEvents = async (token: string, calendarId: string) => {
  if (!dbPromise) {
    console.warn(
      "IndexedDB is not supported in this environment. Database functions will be unavailable."
    );
    return null;
  }

  const date = new Date();
  const timeMin = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0).toISOString();
  const timeMax = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59
  ).toISOString();

  const db = await dbPromise;
  const calendarEvents = await db.get("calendar", calendarId);

  try {
    // Check if data more than 5 minutes old
    if (calendarEvents && Date.now() - calendarEvents.lastFetched < 5 * 60 * 1000) {
      // Load from IndexedDB if data is fresh
      console.log("Loading calendar events from IndexedDB");
      return calendarEvents.data;
    }
    console.log("Fetching calendar events from API");
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        params: {
          orderBy: "startTime",
          singleEvents: true,
          timeMax: timeMax,
          timeMin: timeMin,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    // Save to IndexedDB
    const data = {
      id: calendarId,
      data: response.data,
      lastFetched: Date.now(),
    };
    await db.put("calendar", data);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching calendar events:", error.response?.data || error.message);
    return null;
  }
};

// Delete all calendar data from IndexedDB
export const clearCalendarData = async () => {
  if (!dbPromise) {
    console.warn(
      "IndexedDB is not supported in this environment. Database functions will be unavailable."
    );
    return;
  }
  console.log("Clearing calendar data from IndexedDB");
  ``;
  const db = await dbPromise;
  await db.clear("calendar");
};
