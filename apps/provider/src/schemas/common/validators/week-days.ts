import { type Infer, v } from "convex/values";

export const WeekDay = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY",
} as const;

export type WeekDay = (typeof WeekDay)[keyof typeof WeekDay];

export const WEEK_DAYS = Object.values(WeekDay);

export const weekDaysValidator = v.array(
  v.union(
    v.literal(0),
    v.literal(1),
    v.literal(2),
    v.literal(3),
    v.literal(4),
    v.literal(5),
    v.literal(6),
  ),
);
