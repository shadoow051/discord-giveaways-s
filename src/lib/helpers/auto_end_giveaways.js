import { Scheduler } from "./scheduler.js";
import { GiveawaysManager } from "./../../index.js";

export async function AutoEndGiveaways(filePath) {
  const g = new GiveawaysManager(filePath);
  const now = Date.now();
  const giveaways = await g.GetAllGiveaways();

  for (const giveaway of giveaways) {
    if (giveaway.status !== "active") continue;
    const endedAt = giveaway.endedAt ?? giveaway.startedAt + giveaway.duration;

    if (endedAt <= now) {
      await g.DrawWinners(giveaway.id);
      await g.EndGiveaway(giveaway.id);
      continue;
    }
    Scheduler(endedAt, async () => {
      await g.DrawWinners(giveaway.id);
      await g.EndGiveaway(giveaway.id);
    });
  }
}
