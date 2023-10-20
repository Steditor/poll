import { BecomeAdminPayload, VotePayload } from "@poll/common/playerInterface";

import PollAPI from "../PollAPI";

export class PlayerAPI {
  private readonly _api: PollAPI;

  constructor(api: PollAPI) {
    this._api = api;
  }

  public becomeAdmin(key: string): boolean {
    return this._api.send("becomeAdmin", key as BecomeAdminPayload);
  }

  public vote(index: number): boolean {
    if (this._api.store.settings.openVote) {
      this._api.store.local.sentVote = index;
      return this._api.send("vote", index as VotePayload);
    } else {
      return false;
    }
  }
}
