//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 2.0.19
//
import {
  ArraySchema,
  DataChange,
  MapSchema,
  Schema,
  SetSchema,
  type,
} from "@colyseus/schema";

import { PollPlayer } from "./PollPlayer";
import { PollSettings } from "./PollSettings";

export class PollState extends Schema {
  @type(PollSettings) public settings: PollSettings = new PollSettings();
  @type({ map: PollPlayer }) public players: MapSchema<PollPlayer> =
    new MapSchema<PollPlayer>();
  @type("uint32") public numberOfVoters!: number;
  @type({ map: "number" }) public votes: MapSchema<number> =
    new MapSchema<number>();
}
