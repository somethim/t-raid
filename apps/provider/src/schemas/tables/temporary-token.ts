import { v } from "convex/values";

export const temporaryTokensSchema = v.object({
  phone: v.string(),
  token: v.string(),
});
