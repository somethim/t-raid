import {Link} from "expo-router";
import {Text} from "@zennui/native/text";
import {View} from "react-native";

export default () => {
    return (
        <View>
            <View>
                <Text>Hello World</Text>
                <Link href={"(auth)"}>
                    <Text>Authenticate</Text>
                </Link>
            </View>
        </View>
    );
};
