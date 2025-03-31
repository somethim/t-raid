import { v } from "convex/values";

export const rangeValidator = v.array(v.float64());
export type Range = [number, number];
