import type { EmptyObject, OmitUndefinedEntries } from "@zenncore/types";

export const removeUndefinedEntries = <O extends EmptyObject>(
  obj: O,
): OmitUndefinedEntries<O> =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => !!value) as [
      keyof O,
      Exclude<O[keyof O], undefined>,
    ][],
  ) as OmitUndefinedEntries<O>;
