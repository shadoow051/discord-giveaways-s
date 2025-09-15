<p align="center">
  <a href="https://www.npmjs.com/package/discord-giveaways-s">
    <img src="https://github.com/shadoow051/discord-giveaways-s/blob/main/src/discord-giveaways-s.png" width="600" alt="discord-giveaways-s" />
  </a>
</p>

# 🗃️ DISCORD-GIVEAWAYS-S — Documentation 🗃️

This is not full documentation for this module, but the basic functions are here.

![npm](https://img.shields.io/npm/v/discord-giveaways-s)
![license](https://img.shields.io/npm/l/discord-giveaways-s)
[![GitHub](https://img.shields.io/badge/GitHub-View-blue?logo=github)](https://github.com/shadoow051/discord-giveaways-s)

## 📋 Table of Contents

- [Giveaway Create & Delete](#giveaway-create--delete)
- [Giveaway Join & Leave](#giveaway-join--leave)

## 🎉 Giveaway Create

Below is an example of how to create and start a giveaway.

```js
import { GiveawayBuilder, GiveawaysManager }

const g = new GiveawaysManager("giveaways.json");

const giveaway = new GiveawayBuilder()
  .setPrize("vip")
  .setDescription("description")
  .setDuration(123456789);

const giveawayId = giveaway.id;

await g.CreateGiveaway(giveaway);
await g.StartGiveaway(giveawayId);
```

## ❌ Giveaway Delete

Below is an example of how to remove a giveaway.

```js
import { GiveawaysManager }

const g = new GiveawaysManager("giveaways.json");

await g.DeleteGiveaway(giveawayId);
// or
await g.DeleteAllGiveaways();
```

## 🔍 Get Giveaway

Used to obtain a giveaway.

```js
import { GiveawaysManager }

const g = new GiveawaysManager("giveaways.json");

const giveaway = await g.GetGiveaway(giveawayId);
// or
const giveaways = await g.GetAllGiveaways();
```

## 👤 Add/Remove Participant

Used to add or remove a user from the giveaway.

```js
import { GiveawaysManager }

const g = new GiveawaysManager("giveaways.json");

await g.AddParticipant(giveawayId, userId);
// or
await g.RemoveParticipant(giveawayId, userId);
```

## ✏️ Edit Giveaway

Used to edit the giveaway.

```js
import { GiveawaysManager }

const g = new GiveawaysManager("giveaways.json");

const updates = {
  prize: "new prize",
  description: "new description",
  // ...
}

await g.EditGiveaway(giveawayId, updates);
```

## ⏱️ Auto End Giveaways

This function should be placed in such a place that it runs when the bot starts.
Used to automatically end all gifts once their time has passed.

```js
import { AutoEndGiveaways }

await AutoEndGiveaways("giveaways.json");
```

## 💾 Giveaway Storage

If you want to save files in a database, you must first define the path to the file with the functions that support this database.
If you don't do this, giveaways will be saved in json files by default.
On the project's GitHub there is a custom file with functions converted into the better-sqlite3 module, there is also a template that you can use to convert the functions to another database.

```js
import { GiveawayStorage }

await GiveawayStorage("./customStorage/better-sqlite3_storage.js");
```

## ⏲️ Convert Time

This function helps convert time to timestamp in ms, which can then be used in .setDuration() when creating a giveaway.

```js
import { ConvertTime }

const timestamp = await ConvertTime("1h");
```

## 🎈 Events

The Events variable contains all events emitted by the module.

```js
import { Events }

console.log(Events)
```

## 🆔 Generate Custom Giveaway ID

This function allows you to easily generate custom ids that can be used when creating a giveaway using .setId("...");.
Can be set:
prefix - Characters displayed at the beginning of the giveaway id.
suffix - Characters displayed at the end of the giveaway id.
length - Used to set the length of the giveaway id (default 15).
Instead of length you can use suffix, then instead of random id characters you can insert your own text.

```js
import { GenerateID }

const giveawayId = GenerateID({
  prefix: "Giveaway_",
  suffix: "_s",
  length: 8, // or suffix
});
```

## 🆔 Giveaway Builder

This is used to build a giveaway object, which can then be used to create a giveaway.

```js
import { GiveawayBuilder }

const giveaway = new GiveawayBuilder()
  .setPrize("vip")
  .setDescription("description")
  .setAuthorId("Shadow")
  .setDuration(123456789)
```

```js
  .setId() // string
  .setPrize() // string
  .setDescription() // string
  .setDuration() // number
  .setNumberOfWinners() // number
  .setMinParticipants() // number
  .setMaxParticipants() // number
  .setBlacklist() // array
  .setParticipants() // array
  .setWinners() // array
  .setRerolledWinners() // array
  .setCreatedAt() // number
  .setStartedAt() // number
  .setEndedAt() // number
  .setStartedBy() // string
  .setEndedBy() // string
  .setAuthorId() // string
  .setGuildId() // string
  .setChannelId() // string
  .setMessageId() // string
  .setStatus() // string
  .setCustomInfo(); // object
```
