/* eslint @typescript-eslint/no-unused-vars: "warn" */
import { Dispatcher } from "@colyseus/command";
import { Client } from "colyseus";

import { Poll } from "../Poll";
import { PollState } from "../schema/PollState.js";
import { Game } from "./Game.js";

export class DefaultGame extends Game {
  constructor(state: PollState) {
    super(state);
  }

  onPlayerJoin(client: Client): void {
    this.state.votes.set("0", (this.state.votes.get("0") ?? 0) + 1);
  }

  onPlayerLeave(client: Client): void {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      const voteKey = player.vote.toString();
      this.state.votes.set(voteKey, (this.state.votes.get(voteKey) ?? 1) - 1);
    }
  }

  onMessage(
    type: string | number,
    client: Client,
    message: unknown,
    dispatcher: Dispatcher<Poll>,
  ): void {}
}
