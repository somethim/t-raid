import { v } from "convex/values";
import type { Tuple } from "@zenncore/types/utilities";

export const LANGUAGE = {
  AL: "al",
  EN: "en"
} as const;
export const LANGUAGES = Object.values(LANGUAGE) as Tuple<
  (typeof LANGUAGE)[keyof typeof LANGUAGE],
  1
>;

export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];

export const languageValidator = v.union(
  v.literal(LANGUAGE.AL),
  v.literal(LANGUAGE.EN)
);
