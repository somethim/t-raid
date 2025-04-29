import { HomeIcon } from "@zennui/icons";
import type { Icon as IconType } from "@zenncore/types/components";
import type { Href } from "expo-router";
import { Platform } from "react-native";

export type Route = Readonly<{
  name: string;
  Icon?: IconType;
  subRoutes?: Route[];
  href: Href;
  description?: string;
}>;

export const THEME_COLORS = {
  light: {
    primary: "#000000",
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
    border: "#000000",
    notification: "#000000",
  },
  dark: {
    primary: "#FFFFFF",
    background: "#000000",
    card: "#000000",
    text: "#FFFFFF",
    border: "#FFFFFF",
    notification: "#FFFFFF",
  },
};

export const FONTS = {
  regular: {
    fontFamily: "Roboto",
    fontWeight: "100",
  },
  medium: {
    fontFamily: "Roboto",
    fontWeight: "300",
  },
  bold: {
    fontFamily: "Roboto",
    fontWeight: "500",
  },
  heavy: {
    fontFamily: "Roboto",
    fontWeight: "900",
  },
} as const;

export const ROUTES = {
  home: {
    name: "home",
    icon: HomeIcon,
    href: "/",
  },
} as const;
export type Routes = Record<string, Route>;

export const STEP_FORM_SCROLL_VIEW_BOTTOM_OFFSET =
  Platform.OS === "ios" ? 120 : 120;
export const STEP_FORM_CONTINUE_BUTTON_OFFSET = Platform.OS === "ios" ? 40 : 50;
