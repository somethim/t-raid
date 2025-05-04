import { H1 } from "@zennui/native/typography";
import { Shortcut } from "@/components/home/shortcut";
import { Card } from "@/components/home/card";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

export default () => {
  const { t } = useTranslation("", { keyPrefix: "home" });

  const username = "Sara";

  return (
    <View className={"px-6 pt-safe gap-6 h-full w-full bg-[#ECECEC]"}>
      <H1 className={"color-black mt-14"}>
        {t("welcome-back")} {username}
      </H1>
      <Card />
      <Shortcut />
    </View>
  );
};
