import type { Config } from "tailwindcss";
import preset from "./tailwind.config";

const nativewindPreset = require("nativewind/preset");
const { platformSelect } = require("nativewind/theme");

export default {
  darkMode: "class",
  presets: [preset, nativewindPreset],
  content: [
    ...preset.content,
    "./index.js",
    "../../packages/ui/native/src/**/*.{ts,tsx}",
  ],
  fontFamily: {
    sans: platformSelect({ android: "RFDewi-Regular", ios: "RFDewi-Regular" }),
    header: platformSelect({
      android: "RFDewiExtended-Bold",
      ios: "RFDewiExtended-Bold",
    }),
    subheader: platformSelect({
      android: "RFDewiExtended-Semibold",
      ios: "RFDewiExtended-Semibold",
    }),
    body: platformSelect({ android: "RFDewi-Regular", ios: "RFDewi-Regular" }),
  },
} satisfies Config;
