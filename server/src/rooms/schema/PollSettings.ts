import { Schema, filter, type } from "@colyseus/schema";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";

import { ExpiryDelay } from "../helpers/persistence.js";
import { PollState } from "./PollState.js";

export class PollSettings extends Schema {
  @type("uint8")
  numberOfOptions = 3;

  @type("string")
  numbering = "lower-alpha";

  @type("boolean")
  openVote = false;

  @type("boolean")
  showResults = false;

  @filter(function (client, value, state: PollState) {
    return state.players.get(client.sessionId)?.admin ?? false;
  })
  @type("string")
  moderationKey = nanoid(15);

  @type("string")
  expiry = DateTime.now().plus({ hour: 1 }).toISO()!;

  @type("string")
  expiryDelay = ExpiryDelay.Hour;

  public rerunFilters(): void {
    this._definition.indexesWithFilters.forEach((index) =>
      this.$changes.touch(index),
    );
  }
}

export interface PollSettingsSchemalike {
  numberOfOptions: number;
  numbering: string;
  openVote: boolean;
  showResults: boolean;
  moderationKey: string;
  expiry: string;
  expiryDelay: ExpiryDelay;
}
