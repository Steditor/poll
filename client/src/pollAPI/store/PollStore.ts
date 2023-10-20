import * as Colyseus from "colyseus.js";

import { ref, shallowReactive, watch } from "vue";

import { PollState } from "@poll/common/schema/PollState";

import PollAPI from "../PollAPI";
import LocalStore from "./LocalStore";
import PlayerStore from "./PlayerStore";
import SettingsStore from "./SettingsStore";
import { watchMap } from "./helpers";

export default class PollStore {
  private _api: PollAPI;
  private readonly _sessionId = ref<null | string>(null);
  private readonly _roomId = ref<null | string>(null);

  public readonly settings = new SettingsStore();
  public readonly players = shallowReactive(new Map<string, PlayerStore>());
  public readonly numberOfPlayers = ref<number>(0);
  public readonly votes = shallowReactive(new Map<string, number>());

  public readonly local = new LocalStore();

  constructor(api: PollAPI) {
    this._api = api;
  }

  public watch(room: Colyseus.Room<PollState>): void {
    this.clear();

    this._sessionId.value = room.sessionId;
    this._roomId.value = room.id;

    this.settings.watch(room.state.settings);
    watchMap(this.players, room.state.players, PlayerStore);
    room.state.listen("numberOfPlayers", (value) => {
      this.numberOfPlayers.value = value;
    });
    watchMap(this.votes, room.state.votes);

    watch(
      () => this.me()?.vote,
      () => (this.local.sentVote = undefined),
    );
  }

  public clear(): void {
    this._sessionId.value = null;
    this._roomId.value = null;

    this.settings.clear();
    this.players.clear();
    this.numberOfPlayers.value = 0;
    this.votes.clear();

    this.local.clear();
  }

  get sessionId(): string | null {
    return this._sessionId.value;
  }

  get roomId(): string | null {
    return this._roomId.value;
  }

  public me(): PlayerStore | undefined {
    const id = this.sessionId;
    return id ? this.players.get(id) : undefined;
  }
}
