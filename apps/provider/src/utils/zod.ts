import {
  zCustomAction,
  zCustomMutation,
  zCustomQuery,
  zid,
} from "convex-helpers/server/zod";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "../definition/_generated/server";

import { NoOp } from "convex-helpers/server/customFunctions";

export const zodValidatedInternalAction = zCustomAction(internalAction, NoOp);
export const zodValidatedInternalMutation = zCustomMutation(
  internalMutation,
  NoOp,
);
export const zodValidatedInternalQuery = zCustomQuery(internalQuery, NoOp);
export const zodValidatedMutation = zCustomMutation(mutation, NoOp);
export const zodValidatedQuery = zCustomQuery(query, NoOp);
export const zodValidatedAction = zCustomAction(action, NoOp);

export { zid };
