import { Text } from "@zennui/native/text";
import { Link } from "expo-router";
import { View } from "react-native";

export default () => {
  return (
    <View>
      <View>
        <Text>Hello World</Text>
        <Link href={"(auth)"}>
          <Text>Authenticate</Text>
        </Link>
        <Link href={"(app)"}>
          <Text>App</Text>
        </Link>
      </View>
    </View>
  );
};
