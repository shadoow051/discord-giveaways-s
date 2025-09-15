import fs from "fs/promises";

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
      let data = [];
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        data = JSON.parse(fileContent);
      } catch {
        data = [];
      }
      data.push(giveaway);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving giveaway:", err);
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
      const fileContent = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(fileContent);
      const giveawayToDelete = data.find((g) => g.id === GiveawayId);
      const filteredData = data.filter((g) => g.id !== GiveawayId);
      await fs.writeFile(
        filePath,
        JSON.stringify(filteredData, null, 2),
        "utf-8"
      );
      return giveawayToDelete || null;
    } catch (err) {
      console.error("Error deleting giveaway:", err);
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
      await fs.writeFile(filePath, JSON.stringify([], null, 2), "utf-8");
    } catch (err) {
      console.error("Error deleting all giveaways:", err);
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
      const fileContent = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(fileContent);
      const giveaway = data.find((g) => g.id === GiveawayId); // <- tylko 'id'
      return giveaway || null;
    } catch (err) {
      console.error("Error getting giveaway:", err);
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
      const fileContent = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(fileContent);
      return data;
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
      let data = [];
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        data = JSON.parse(fileContent);
      } catch {
        data = [];
      }
      let updatedGiveaway = null;
      data = data.map((g) => {
        if (g.id === giveawayId) {
          updatedGiveaway = { ...g, ...updates };
          return updatedGiveaway;
        }
        return g;
      });
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
      return updatedGiveaway;
    } catch (err) {
      console.error("Error editing giveaway:", err);
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
