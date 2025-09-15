import { StorageFunctions, GenerateID } from "./../../index.js";
import util from "util";

export class GiveawayBuilder {
  constructor() {}

  //---------------------------------------------------------------------
  //region # Setters
  //---------------------------------------------------------------------

  setId(v) {
    this.id = v;
    return this;
  }
  setPrize(v) {
    this.prize = v;
    return this;
  }
  setDescription(v) {
    this.description = v;
    return this;
  }
  setDuration(v) {
    this.duration = v;
    return this;
  }
  setNumberOfWinners(v) {
    this.numberOfWinners = v;
    return this;
  }
  setMinParticipants(v) {
    this.minParticipants = v;
    return this;
  }
  setMaxParticipants(v) {
    this.maxParticipants = v;
    return this;
  }
  setBlacklist(v) {
    this.blacklist = v;
    return this;
  }
  setParticipants(v) {
    this.participants = v;
    return this;
  }
  setWinners(v) {
    this.winners = v;
    return this;
  }
  setRerolledWinners(v) {
    this.rerolledWinners = v;
    return this;
  }
  setCreatedAt(v) {
    this.createdAt = v;
    return this;
  }
  setStartedAt(v) {
    this.startedAt = v;
    return this;
  }
  setEndedAt(v) {
    this.endedAt = v;
    return this;
  }
  setStartedBy(v) {
    this.startedBy = v;
    return this;
  }
  setEndedBy(v) {
    this.endedBy = v;
    return this;
  }
  setAuthorId(v) {
    this.authorId = v;
    return this;
  }
  setGuildId(v) {
    this.guildId = v;
    return this;
  }
  setChannelId(v) {
    this.channelId = v;
    return this;
  }
  setMessageId(v) {
    this.messageId = v;
    return this;
  }
  setStatus(v) {
    const allowed = ["waiting", "active", "ended"];
    if (!allowed.includes(v)) {
      throw new Error(`Incorrect status! Allowed: ${allowed.join(", ")}`);
    }
    this.status = v;
    return this;
  }
  setCustomInfo(v) {
    this.customInfo = v;
    return this;
  }

  //---------------------------------------------------------------------
  //region # Generate Object
  //---------------------------------------------------------------------

  get giveaway() {
    return {
      id: this.id ?? GenerateID(), // string
      prize: this.prize ?? "", // string
      description: this.description ?? "", // string
      duration: this.duration ?? 3600000, // ms (default 1h)
      numberOfWinners: this.numberOfWinners ?? 1, // number
      minParticipants: this.minParticipants ?? 1, // number
      maxParticipants: this.maxParticipants ?? null, // number
      blacklist: this.blacklist ?? [], // array
      participants: [], // array
      participantCount: 0, // number
      joinCount: 0, // number
      leaveCount: 0, // number
      winners: [], // array
      rerolledWinners: [], // array
      rerollCount: 0, // number
      createdAt: Date.now() ?? null, // timestamp
      startedAt: null, // timestamp
      endedAt: null, // timestamp
      startedBy: "", // string
      endedBy: "", // string
      authorId: this.authorId ?? "", // string
      guildId: this.guildId ?? "", // string
      channelId: this.channelId ?? "", // string
      messageId: this.messageId ?? "", // string
      status: this.status ?? "waiting", // string (waiting/active/ended)
      customInfo: this.customInfo ?? {}, // object
    };
  }

  [util.inspect.custom]() {
    return this.giveaway;
  }
  toJSON() {
    return this.giveaway;
  }
}
