import {
  LanguageSelect,
  type LanguageState,
} from "@/components/general/language-select";
import { LinearGradient } from "@/components/general/linear-gradient";
import { LoadingView } from "@/components/general/loading-view";
import { useInsets } from "@/hooks/use-insets";
import type { Language } from "@traid/provider/schemas/enums";
import { Button } from "@zennui/native/button";
import { Text } from "@zennui/native/text";
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

cssInterop(Image, { className: "style" });
cssInterop(ScrollView, { className: "style" });
cssInterop(SafeAreaView, { className: "style" });
cssInterop(LinearGradient, { className: "style" });

export default () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { bottom } = useInsets({
    applyNavbarBottomOffset: false,
  });
  const [language, setLanguage] = useMMKVString("language") as LanguageState;
  const { t, i18n } = useTranslation("");

  useEffect(() => {
    if (isLoading || isAuthenticated) return;

    SplashScreen.hide();
  }, [isLoading, isAuthenticated]);

  if (isLoading) return <LoadingView />;
  if (isAuthenticated) return <Redirect href={`/home`} />;

  return (
    <>
      <View
        className={"mt-auto gap-6 px-6 z-10"}
        style={{ paddingBottom: bottom + 40 }}
      >
        <Link href={"/sign-in"} asChild>
          <Button color={"primary"}>
            <Text
              className={
                "pointer-events-none border-0 font-header text-foreground"
              }
            >
              {t("routes.sign-in")}
            </Text>
          </Button>
        </Link>
      </View>
      <LinearGradient
        colors={["rgba(57,181,74,0)", "rgba(57,181,74,0.6)"]}
        className="absolute bottom-0 h-64 w-full"
      />
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
