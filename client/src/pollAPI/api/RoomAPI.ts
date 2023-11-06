import { SetSettingsPayload } from "@poll/common/roomInterface";

import PollAPI from "../PollAPI";

export class RoomAPI {
  private readonly _api: PollAPI;

  constructor(api: PollAPI) {
    this._api = api;
  }

  public setSettings(settings: SetSettingsPayload): boolean {
    return this._api.send("setSettings", settings);
  }

  public clearVotes(): boolean {
    return this._api.send("clearVotes");
  }
}
