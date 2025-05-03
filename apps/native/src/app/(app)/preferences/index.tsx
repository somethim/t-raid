import { SettingsIcon, UserIcon } from "@zennui/icons";
import { Text, View } from "react-native";
import { Link } from "expo-router";
import { Button } from "@zennui/native/button";
import { H1, H2, H4 } from "@zennui/native/typography";
import { Switch } from "@zennui/native/switch";

type SettingRow = {
  title: string;
  route: string;
};

const SettingRow = ({ title, route }: SettingRow) => (
  <Link href={route} asChild>
    <Button className="flex-row justify-between items-center py-4 px-6 bg-transparent border-0">
      <Text className="text-lg font-medium color-black">{title}</Text>
      <Text className="text-2xl color-black">›</Text>
    </Button>
  </Link>
);

export default () => {
  return (
    <View className="flex-1 p-safe mt-9">
      <View className="bg-background-dimmed p-6 rounded-3xl mx-4 my-6 max-h-96">
        <View className="flex-row items-center mb-4 mt-6 mx-4">
          <SettingsIcon />
          <H1 className={"font-medium mx-3"}>Settings</H1>
        </View>

        {/* Profile Section */}
        <View className="bg-white rounded-3xl py-6 mt-6 pb-5">
          <View
            className={
              "border-b-2 border-gray-200 w-full pb-5 flex-row items-center"
            }
          >
            <UserIcon width={24} height={24} className={"ml-8"} />
            <H2 className={"ml-3 font-medium"}>Emily Smith</H2>
          </View>

          {/* Account Settings */}
          <View className={"px-6 my-6 border-b-2 border-gray-200 pb-5"}>
            <H4 className={"color-gray-600"}>Account Settings</H4>
            <SettingRow title="Edit profile" route={"/profile"} />
            <SettingRow title="Change password" route={"/change-password"} />
            <View className="flex-row justify-between items-center py-4 px-6">
              <Text className="text-lg font-medium text-black">
                Push notifications
              </Text>
              <Switch checked={false} onCheckedChange={() => {}} />
            </View>
          </View>

          {/* More Section */}
          <View className={"px-6 mt-2"}>
            <H4 className={"color-gray-600"}>More</H4>
            <SettingRow title="Raiffeisen Points" route={"/points"} />
            <SettingRow title="Goals" route={"/goals"} />
            <View className="flex-row justify-between items-center py-4 px-6">
              <Text className="text-lg font-medium text-black">Dark Mode</Text>
              <Switch checked={false} onCheckedChange={() => {}} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
