import { type Doc, invalidateSessions } from "@convex-dev/auth/server";
import type { Id } from "../definition/_generated/dataModel";
import type { ActionCtx } from "../definition/_generated/server";
import {
  repository,
  withAuthenticatedMutationContext,
  withAuthenticatedQueryContext,
} from "../utils";

export const { getAll, update, create } = repository("users");

export const getById = withAuthenticatedQueryContext(
  async (ctx, { id }: { id: Id<"users"> }) => {
    const user = await ctx.db.get(id);

    if (!user) {
      throw new Error("User not found");
    }

    if (!ctx.user?.admin || ctx.user._id !== user._id) {
      throw new Error("You are not allowed to view this user");
    }

    return user;
  },
);

export const updateUser = withAuthenticatedMutationContext(
  async (
    ctx,
    { id, data }: { id: Id<"users">; data: Partial<Doc<"users">> },
  ) => {
    if (!ctx.user?.admin) {
      throw new Error("You are not allowed to update this user");
    }

    const user = await ctx.db.get(id);
    if (!user) {
      throw new Error("User not found");
    }

    await update(ctx, { id, data });
  },
);

export const deleteUser = withAuthenticatedMutationContext(
  async (ctx, { id }: { id: Id<"users"> }) => {
    if (!ctx.user?.admin) {
      throw new Error("You are not allowed to delete this user");
    }

    await invalidateSessions(ctx as unknown as ActionCtx, {
      userId: id,
    });

    const authAccounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), id))
      .collect();
    await Promise.all(authAccounts.map(({ _id }) => ctx.db.delete(_id)));

    await update(ctx, {
      id,
      data: {
        _deletedAt: Date.now(),
        email: undefined,
      },
    });
  },
);

export const getCurrentUser = withAuthenticatedQueryContext(async (ctx) => {
  return ctx.user;
});

export const updateCurrentUser = withAuthenticatedQueryContext(
  async (ctx, data: Partial<Doc<"users">>) => {
    const userId = ctx.user._id;
    return await update(ctx, { id: userId, data });
  },
);

export const deleteCurrentUser = withAuthenticatedMutationContext(
  async (ctx) => {
    await invalidateSessions(ctx as unknown as ActionCtx, {
      userId: ctx.user._id,
    });

    const authAccounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), ctx.user._id))
      .collect();
    await Promise.all(authAccounts.map(({ _id }) => ctx.db.delete(_id)));

    await update(ctx, {
      id: ctx.user._id,
      data: {
        _deletedAt: Date.now(),
        email: undefined,
      },
    });
  },
);
