import { MapSchema, Schema } from "@colyseus/schema";

import { SchemaProperties } from "@poll/common/schema/helpers";

export function watchObject<T extends Schema>(
  target: SchemaProperties<T>,
  source: T,
): void {
  Object.assign(target, source);
  source.onChange(() => {
    Object.assign(target, source);
  });
}

export function watchMap<T extends Schema, W>(
  target: Map<string, W>,
  Wrapper: new (item: T) => W,
  source: MapSchema<T>,
): void {
  const setCallback = (item: T, key: string) => {
    target.set(key, new Wrapper(item));
  };
  source.onAdd(setCallback);
  source.onChange(setCallback);

  source.onRemove = (item, key) => {
    target.delete(key);
  };
}
