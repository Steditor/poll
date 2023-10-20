import { reactive } from "vue";

import { PollPlayer } from "@poll/common/schema/PollPlayer";
import { SchemaProperties } from "@poll/common/schema/helpers";

import { watchObject } from "./helpers";

export default class PlayerStore implements SchemaProperties<PollPlayer> {
  private readonly _properties = reactive<SchemaProperties<PollPlayer>>({
    admin: false,
    vote: 0,
    voted: false,
  });

  constructor(player: PollPlayer) {
    watchObject(this._properties, player, ["admin", "vote", "voted"]);
  }

  get admin(): boolean {
    return this._properties.admin;
  }

  get vote(): number {
    return this._properties.vote;
  }

  get voted(): boolean {
    return this._properties.voted;
  }
}
