import { Command } from "@colyseus/command";

import { Poll } from "../Poll.js";
import {
  computeExtendedExpiry,
  persistPollSettings,
} from "../helpers/persistence.js";

export class UpdateExpiryCommand extends Command<Poll> {
  async execute(): Promise<void> {
    this.state.settings.expiry = await computeExtendedExpiry(
      this.state.settings.expiryDelay,
    );
    await persistPollSettings(this.room.roomId, this.state.settings);
  }
}
