import * as Colyseus from "colyseus.js";

import { ref, shallowReactive } from "vue";

import { PollState } from "@poll/common/schema/PollState";

import PollAPI from "../PollAPI";
import GameDataStore from "./GameDataStore";
import PlayerStore from "./PlayerStore";
import SettingsStore from "./SettingsStore";
import { watchMap } from "./helpers";

export default class PollStore {
  private _api: PollAPI;
  private readonly _sessionId = ref<null | string>(null);
  private readonly _roomId = ref<null | string>(null);

  public readonly settings = new SettingsStore();
  public readonly gameData = new GameDataStore();
  public readonly players = shallowReactive(new Map<string, PlayerStore>());

  constructor(api: PollAPI) {
    this._api = api;
  }

  public watch(room: Colyseus.Room<PollState>): void {
    this.clear();

    this._sessionId.value = room.sessionId;
    this._roomId.value = room.id;

    this.settings.watch(room.state.settings);
    this.gameData.watch(room.state.gameData);

    watchMap(this.players, PlayerStore, room.state.players);
  }

  public clear(): void {
    this._sessionId.value = null;
    this._roomId.value = null;

    this.settings.clear();
    this.gameData.clear();
    this.players.clear();
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
