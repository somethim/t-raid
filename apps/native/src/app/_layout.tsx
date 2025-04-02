import {Providers} from "@/components/providers/providers";
import "@zenncore/config/tailwind/globals";
import {useColorScheme} from "@zenncore/hooks/native";
import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {configureReanimatedLogger, ReanimatedLogLevel,} from "react-native-reanimated";
import {useTranslation} from "react-i18next";
import {useNetworkState} from "expo-network";
import {useEffect} from "react";
import {toast} from "sonner-native";
import {View} from "react-native";

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
    const {t} = useTranslation("", {keyPrefix: "network"});
    const {isDarkColorScheme} = useColorScheme();

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
                        headerShown: false
                    }}
                >
                    <Stack.Screen
                        name={"root"}
                        options={{
                            title: "Home",
                            headerShown: false,
                            contentStyle: {
                                backgroundColor: isDarkColorScheme ? "#000" : "#fff",
                            },
                        }}
                    />
                    <Stack.Screen
                        name={"(auth)"}
                        options={{
                            title: "Authenticate",
                            headerShown: false,
                            contentStyle: {
                                backgroundColor: isDarkColorScheme ? "#000" : "#fff",
                            },
                        }}
                    />
                    <Stack.Screen
                        name={"(app)"}
                        options={{
                            title: "App",
                            headerShown: false,
                            contentStyle: {
                                backgroundColor: isDarkColorScheme ? "#000" : "#fff",
                            },
                        }}
                    />
                </Stack>
            </View>
        </Providers>
    );
};

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";
