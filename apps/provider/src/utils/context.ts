import { getAuthUserId } from "@convex-dev/auth/server";
import type { EmptyObject } from "convex-helpers";
import type { Doc } from "../definition/_generated/dataModel";
import type {
  ActionCtx,
  MutationCtx,
  QueryCtx,
} from "../definition/_generated/server";
import * as User from "../models/user";

export const wrapWithAuthentication = async <
  Ctx extends QueryCtx | MutationCtx,
>(
  ctx: Ctx,
  args: EmptyObject,
): Promise<{
  ctx: Ctx & {
    user: Doc<"users">;
  };
  args: EmptyObject;
}> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("unauthorized");
  }

  const user = await User.getById(ctx, { id: userId });
  if (!user) {
    throw new Error("unauthorized");
  }

  return { args, ctx: { ...ctx, user } };
};

export type AuthorizedQueryContext = QueryCtx & { user: Doc<"users"> };
export type AuthorizedMutationContext = MutationCtx & { user: Doc<"users"> };
export type AuthorizedActionContext = ActionCtx & { user: Doc<"users"> };

export const withQueryContext = <
  F extends (ctx: QueryCtx, args: never) => Promise<unknown>,
>(
  fn: F,
) => {
  return fn as F;
};

export const withMutationContext = <
  F extends (ctx: MutationCtx, args: never) => Promise<unknown>,
>(
  fn: F,
) => {
  return fn as F;
};

export const withActionContext = <
  F extends (ctx: ActionCtx, args: never) => Promise<unknown>,
>(
  fn: F,
) => {
  return fn as F;
};

export const withAuthenticatedQueryContext = <
  F extends (ctx: AuthorizedQueryContext, args: never) => Promise<unknown>,
>(
  fn: F,
) => {
  return fn as F;
};

export const withAuthenticatedMutationContext = <
  F extends (ctx: AuthorizedMutationContext, args: never) => Promise<unknown>,
>(
  fn: F,
) => {
  return fn as F;
};

export const withAuthenticatedActionContext = <
  F extends (ctx: AuthorizedActionContext, args: never) => Promise<unknown>,
>(
  fn: F,
) => {
  return fn as F;
};
