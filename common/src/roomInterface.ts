import { JSONSchemaType } from "ajv";

import { PollSettings } from "./schema/PollSettings";
import { SchemaProperties } from "./schema/helpers";

export interface PollRoomJoinOptions {
  initialModerationKey?: string;
  roomId?: string;
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
    roomId: {
      type: "string",
      nullable: true,
    },
  },
  additionalProperties: false,
  maxProperties: 1,
};

export enum PollCloseCodes {
  KICKED = 4000,
}

export type SetSettingsPayload = Partial<
  Pick<
    SchemaProperties<PollSettings>,
    "numberOfOptions" | "numbering" | "openVote" | "showResults" | "expiryDelay"
  >
>;

export const NUMBERINGS = [
  "lower-alpha",
  "upper-alpha",
  "decimal",
  "lower-roman",
  "upper-roman",
] as const;

export const LABELED_NUMBERINGS: readonly {
  label: string;
  value: (typeof NUMBERINGS)[number];
}[] = [
  { label: "a, b, c, d, ...", value: "lower-alpha" },
  { label: "A, B, C, D, ...", value: "upper-alpha" },
  { label: "1, 2, 3, 4, ...", value: "decimal" },
  { label: "i, ii, iii, iv, ...", value: "lower-roman" },
  { label: "I, II, III, IV, ...", value: "upper-roman" },
] as const;

export enum ExpiryDelay {
  Hour = "hour",
  Day = "day",
  Week = "week",
  Month = "month",
}

export const LABELED_DELAYS: readonly {
  label: string;
  value: ExpiryDelay;
}[] = [
  { label: "Hour", value: ExpiryDelay.Hour },
  { label: "Day", value: ExpiryDelay.Day },
  { label: "Week", value: ExpiryDelay.Week },
  { label: "Month", value: ExpiryDelay.Month },
];

export const SetSettingsPayload: JSONSchemaType<SetSettingsPayload> = {
  type: "object",
  properties: {
    numberOfOptions: {
      type: "number",
      minimum: 2,
      maximum: 255,
      nullable: true,
    },
    numbering: {
      type: "string",
      enum: NUMBERINGS,
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
    expiryDelay: {
      type: "string",
      enum: Object.values(ExpiryDelay) as readonly ExpiryDelay[],
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
};
