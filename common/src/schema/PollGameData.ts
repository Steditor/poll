//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 2.0.19
//
import {
  ArraySchema,
  DataChange,
  MapSchema,
  Schema,
  SetSchema,
  type,
} from "@colyseus/schema";

export class PollGameData extends Schema {
  @type("boolean") public showResults!: boolean;
}
