import {DrawerRootProvider} from "@zennui/native/drawer";
import {TextClassContext} from "@zennui/native/text";
import type {PropsWithChildren} from "react";
import {StatusBar} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Toaster} from "sonner-native";
import {ConvexProvider} from "./convex-provider";
import {ThemeProvider} from "./theme-provider";

export const Providers = ({children}: PropsWithChildren) => {
    return (
        <ConvexProvider>
            <ThemeProvider>
                <TextClassContext.Provider value={"font-body"}>
                    <StatusBar translucent backgroundColor="transparent"/>
                    <GestureHandlerRootView className="flex-1">
                        <DrawerRootProvider>{children}</DrawerRootProvider>
                        <Toaster/>
                    </GestureHandlerRootView>
                </TextClassContext.Provider>
            </ThemeProvider>
        </ConvexProvider>
    );
};
