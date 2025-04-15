import { type PropsWithChildren, createContext, useContext } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { PortalHost } from "../../portal";

type DrawerContextValue = SharedValue<number>;
const DrawerRootContext = createContext<DrawerContextValue | null>(null);

export const useDrawerRootContext = () => {
  const context = useContext(DrawerRootContext);

  if (!context) {
    throw new Error("Drawer should be used withing DrawerRootProvider");
  }
  return context;
};

export const DrawerRootProvider = ({ children }: PropsWithChildren) => {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => {
    const borderRadius = interpolate(scale.value, [1, 0.9], [0, 16]);

    return {
      transform: [{ scale: scale.value }],
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
    };
  });

  return (
    <DrawerRootContext.Provider value={scale}>
      <View className={"flex-1 bg-black"}>
        <Animated.View style={style} className={"size-full overflow-hidden"}>
          {children}
          <PortalHost name="scale_portal" />
        </Animated.View>
      </View>
      <PortalHost />
    </DrawerRootContext.Provider>
  );
};
