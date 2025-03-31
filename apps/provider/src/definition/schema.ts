import { defineSchema, defineTable } from "convex/server";
import {
  addressSearchSessionSchema,
  bookingSchema,
  clientSchema,
  contactSchema,
  favoriteSchema,
  messageSchema,
  parkingLotSchema,
  parkingSpotSchema,
  paymentSchema,
  preferenceSchema,
  providerSchema,
  reviewSchema,
  rideSchema,
  roomMembershipSchema,
  roomSchema,
  temporaryTokensSchema,
  userSchema,
  vehicleSchema,
} from "../schemas/tables";

import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable(userSchema)
    .index("email", ["email"])
    .index("phone", ["phone"]),
  clients: defineTable(clientSchema)
    .index("by_user", ["user"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),
  providers: defineTable(providerSchema)
    .index("by_user", ["user"])
    .index("by_stripeAccountId", ["stripeAccountId"]),

  vehicles: defineTable(vehicleSchema).index("by_licensePlate", [
    "licensePlate",
  ]),

  parkingLots: defineTable(parkingLotSchema).index("by_user", ["user"]),
  parkingSpots: defineTable(parkingSpotSchema).index("by_parkingLot", [
    "parkingLot",
  ]),
  reviews: defineTable(reviewSchema)
    .index("by_user", ["user"])
    .index("by_parkingLot", ["parkingLot"])
    .index("by_user_and_parkingLot", ["user", "parkingLot"]),

  bookings: defineTable(bookingSchema)
    .index("by_user", ["user"])
    .index("by_parkingSpot", ["parkingSpot"])
    .index("by_parkingLot", ["parkingLot"])
    .index("by_status", ["status"])
    .index("by_parkingLot_and_status", ["parkingLot", "status"])
    .index("by_user_and_parkingLot", ["user", "parkingLot"]),

  payments: defineTable(paymentSchema)
    .index("by_booking", ["booking"])
    .index("by_stripeId", ["stripeId"])
    .index("by_booking_and_type", ["booking", "type"])
    .index("by_stage_and_status", ["stage", "status"]),

  favorites: defineTable(favoriteSchema)
    .index("by_user", ["user"])
    .index("by_parkingLot", ["parkingLot"])
    .index("by_parkingLot_and_user", ["parkingLot", "user"]),

  rooms: defineTable(roomSchema).index("by_name", ["name"]),
  roomMemberships: defineTable(roomMembershipSchema)
    .index("by_room", ["room"])
    .index("by_user", ["user"]),

  messages: defineTable(messageSchema)
    .index("by_room", ["room"])
    .index("by_readReceipt", ["readAt", "room", "sender"]),

  rides: defineTable(rideSchema).index("by_user", ["user"]),

  addressSearchSessions: defineTable(addressSearchSessionSchema).index(
    "by_user",
    ["user"],
  ),

  temporaryTokens: defineTable(temporaryTokensSchema).index("by_phone", [
    "phone",
  ]),

  preferences: defineTable(preferenceSchema).index("by_user", ["user"]),

  contacts: defineTable(contactSchema),
});
