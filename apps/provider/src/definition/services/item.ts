import { v } from "convex/values";
import * as Item from "../../models/item";
import { itemSchema } from "../../schemas/tables";
import {
  authenticatedMutation,
  authenticatedQuery,
  partial,
} from "../../utils";

export const getAll = authenticatedQuery({
  args: {},
  handler: Item.getAllItems,
});

export const getById = authenticatedQuery({
  args: {
    id: v.id("items"),
  },
  handler: Item.getById,
});

export const updateItem = authenticatedMutation({
  args: {
    id: v.id("items"),
    data: partial(itemSchema),
  },
  handler: Item.updateItem,
});

export const createItem = authenticatedMutation({
  args: {
    data: itemSchema,
  },
  handler: Item.createItem,
});

export const destroyItem = authenticatedMutation({
  args: {
    id: v.id("items"),
  },
  handler: Item.deleteItem,
});
