import { Image } from "expo-image";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

type LoadingViewProps = {
  title?: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
};
export const LoadingView = ({
  description,
  title,
  style,
}: LoadingViewProps) => {
  return (
    <Animated.View
      exiting={FadeOut}
      className={"flex flex-1 flex-col items-center justify-center px-6"}
      style={style}
    >
      <Image
        source={require("@/assets/images/cat.jpg")}
        className={"aspect-square size-12 dark:opacity-40"}
        contentFit="contain"
      />
    </Animated.View>
  );
};
