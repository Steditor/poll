import * as Colyseus from "colyseus.js";
import { nanoid } from "nanoid";

import { PollRoomJoinOptions } from "@poll/common/roomInterface";
import { PollState } from "@poll/common/schema/PollState";

import { ToastMessage } from "../../typings/primetoast";
import { vm } from "../main";
import router from "../router";
import { PlayerAPI } from "./api/PlayerAPI";
import { RoomAPI } from "./api/RoomAPI";
import PollStore from "./store/PollStore";

export enum JoinPollResult {
  SUCCESSFUL,
  ROOM_NOT_FOUND,
  UNKNOWN_ERROR,
}

export default class PollAPI {
  private readonly _client: Colyseus.Client;

  private _room?: Colyseus.Room<PollState>;
  get room(): Colyseus.Room | undefined {
    return this._room;
  }

  public readonly store: PollStore;

  public readonly playerAPI: PlayerAPI;
  public readonly roomAPI: RoomAPI;

  constructor() {
    this._client = new Colyseus.Client(getEndpoint());
    this.playerAPI = new PlayerAPI(this);
    this.roomAPI = new RoomAPI(this);
    this.store = new PollStore(this);

    window.addEventListener("beforeunload", () => this.onBeforeUnload());
  }

  public async createPoll(): Promise<string | undefined> {
    try {
      this._room = await this._client.create("poll", {
        initialModerationKey: nanoid(15),
      } as PollRoomJoinOptions);
      this.watchRoom(this._room);
    } catch (e) {
      return undefined;
    }
    return this._room.id;
  }

  public async joinPoll(
    id: string,
    options?: PollRoomJoinOptions,
  ): Promise<JoinPollResult> {
    if (this._room) {
      if (this._room.id === id) {
        return JoinPollResult.SUCCESSFUL;
      } else {
        this._room.leave(true);
        this._room = undefined;
      }
    }
    try {
      this._room = await this._client.joinById(id, options);
      this.watchRoom(this._room);
      this.receiveMessages(this._room);
    } catch (e: any) {
      if ((e.message as string).includes("not found")) {
        return JoinPollResult.ROOM_NOT_FOUND;
      } else {
        return JoinPollResult.UNKNOWN_ERROR;
      }
    }
    return JoinPollResult.SUCCESSFUL;
  }

  public send<T>(type: string | number, message?: T): boolean {
    if (this._room) {
      this._room.send(type, message);
      return true;
    } else {
      return false;
    }
  }

  private watchRoom(room: Colyseus.Room<PollState>) {
    room.onLeave((code) => this.onLeavePoll(code));
    // eslint-disable-next-line no-console
    room.onError((code, message) => console.log(code, message));
    this.store.watch(room);
  }

  private receiveMessages(room: Colyseus.Room<PollState>): void {
    room.onMessage("toast", (message: ToastMessage) => {
      vm.$toast.add(message);
    });
  }

  private onLeavePoll(code: number) {
    if (code !== 1000) {
      vm.$toast.add({
        severity: "warn",
        summary: "Disconnected",
        detail: "You were disconnected from the server.",
      });
    }
    this._room = undefined;
    this.store.clear();
    router.push({ name: "Home" });
  }

  private onBeforeUnload() {
    this._room?.leave(true);
  }
}

function getEndpoint() {
  const host = window.document.location.host.replace(/:.*/, "");
  const port = location.port ? ":" + location.port : "";
  const protocol = location.protocol.replace(/http(s?)/, "ws$1");
  return protocol + "//" + host + port;
}
