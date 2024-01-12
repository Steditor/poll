import { DateTime } from "luxon";

import { reactive } from "vue";

import { ExpiryDelay } from "@poll/common/roomInterface";
import { PollSettings } from "@poll/common/schema/PollSettings";
import { SchemaProperties } from "@poll/common/schema/helpers";

import { watchObject } from "./helpers";

export default class SettingsStore implements SchemaProperties<PollSettings> {
  private readonly _properties = reactive<SchemaProperties<PollSettings>>(
    defaultSettings(),
  );

  public clear(): void {
    Object.assign(this._properties, defaultSettings());
  }

  public watch(settings: PollSettings): void {
    watchObject(this._properties, settings, [
      "numberOfOptions",
      "numbering",
      "openVote",
      "showResults",
      "moderationKey",
      "expiry",
      "expiryDelay",
    ]);
  }

  get numberOfOptions(): number {
    return this._properties.numberOfOptions;
  }

  get numbering(): string {
    return this._properties.numbering;
  }

  get openVote(): boolean {
    return this._properties.openVote;
  }

  get showResults(): boolean {
    return this._properties.showResults;
  }

  get moderationKey(): string {
    return this._properties.moderationKey;
  }

  get expiry(): string {
    return this._properties.expiry;
  }

  get expiryDelay(): string {
    return this._properties.expiryDelay;
  }
}

function defaultSettings(): SchemaProperties<PollSettings> {
  return {
    numberOfOptions: 3,
    numbering: "lower-alpha",
    openVote: false,
    showResults: false,
    moderationKey: "",
    expiry: DateTime.now().plus({ hour: 1 }).toISO()!,
    expiryDelay: ExpiryDelay.Hour,
  };
}
