import { Command } from "@colyseus/command";
import { Client } from "@colyseus/core";
import Ajv from "ajv";

import { SetSettingsPayload } from "@poll/common/roomInterface";

import { Poll } from "../Poll.js";
import { persistPollSettings } from "../helpers/persistence.js";

const validate = new Ajv().compile(SetSettingsPayload);

export class SetSettingsCommand extends Command<
  Poll,
  {
    client: Client;
    settings: SetSettingsPayload;
  }
> {
  async execute({ settings }: this["payload"]): Promise<void> {
    Object.assign(this.state.settings, settings);

    await persistPollSettings(this.room.roomId, this.state.settings);

    this.state.recomputeVotes();
  }

  validate({ client, settings }: this["payload"] & { settings: any }): boolean {
    if (!validate(settings)) {
      return false;
    }
    return this.state.players.get(client.sessionId)?.admin ?? false; // only admins can configure settings
  }
}
