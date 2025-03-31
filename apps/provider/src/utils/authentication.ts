import { getAuthUserId } from "@convex-dev/auth/server";
import {
  customAction,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { api } from "../definition/_generated/api";
import {
  type MutationCtx,
  type QueryCtx,
  action,
  mutation,
  query,
} from "../definition/_generated/server";
import { wrapWithAuthentication } from "./context";

export const authenticatedQuery = customQuery(query, {
  args: {},
  input: (ctx, args) => wrapWithAuthentication<QueryCtx>(ctx, args),
});

export const authenticatedMutation = customMutation(mutation, {
  args: {},
  input: (ctx, args) => wrapWithAuthentication<MutationCtx>(ctx, args),
});

export const authenticatedAction = customAction(action, {
  args: {},
  input: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("unauthorized");
    }

    const user = await ctx.runQuery(api.services.user.getById, { id: userId });

    return { args, ctx: { ...ctx, user } };
  },
});
