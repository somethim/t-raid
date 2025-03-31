import type { EmptyObject } from "../domain";

export type DeepPartial<T extends EmptyObject> = {
  [K in keyof T]?: T[K] extends EmptyObject ? DeepPartial<T[K]> : T[K];
};
