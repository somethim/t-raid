import {
  repository,
  withAuthenticatedMutationContext,
  withAuthenticatedQueryContext,
} from "../utils";
import { Id } from "../definition/_generated/dataModel";
import { Item } from "../schemas/tables";

export const { getById, getAll, update, paginate, create, destroy } =
  repository("items");

export const getAllItems = withAuthenticatedQueryContext(async (ctx) => {
  if (ctx.user?.admin) {
    const items = await ctx.db.query("items").collect();

    return items.reduce((accumulator: Item[], item) => {
      if (!accumulator[item.user]) {
        accumulator[item.user] = [];
      }
      accumulator[item.user].push(item);

      return accumulator;
    }, []);
  }

  return await ctx.db
    .query("items")
    .filter((q) => q.eq(q.field("user"), ctx.user._id))
    .collect();
});

export const getItem = withAuthenticatedQueryContext(
  async (ctx, { id }: { id: Id<"items"> }) => {
    const item = await ctx.db.get(id);

    if (!item) {
      throw new Error("Item not found");
    }

    if (ctx.user?.admin || ctx.user._id === item.user) {
      return item;
    }

    throw new Error("You are not allowed to view this item");
  },
);

export const createItem = withAuthenticatedMutationContext(
  async (ctx, { data }: { data: Item }) => {
    if (ctx.user?.admin) {
      return await create(ctx, { data });
    }

    return await create(ctx, { data: { ...data, user: ctx.user._id } });
  },
);

export const updateItem = withAuthenticatedMutationContext(
  async (
    ctx,
    {
      id,
      data,
    }: {
      id: Id<"items">;
      data: Partial<Item>;
    },
  ) => {
    const item = await getItem(ctx, { id });

    return await update(ctx, { id: item._id, data });
  },
);

export const deleteItem = withAuthenticatedMutationContext(
  async (ctx, { id }: { id: Id<"items"> }) => {
    const item = await getItem(ctx, { id });

    return await destroy(ctx, { id: item._id });
  },
);
