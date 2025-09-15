console.log("use better-sqlite3");

import fs from "fs/promises";
import path from "path";
import Database from "better-sqlite3";

const dbCache = new Map();
function resolveDbPath(filePath) {
  if (!filePath) {
    return path.resolve(process.cwd(), "giveaways.sqlite");
  }
  return path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
}
function openDb(dbPath) {
  if (dbCache.has(dbPath)) return dbCache.get(dbPath);
  const dir = path.dirname(dbPath);
  try {
  } catch (e) {}
  const db = new Database(dbPath);
  db.prepare(
    `CREATE TABLE IF NOT EXISTS giveaways (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`
  ).run();
  dbCache.set(dbPath, db);
  return db;
}

export default {
  ///////////////////////////////////////////////////////////////////////
  //
  //
  //region # Required Functions
  //
  // This region contains functions required for the module to function.
  //
  ///////////////////////////////////////////////////////////////////////

  //---------------------------------------------------------------------
  //region * Save Giveaway
  //
  // This function receives a file path and a giveaway object.
  // It then saves the giveaway object into the file.
  //---------------------------------------------------------------------

  SaveGiveaway: async (filePath, giveaway) => {
    try {
      const dbPath = resolveDbPath(filePath);
      await fs.mkdir(path.dirname(dbPath), { recursive: true }).catch(() => {});
      const db = openDb(dbPath);
      const stmt = db.prepare(
        "INSERT OR REPLACE INTO giveaways (id, data) VALUES (?, ?)"
      );
      stmt.run(giveaway.id, JSON.stringify(giveaway));
    } catch (err) {
      console.error("Error saving giveaway (sqlite):", err);
    }
  },

  //---------------------------------------------------------------------
  //region * Delete Giveaway
  //
  // This function receives a file path and a giveaway ID.
  // It reads the file to find a giveaway with the given ID
  // and removes it if it exists.
  //---------------------------------------------------------------------

  DeleteGiveaway: async (filePath, GiveawayId) => {
    try {
      const dbPath = resolveDbPath(filePath);
      const db = openDb(dbPath);
      const row = db
        .prepare("SELECT data FROM giveaways WHERE id = ?")
        .get(GiveawayId);
      const giveawayToDelete = row ? JSON.parse(row.data) : null;
      db.prepare("DELETE FROM giveaways WHERE id = ?").run(GiveawayId);
      return giveawayToDelete || null;
    } catch (err) {
      console.error("Error deleting giveaway (sqlite):", err);
      return null;
    }
  },

  //---------------------------------------------------------------------
  //region * Delete All Giveaways
  //
  // This function receives a file path and clears the entire file.
  //---------------------------------------------------------------------

  DeleteAllGiveaways: async (filePath) => {
    try {
      const dbPath = resolveDbPath(filePath);
      const db = openDb(dbPath);
      db.prepare("DELETE FROM giveaways").run();
    } catch (err) {
      console.error("Error deleting all giveaways (sqlite):", err);
    }
  },

  //---------------------------------------------------------------------
  //region * Get Giveaway
  //
  // This function receives a file path and a giveaway ID.
  // It searches the file for a giveaway with the specified ID
  // and, if found, returns the giveaway object.
  //---------------------------------------------------------------------

  GetGiveaway: async (filePath, GiveawayId) => {
    try {
      const dbPath = resolveDbPath(filePath);
      const db = openDb(dbPath);
      const row = db
        .prepare("SELECT data FROM giveaways WHERE id = ?")
        .get(GiveawayId);
      const giveaway = row ? JSON.parse(row.data) : null;
      return giveaway || null;
    } catch (err) {
      console.error("Error getting giveaway (sqlite):", err);
      return null;
    }
  },

  //---------------------------------------------------------------------
  //region * Get All Giveaways
  //
  // This function receives a file path. It reads the entire file
  // and returns all existing giveaway objects in an array.
  //---------------------------------------------------------------------

  GetAllGiveaways: async (filePath) => {
    try {
      const dbPath = resolveDbPath(filePath);
      const db = openDb(dbPath);
      const rows = db.prepare("SELECT data FROM giveaways").all();
      return rows
        .map((r) => {
          try {
            return JSON.parse(r.data);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    } catch {
      return [];
    }
  },

  //---------------------------------------------------------------------
  //region * Edit Giveaway
  //
  // This function receives a file path, a giveaway ID, and
  // an object with updates. It searches the file for the
  // giveaway with the given ID, applies the changes, and
  // returns the updated giveaway object.
  //---------------------------------------------------------------------

  EditGiveaway: async (filePath, giveawayId, updates = {}) => {
    try {
      const dbPath = resolveDbPath(filePath);
      const db = openDb(dbPath);
      const row = db
        .prepare("SELECT data FROM giveaways WHERE id = ?")
        .get(giveawayId);
      let data = null;
      try {
        data = row ? JSON.parse(row.data) : null;
      } catch {
        data = null;
      }
      if (!data) {
        return null;
      }
      const updatedGiveaway = { ...data, ...updates };
      db.prepare("UPDATE giveaways SET data = ? WHERE id = ?").run(
        JSON.stringify(updatedGiveaway),
        giveawayId
      );
      return updatedGiveaway;
    } catch (err) {
      console.error("Error editing giveaway (sqlite):", err);
      return null;
    }
  },

  ///////////////////////////////////////////////////////////////////////
  //
  //
  //region # Custom Functions
  //
  // In this region you can create your own custom functions.
  // Then you can use these functions via StorageFunctions.(function name).
  //
  ///////////////////////////////////////////////////////////////////////
};
