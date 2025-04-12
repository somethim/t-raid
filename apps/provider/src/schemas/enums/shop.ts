import type { Tuple } from "@zenncore/types/utilities";
import { v } from "convex/values";

export const SHOP = {
  FOLEJA: "foleja",
  AMAZON: "amazon",
  ALIEXPRESS: "aliexpress",
  EBAY: "ebay",
};

export const SHOPS = Object.values(SHOP) as Tuple<
  (typeof SHOP)[keyof typeof SHOP],
  1
>;

export type Shop = (typeof SHOP)[keyof typeof SHOP];

export const shopValidator = v.union(
  v.literal(SHOP.FOLEJA),
  v.literal(SHOP.AMAZON),
  v.literal(SHOP.ALIEXPRESS),
  v.literal(SHOP.EBAY),
);

export const ITEM_STATUS = {
  BOUGHT: "bought",
  CART: "cart",
  WISHLIST: "wishlist",
  TRANSIT: "transit",
};

export const ITEM_STATUSES = Object.values(ITEM_STATUS) as Tuple<
  (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS],
  1
>;

export type ItemStatus = (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS];

export const itemStatusValidator = v.union(
  v.literal(ITEM_STATUS.BOUGHT),
  v.literal(ITEM_STATUS.CART),
  v.literal(ITEM_STATUS.WISHLIST),
  v.literal(ITEM_STATUS.TRANSIT),
);
