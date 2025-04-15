import { Providers } from "@/components/providers/providers";
import "@zenncore/config/tailwind/globals";
import { useNetworkState } from "expo-network";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { toast } from "sonner-native";
import "expo-dev-client";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.setOptions({
  fade: true,
  duration: 200,
});

export default function RootLayout() {
  const networkState = useNetworkState();
  const { t } = useTranslation("", { keyPrefix: "network" });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (networkState.isConnected === false) {
      toast.error(t("no-internet"));
    }
  }, [networkState]);

  return (
    <Providers>
      <View>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </Providers>
  );
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";
