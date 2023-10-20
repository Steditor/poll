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
    watchObject(this._properties, settings);
  }

  get moderationKey(): string {
    return this._properties.moderationKey;
  }
}

function defaultSettings(): SchemaProperties<PollSettings> {
  return {
    moderationKey: "",
  };
}
