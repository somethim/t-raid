import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { itemSchema, userSchema } from "../schemas/tables";

export default defineSchema({
  ...authTables,
  users: defineTable(userSchema)
    .index("email", ["email"])
    .index("username", ["username"]),
  items: defineTable(itemSchema).index("users", ["user"]),
});
