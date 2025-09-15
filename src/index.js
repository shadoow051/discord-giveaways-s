//---------------------------------------------------------------------
//region # Imports
//---------------------------------------------------------------------

import {
  GiveawayStorage,
  StorageFunctions,
} from "./lib/storage/giveaway_storage.js";
import { GenerateID } from "./lib/helpers/generate_id.js";
import { AutoEndGiveaways } from "./lib/helpers/auto_end_giveaways.js";
import { GiveawayBuilder } from "./lib/helpers/giveaway_builder.js";
import { GiveawayStatus } from "./lib/helpers/other/giveaway_status.js";
import { Events } from "./lib/helpers/other/events.js";
import { ConvertTime } from "./lib/helpers/convert_time_to_timestamp.js";
import { GiveawaysManager } from "./lib/giveaways_manager.js";
import { Version } from "./lib/helpers/module_version.js";

//---------------------------------------------------------------------
//region # Exports
//---------------------------------------------------------------------

export {
  GiveawayStorage,
  StorageFunctions,
  GenerateID,
  GiveawayBuilder,
  GiveawaysManager,
  AutoEndGiveaways,
  ConvertTime,
  GiveawayStatus,
  Events,
  Version,
};
export default {
  GiveawayStorage,
  StorageFunctions,
  GenerateID,
  GiveawayBuilder,
  GiveawaysManager,
  AutoEndGiveaways,
  ConvertTime,
  GiveawayStatus,
  Events,
  Version,
};
