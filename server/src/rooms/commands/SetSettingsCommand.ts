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

    // Ensure state is consistent with number of options
    for (
      let i = this.state.votes.size - 1;
      i > this.state.settings.numberOfOptions;
      i--
    ) {
      this.state.votes.delete(i.toString());
    }
    for (
      let i = this.state.votes.size;
      i <= this.state.settings.numberOfOptions;
      i++
    ) {
      this.state.votes.set(i.toString(), 0);
    }
    for (const [, player] of this.state.players) {
      if (player.vote > this.state.settings.numberOfOptions) {
        player.vote = 0;
        this.state.votes.set("0", (this.state.votes.get("0") ?? 0) + 1);
      }
    }

    if (settings.showResults !== undefined) {
      this.state.rerunVotesFilter();
    }
  }

  validate({ client, settings }: this["payload"] & { settings: any }): boolean {
    if (!validate(settings)) {
      return false;
    }
    return this.state.players.get(client.sessionId)?.admin ?? false; // only admins can configure settings
  }
}
