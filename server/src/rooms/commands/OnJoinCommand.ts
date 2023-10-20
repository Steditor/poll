import { Command } from "@colyseus/command";
import { Client } from "@colyseus/core";
import Ajv from "ajv";

import { PollRoomJoinOptions } from "@poll/common/roomInterface";

import { Poll } from "../Poll.js";
import { Game } from "../games/Game.js";
import { PollPlayer } from "../schema/PollPlayer.js";
import { BecomeAdminCommand } from "./BecomeAdminCommand.js";

const validate = new Ajv().compile(PollRoomJoinOptions);

export class OnJoinCommand extends Command<
  Poll,
  {
    client: Client;
    options?: PollRoomJoinOptions;
    game: Game;
  }
> {
  execute({ client, options, game }: this["payload"]): Array<Command> {
    const player = new PollPlayer();

    this.state.players.set(client.sessionId, player);
    game.onPlayerJoin(client);

    const commands = [] as Array<Command>;
    if (options?.initialModerationKey) {
      const becomeAdmin = new BecomeAdminCommand();
      becomeAdmin.setPayload({ client, key: options.initialModerationKey });
      commands.push(becomeAdmin);
    }
    return commands;
  }
  validate({ options }: this["payload"] & { options: unknown }): boolean {
    return validate(options);
  }
}
