import { FONTS, THEME_COLORS } from "@/lib/constants";
import type { Theme } from "@react-navigation/native";
import { ThemeProvider as ThemeProviderPrimitive } from "@react-navigation/native";
import { useColorScheme } from "@zenncore/hooks/native";
import { SplashScreen } from "expo-router";
import { type PropsWithChildren, useEffect } from "react";
import { useMMKVString } from "react-native-mmkv";

const LIGHT_THEME = {
  dark: false,
  colors: THEME_COLORS.light,
  fonts: FONTS,
} satisfies Theme;
const DARK_THEME = {
  dark: true,
  colors: THEME_COLORS.dark,
  fonts: FONTS,
} satisfies Theme;

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export type ThemeSelectState = [
  "system" | "light" | "dark" | undefined,
  (colorScheme: "system" | "light" | "dark") => void,
];

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [savedColorScheme = colorScheme] = useMMKVString(
    "theme",
  ) as ThemeSelectState;

  const selectedScheme =
    savedColorScheme === "system" ? colorScheme : savedColorScheme;

  // biome-ignore lint/correctness/useExhaustiveDependencies: this should run only on first render to sync colorScheme with savedColorScheme
  useEffect(() => {
    if (savedColorScheme !== "system") setColorScheme(savedColorScheme); //TODO: fix setColorScheme("system") incorrect when reopening app
  }, []);

  return (
    <ThemeProviderPrimitive
      // value={selectedScheme === "dark" ? DARK_THEME : LIGHT_THEME}
      value={LIGHT_THEME}
    >
      {children}
    </ThemeProviderPrimitive>
  );
};
