import { v } from "convex/values";

export const transactionSchema = v.object({
  accountId: v.id("accounts"),
  value: v.number(),
  discount: v.optional(v.number())
});