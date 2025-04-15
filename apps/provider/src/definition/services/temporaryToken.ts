import { v } from "convex/values";
import * as TemporaryToken from "../../models/temporaryToken";
import { temporaryTokensSchema } from "../../schemas/tables";
import { internalMutation, internalQuery } from "../_generated/server";

export const create = internalMutation({
  args: {
    data: temporaryTokensSchema,
  },
  handler: TemporaryToken.create,
});

export const deleteExpiredTemporaryTokens = internalMutation({
  args: {},
  handler: TemporaryToken.deleteExpiredTemporaryTokens,
});

export const getIsValid = internalQuery({
  args: {
    token: v.string(),
    phone: v.string(),
  },
  handler: TemporaryToken.getIsValid,
});
