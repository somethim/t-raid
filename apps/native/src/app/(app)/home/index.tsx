import {View} from "react-native";
import {H1} from "@zennui/native";

export default () => {
    const username = "NAN"

    return (
        <View>
            <H1>Hello {username}</H1>
            <Card/>
            <Shortcut/>
        </View>
    );
};
