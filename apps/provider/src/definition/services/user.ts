import { v } from "convex/values";
import * as User from "../../models/user";
import { userSchema } from "../../schemas/tables";
import {
  authenticatedMutation,
  authenticatedQuery,
  partial,
} from "../../utils";

export const getAll = authenticatedQuery({
  args: {},
  handler: User.getAll,
});

export const getById = authenticatedQuery({
  args: {
    id: v.id("users"),
  },
  handler: User.getById,
});

export const updateUser = authenticatedMutation({
  args: {
    id: v.id("users"),
    data: partial(userSchema),
  },
  handler: User.updateUser,
});

export const deleteUser = authenticatedMutation({
  args: {
    id: v.id("users"),
  },
  handler: User.deleteUser,
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
