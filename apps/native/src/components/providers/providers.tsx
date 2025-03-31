import { DrawerRootProvider } from "@zennui/native/drawer";
import { PortalHost } from "@zennui/native/portal";
import { TextClassContext } from "@zennui/native/text";
import type { PropsWithChildren } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Toaster } from "sonner-native";
import { StripeProvider } from "../payment/stripe-provider";
import { ConvexProvider } from "./convex-provider";
import { ThemeProvider } from "./theme-provider";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ConvexProvider>
      <StripeProvider>
        <ThemeProvider>
          <TextClassContext.Provider value={"font-body"}>
            {/* use react native Status bar to preserve ios status bar color behavior */}
            <StatusBar translucent backgroundColor="transparent" />
            {/* <StatusBar
            // style={isDarkColorScheme ? "light" : "dark"}
            // backgroundColor="transparent"
            // translucent
            /> */}
            <GestureHandlerRootView className="flex-1">
              <KeyboardProvider statusBarTranslucent preserveEdgeToEdge>
                <DrawerRootProvider>{children}</DrawerRootProvider>
                <Toaster />
                {/* <PortalHost name="select-portal" />
          <PortalHost name="drawer" /> */}
              </KeyboardProvider>
            </GestureHandlerRootView>
          </TextClassContext.Provider>
        </ThemeProvider>
      </StripeProvider>
    </ConvexProvider>
  );
};
