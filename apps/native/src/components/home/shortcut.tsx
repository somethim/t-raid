import { View } from "react-native";
import { SHORTCUTS } from "@/lib/constants";
import { Link } from "expo-router";
import { Button } from "@zennui/native/button";
import { Text } from "@zennui/native/text";

export const Shortcut = () => {
  return (
    <View className={"flex-row flex-wrap gap-5 items-start justify-center"}>
      {SHORTCUTS.map((shortcut, index) => (
        <Link href={shortcut.href} key={index} asChild>
          <Button
            className={
              "bg-white w-[30%] justify-evenly gap-0 flex-col border-0 py-3 h-32 shadow-2xl"
            }
          >
            <shortcut.Svg className={"size-9 text-black"} />
            <Text
              className={"color-black text-center"}
              style={{ fontSize: 12, lineHeight: 16 }}
            >
              {shortcut.name}
            </Text>
          </Button>
        </Link>
      ))}
    </View>
  );
};
