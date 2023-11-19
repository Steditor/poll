//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 2.0.22
//
import {
  ArraySchema,
  DataChange,
  MapSchema,
  Schema,
  SetSchema,
  type,
} from "@colyseus/schema";

export class PollPlayer extends Schema {
  @type("boolean") public admin!: boolean;
  @type("uint8") public vote!: number;
}
