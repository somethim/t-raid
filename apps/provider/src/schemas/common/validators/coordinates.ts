import { type Infer, v } from "convex/values";

export const coordinatesValidator = v.object({
  latitude: v.number(),
  longitude: v.number(),
});

export type Coordinates = Infer<typeof coordinatesValidator>;
