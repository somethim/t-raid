import { v } from "convex/values";
import * as User from "../../models/user";
import { userSchema } from "../../schemas/tables";
import { partial } from "../../utils";
import {
  authenticatedMutation,
  authenticatedQuery,
} from "../../utils/authentication";
import { internalQuery } from "../_generated/server";

export const getById = internalQuery({
  args: {
    id: v.id("users"),
  },
  handler: User.getById,
});

export const getCurrentUser = authenticatedQuery({
  args: {},
  handler: User.getCurrentUser,
});

export const updateCurrentUser = authenticatedMutation({
  args: partial(userSchema),
  handler: User.updateCurrentUser,
});

export const deleteCurrentUser = authenticatedMutation({
  args: {},
  handler: User.deleteCurrentUser,
});

