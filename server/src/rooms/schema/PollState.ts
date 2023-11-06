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
  numberOfVoters = 0;

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

  constructor() {
    super();
    this.recomputeVotes();
  }

  public recomputeVotes() {
    this.votes.clear();

    for (let i = 0; i <= this.settings.numberOfOptions; i++) {
      this.votes.set(i.toString(), 0);
    }

    for (const [, player] of this.players) {
      if (player.admin) continue;

      if (player.vote > this.settings.numberOfOptions) {
        player.vote = 0;
      }
      const voteKey = player.vote.toString();
      this.votes.set(voteKey, (this.votes.get(voteKey) ?? 0) + 1);
    }
  }
}
