import { Dispatcher } from "@colyseus/command";
import { Client } from "colyseus";

import { Poll } from "../Poll.js";
import { PollState } from "../schema/PollState.js";

export abstract class Game {
  protected readonly state: PollState;

  protected constructor(state: PollState) {
    this.state = state;
  }

  abstract onPlayerJoin(client: Client): void;
  abstract onPlayerLeave(client: Client): void;

  abstract onMessage(
    type: string | number,
    client: Client,
    message: unknown,
    dispatcher: Dispatcher<Poll>,
  ): void;
}
