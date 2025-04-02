import {v} from "convex/values";

export const accountSchema = v.object({
    username: v.string(),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    birthdate: v.optional(v.string()),
    deletionTime: v.optional(v.number())
});