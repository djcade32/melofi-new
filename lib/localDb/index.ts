import { IDBPDatabase, openDB } from "idb";

let db: IDBPDatabase | null = null;

export const initializeLocalDb = async () => {
  console.log("Initializing local db");
  if (db) return;
  db = await openDB("melofiDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("appSettings")) {
        db.createObjectStore("appSettings");
        db.createObjectStore("settings");
      }
    },
  });
};

export const getLocalDb = async () => {
  if (!db) {
    throw new Error("Database not initialized. Call initializeLocalDb first.");
  }
  return db;
};
