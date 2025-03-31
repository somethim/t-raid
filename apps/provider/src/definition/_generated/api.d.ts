/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as components_migrations from "../components/migrations.js";
import type * as components_notifications from "../components/notifications.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as migrations_payment from "../migrations/payment.js";
import type * as migrations_user from "../migrations/user.js";
import type * as migrations from "../migrations.js";
import type * as providers_LookUpProvider from "../providers/LookUpProvider.js";
import type * as services_addressSearch from "../services/addressSearch.js";
import type * as services_booking from "../services/booking.js";
import type * as services_client from "../services/client.js";
import type * as services_common_mapbox from "../services/common/mapbox.js";
import type * as services_common_storage from "../services/common/storage.js";
import type * as services_common_stripe from "../services/common/stripe.js";
import type * as services_common_twilio from "../services/common/twilio.js";
import type * as services_contact from "../services/contact.js";
import type * as services_direction from "../services/direction.js";
import type * as services_favorite from "../services/favorite.js";
import type * as services_message from "../services/message.js";
import type * as services_notifications from "../services/common/notifications.js";
import type * as services_parkingLot from "../services/parkingLot.js";
import type * as services_parkingSpot from "../services/parkingSpot.js";
import type * as services_payment from "../services/payment.js";
import type * as services_preference from "../services/preference.js";
import type * as services_provider from "../services/provider.js";
import type * as services_review from "../services/review.js";
import type * as services_room from "../services/room.js";
import type * as services_temporaryToken from "../services/temporaryToken.js";
import type * as services_user from "../services/user.js";
import type * as services_vehicle from "../services/vehicle.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "components/migrations": typeof components_migrations;
  "components/notifications": typeof components_notifications;
  crons: typeof crons;
  http: typeof http;
  "migrations/payment": typeof migrations_payment;
  "migrations/user": typeof migrations_user;
  migrations: typeof migrations;
  "providers/LookUpProvider": typeof providers_LookUpProvider;
  "services/addressSearch": typeof services_addressSearch;
  "services/booking": typeof services_booking;
  "services/client": typeof services_client;
  "services/common/mapbox": typeof services_common_mapbox;
  "services/common/storage": typeof services_common_storage;
  "services/common/stripe": typeof services_common_stripe;
  "services/common/twilio": typeof services_common_twilio;
  "services/contact": typeof services_contact;
  "services/direction": typeof services_direction;
  "services/favorite": typeof services_favorite;
  "services/message": typeof services_message;
  "services/notifications": typeof services_notifications;
  "services/parkingLot": typeof services_parkingLot;
  "services/parkingSpot": typeof services_parkingSpot;
  "services/payment": typeof services_payment;
  "services/preference": typeof services_preference;
  "services/provider": typeof services_provider;
  "services/review": typeof services_review;
  "services/room": typeof services_room;
  "services/temporaryToken": typeof services_temporaryToken;
  "services/user": typeof services_user;
  "services/vehicle": typeof services_vehicle;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  pushNotifications: {
    public: {
      deleteNotificationsForUser: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
        any
      >;
      getNotification: FunctionReference<
        "query",
        "internal",
        { id: string; logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" },
        null | {
          body?: string;
          data?: any;
          numPreviousFailures: number;
          sound?: string;
          state:
          | "awaiting_delivery"
          | "in_progress"
          | "delivered"
          | "needs_retry"
          | "failed"
          | "maybe_delivered"
          | "unable_to_deliver";
          title: string;
        }
      >;
      getNotificationsForUser: FunctionReference<
        "query",
        "internal",
        {
          limit?: number;
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          userId: string;
        },
        Array<{
          body?: string;
          data?: any;
          id: string;
          numPreviousFailures: number;
          sound?: string;
          state:
          | "awaiting_delivery"
          | "in_progress"
          | "delivered"
          | "needs_retry"
          | "failed"
          | "maybe_delivered"
          | "unable_to_deliver";
          title: string;
        }>
      >;
      getStatusForUser: FunctionReference<
        "query",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
        { hasToken: boolean; paused: boolean }
      >;
      pauseNotificationsForUser: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
        null
      >;
      recordPushNotificationToken: FunctionReference<
        "mutation",
        "internal",
        {
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          pushToken: string;
          userId: string;
        },
        null
      >;
      removePushNotificationToken: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
        null
      >;
      restart: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" },
        boolean
      >;
      sendPushNotification: FunctionReference<
        "mutation",
        "internal",
        {
          allowUnregisteredTokens?: boolean;
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          notification: {
            body?: string;
            data?: any;
            sound?: string;
            title: string;
          };
          userId: string;
        },
        string | null
      >;
      shutdown: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" },
        { data?: any; message: string }
      >;
      unpauseNotificationsForUser: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
        null
      >;
    };
  };
  migrations: {
    lib: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { name: string },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
      cancelAll: FunctionReference<
        "mutation",
        "internal",
        { sinceTs?: number },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { limit?: number; names?: Array<string> },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      migrate: FunctionReference<
        "mutation",
        "internal",
        {
          batchSize?: number;
          cursor?: string | null;
          dryRun: boolean;
          fnHandle: string;
          name: string;
          next?: Array<{ fnHandle: string; name: string }>;
        },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
    };
    public: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { name: string },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
      cancelAll: FunctionReference<
        "mutation",
        "internal",
        { sinceTs?: number },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { limit?: number; migrationNames?: Array<string> },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      runMigration: FunctionReference<
        "mutation",
        "internal",
        {
          batchSize?: number;
          cursor?: string | null;
          dryRun: boolean;
          fnHandle: string;
          name: string;
          next?: Array<{ fnHandle: string; name: string }>;
        },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
    };
  };
};
