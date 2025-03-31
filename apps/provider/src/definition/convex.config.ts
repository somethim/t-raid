import pushNotifications from "@convex-dev/expo-push-notifications/convex.config";
import migrations from "@convex-dev/migrations/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(pushNotifications);
app.use(migrations);

export default app;
