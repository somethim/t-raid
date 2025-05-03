import {
  AstrixIcon,
  CoinsEuroIcon,
  CreditCardIcon,
  HomeIcon,
  SettingsIcon,
} from "@zennui/icons";
import React, { FunctionComponent } from "react";
import { Href } from "expo-router";
import type { Icon as IconType } from "@zenncore/types/components";
import { InsightsIcon } from "@/assets/svg/insights";
import { RocketIcon } from "@/assets/svg/rocket";
import { ChatBotIcon } from "@/assets/svg/chat";
import { ConsoleIcon } from "@/assets/svg/console";
import { TrophyIcon } from "@/assets/svg/trophy";

export type Route = Readonly<{
  name: string;
  Icon?: IconType;
  subRoutes?: Route[];
  href: Href;
  description?: string;
}>;
export type Routes = Record<string, Route>;

export const NAVBAR = {
  budget: {
    name: "Insights",
    Icon: InsightsIcon,
    href: "/budget",
  },
  home: {
    name: "Home",
    Icon: HomeIcon,
    href: "/home",
  },
  preferences: {
    name: "Goals",
    Icon: RocketIcon,
    href: "/goals",
  },
} satisfies Routes;

type Shortcut = {
  name: string;
  Svg: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  href: Href;
};

export const SHORTCUTS = [
  {
    name: "Insights",
    Svg: InsightsIcon,
    href: "/budget",
  },
  {
    name: "Games",
    Svg: ConsoleIcon,
    href: "/games",
  },
  {
    name: "Goals",
    Svg: RocketIcon,
    href: "/goals",
  },
  {
    name: "Preferences",
    Svg: SettingsIcon,
    href: "/preferences",
  },
  {
    name: "Raifi",
    Svg: ChatBotIcon,
    href: "/chatbot",
  },
  {
    name: "Leaderboard",
    Svg: TrophyIcon,
    href: "/leaderboard",
  },
] satisfies Shortcut[];

export const ROUTES = {
  budget: {
    name: "Insights",
    Icon: InsightsIcon,
    href: "/budget",
  },
  card: {
    name: "Card",
    Icon: CreditCardIcon,
    href: "/cards",
  },
  changePassword: {
    name: "Change Password",
    Icon: AstrixIcon,
    href: "/change-password",
  },
  home: {
    name: "Home",
    Icon: HomeIcon,
    href: "/home",
  },
  goals: {
    name: "Goals",
    Icon: RocketIcon,
    href: "/goals",
  },
  games: {
    name: "Games",
    Icon: ConsoleIcon,
    href: "/games",
  },
  preferences: {
    name: "Preferences",
    Icon: SettingsIcon,
    href: "/preferences",
  },
  chatbot: {
    name: "Raifi",
    Icon: ChatBotIcon,
    href: "/chatbot",
  },
  leaderboard: {
    name: "Leaderboard",
    Icon: TrophyIcon,
    href: "/leaderboard",
  },
  points: {
    name: "Points",
    Icon: CoinsEuroIcon,
    href: "/points",
  },
};

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
