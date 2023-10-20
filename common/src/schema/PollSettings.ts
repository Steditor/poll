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

export class PollSettings extends Schema {
  @type("uint8") public numberOfOptions!: number;
  @type("boolean") public openVote!: boolean;
  @type("boolean") public showResults!: boolean;
  @type("string") public moderationKey!: string;
}
