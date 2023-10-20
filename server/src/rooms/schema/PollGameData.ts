import { Schema, type } from "@colyseus/schema";

export class PollGameData extends Schema {
  @type("boolean")
  showResults = false;
}
