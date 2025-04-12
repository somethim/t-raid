"use node";

import type { Result } from "@zenncore/types/utilities";
import { v } from "convex/values";
import Twilio from "twilio";
import { internal } from "../../_generated/api";
import { action } from "../../_generated/server";

const getTwilioClient = () => {
  return Twilio(
    process.env.AUTH_TWILIO_ACCOUNT_SID,
    process.env.AUTH_TWILIO_AUTH_TOKEN,
  );
};

const getTwilioService = () => {
  return getTwilioClient().verify.v2.services(
    process.env.AUTH_TWILIO_SERVICE_SID,
  );
};

export const validateVerificationToken = action({
  args: {
    phone: v.string(),
    token: v.string(),
  },
  handler: async (ctx, { token, phone }): Promise<Result<string, string>> => {
    try {
      const verificationCheck =
        await getTwilioService().verificationChecks.create({
          to: phone,
          code: token,
        });

      if (verificationCheck.status !== "approved") {
        throw new Error("Verification failed");
      }

      const verificationToken = Math.random().toString(36).substring(2, 7);

      await ctx.runMutation(internal.services.temporaryToken.create, {
        data: {
          phone,
          token: verificationToken,
        },
      });

      return {
        success: true,
        data: verificationToken,
      };
    } catch (error) {
      console.error("Error checking verification:", error);

      return {
        success: false,
        error: "Failed to check verification",
      };
    }
  },
});

export const sendVerificationMessage = action({
  args: {
    phone: v.string(),
  },
  handler: async (_, { phone }) => {
    try {
      const service = getTwilioService();
      const verification = await service.verifications.create({
        to: phone,
        channel: "sms",
      });

      return {
        success: true,
        data: `Verification sent to ${phone}. Status: ${verification.status}`,
      };
    } catch (error) {
      console.error("Error sending verification:", error);

      return {
        success: false,
        error: "Failed to send verification",
      };
    }
  },
});
