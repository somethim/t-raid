import { useInsets } from "@/hooks/use-insets";
import { api } from "@traid/provider";
import type { Language } from "@traid/provider/schemas/enums";
import { CheckIcon } from "@zennui/icons";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerPressable,
  DrawerTrigger,
} from "@zennui/native/drawer";
import { Text } from "@zennui/native/text";
import { useConvexAuth, useMutation } from "convex/react";
import { Image } from "expo-image";
import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { useTranslation } from "react-i18next";

export type LanguageState = [Language | undefined, (value: Language) => void];

type LanguageSelectProps = {
  defaultLanguage?: Language;
  defaultOpen?: boolean;
  onClose?: () => void;
} & PropsWithChildren;

export const LanguageSelect = ({
  defaultOpen,
  defaultLanguage,
  onClose,
  children,
}: LanguageSelectProps) => {
  const { isAuthenticated } = useConvexAuth();
  const { i18n } = useTranslation();
  const setPreferences = useMutation(api.services.preference.setMine);
  const [language = defaultLanguage, setLanguage] = useMMKVString(
    "language",
  ) as LanguageState;
  const { bottom } = useInsets({
    applyNavbarBottomOffset: false,
  });

  const handleLanguageSelect = (language: Language) => {
    i18n.changeLanguage(language);
    setLanguage(language);

    if (isAuthenticated) {
      try {
        setPreferences({ language });
      } catch (error) {}
    }
  };

  return (
    <Drawer
      snapAt={"100%"}
      dynamicSnapPoint
      defaultOpen={defaultOpen}
      scaleRoot={false}
      onOpenChange={(open) => !open && onClose?.()}
      overDragResistanceFactor={20}
    >
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent
        classList={{
          content: "pt-8",
        }}
        contentStyle={{
          paddingBottom: bottom,
        }}
      >
        <View className="gap-4 px-4">
          <DrawerClose asChild>
            <DrawerPressable
              className="flex-row items-center gap-4"
              onPress={() => handleLanguageSelect("en")}
            >
              <View className="overflow-hidden rounded-lg pb-4">
                <Image
                  source={require("@/assets/images/uk-flag.svg")}
                  className="aspect-square size-8 rounded-lg"
                  contentFit="cover"
                />
              </View>
              <View className="flex-1 flex-row items-center border-border border-b pb-4">
                <Text className="flex-1 text-2xl">English</Text>
                {language === "en" && (
                  <CheckIcon className="absolute top-0 right-0 size-8 text-primary" />
                )}
              </View>
            </DrawerPressable>
          </DrawerClose>
          <DrawerClose asChild>
            <DrawerPressable
              className="flex-row items-center gap-4"
              onPress={() => handleLanguageSelect("al")}
            >
              <View className="overflow-hidden rounded-lg">
                <Image
                  source={require("@/assets/images/al-flag.svg")}
                  className="aspect-square size-8"
                  contentFit="cover"
                />
              </View>
              <View className="flex-1 flex-row items-center">
                <Text className="flex-1 text-2xl">Shqip</Text>
                {language === "al" && (
                  <CheckIcon className="absolute top-0 right-0 size-8 text-primary" />
                )}
              </View>
            </DrawerPressable>
          </DrawerClose>
        </View>
      </DrawerContent>
    </Drawer>
  );
};
