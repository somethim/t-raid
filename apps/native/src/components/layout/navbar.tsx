import type { Route, Routes } from "@/lib/constants";
import { cn } from "@zenncore/utils";
import { Pressable, View } from "react-native";
import { Text } from "@zennui/native/text";
import { usePathname } from "expo-router";
import { TabTrigger } from "expo-router/ui";
import { forwardRef, useEffect, useState } from "react";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type NavbarProps = {
  routes: Routes;
  isVisible?: boolean;
};

export const Navbar = ({ routes, isVisible = true }: NavbarProps) => {
  return (
    <View 
      className={cn(
        "absolute bottom-3 left-0 z-50 w-full px-6 py-4",
        !isVisible && "hidden"
      )}
    >
      <View className="w-[90%] max-w-[400px] flex-row justify-between self-center rounded-full bg-background p-3 shadow">
        {Object.values(routes).map((route) => (
          <NavbarItem {...route} key={route.name} />
        ))}
      </View>
    </View>
  );
};

type NavbarItemProps = Route;

const NavbarItem = forwardRef<View, NavbarItemProps>(
  ({ href, Icon, name, subRoutes }, ref) => {
    const pathname = usePathname();
    const [isActiveItem, setActiveItem] = useState<boolean>(
      pathname.startsWith(href as string),
    );
    const [isItemAnimating, setIsItemAnimating] = useState<boolean>(false);
    const itemRef = useAnimatedRef<View>();
    const itemNameWidth = useSharedValue(0);
    const opacity = useDerivedValue(() => {
      const targetOpacity = Number(isActiveItem);

      return withTiming(targetOpacity, {
        duration: 100,
      });
    });

    const styles = useAnimatedStyle(() => {
      const width = withTiming(
        itemNameWidth.value * Number(isActiveItem),
        {
          duration: 200,
        },
        () => {
          runOnJS(setIsItemAnimating)(false);
        },
      );

      return {
        width: width,
        opacity: opacity.value,
      };
    });

    const buttonStyles = useAnimatedStyle(() => {
      return {
        paddingHorizontal: interpolate(opacity.value, [0, 1], [8, 16]),
      };
    });

    useEffect(() => {
      const subRoutePaths = subRoutes?.map(({ href }) => href) ?? [];
      const routes = [href, ...subRoutePaths];

      const isRootRoute = href === "/";
      const isActiveItem = isRootRoute
        ? pathname === href
        : routes.some((route) => pathname.startsWith(route as string));

      setActiveItem(isActiveItem);
      setIsItemAnimating(true);
    }, [pathname, href, subRoutes]);

    return (
      <TabTrigger name={name} hitSlop={10} asChild>
        <AnimatedPressable
          key={name}
          ref={ref}
          className={cn(
            "h-auto flex-row items-center gap-0 overflow-hidden rounded-full border-0 py-1.5 px-1.5",
            isActiveItem && "gap-1.5 bg-background-dimmed px-3",
          )}
          style={buttonStyles}
        >
          {Icon && (
            <Icon
              className={cn(
                "text-black size-6",
                isActiveItem && "text-foreground",
              )}
            />
          )}
          <Animated.View
            style={styles}
            className={cn("items-center justify-center")}
          >
            <Animated.View
              ref={itemRef}
              collapsable={false}
              className="absolute h-full items-center justify-center"
              onLayout={({ nativeEvent: { layout } }) => {
                if (isItemAnimating && itemNameWidth.value > 0) return;

                itemNameWidth.value = layout.width;
              }}
            >
              <Text className="w-full text-xl">{name}</Text>
            </Animated.View>
          </Animated.View>
        </AnimatedPressable>
      </TabTrigger>
    );
  },
);
