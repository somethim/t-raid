import { type Infer, v } from "convex/values";

export const slotValidator = v.object({
  start: v.string(),
  end: v.string(),
});

export type Slot = Infer<typeof slotValidator>;
