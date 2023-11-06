import { Command } from "@colyseus/command";
import { Client, Room } from "@colyseus/core";
import Ajv from "ajv";

import { VotePayload } from "@poll/common/playerInterface";

import { Poll } from "../Poll.js";
import { sendToast } from "../helpers/messages.js";

const validate = new Ajv().compile(VotePayload);

export class VoteCommand extends Command<
  Poll,
  {
    client: Client;
    vote: VotePayload;
  }
> {
  execute({ client, vote }: this["payload"]): void {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      let voteKey = player.vote.toString();
      this.state.votes.set(voteKey, (this.state.votes.get(voteKey) ?? 1) - 1);

      player.vote = vote;
      voteKey = player.vote.toString();
      this.state.votes.set(voteKey, (this.state.votes.get(voteKey) ?? 0) + 1);

      sendVoteSuccess(this.room, client);
    }
  }

  validate({ client, vote }: this["payload"] & { vote: any }): boolean {
    if (!validate(vote)) {
      sendVoteError(this.room, client);
      return false;
    }
    if (this.state.settings.numberOfOptions < vote) {
      return false;
    }
    if (!this.state.settings.openVote) {
      return false;
    }
    return this.state.players.has(client.sessionId);
  }
}

function sendVoteError(room: Room, client: Client) {
  sendToast(client, {
    severity: "error",
    summary: "Voting failed",
    detail: "The vote was invalid.",
    life: 2000,
  });
}

function sendVoteSuccess(room: Room, client: Client) {
  sendToast(client, {
    severity: "success",
    summary: "Vote sent",
    detail: "Thanks for your vote!",
    life: 1000,
  });
}
