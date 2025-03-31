import { Providers } from "@/components/providers/providers";
import "@zenncore/config/tailwind/globals";
import { useColorScheme } from "@zenncore/hooks/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from "react-native-reanimated";

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
  const { isDarkColorScheme } = useColorScheme();

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
