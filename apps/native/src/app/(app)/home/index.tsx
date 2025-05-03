import { H1 } from "@zennui/native/typography";
import { Shortcut } from "@/components/home/shortcut";
import { Card } from "@/components/home/card";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

export default () => {
  const { t } = useTranslation("", { keyPrefix: "home" });

  const username = "NAN";

  return (
    <View className={"px-6 pt-safe gap-6"}>
      <H1 className={"color-primary"}>
        {t("welcome-back")} {username}
      </H1>
      <Card />
      <Shortcut />
    </View>
  );
};
