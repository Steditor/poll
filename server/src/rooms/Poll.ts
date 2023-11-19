import { Dispatcher } from "@colyseus/command";
import { Client, Room } from "@colyseus/core";
import Ajv from "ajv";
import { nanoid } from "nanoid";

import { PollRoomJoinOptions } from "@poll/common/roomInterface";

import { prisma } from "../db.js";
import { BecomeAdminCommand } from "./commands/BecomeAdminCommand.js";
import { OnJoinCommand } from "./commands/OnJoinCommand.js";
import { OnLeaveCommand } from "./commands/OnLeaveCommand.js";
import { SetSettingsCommand } from "./commands/SetSettingsCommand.js";
import { DefaultGame } from "./games/DefaultGame.js";
import { Game } from "./games/Game.js";
import {
  entityToSchemalike,
  persistPollSettings,
  updateExpiry,
} from "./helpers/persistence.js";
import { PollState } from "./schema/PollState.js";

const validate = new Ajv().compile(PollRoomJoinOptions);

export class Poll extends Room<PollState> {
  dispatcher = new Dispatcher(this);
  private _initialModerationKey: string | undefined;

  private game!: Game;

  async onCreate(options: PollRoomJoinOptions): Promise<void> {
    if (!validate(options)) {
      await this.disconnect();
      return;
    }

    if (options.roomId) {
      // restore old room
      const roomData = await prisma.pollSettings.findUnique({
        where: { roomId: options.roomId },
      });
      if (!roomData) {
        await this.disconnect();
        return;
      }
      this.roomId = options.roomId;
      this.setState(new PollState());
      Object.assign(this.state.settings, entityToSchemalike(roomData));
    } else {
      // create new room
      this._initialModerationKey = options.initialModerationKey;
      while (
        (await prisma.pollSettings.findUnique({
          where: { roomId: this.roomId },
        })) !== null
      ) {
        this.roomId = nanoid(9);
      }
      this.setState(new PollState());
      await persistPollSettings(this.roomId, this.state.settings);
    }

    this.game = new DefaultGame(this.state);

    this.onMessage("setSettings", async (client, settings) => {
      await this.dispatcher.dispatch(new SetSettingsCommand(), {
        client,
        settings,
      });
      await updateExpiry(this.roomId);
    });

    this.onMessage("becomeAdmin", async (client, key) => {
      await this.dispatcher.dispatch(new BecomeAdminCommand(), {
        client,
        key,
        game: this.game,
      });
      await updateExpiry(this.roomId);
    });

    this.onMessage("*", async (client, type, message) => {
      this.game.onMessage(type, client, message, this.dispatcher);
      await updateExpiry(this.roomId);
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

  async onJoin(client: Client, options: PollRoomJoinOptions): Promise<void> {
    this.dispatcher.dispatch(new OnJoinCommand(), {
      client,
      options,
      game: this.game,
    });
    await updateExpiry(this.roomId);
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    this.dispatcher.dispatch(new OnLeaveCommand(), {
      client,
      consented,
      game: this.game,
    });
    await updateExpiry(this.roomId);
  }

  onDispose(): void | Promise<any> {}
}
