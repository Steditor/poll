import { MapSchema, Schema, type } from "@colyseus/schema";

import { PollGameData } from "./PollGameData.js";
import { PollPlayer } from "./PollPlayer.js";
import { PollSettings } from "./PollSettings.js";

export class PollState extends Schema {
  @type(PollSettings)
  settings = new PollSettings();

  @type({ map: PollPlayer })
  players = new MapSchema<PollPlayer>();

  @type(PollGameData)
  gameData = new PollGameData();
}
