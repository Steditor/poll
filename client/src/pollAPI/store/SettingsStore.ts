import { reactive } from "vue";

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
      "openVote",
      "showResults",
      "moderationKey",
    ]);
  }

  get numberOfOptions(): number {
    return this._properties.numberOfOptions;
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
}

function defaultSettings(): SchemaProperties<PollSettings> {
  return {
    numberOfOptions: 3,
    openVote: false,
    showResults: false,
    moderationKey: "",
  };
}
