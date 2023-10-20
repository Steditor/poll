import { MapSchema, Schema, filterChildren, type } from "@colyseus/schema";
import { ClientWithSessionId } from "@colyseus/schema/lib/annotations";

import { PollPlayer } from "./PollPlayer.js";
import { PollSettings } from "./PollSettings.js";

export class PollState extends Schema {
  @type(PollSettings)
  settings = new PollSettings();

  @filterChildren(function (client: ClientWithSessionId, key: string) {
    return client.sessionId === key;
  })
  @type({ map: PollPlayer })
  players = new MapSchema<PollPlayer>();

  @type("uint32")
  numberOfPlayers = 0;

  @filterChildren(function (
    client: ClientWithSessionId,
    key,
    value,
    state: PollState,
  ) {
    return (
      state.settings.showResults ||
      (state.players.get(client.sessionId)?.admin ?? false)
    );
  })
  @type({ map: "number" })
  votes = new MapSchema<number>();

  public rerunVotesFilter(): void {
    // re-set all votes to make sure they are synchronized properly
    const votes = new Map<string, number>(this.votes.entries());
    this.votes.clear();
    votes.forEach((value, key) => this.votes.set(key, value));
  }
}
