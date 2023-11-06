import { Schema, type } from "@colyseus/schema";

export class PollPlayer extends Schema {
  @type("boolean")
  admin = false;

  @type("uint8")
  vote = 0;
}
