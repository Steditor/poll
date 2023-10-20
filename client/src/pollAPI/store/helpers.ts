import { MapSchema, Schema } from "@colyseus/schema";
import { NonFunctionPropNames } from "@colyseus/schema/lib/types/HelperTypes";

import { SchemaProperties } from "@poll/common/schema/helpers";

export function watchObject<T extends Schema>(
  target: SchemaProperties<T>,
  source: T,
  keys: (NonFunctionPropNames<T> & keyof SchemaProperties<T>)[],
): void {
  for (const key of keys) {
    source.listen(key, (value) => (target[key] = value));
  }
}

export function watchMap<T>(target: Map<string, T>, source: MapSchema<T>): void;
export function watchMap<T extends Schema, W>(
  target: Map<string, W>,
  source: MapSchema<T>,
  Wrapper: new (item: T) => W,
): void;
export function watchMap<T, W>(
  target: Map<string, W>,
  source: MapSchema<T>,
  Wrapper?: new (item: T) => W,
): void {
  source.onAdd((item: T, key: string) => {
    target.set(key, Wrapper ? new Wrapper(item) : (item as unknown as W));
  });
  source.onChange((item: T, key: string) => {
    if (target.has(key)) {
      target.set(key, Wrapper ? new Wrapper(item) : (item as unknown as W));
    }
  });

  source.onRemove((item, key) => {
    target.delete(key);
  });
}
