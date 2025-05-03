import { Text } from "@zennui/native/text";
import { Link, Stack } from "expo-router";
import { View } from "react-native";

export default () => (
  <>
    <Stack.Screen options={{ title: "Oops!" }} />
    <View className={"py-safe"}>
      <Text>This screen doesn't exist.</Text>

      <Link href="/">
        <Text>Go to home screen!</Text>
      </Link>
    </View>
  </>
);
