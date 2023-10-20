import { BecomeAdminPayload } from "@poll/common/playerInterface";

import PollAPI from "../PollAPI";

export class PlayerAPI {
  private readonly _api: PollAPI;

  constructor(api: PollAPI) {
    this._api = api;
  }

  public becomeAdmin(key: string): boolean {
    return this._api.send("becomeAdmin", key as BecomeAdminPayload);
  }
}
