import type { Tuple } from "@zenncore/types/utilities";
import { v } from "convex/values";

export const Item = {
  FOLEJA: "foleja",
  AMAZON: "amazon",
  ALIEXPRESS: "aliexpress",
  EBAY: "ebay",
};

export const SHOPS = Object.values(Item) as Tuple<
  (typeof Item)[keyof typeof Item],
  1
>;

export type Shop = (typeof Item)[keyof typeof Item];

export const shopValidator = v.union(
  v.literal(Item.FOLEJA),
  v.literal(Item.AMAZON),
  v.literal(Item.ALIEXPRESS),
  v.literal(Item.EBAY),
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
