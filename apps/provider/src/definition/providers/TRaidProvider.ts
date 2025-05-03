import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import {
  createAccount,
  modifyAccountCredentials,
  retrieveAccount,
} from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { Scrypt } from "lucia";
import { z } from "zod";
import { api } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import type { Result } from "@zenncore/types/utilities";

const signInSchema = z.object({
  flow: z.literal("sign-in"),
  email: z.string(),
  password: z.string().min(8),
});

const signUpSchema = signInSchema.extend({
  flow: z.literal("register"),
  email: z.string(),
});

const resetPassword = signInSchema.extend({
  flow: z.literal("reset-password"),
  phone: z.string(),
  token: z.string(),
  newPassword: z.string().min(8),
});

const changePasswordSchema = signInSchema.extend({
  flow: z.literal("change-password"),
  newPassword: z.string().min(8),
});

const authorizationSchema = z.discriminatedUnion("flow", [
  signInSchema,
  signUpSchema,
  resetPassword,
  changePasswordSchema,
]);

export const TRaidProvider = () => {
  const provider = "traid";

  return ConvexCredentials<DataModel>({
    id: "traid",
    authorize: async (params, ctx) => {
      const { data, error } = authorizationSchema.safeParse(params);

      console.log(data);
      if (error) throw new ConvexError(error.format());

      const { flow, password: secret, ...profile } = data;
      const { email } = profile;

      const user = await (async () => {
        switch (flow) {
          case "register": {
            const account = await createAccount<DataModel>(ctx, {
              provider,
              account: { id: email, secret },
              profile: {
                email,
                phoneVerifiedAt: Date.now(),
              },
              shouldLinkViaEmail: false,
              shouldLinkViaPhone: true,
            });

            return account.user;
          }
          case "sign-in": {
            const account = await retrieveAccount<DataModel>(ctx, {
              provider,
              account: { id: email, secret },
            });

            if (account === null) throw new ConvexError("Invalid credentials");

            return account.user;
          }
          case "reset-password": {
            const data = profile as z.infer<typeof resetPassword>;
            const result: Result<string, string> = await ctx.runAction(
              api.services.common.twilo.validateVerificationToken,
              {
                phone: data.phone,
                token: data.token,
              },
            );

            if (result.success === false) throw new ConvexError(result.error);

            const retrieved = await retrieveAccount<DataModel>(ctx, {
              provider,
              account: { id: email, secret },
            });

            if (retrieved === null) throw new ConvexError("User not found");

            await modifyAccountCredentials<DataModel>(ctx, {
              provider,
              account: { id: email, secret: data.newPassword },
            });

            return retrieved.user;
          }
          case "change-password": {
            const data = profile as z.infer<typeof changePasswordSchema>;
            const retrieved = await retrieveAccount<DataModel>(ctx, {
              provider,
              account: { id: email, secret: data.password },
            });

            if (retrieved === null) throw new ConvexError("User not found");

            await modifyAccountCredentials<DataModel>(ctx, {
              provider,
              account: { id: email, secret: data.newPassword },
            });

            return retrieved.user;
          }
          default: {
            throw new ConvexError("Invalid flow");
          }
        }
      })();

      return { userId: user._id };
    },
    crypto: {
      hashSecret: (password: string) => new Scrypt().hash(password),
      verifySecret: (password: string, hash: string) =>
        new Scrypt().verify(hash, password),
    },
  });
};
