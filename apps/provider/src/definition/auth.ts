import Apple from "@auth/core/providers/apple";
import Facebook from "@auth/core/providers/facebook";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Apple({
      authorization: {
        params: {
          scope: "name email",
          response_mode: "form_post",
        },
      },
      profile(apple) {
        const fullName = apple.user?.name
          ? `${apple.user.name.firstName} ${apple.user.name.lastName}`
          : undefined;

        return {
          id: apple.sub,
          fullName,
          email: apple.email,
          emailVerificationTime:
            apple.email_verified === true || apple.email_verified === "true"
              ? apple.auth_time
              : undefined,
        };
      },
    }),
    Google({
      async profile(google) {
        return {
          fullName: `${google.given_name} ${google.family_name ?? ""}`,
          email: google.email,
          birthdate: undefined,
          id: google.sub,
          image: google.picture,
        };
      },

      authorization: {
        params: {
          scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/user.birthday.read",
            "https://www.googleapis.com/auth/user.phonenumbers.read",
          ].join(" "),
        },
      },
    }),
  ],
  callbacks: {
    async redirect({ redirectTo }) {
      // Allow redirects to the mobile Expo URL or to the web URL.
      // Without this, only redirects to `SITE_URL` are allowed.
      if (redirectTo !== process.env.SITE_URL) {
        throw new Error(`Invalid redirectTo URI ${redirectTo}`);
      }
      return redirectTo;
    },
    async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) {
      if (existingUserId) return;

      await ctx.db.insert("users", {
        user: userId,
        status: "active",
        balance: 0,
      });
    },
  },
});
