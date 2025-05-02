import {WalletIcon} from "@zennui/icons";
import type {Icon as IconType} from "@zenncore/types/components";
import type {Href} from "expo-router";
import React, {FunctionComponent} from "react";

export type Route = Readonly<{
    name: string;
    Icon?: IconType;
    subRoutes?: Route[];
    href: Href;
    description?: string;
}>;
export type Routes = Record<string, Route>;

type Shortcut = {
    name: string;
    Svg: FunctionComponent<React.SVGProps<SVGSVGElement>>;
    href: string;
}

export const SHORTCUTS = [
    {
        name: "Budgeting Plan",
        Svg: WalletIcon,
        href: "/child/budget",
    },

] satisfies Shortcut[]


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
