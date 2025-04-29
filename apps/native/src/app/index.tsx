import {
  LanguageSelect,
  type LanguageState,
} from "@/components/general/language-select";
import { LinearGradient } from "@/components/general/linear-gradient";
import { LoadingView } from "@/components/general/loading-view";
import { useInsets } from "@/hooks/use-insets";
import type { Language } from "@traid/provider/schemas/enums";
import { Button } from "@zennui/native/button";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
} from "@zennui/native/carousel";
import { Text } from "@zennui/native/text";
import { H1 } from "@zennui/native/typography";
import { useConvexAuth } from "convex/react";
import { Image } from "expo-image";
import { Link, Redirect, SplashScreen } from "expo-router";
import { cssInterop } from "nativewind";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import Animated, {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

cssInterop(Image, { className: "style" });
cssInterop(ScrollView, { className: "style" });
cssInterop(SafeAreaView, { className: "style" });
cssInterop(LinearGradient, { className: "style" });

const ONBOARD_SECTIONS = [
  {
    image: require("@/assets/images/cat.jpg"),
    title: "fast-easy-parking" as const,
    description: "fast-easy-parking-description" as const,
  },
  {
    image: require("@/assets/images/cat.jpg"),
    title: "security-priority" as const,
    description: "security-priority-description" as const,
  },
];

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
      <View className="z-10 flex-1">
        <View className="gap-10">
          <Carousel loop gap={0} itemCount={ONBOARD_SECTIONS.length}>
            <CarouselContent
              classList={{
                content: "items-start",
              }}
            >
              {ONBOARD_SECTIONS.map((onboardSection, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <OnboardSection key={index} {...onboardSection} index={index} />
              ))}
            </CarouselContent>
            <CarouselIndicator growthFactor={5} />
          </Carousel>
        </View>

        <View
          className={"mt-auto gap-6 px-6"}
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

type OnboardSectionProps = {
  index: number;
} & (typeof ONBOARD_SECTIONS)[number];

const OnboardSection = ({
  index,
  image,
  title,
  description,
}: OnboardSectionProps) => {
  const { t } = useTranslation("", { keyPrefix: "onboard" });
  const translateX = useSharedValue(0);

  return (
    <CarouselItem
      key={index}
      index={index}
      className="w-screen gap-8"
      animate={({ scrollOffset, index, itemSize }) => {
        "worklet";
        const input = scrollOffset / itemSize;
        const inputRange = [index - 1, index, index + 1];

        const opacity = interpolate(
          input,
          inputRange,
          [0, 1, 0],
          Extrapolation.CLAMP,
        );

        translateX.value = interpolate(
          input,
          inputRange,
          [300, 0, -300],
          Extrapolation.CLAMP,
        );

        return {
          opacity,
        };
      }}
    >
      <Image source={image} className={"h-[55vh]"} />
      <Animated.View
        className="gap-2 px-6"
        style={{
          transform: [{ translateX }],
        }}
      >
        <H1 numberOfLines={2}>{t(title)}</H1>
        <Text className="text-lg" numberOfLines={3}>
          {t(description)}
        </Text>
      </Animated.View>
    </CarouselItem>
  );
};
