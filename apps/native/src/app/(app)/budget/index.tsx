import { View } from "react-native";
import { UserIcon } from "@zennui/icons";
import { H4 } from "@zennui/native/typography";

export default () => {
  return (
    <View className={"flex p-safe mt-9"}>
      <View className={"flex-col justify-center m-6"}>
        <UserIcon />
        <H4>Hi, Emily!</H4>
      </View>
      <View
        className={
          "border-2 border-gray-500 aspect-square rounded-3xl w-full h-72"
        }
      >
        <View className={"m-6"}>
          <H4>Insights</H4>
        </View>
      </View>
    </View>
  );
};
