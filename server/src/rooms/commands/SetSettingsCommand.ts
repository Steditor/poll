import { Command } from "@colyseus/command";
import { Client } from "@colyseus/core";
import Ajv from "ajv";

import { SetSettingsPayload } from "@poll/common/roomInterface";

import { Poll } from "../Poll.js";

const validate = new Ajv().compile(SetSettingsPayload);

export class SetSettingsCommand extends Command<
  Poll,
  {
    client: Client;
    settings: SetSettingsPayload;
  }
> {
  execute({ settings }: this["payload"]): void {
    Object.assign(this.state.settings, settings);
  }

  validate({ client, settings }: this["payload"] & { settings: any }): boolean {
    if (!validate(settings)) {
      return false;
    }
    return this.state.players.get(client.sessionId)?.admin ?? false; // only admins can configure settings
  }
}
