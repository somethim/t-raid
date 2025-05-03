import {
  LanguageSelect,
  type LanguageState,
} from "@/components/general/language-select";
import { LinearGradient } from "@/components/general/linear-gradient";
import { LoadingView } from "@/components/general/loading-view";
import type { Language } from "@traid/provider/schemas/enums";
import { useConvexAuth } from "convex/react";
import { Image } from "expo-image";
import { Link, Redirect, SplashScreen } from "expo-router";
import { cssInterop } from "nativewind";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@zennui/native/button";
import { ArrowRightIcon } from "@zennui/icons";
import { Text } from "@zennui/native/text";

cssInterop(Image, { className: "style" });
cssInterop(ScrollView, { className: "style" });
cssInterop(SafeAreaView, { className: "style" });
cssInterop(LinearGradient, { className: "style" });

export default () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const [language, setLanguage] = useMMKVString("language") as LanguageState;
  const { i18n } = useTranslation("");

  useEffect(() => {
    if (isLoading || isAuthenticated) return;

    SplashScreen.hide();
  }, [isLoading, isAuthenticated]);

  if (isLoading) return <LoadingView />;
  if (isAuthenticated) return <Redirect href={`/child/home`} />;

  return (
    <>
      <LinearGradient
        colors={["rgba(255,225,53,1)", "rgba(255,255,255,0)"]}
        className="absolute top-0 w-full"
        style={{ height: "50%" }}
      />
      <View className={"mt-auto gap-6 px-6 z-10"}>
        <Link href={"/sign-in"} asChild>
          <Button
            style={{
              alignSelf: "flex-end",
            }}
            className={
              "w-20 h-auto aspect-square rounded-full bg-white border-0 bottom-10 right-5"
            }
          >
            <ArrowRightIcon className={"color-primary size-10"} />
          </Button>
        </Link>
        <Link href={"/child/home"} asChild>
          <Button
            style={{
              alignSelf: "flex-end",
            }}
            className={"rounded-full bg-white border-0"}
          >
            <Text className={"color-primary"}>Home</Text>
          </Button>
        </Link>
      </View>
      {!language && (
        <LanguageSelect
          defaultOpen
          onClose={() => {
            if (!language) setLanguage(i18n.languages[0] as Language);
          }}
        />
      )}
    </>
  );
};
