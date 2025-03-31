import { v } from "convex/values";

export const TimeUnit = {
  HOUR: "HOUR",
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
} as const;

export type TimeUnit = (typeof TimeUnit)[keyof typeof TimeUnit];

export const TIME_UNITS = Object.values(TimeUnit);

export const timeUnitValidator = v.union(
  v.literal(TimeUnit.HOUR),
  v.literal(TimeUnit.DAY),
  v.literal(TimeUnit.WEEK),
  v.literal(TimeUnit.MONTH),
);
