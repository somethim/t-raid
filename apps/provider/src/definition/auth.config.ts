import type { ConvexAuthConfig } from "@convex-dev/auth/server";

export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex"
    }
  ],
  jwt: {
    durationMs: 1000 * 60 * 60 * 24 * 30 // 30 days
  }
} as unknown as ConvexAuthConfig;
