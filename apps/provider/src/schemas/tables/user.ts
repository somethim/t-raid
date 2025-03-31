import { v } from "convex/values";

export const userSchema = v.object({
  fullName: v.string(),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  birthdate: v.optional(v.string()),
  deletionTime: v.optional(v.number()),
});
