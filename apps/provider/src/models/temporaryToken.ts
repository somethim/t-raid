import { repository, withMutationContext, withQueryContext } from "../utils";

export const { create, update, replace } = repository("temporaryTokens");

export const deleteExpiredTemporaryTokens = withMutationContext(
  async (ctx): Promise<void> => {
    const minimumCreationTime = Date.now() - 1000 * 60 * 60;
    const expiredTemporaryTokens = await ctx.db
      .query("temporaryTokens")
      .withIndex("by_creation_time", (q) =>
        q.lte("_creationTime", minimumCreationTime),
      )
      .collect();

    await Promise.all(
      expiredTemporaryTokens.map(async (temporaryToken) => {
        await ctx.db.delete(temporaryToken._id);
      }),
    );
  },
);

export const getIsValid = withQueryContext(
  async (
    ctx,
    { token, phone }: { token: string; phone: string },
  ): Promise<boolean> => {
    const document = await ctx.db
      .query("temporaryTokens")
      .filter((q) =>
        q.and(q.eq(q.field("phone"), phone), q.eq(q.field("token"), token)),
      )
      .first();

    return document !== null;
  },
);
