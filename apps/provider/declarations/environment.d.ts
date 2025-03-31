namespace NodeJS {
  export interface ProcessEnv {
    AUTH_TWILIO_ACCOUNT_SID: string;
    AUTH_TWILIO_AUTH_TOKEN: string;
    AUTH_TWILIO_SERVICE_SID: string;

    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOKS_SECRET: string;

    MAPBOX_KEY: string;

    CONVEX_SITE_URL: string;
  }
}
