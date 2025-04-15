import { Infer, v } from "convex/values";
import { itemStatusValidator, shopValidator } from "../enums";

export type Item = Infer<typeof itemSchema>;

export const itemSchema = v.object({
  user: v.id("users"),
  origin: shopValidator,
  status: itemStatusValidator,
  product: v.string(),
  value: v.number(),
  quantity: v.number(),
  discount: v.optional(v.number()),
  _deletedAt: v.optional(v.number()),
});
