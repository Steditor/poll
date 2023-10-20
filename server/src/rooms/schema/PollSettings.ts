import { Schema, filter, type } from "@colyseus/schema";
import { nanoid } from "nanoid";

import { PollState } from "./PollState.js";

export class PollSettings extends Schema {
  @type("uint8")
  numberOfOptions = 3;

  @filter(function (client, value, state: PollState) {
    return state.players.get(client.sessionId)?.admin ?? false;
  })
  @type("string")
  moderationKey = nanoid(15);

  public rerunFilters(): void {
    this._definition.indexesWithFilters.forEach((index) =>
      this.$changes.touch(index),
    );
  }
}
