import {PushNotifications} from "@convex-dev/expo-push-notifications";
import {components} from "../_generated/api";

export const notifications = new PushNotifications(
    components.pushNotifications,
);
