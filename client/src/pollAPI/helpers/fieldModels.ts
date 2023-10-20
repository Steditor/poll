import { ComponentCustomProperties, WritableComputedOptions } from "vue";

import { SetSettingsPayload } from "@poll/common/roomInterface";

type PropertiesOfType<TObj, TResult> = {
  [K in keyof TObj]: TObj[K] extends TResult ? K : never;
}[keyof TObj];

export function settingsFieldModel<
  T extends SetSettingsPayload[keyof SetSettingsPayload],
>(
  field: PropertiesOfType<Required<SetSettingsPayload>, T>,
): WritableComputedOptions<T> {
  return {
    get(this: ComponentCustomProperties): T {
      return this.$pollAPI.store.settings[field] as T;
    },
    set(this: ComponentCustomProperties, value: T) {
      this.$pollAPI.roomAPI.setSettings({ [field]: value });
    },
  };
}
