import { Command } from "@colyseus/command";
import { Client } from "@colyseus/core";

import { Poll } from "../Poll.js";

export class ClearVotesCommand extends Command<
  Poll,
  {
    client: Client;
  }
> {
  execute(): void {
    this.state.players.forEach((player) => (player.vote = 0));
    this.state.votes.forEach((_, key) => this.state.votes.set(key, 0));
    this.state.votes.set("0", this.state.numberOfPlayers);
  }

  validate({ client }: this["payload"]): boolean {
    return this.state.players.get(client.sessionId)?.admin ?? false; // only admins can clear votes
  }
}
