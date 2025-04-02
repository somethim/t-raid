import { defineSchema, defineTable } from "convex/server";
import { accountSchema, transactionSchema } from "../schemas/tables";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable(accountSchema)
    .index("email", ["email"])
    .index("phone", ["phone"]),
  transactions: defineTable(transactionSchema).index("accountId", ["accountId"])
});
