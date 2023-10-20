import { Dispatcher } from "@colyseus/command";
import { Client, Room } from "@colyseus/core";
import Ajv from "ajv";

import { PollRoomJoinOptions } from "@poll/common/roomInterface";

import { BecomeAdminCommand } from "./commands/BecomeAdminCommand.js";
import { OnJoinCommand } from "./commands/OnJoinCommand.js";
import { OnLeaveCommand } from "./commands/OnLeaveCommand.js";
import { SetSettingsCommand } from "./commands/SetSettingsCommand.js";
import { VoteCommand } from "./commands/VoteCommand.js";
import { DefaultGame } from "./games/DefaultGame.js";
import { Game } from "./games/Game.js";
import { PollState } from "./schema/PollState.js";

const validate = new Ajv().compile(PollRoomJoinOptions);

export class Poll extends Room<PollState> {
  dispatcher = new Dispatcher(this);
  private _initialModerationKey: string | undefined;

  private game!: Game;

  onCreate(options: PollRoomJoinOptions): void {
    if (validate(options)) {
      this._initialModerationKey = options.initialModerationKey;
    } else {
      this.disconnect();
      return;
    }
    this.setState(new PollState());
    this.game = new DefaultGame(this.state);

    this.onMessage("setSettings", (client, settings) => {
      this.dispatcher.dispatch(new SetSettingsCommand(), { client, settings });
    });

    this.onMessage("becomeAdmin", (client, key) => {
      this.dispatcher.dispatch(new BecomeAdminCommand(), { client, key });
    });

    this.onMessage("vote", (client, vote) => {
      this.dispatcher.dispatch(new VoteCommand(), { client, vote });
    });

    this.onMessage("*", (client, type, message) => {
      this.game.onMessage(type, client, message, this.dispatcher);
    });
  }

  public consumeInitialModerationKey(key: string): boolean {
    if (this._initialModerationKey && key === this._initialModerationKey) {
      this._initialModerationKey = undefined;
      return true;
    } else {
      return false;
    }
  }

  onJoin(client: Client, options: PollRoomJoinOptions): void {
    this.dispatcher.dispatch(new OnJoinCommand(), {
      client,
      options,
      game: this.game,
    });
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    this.dispatcher.dispatch(new OnLeaveCommand(), {
      client,
      consented,
      game: this.game,
    });
  }

  onDispose(): void | Promise<any> {}
}
