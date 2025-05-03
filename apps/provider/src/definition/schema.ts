import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { temporaryTokensSchema, userSchema } from "../schemas/tables";

export default defineSchema({
  ...authTables,
  users: defineTable(userSchema).index("email", ["email"]),
  temporaryTokens: defineTable(temporaryTokensSchema).index("by_phone", [
    "phone",
  ]),
});
