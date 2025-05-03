import { v } from "convex/values";

export const userSchema = v.object({
  email: v.string(),
  phone: v.optional(v.string()),
  fullName: v.optional(v.string()),
  emailVerifiedAt: v.optional(v.number()),
  phoneVerifiedAt: v.optional(v.number()),
  _deletedAt: v.optional(v.number()),
});
