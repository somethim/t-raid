import { v } from "convex/values";

export const addressValidator = v.object({
  street: v.string(),
  city: v.string(),
  postalCode: v.number(),
});
