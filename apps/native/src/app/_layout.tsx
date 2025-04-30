import { Providers } from "@/components/providers/providers";
import "@/i18n";
import "@zenncore/config/tailwind/globals";
import { useColorScheme } from "@zenncore/hooks/native";
import "expo-dev-client";
import { useNetworkState } from "expo-network";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { toast } from "sonner-native";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  fade: true,
  duration: 200,
});

export default () => {
  const networkState = useNetworkState();
  const { t } = useTranslation("", { keyPrefix: "network" });
  const { isDarkColorScheme } = useColorScheme();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (networkState.isConnected === false) {
      toast.error(t("no-internet"));
    }
  }, [networkState.isConnected]);

  return (
    <>
      <Providers>
        <Stack
          screenOptions={{
            headerShown: false,
            navigationBarColor: isDarkColorScheme
              ? "hsl(0 0% 10%)"
              : "hsl(0 0% 99%)",
          }}
        />
      </Providers>
    </>
  );
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";
