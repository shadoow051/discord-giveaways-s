import { EventEmitter } from "events";
import { StorageFunctions } from "./../index.js";
import { Scheduler } from "./helpers/scheduler.js";

export class GiveawaysManager extends EventEmitter {
  constructor(filePath) {
    super();
    if (!filePath) {
      console.error(
        `GiveawaysManager will not function properly without a valid path.`
      );
    }
    this.filePath = filePath;

    //---------------------------------------------------------------------
    //region * Create Giveaway
    //---------------------------------------------------------------------

    this.CreateGiveaway = async (giveaway) => {
      await StorageFunctions.SaveGiveaway(this.filePath, giveaway);
      this.emit("giveawayCreated", giveaway, { filePath: this.filePath });
      return giveaway;
    };

    //---------------------------------------------------------------------
    //region * Delete Giveaway
    //---------------------------------------------------------------------

    this.DeleteGiveaway = async (giveawayId) => {
      const giveaway = await StorageFunctions.GetGiveaway(
        this.filePath,
        giveawayId
      );
      await StorageFunctions.DeleteGiveaway(this.filePath, giveawayId);
      this.emit("giveawayDeleted", giveaway, { filePath: this.filePath });
      return giveaway;
    };

    this.DeleteAllGiveaways = async () => {
      const giveaways = await StorageFunctions.GetAllGiveaways(this.filePath);
      await StorageFunctions.DeleteAllGiveaways(this.filePath);
      this.emit("allGiveawaysDeleted", giveaways, { filePath: this.filePath });
      return giveaways;
    };

    //---------------------------------------------------------------------
    //region * Start Giveaway
    //---------------------------------------------------------------------

    this.StartGiveaway = async (giveawayId) => {
      const giveaway = await StorageFunctions.GetGiveaway(
        this.filePath,
        giveawayId
      );
      const endedAt = Date.now() + giveaway.duration;
      const giveaway2 = await StorageFunctions.EditGiveaway(
        this.filePath,
        giveawayId,
        {
          status: "active",
          startedAt: Date.now(),
          endedAt: endedAt,
        }
      );
      Scheduler(endedAt, async () => {
        await this.DrawWinners(giveawayId);
        await this.EndGiveaway(giveawayId);
      });
      this.emit("giveawayStarted", giveaway2, { filePath: this.filePath });
      return true;
    };

    //---------------------------------------------------------------------
    //region * Pause Giveaway
    //---------------------------------------------------------------------

    this.PauseGiveaway = async (giveawayId) => {
      const giveaway = await StorageFunctions.EditGiveaway(
        this.filePath,
        giveawayId,
        {
          status: "waiting",
        }
      );
      this.emit("giveawayPaused", giveaway, { filePath: this.filePath });
      return true;
    };

    //---------------------------------------------------------------------
    //region * Resume Giveaway
    //---------------------------------------------------------------------

    this.ResumeGiveaway = async (giveawayId) => {
      const giveaway = await StorageFunctions.EditGiveaway(
        this.filePath,
        giveawayId,
        {
          status: "active",
        }
      );
      this.emit("giveawayResumed", giveaway, { filePath: this.filePath });
      return true;
    };

    //---------------------------------------------------------------------
    //region * End Giveaway
    //---------------------------------------------------------------------

    this.EndGiveaway = async (giveawayId) => {
      const giveaway = await StorageFunctions.EditGiveaway(
        this.filePath,
        giveawayId,
        {
          status: "ended",
        }
      );
      this.emit("giveawayEnded", giveaway, { filePath: this.filePath });
      return true;
    };

    //---------------------------------------------------------------------
    //region * Draw Winners
    //---------------------------------------------------------------------

    this.DrawWinners = async (giveawayId, customNumberOfWinners = null) => {
      const giveaway = await StorageFunctions.GetGiveaway(
        this.filePath,
        giveawayId
      );
      const participants = [...giveaway.participants];
      if (!participants.length) return [];
      const numberOfWinners =
        customNumberOfWinners !== null
          ? Math.min(customNumberOfWinners, participants.length)
          : Math.min(giveaway.numberOfWinners, participants.length);
      const winners = [];
      for (let i = 0; i < numberOfWinners; i++) {
        const randomIndex = Math.floor(Math.random() * participants.length);
        winners.push(participants[randomIndex]);
        participants.splice(randomIndex, 1);
      }
      const giveaway2 = await StorageFunctions.EditGiveaway(
        this.filePath,
        giveawayId,
        {
          winners: winners,
        }
      );
      this.emit("winnersDrawn", giveaway2, { filePath: this.filePath });
      return winners;
    };

    //---------------------------------------------------------------------
    //region * Reroll Winners
    //---------------------------------------------------------------------

    this.RerollWinners = async (giveawayId, customNumberOfWinners = null) => {
      const giveaway = await StorageFunctions.GetGiveaway(
        this.filePath,
        giveawayId
      );
      const participants = [...giveaway.participants];
      if (!participants.length) return [];
      const numberOfWinners =
        customNumberOfWinners !== null
          ? Math.min(customNumberOfWinners, participants.length)
          : Math.min(giveaway.numberOfWinners, participants.length);
      const winners = [];
      for (let i = 0; i < numberOfWinners; i++) {
        const randomIndex = Math.floor(Math.random() * participants.length);
        winners.push(participants[randomIndex]);
        participants.splice(randomIndex, 1);
      }
      const giveaway2 = await StorageFunctions.EditGiveaway(
        this.filePath,
        giveawayId,
        {
          rerolledWinners: winners,
          rerollCount: giveaway.rerollCount + 1,
        }
      );
      this.emit("winnersRerolled", giveaway2, { filePath: this.filePath });
      return winners;
    };

    //---------------------------------------------------------------------
    //region * Get Giveaway
    //---------------------------------------------------------------------

    this.GetGiveaway = async (giveawayId) => {
      const giveaway = await StorageFunctions.GetGiveaway(
        this.filePath,
        giveawayId
      );
      this.emit("giveawayFetched", giveaway, { filePath: this.filePath });
      return giveaway;
    };

    //---------------------------------------------------------------------
    //region * Get All Giveaways
    //---------------------------------------------------------------------

    this.GetAllGiveaways = async () => {
      const giveaways = await StorageFunctions.GetAllGiveaways(this.filePath);
      this.emit("allGiveawaysFetched", giveaways, { filePath: this.filePath });
      return giveaways;
    };

    //---------------------------------------------------------------------
    //region * Add Participant
    //---------------------------------------------------------------------

    this.AddParticipant = async (giveawayId, userId) => {
      const giveaway = await StorageFunctions.GetGiveaway(
        this.filePath,
        giveawayId
      );
      if (!giveaway || !Array.isArray(giveaway.participants)) return [];
      if (giveaway.status !== "active") {
        return giveaway.participants;
      }
      if (
        Array.isArray(giveaway.blacklist) &&
        giveaway.blacklist.includes(userId)
      ) {
        return giveaway.participants;
      }
      if (giveaway.participants.includes(userId)) {
        return giveaway.participants;
      }
      if (
        giveaway.maxParticipants &&
        giveaway.participants.length >= giveaway.maxParticipants
      ) {
        return giveaway.participants;
      }
      const participants = [...giveaway.participants, userId];
      const giveaway2 = await StorageFunctions.EditGiveaway(
        this.filePath,
        giveawayId,
        {
          participants: participants,
          participantCount: participants.length,
          joinCount: giveaway.joinCount + 1,
        }
      );
      this.emit("participantAdded", giveaway2, {
        userId,
        filePath: this.filePath,
      });
      return participants;
    };

    //---------------------------------------------------------------------
    //region * Remove Participant
    //---------------------------------------------------------------------

    this.RemoveParticipant = async (giveawayId, userId) => {
      const giveaway = await StorageFunctions.GetGiveaway(
        this.filePath,
        giveawayId
      );
      if (!giveaway || !giveaway.participants) return [];
      if (giveaway.status !== "active") {
        return giveaway.participants;
      }
      const participants = giveaway.participants.filter((id) => id !== userId);
      const giveaway2 = await StorageFunctions.EditGiveaway(
        this.filePath,
        giveawayId,
        {
          participants: participants,
          participantCount: participants.length,
          leaveCount: giveaway.leaveCount + 1,
        }
      );
      this.emit("participantRemoved", giveaway2, {
        userId,
        filePath: this.filePath,
      });
      return participants;
    };

    //---------------------------------------------------------------------
    //region * Has Participant
    //---------------------------------------------------------------------

    this.HasParticipant = async (giveawayId, userId) => {
      const giveaway = await StorageFunctions.GetGiveaway(
        this.filePath,
        giveawayId
      );
      if (!giveaway || !Array.isArray(giveaway.participants)) return false;
      return giveaway.participants.includes(userId);
    };

    //---------------------------------------------------------------------
    //region * Get Participants
    //---------------------------------------------------------------------

    this.GetParticipants = async (giveawayId) => {
      const giveaway = await StorageFunctions.GetGiveaway(
        this.filePath,
        giveawayId
      );
      this.emit("participantsFetched", giveaway, {
        filePath: this.filePath,
      });
      return giveaway.participants;
    };

    //---------------------------------------------------------------------
    //region * Edit Giveaway
    //---------------------------------------------------------------------

    this.EditGiveaway = async (giveawayId, updates = {}) => {
      const oldGiveaway = await StorageFunctions.GetGiveaway(
        this.filePath,
        giveawayId
      );
      const newGiveaway = await StorageFunctions.EditGiveaway(
        this.filePath,
        giveawayId,
        updates
      );
      const result = {
        oldGiveaway: oldGiveaway,
        newGiveaway: newGiveaway,
      };
      this.emit("giveawayEdited", result, {
        filePath: this.filePath,
      });
      return result;
    };
  }
}
