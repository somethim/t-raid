import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import {
  itemSchema,
  temporaryTokensSchema,
  userSchema,
} from "../schemas/tables";

export default defineSchema({
  ...authTables,
  users: defineTable(userSchema).index("email", ["email"]),
  items: defineTable(itemSchema).index("users", ["user"]),
  temporaryTokens: defineTable(temporaryTokensSchema).index("by_phone", [
    "phone",
  ]),
});
