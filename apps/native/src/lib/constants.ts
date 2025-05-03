import { HomeIcon, WalletIcon } from "@zennui/icons";
import type { Icon as IconType } from "@zenncore/types/components";
import React, { FunctionComponent } from "react";
import { Href } from "expo-router";

export type Route = Readonly<{
  name: string;
  Icon?: IconType;
  subRoutes?: Route[];
  href: Href;
  description?: string;
}>;
export type Routes = Record<string, Route>;

export const CHILD_ROUTES = {
  budget: {
    name: "Budgeting Plan",
    Icon: WalletIcon,
    href: "/child/budget",
  },
  home: {
    name: "Home",
    Icon: HomeIcon,
    href: "/child/home",
  },
  preferences: {
    name: "Preferences",
    Icon: WalletIcon,
    href: "/child/preferences",
  },
} satisfies Routes;

type Shortcut = {
  name: string;
  Svg: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  href: Href;
};

export const SHORTCUTS = [
  {
    name: "Budgeting Plan",
    Svg: WalletIcon,
    href: "/child/budget",
  },
  {
    name: "Preferences",
    Svg: WalletIcon,
    href: "/child/preferences",
  },
  {
    name: "Goals",
    Svg: WalletIcon,
    href: "/child/preferences/goals",
  },
  {
    name: "Raifi",
    Svg: WalletIcon,
    href: "/child/chatbot",
  },
  {
    name: "Games",
    Svg: WalletIcon,
    href: "/child/games",
  },
  {
    name: "Leaderboard",
    Svg: WalletIcon,
    href: "/child/games/leaderboard",
  },
] satisfies Shortcut[];

export const THEME_COLORS = {
  light: {
    primary: "#ECECEC",
    background: "#ECECEC",
    card: "#ECECEC",
    text: "#333333",
    border: "#CCCCCC",
    notification: "#FFCC00",
  },
  dark: {
    primary: "#000000",
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
