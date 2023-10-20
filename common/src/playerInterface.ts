import { JSONSchemaType } from "ajv";

export type BecomeAdminPayload = string;

export const BecomeAdminPayload: JSONSchemaType<BecomeAdminPayload> = {
  type: "string",
  minLength: 15,
  maxLength: 15,
};

export type VotePayload = number;

export const VotePayload: JSONSchemaType<VotePayload> = {
  type: "number",
  minimum: 0,
  maximum: 255,
};
