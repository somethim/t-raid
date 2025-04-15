import type { Prettify, UnionToIntersection } from "../utilities";

type SubClassList<T extends string, U extends string> = Prettify<
  Partial<Record<T | "root", U>>
>;

export type ClassList<T extends string | SubClassList<string, string>> =
  Prettify<
    UnionToIntersection<
      T extends string
        ? Partial<Record<T | "root", string>>
        : T extends SubClassList<infer K, infer V>
          ? { root?: string } & Partial<Record<K, SubClassList<V, string>>>
          : never
    >
  >;

// type SubClassList<
//   T extends string,
//   U extends string | ClassList<any>,
// > = UnionToIntersection<
//   U extends string
//     ? Partial<Record<T, U>>
//     : U extends ClassList<infer K extends string>
//       ? Partial<Record<K, ClassList<U>>>
//       : never
// >;

// export type ClassList<
//   T extends string | SubClassList<string, string | ClassList<any>>,
// > = UnionToIntersection<
//   T extends string
//     ? Partial<Record<T, string>>
//     : T extends SubClassList<infer K extends string, infer V>
//       ? Partial<Record<K, SubClassList<V, string>>>
//       : never
// >;
