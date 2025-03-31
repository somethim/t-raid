import { PushNotifications } from "@convex-dev/expo-push-notifications";
import { components } from "../../definition/_generated/api";

export const notifications = new PushNotifications(
  components.pushNotifications,
);
