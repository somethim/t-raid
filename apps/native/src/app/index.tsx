import { Link } from "expo-router";
import { Text, View } from "react-native";

export default () => {
  // todo: check if authenticated

  return (
    <View>
      <View>
        <Text>Hello World</Text>
        <Link href={"/"}>
          <Text>App</Text>
        </Link>
      </View>
    </View>
  );
};
