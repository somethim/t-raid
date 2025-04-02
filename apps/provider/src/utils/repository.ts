import type { PaginationOptions, TableDefinition, WithoutSystemFields } from "convex/server";
import type { Infer, Validator } from "convex/values";
import type { Doc, Id, TableNames } from "../definition/_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../definition/_generated/server";
import schema from "../definition/schema";
import { deepPartial } from "./validator";

export const repository = <T extends TableNames>(tableName: T) => {
  const table = schema.tables[tableName] as unknown as TableDefinition<
    Validator<WithoutSystemFields<Doc<T>>>
  >;
  const validator = table.validator;
  const partialValidator = deepPartial(validator);

  return {
    create: async (
      ctx: MutationCtx,
      args: { data: Infer<typeof validator> }
    ) => {
      return await ctx.db.insert(tableName, args.data);
    },
    getById: async (ctx: MutationCtx | QueryCtx, args: { id: Id<T> }) => {
      return await ctx.db.get(args.id);
    },
    update: async (
      ctx: MutationCtx | QueryCtx,
      args: { id: Id<T>; data: Infer<typeof partialValidator> }
    ) => {
      // @ts-ignore
      return ctx.db.patch(args.id, args.data);
    },
    getAll: async (
      ctx: MutationCtx | QueryCtx,
      args: Infer<typeof partialValidator>
    ) => {
      const query = ctx.db.query<T>(tableName);
      // @ts-ignore
      applyFilterToQuery<T>(query, args);
      return query.collect();
    },
    destroy: async (ctx: MutationCtx, args: { id: Id<T> }) => {
      return ctx.db.delete(args.id);
    },
    paginate: async (
      ctx: MutationCtx | QueryCtx,
      args: {
        filter: Infer<typeof partialValidator>;
        paginationOpts: PaginationOptions;
      }
    ) => {
      const query = ctx.db.query<T>(tableName);
      // @ts-ignore
      applyFilterToQuery(query, args.filter);
      return query.paginate(args.paginationOpts);
    },

    replace: (
      ctx: MutationCtx,
      args: { id: Id<T>; data: Infer<typeof validator> }
    ) => {
      // @ts-ignore
      return ctx.db.replace(args.id, args.data);
    }
  };
};

const applyFilterToQuery = () => {
};
