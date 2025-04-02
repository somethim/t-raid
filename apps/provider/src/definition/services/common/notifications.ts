import {v} from "convex/values";
import {authenticatedMutation} from "../../../utils";
import {internalMutation} from "../../_generated/server";
import {notifications} from "../../components/notifications";

export const recordPushNotificationToken = authenticatedMutation({
    args: {token: v.string()},
    handler: async (ctx, args) => {
        await notifications.recordToken(ctx, {
            userId: ctx.user._id,
            pushToken: args.token,
        });
    },
});

export const sendPushNotification = internalMutation({
    args: {title: v.string(), to: v.id("users")},
    handler: async (ctx, args) => {
        await notifications.sendPushNotification(ctx, {
            userId: args.to,
            notification: {
                title: args.title,
            },
        });
    },
});
