/* eslint @typescript-eslint/no-unused-vars: "warn" */
import { Dispatcher } from "@colyseus/command";
import { Client } from "colyseus";

import { Poll } from "../Poll";
import { ClearVotesCommand } from "../commands/ClearVotesCommand.js";
import { VoteCommand } from "../commands/VoteCommand.js";
import { PollState } from "../schema/PollState.js";
import { Game } from "./Game.js";

export class DefaultGame extends Game {
  constructor(state: PollState) {
    super(state);
  }

  onPlayerJoin(client: Client): void {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.vote = 0;
      this.state.votes.set("0", (this.state.votes.get("0") ?? 0) + 1);
      this.state.numberOfVoters++;
    }
  }

  onPlayerBecomeAdmin(client: Client): void {
    this.onPlayerLeave(client);
  }

  onPlayerLeave(client: Client): void {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      const voteKey = player.vote.toString();
      this.state.votes.set(voteKey, (this.state.votes.get(voteKey) ?? 1) - 1);
      this.state.numberOfVoters--;
    }
  }

  onMessage(
    type: string | number,
    client: Client,
    message: unknown,
    dispatcher: Dispatcher<Poll>,
  ): void {
    switch (type) {
      case "vote":
        dispatcher.dispatch(new VoteCommand(), {
          client,
          vote: message as any,
        });
        break;
      case "clearVotes":
        dispatcher.dispatch(new ClearVotesCommand(), { client });
        break;
    }
  }
}
