import { type Doc, invalidateSessions } from "@convex-dev/auth/server";
import { v4 } from "uuid";
import type { Id } from "../definition/_generated/dataModel";
import type { ActionCtx } from "../definition/_generated/server";
import {
  repository,
  withAuthenticatedMutationContext,
  withAuthenticatedQueryContext,
  withQueryContext,
} from "../utils";

export const { getById, getAll, update, paginate, create } =
  repository("users");

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

    const now = Date.now();
    const uniqueDeletionIdentifier = v4();

    await update(ctx, {
      id: ctx.user._id,
      data: {
        deletionTime: now,
        email: undefined,
      },
    });
  },
);

export const getPreviewById = withQueryContext(
  async (ctx, { id }: { id: Id<"users"> }) => {
    const user = await getById(ctx, { id });

    if (!user) return null;

    return {
      username: user.username,
    };
  },
);
