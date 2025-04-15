import { v } from "convex/values";

export const userSchema = v.object({
  email: v.string(),
  admin: v.optional(v.boolean()),
  emailVerifiedAt: v.optional(v.number()),
  username: v.optional(v.string()),
  phone: v.optional(v.string()),
  phoneVerifiedAt: v.optional(v.number()),
  _deletedAt: v.optional(v.number()),
});
