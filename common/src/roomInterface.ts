import { JSONSchemaType } from "ajv";

import { PollSettings } from "./schema/PollSettings";
import { SchemaProperties } from "./schema/helpers";

export interface PollRoomJoinOptions {
  initialModerationKey?: string;
}

export const PollRoomJoinOptions: JSONSchemaType<PollRoomJoinOptions> = {
  type: "object",
  properties: {
    initialModerationKey: {
      type: "string",
      minLength: 15,
      maxLength: 15,
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
};

export enum PollCloseCodes {
  KICKED = 4000,
}

export type SetSettingsPayload = Partial<
  Pick<
    SchemaProperties<PollSettings>,
    "numberOfOptions" | "openVote" | "showResults"
  >
>;

export const SetSettingsPayload: JSONSchemaType<SetSettingsPayload> = {
  type: "object",
  properties: {
    numberOfOptions: {
      type: "number",
      minimum: 2,
      maximum: 255,
      nullable: true,
    },
    openVote: {
      type: "boolean",
      nullable: true,
    },
    showResults: {
      type: "boolean",
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
};
